import threading
from typing import Dict, Optional, List, Any

class KnotSessionManager:
    """
    In-memory state management for active Knot sessions.
    Thread-safe operations using RLock.
    """
    def __init__(self):
        self.sessions: Dict[str, Dict[str, Any]] = {}  # room_id: {users: [sid], start_time, star_id}
        self.user_rooms: Dict[str, str] = {}  # socket_id: room_id
        self.lock = threading.RLock()
        # Queue for users waiting for a star: star_id -> [room_id]
        self.waiting_rooms: Dict[str, List[str]] = {}

    def create_or_join_room(self, star_id: str, socket_id: str) -> Dict[str, Any]:
        """
        Logic to create new room or join existing match.
        Returns: {'status': 'created'|'joined'|'error', 'room_id': ..., 'message': ...}
        """
        from ..utils.room_utils import generate_room_id

        with self.lock:
            # Check if user already in a room
            if socket_id in self.user_rooms:
                return {'status': 'error', 'message': 'User already in a session'}

            # Check for available waiting room for this star
            if star_id in self.waiting_rooms and self.waiting_rooms[star_id]:
                # Join existing room
                room_id = self.waiting_rooms[star_id].pop(0)
                if not self.waiting_rooms[star_id]:
                    del self.waiting_rooms[star_id]
                
                # Update session state
                if room_id in self.sessions:
                    self.sessions[room_id]['users'].append(socket_id)
                    self.user_rooms[socket_id] = room_id
                    return {'status': 'joined', 'room_id': room_id}
                else:
                    # Stale room in waiting list
                    pass 

            # Create new room
            room_id = generate_room_id(star_id)
            self.sessions[room_id] = {
                'users': [socket_id],
                'star_id': star_id,
                'created_at': None, # Set when match starts
                'state': 'waiting'
            }
            self.user_rooms[socket_id] = room_id
            
            # Add to waiting list
            if star_id not in self.waiting_rooms:
                self.waiting_rooms[star_id] = []
            self.waiting_rooms[star_id].append(room_id)
            
            return {'status': 'created', 'room_id': room_id}

    def remove_user_from_room(self, socket_id: str) -> tuple[Optional[str], int]:
        """
        Remove user from room.
        Returns: (room_id, remaining_user_count)
        """
        with self.lock:
            room_id = self.user_rooms.get(socket_id)
            if not room_id:
                return None, 0
            
            del self.user_rooms[socket_id]
            
            if room_id in self.sessions:
                session = self.sessions[room_id]
                if socket_id in session['users']:
                    session['users'].remove(socket_id)
                
                remaining = len(session['users'])
                
                # If waiting, remove from waiting list
                if session['state'] == 'waiting':
                    star_id = session['star_id']
                    if star_id in self.waiting_rooms and room_id in self.waiting_rooms[star_id]:
                        self.waiting_rooms[star_id].remove(room_id)
                        if not self.waiting_rooms[star_id]:
                            del self.waiting_rooms[star_id]

                return room_id, remaining
            
            return room_id, 0

    def get_room_for_user(self, socket_id: str) -> Optional[str]:
        with self.lock:
            return self.user_rooms.get(socket_id)

    def get_room_state(self, room_id: str) -> Optional[Dict]:
        with self.lock:
            return self.sessions.get(room_id)

    def cleanup_room(self, room_id: str):
        """Remove room from memory."""
        with self.lock:
            if room_id in self.sessions:
                # Ensure users are cleared (should be done by remove_user, but safety net)
                session = self.sessions[room_id]
                for sid in session['users']:
                    if sid in self.user_rooms:
                        del self.user_rooms[sid]
                
                # Remove from waiting list if there
                if session['state'] == 'waiting':
                    star_id = session['star_id']
                    if star_id in self.waiting_rooms and room_id in self.waiting_rooms[star_id]:
                        self.waiting_rooms[star_id].remove(room_id)
                        if not self.waiting_rooms[star_id]:
                            del self.waiting_rooms[star_id]
                            
                del self.sessions[room_id]
