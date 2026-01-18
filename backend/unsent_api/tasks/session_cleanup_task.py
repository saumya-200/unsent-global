from apscheduler.schedulers.background import BackgroundScheduler
import atexit
# Helper for socket event emmission (circular import avoidance handled by passing callback or socket object)

def cleanup_expired_sessions_task(knot_service, session_manager, socketio):
    """
    Initialize background cleanup task using APScheduler.
    """
    def job():
        # 1. Database Cleanup
        expired_count = knot_service.cleanup_expired_sessions()
        if expired_count > 0:
            print(f"[Cleanup] Cleaned {expired_count} expired sessions from DB")
            
        # 2. Memory/Socket Cleanup
        current_sessions = list(session_manager.sessions.keys())
        for room_id in current_sessions:
            room_state = session_manager.get_room_state(room_id)
            if room_state and room_state.get('created_at'):
                from ..utils.timer_utils import is_session_expired
                
                # Check expiry based on created_at
                # Use UTC for consistency
                if is_session_expired(room_state['created_at']):
                    print(f"[Cleanup] Session {room_id} expired. Closing.")
                    
                    # Notify users
                    socketio.emit('session_ended', {
                        'room_id': room_id,
                        'reason': 'expired',
                        'message': 'Session time limit reached'
                    }, room=room_id)
                    
                    # Deactivate in DB
                    knot_service.deactivate_knot_session(room_id)
                    
                    # Clean memory
                    session_manager.cleanup_room(room_id)

    # Initialize scheduler
    scheduler = BackgroundScheduler()
    scheduler.add_job(
        func=job,
        trigger="interval",
        minutes=1, # Frequency check
        id='cleanup_expired_sessions'
    )
    scheduler.start()
    
    # Shut down scheduler on exit
    atexit.register(lambda: scheduler.shutdown())
    return scheduler
