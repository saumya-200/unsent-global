import pytest
import uuid
from unsent_api.services.knot_service import KnotService
from unsent_api.utils.room_utils import generate_room_id

# Mock Supabase interactions if needed, or rely on integration testing 
# For now, simplistic test structure assuming DB access (integration style)

class TestKnotService:
    def test_create_knot_session(self):
        star_id = str(uuid.uuid4())
        room_id = generate_room_id(star_id)
        
        session = KnotService.create_knot_session(star_id, room_id)
        assert session is not None
        assert session['room_id'] == room_id
        assert session['is_active'] is True

    def test_get_knot_session(self):
        star_id = str(uuid.uuid4())
        room_id = generate_room_id(star_id)
        KnotService.create_knot_session(star_id, room_id)
        
        session = KnotService.get_knot_session(room_id)
        assert session is not None
        assert session['room_id'] == room_id

    def test_session_lifecycle(self):
        star_id = str(uuid.uuid4())
        room_id = generate_room_id(star_id)
        KnotService.create_knot_session(star_id, room_id)
        
        # Deactivate
        KnotService.deactivate_knot_session(room_id)
        
        # Check active status
        is_active = KnotService.is_session_active(room_id)
        assert is_active is False
