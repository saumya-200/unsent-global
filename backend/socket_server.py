import eventlet
# eventlet.monkey_patch() # Handled by Gunicorn -k eventlet

import socketio
import os
import time
import uuid
from flask import Flask, jsonify
from unsent_api.configuration import BaseConfig as Config

# Create a simple Flask app for the health check
app = Flask(__name__)

@app.route('/', methods=['GET'])
def index():
    return "Unsent Knot Socket Server is Running", 200

# Basic health check for the socket service
@app.route('/socket/health', methods=['GET'])
def health():
    return jsonify({
        "status": "healthy",
        "service": "socket.io",
        "environment": Config.FLASK_ENV
    }), 200

# Configure Socket.IO
# Allow specific origins in production, default to '*' for dev
cors_origins = os.getenv('CORS_ALLOWED_ORIGINS', '*').split(',')
if len(cors_origins) == 1 and cors_origins[0] == '*':
    cors_origins = '*'

sio = socketio.Server(
    cors_allowed_origins=cors_origins, 
    async_mode='eventlet',
    logger=True, # Enable logs for production debugging
    engineio_logger=True
)

# Wrap Flask app with Socket.IO
app = socketio.WSGIApp(sio, app)

# --- In-Memory State (MVP) ---
# In production, use Redis
active_rooms = {} # room_id -> { 'users': [sid1, sid2], 'start_time': ts, 'star_id': id }
user_room_map = {} # sid -> room_id

# New Mappings for Request-Accept Flow
star_owners = {} # star_id -> owner_sid
pending_requests = {} # request_id -> { 'requester_sid': sid, 'owner_sid': sid, 'star_id': id }

SESSION_DURATION = 1800 # 30 minutes

@sio.event
def connect(sid, environ):
    print(f"Client connected: {sid}")

@sio.event
def disconnect(sid):
    print(f"Client disconnected: {sid}")
    
    # Cleanup Ownership
    # (Optional: keep ownership if we expect reconnection? For MVP, drop it)
    stars_to_remove = [k for k, v in star_owners.items() if v == sid]
    for k in stars_to_remove:
        del star_owners[k]
        
    # Handle active session
    room_id = user_room_map.get(sid)
    if room_id:
        handle_leave_room(sid, room_id, reason='partner_left')

# --- 1. Star Ownership ---
@sio.on('claim_star')
def handle_claim_star(sid, data):
    star_id = data.get('star_id')
    if star_id:
        star_owners[star_id] = sid
        print(f"DEBUG: User {sid} claimed star {star_id}. Total tracked stars: {len(star_owners)}")

# --- 2. Connection Request Flow ---
@sio.on('request_connection')
def handle_request_connection(sid, data):
    star_id = data.get('star_id')
    print(f"DEBUG: User {sid} requesting connection for star {star_id}")
    
    owner_sid = star_owners.get(star_id)
    
    if not owner_sid:
        print(f"DEBUGGING FAILURE: Star {star_id} has no owner.")
        print(f"Current Owners Map: {star_owners}")
        sio.emit('error', {'message': 'The author of this star is not currently online.'}, to=sid)
        return
        
    if owner_sid == sid:
        sio.emit('error', {'message': 'You cannot connect with yourself.'}, to=sid)
        return

    # Create a request
    request_id = str(uuid.uuid4())
    pending_requests[request_id] = {
        'requester_sid': sid,
        'owner_sid': owner_sid,
        'star_id': star_id
    }
    
    # Notify Owner
    print(f"DEBUG: Notifying owner {owner_sid} of request {request_id}")
    sio.emit('incoming_request', {
        'request_id': request_id,
        'star_id': star_id,
        'message': 'Someone resonates with your message and wants to connect.'
    }, to=owner_sid)

@sio.on('accept_request')
def handle_accept_request(sid, data):
    request_id = data.get('request_id')
    req = pending_requests.get(request_id)
    
    if not req:
        # Request expired or invalid
        return
        
    if req['owner_sid'] != sid:
        # Security check
        return
        
    # Start the Knot!
    requester_sid = req['requester_sid']
    star_id = req['star_id']
    room_id = str(uuid.uuid4())
    
    # Create Room
    active_rooms[room_id] = {
        'users': [sid, requester_sid],
        'start_time': time.time(),
        'star_id': star_id,
        'duration': SESSION_DURATION
    }
    
    user_room_map[sid] = room_id
    user_room_map[requester_sid] = room_id
    
    sio.enter_room(sid, room_id)
    sio.enter_room(requester_sid, room_id)
    
    # Notify Both
    sio.emit('knot_started', {
        'room_id': room_id,
        'partner_id': requester_sid,
        'star_id': star_id,
        'start_time': time.time(),
        'duration': SESSION_DURATION, 
        'message': 'Connection established.'
    }, room=room_id)
    
    # Cleanup request
    del pending_requests[request_id]
    print(f"DEBUG: Knot started in room {room_id}")

@sio.on('reject_request')
def handle_reject_request(sid, data):
    request_id = data.get('request_id')
    req = pending_requests.get(request_id)
    if req and req['owner_sid'] == sid:
        requester_sid = req['requester_sid']
        sio.emit('request_rejected', {'message': 'The author declined the connection.'}, to=requester_sid)
        del pending_requests[request_id]

# --- 3. Session Management ---
@sio.on('leave_knot')
def on_leave_knot(sid, data):
    room_id = data.get('room_id') or user_room_map.get(sid)
    if room_id:
        handle_leave_room(sid, room_id, reason='user_left')

def handle_leave_room(sid, room_id, reason='partner_left'):
    room = active_rooms.get(room_id)
    if not room:
        return
        
    # Notify other users
    for user_id in room['users']:
        if user_id != sid:
            sio.emit('session_ended', {
                'reason': reason,
                'message': 'Partner left the session.'
            }, to=user_id)
        
        # Cleanup
        sio.leave_room(user_id, room_id)
        if user_id in user_room_map:
            del user_room_map[user_id]
            
    if room_id in active_rooms:
        del active_rooms[room_id]
        
    print(f"Room {room_id} ended. Reason: {reason}")

@sio.on('chat_message')
def handle_chat(sid, data):
    room_id = data.get('room_id')
    message = data.get('message')
    if room_id:
        sio.emit('chat_message', {
            'sender_id': sid,
            'message': message,
            'timestamp': time.time() * 1000
        }, room=room_id, skip_sid=sid)

@sio.on('draw_event')
def handle_draw(sid, data):
    room_id = data.get('room_id')
    drawing_data = data.get('drawing_data')
    if room_id:
        sio.emit('draw_event', {
            'sender_id': sid,
            'drawing_data': drawing_data
        }, room=room_id, skip_sid=sid)

if __name__ == '__main__':
    # Force 5002 if 'PORT' gives us 5000 (which is the default API port)
    env_port = int(os.getenv('PORT', 5002))
    port = 5002 if env_port == 5000 else env_port
    
    print(f"Starting Socket.IO server on port {port}")
    eventlet.wsgi.server(eventlet.listen(('0.0.0.0', port)), app)
