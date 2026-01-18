import hashlib
import time
import uuid

def generate_room_id(star_id: str) -> str:
    """
    Creates unique room ID from star_id + timestamp.
    Format: "knot_{star_id}_{short_uuid}_{timestamp}"
    """
    short_uuid = str(uuid.uuid4())[:8]
    timestamp = int(time.time())
    return f"knot_{star_id}_{short_uuid}_{timestamp}"

def validate_room_id(room_id: str) -> bool:
    """
    Validates room ID format.
    Must start with 'knot_' and contain 4 parts.
    """
    if not room_id or not isinstance(room_id, str):
        return False
    
    parts = room_id.split('_')
    if len(parts) != 4 or parts[0] != 'knot':
        return False
        
    return True

def parse_star_from_room(room_id: str) -> str | None:
    """
    Extracts star_id from room_id.
    Returns None if invalid format.
    """
    if not validate_room_id(room_id):
        return None
        
    parts = room_id.split('_')
    # knot_{star_id}_{uuid}_{timestamp}
    return parts[1]
