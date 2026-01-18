from flask_socketio import SocketIO
from typing import Dict, Any

class SocketService:
    """Service to handle Socket.IO operations."""
    _instance = None
    _socketio = None

    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            cls._instance = SocketService()
        return cls._instance

    @classmethod
    def init_app(cls, app, cors_allowed_origins="*"):
        """Initialize the SocketIO instance."""
        if cls._socketio is None:
            cls._socketio = SocketIO(app, cors_allowed_origins=cors_allowed_origins, async_mode='eventlet')
            cls._instance = SocketService()
        else:
            cls._socketio.init_app(app, cors_allowed_origins=cors_allowed_origins, async_mode='eventlet')
        return cls._socketio

    @classmethod
    def get_socketio(cls):
        return cls._socketio

    @classmethod
    def emit_new_star(cls, star_data: Dict[str, Any]):
        """Broadcast a new star creation event."""
        if cls._socketio:
            print(f"Broadcasting new star: {star_data.get('id')}")
            cls._socketio.emit('new_star', star_data)

    @classmethod
    def emit_resonance_update(cls, star_id: str, new_count: int):
        """Broadcast a resonance count update."""
        if cls._socketio:
            print(f"Broadcasting resonance update for {star_id}: {new_count}")
            cls._socketio.emit('resonance_update', {
                'star_id': star_id,
                'resonance_count': new_count
            })
