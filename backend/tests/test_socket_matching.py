import pytest
from unittest.mock import MagicMock
from unsent_api.models.knot_session_state import KnotSessionManager

class TestMatchingSystem:
    def test_first_user_wait(self):
        manager = KnotSessionManager()
        star_id = "star_123"
        sid1 = "socket_1"
        
        # User 1 joins
        result = manager.create_or_join_room(star_id, sid1)
        
        assert result['status'] == 'created'
        assert result['room_id'].startswith("knot_star_123")
        assert manager.user_rooms[sid1] == result['room_id']

    def test_second_user_match(self):
        manager = KnotSessionManager()
        star_id = "star_123"
        sid1 = "socket_1"
        sid2 = "socket_2"
        
        # User 1
        res1 = manager.create_or_join_room(star_id, sid1)
        room_id = res1['room_id']
        
        # User 2
        res2 = manager.create_or_join_room(star_id, sid2)
        
        assert res2['status'] == 'joined'
        assert res2['room_id'] == room_id
        
        state = manager.get_room_state(room_id)
        assert len(state['users']) == 2
        assert sid1 in state['users']
        assert sid2 in state['users']

    def test_user_leaves(self):
         manager = KnotSessionManager()
         star_id = "star_123"
         sid1 = "socket_1"
         
         res1 = manager.create_or_join_room(star_id, sid1)
         room_id = res1['room_id']
         
         # Leave
         room_left, remaining = manager.remove_user_from_room(sid1)
         assert room_left == room_id
         assert remaining == 0
         
         # Should be removed from waiting list
         assert star_id not in manager.waiting_rooms or not manager.waiting_rooms[star_id]
