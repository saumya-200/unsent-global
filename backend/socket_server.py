import eventlet
eventlet.monkey_patch()

from flask import Flask
from flask_socketio import SocketIO
from flask_cors import CORS
import os

# Initialize Flask app
app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('FLASK_SECRET_KEY', 'dev_secret_key')

# CORS configuration
cors_origins = os.getenv('SOCKET_CORS_ORIGINS', 'http://localhost:3000').split(',')
CORS(app, origins=cors_origins)

# Socket.IO configuration
socketio = SocketIO(
    app,
    cors_allowed_origins=cors_origins,
    async_mode='eventlet',
    logger=True,
    engineio_logger=True,
    ping_timeout=60,
    ping_interval=25
)

# Health check endpoint
@app.route('/socket/health')
def health():
    return {'status': 'healthy', 'service': 'socket.io'}

# Error handling
@socketio.on_error_default
def default_error_handler(e):
    print(f"Socket Error: {e}")

from flask import request
from flask_socketio import join_room, leave_room, emit
import threading
from datetime import datetime
import time

# Import services
from unsent_api.models.knot_session_state import KnotSessionManager
from unsent_api.services.knot_service import KnotService
from unsent_api.tasks.session_cleanup_task import cleanup_expired_sessions_task
from unsent_api.utils.timer_utils import format_time, calculate_remaining_time

# Initialize state manager
session_manager = KnotSessionManager()

# Start background cleanup task (passed socketio for notifications)
cleanup_expired_sessions_task(KnotService, session_manager, socketio)

# Active timers: room_id -> threading.Timer
active_timers = {}

def start_session_timer(room_id, duration=1800):
    """
    Start 30-minute countdown timer for a Knot session.
    """
    if room_id in active_timers:
        return

    def timer_task():
        # Set database start time effectively now
        # Ideally DB has created_at, we just sync our countdown
        start_ts = datetime.utcnow()
        end_ts = start_ts.timestamp() + duration
        
        while time.time() < end_ts:
            time.sleep(1) # Check every second
            
            # 1. Check if session still exists in memory
            state = session_manager.get_room_state(room_id)
            if not state or state.get('state') != 'active':
                # Session ended externally (user left)
                break
                
            remaining = int(end_ts - time.time())
            
            # Send update every 30 seconds
            if remaining % 30 == 0:
                socketio.emit('timer_update', {
                    'room_id': room_id,
                    'remaining_seconds': remaining,
                    'remaining_formatted': format_time(remaining)
                }, room=room_id)
            
            # Warning at 5 minutes
            if remaining == 300:
                socketio.emit('timer_warning', {
                    'room_id': room_id,
                    'message': '5 minutes remaining',
                    'remaining_seconds': 300
                }, room=room_id)
            
            # Warning at 1 minute
            if remaining == 60:
                socketio.emit('timer_warning', {
                    'room_id': room_id,
                    'message': '1 minute remaining',
                    'remaining_seconds': 60
                }, room=room_id)
        
        # If loop finished naturally (didn't break), time expired
        if time.time() >= end_ts:
             # Verify state one last time
            state = session_manager.get_room_state(room_id)
            if state and state.get('state') == 'active':
                end_session(room_id, reason='time_expired')
                
    timer_thread = threading.Thread(target=timer_task, daemon=True)
    timer_thread.start()
    active_timers[room_id] = timer_thread

def stop_session_timer(room_id):
    """Stop/Remove timer reference."""
    if room_id in active_timers:
        # We can't kill threads easily in Python, but our thread loop checks session state
        # So removing session from manager (or changing state) implicitly stops it.
        # Just remove reference here.
        del active_timers[room_id]

def end_session(room_id, reason='time_expired'):
    """End a session due to timer or expiry."""
    stop_session_timer(room_id)
    
    socketio.emit('session_ended', {
        'room_id': room_id,
        'reason': reason,
        'message': 'Session has ended' if reason == 'time_expired' else 'Session closed'
    }, room=room_id)
    
    KnotService.deactivate_knot_session(room_id)
    session_manager.cleanup_room(room_id)

def format_time(seconds):
    minutes = seconds // 60
    secs = seconds % 60
    return f"{minutes:02d}:{secs:02d}"

@socketio.on('connect')
def handle_connect():
    print(f'Client connected: {request.sid}')
    emit('connected', {'socket_id': request.sid})

@socketio.on('disconnect')
def handle_disconnect():
    socket_id = request.sid
    room_id, remaining_count = session_manager.remove_user_from_room(socket_id)
    
    if room_id:
        print(f"Client {socket_id} disconnected from room {room_id}")
        
        # Assuming 2-person chat: if one leaves, session effectively breaks or pauses
        # Requirement: "Partner notified"
        # If surviving user remains, notify them. 
        if remaining_count > 0:
            emit('partner_left', {
                'message': 'Your partner has left the session',
                'can_continue': False
            }, room=room_id, skip_sid=socket_id)
            
            # Stop timer immediately if session invalid
            stop_session_timer(room_id)
            # Depending on UX, maybe we wait for reconnect? 
            # Prompt implies: "Cleanup expired sessions... Handle early exits".
            # If partner leaves, session dead.
            KnotService.deactivate_knot_session(room_id)
            session_manager.cleanup_room(room_id)
        
        # If no users left (last one out)
        if remaining_count == 0:
            stop_session_timer(room_id)
            state = session_manager.get_room_state(room_id)
            if state and state.get('state') != 'waiting':
                KnotService.deactivate_knot_session(room_id)
            session_manager.cleanup_room(room_id)

@socketio.on('request_knot')
def handle_request_knot(data):
    """
    Client sends: {'star_id': 'uuid'}
    """
    star_id = data.get('star_id')
    socket_id = request.sid
    
    if not star_id:
        emit('error', {'message': 'Star ID required'})
        return

    # Try to create or join room
    result = session_manager.create_or_join_room(star_id, socket_id)
    
    room_id = result.get('room_id')
    status = result.get('status')

    if status == 'created':
        # User is first, create DB session (waiting state)
        KnotService.create_knot_session(star_id, room_id)
        join_room(room_id)
        emit('waiting_for_partner', {
            'room_id': room_id,
            'star_id': star_id,
            'message': 'Waiting for someone to join...'
        })
    
    elif status == 'joined':
        # User is second, start session
        join_room(room_id)
        
        # Update participant count
        KnotService.update_participant_count(room_id, 2)
        
        # Update in-memory state
        state = session_manager.get_room_state(room_id)
        if state:
            state['state'] = 'active'
            # state['created_at'] is essentially now for logical timer
            state['created_at'] = datetime.utcnow().isoformat()
        
        # Start timer!
        start_session_timer(room_id, duration=1800)

        # Notify both users
        emit('knot_started', {
            'room_id': room_id,
            'star_id': star_id,
            'partner_count': 2,
            'duration': 1800,
            'message': 'Connection established. You have 30 minutes.'
        }, room=room_id)
    
    else:
        emit('error', {
            'message': result.get('message', 'Unable to join session')
        })

@socketio.on('leave_knot')
def handle_leave_knot(data):
    """
    User voluntarily exits.
    """
    socket_id = request.sid
    room_id = data.get('room_id') or session_manager.get_room_for_user(socket_id)
    
    if room_id:
        leave_room(room_id)
        _, remaining_count = session_manager.remove_user_from_room(socket_id)
        
        # Stop timer if needed (if session breaks)
        # If one leaves, session ends
        stop_session_timer(room_id)

        # Update DB
        KnotService.update_participant_count(room_id, remaining_count)
        
        # Notify leaving user
        emit('left_knot', {'message': 'You have left the session'})
        
        # Notify remaining partner
        if remaining_count > 0:
            emit('partner_left', {
                'message': 'Your partner has left the session',
                'can_continue': False
            }, room=room_id, skip_sid=socket_id)
            
            # Close session
            KnotService.deactivate_knot_session(room_id)
            session_manager.cleanup_room(room_id)
        else:
            # End session
            KnotService.deactivate_knot_session(room_id)
            session_manager.cleanup_room(room_id)

@socketio.on('get_session_info')
def handle_get_session_info(data):
    """
    Get current session information
    """
    room_id = data.get('room_id')
    socket_id = request.sid
    
    # Validation: Ensure user belongs to room?
    # Skipping for brevity/MVP
    
    session = KnotService.get_knot_session(room_id)
    
    if session:
        # Calculate sync time from DB record
        remaining = calculate_remaining_time(session['created_at'])
        emit('session_info', {
            'room_id': room_id,
            'remaining_seconds': remaining,
            'remaining_formatted': format_time(remaining),
            'participant_count': session['participant_count'],
            'is_active': session['is_active']
        })
    else:
        emit('error', {'message': 'Session not found'})

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5002))
    print(f"Starting Socket.IO Server on port {port}")
    socketio.run(app, host='0.0.0.0', port=port, debug=False)
