from datetime import datetime, timedelta
from ..utils.supabase_client import SupabaseClient

class KnotService:
    @staticmethod
    def create_knot_session(star_id: str, room_id: str) -> dict:
        """
        Creates new knot_sessions record.
        Expires in 30 minutes.
        """
        client = SupabaseClient.get_client()
        expires_at = (datetime.utcnow() + timedelta(minutes=30)).isoformat()
        
        data = {
            "star_id": star_id,
            "room_id": room_id,
            "created_at": datetime.utcnow().isoformat(),
            "expires_at": expires_at,
            "is_active": True,
            "participant_count": 1
        }
        
        result = client.table("knot_sessions").insert(data).execute()
        return result.data[0] if result.data else None

    @staticmethod
    def get_knot_session(room_id: str) -> dict | None:
        """Fetch session by room_id."""
        client = SupabaseClient.get_client()
        result = client.table("knot_sessions").select("*").eq("room_id", room_id).execute()
        
        if not result.data:
            return None
            
        session = result.data[0]
        
        # Check expiry
        if datetime.fromisoformat(session["expires_at"]) < datetime.utcnow():
            return None
            
        return session

    @staticmethod
    def update_participant_count(room_id: str, count: int) -> dict:
        """Update participant count."""
        client = SupabaseClient.get_client()
        result = client.table("knot_sessions").update({"participant_count": count}).eq("room_id", room_id).execute()
        return result.data[0] if result.data else None

    @staticmethod
    def deactivate_knot_session(room_id: str) -> dict:
        """Marks session as ended."""
        client = SupabaseClient.get_client()
        result = client.table("knot_sessions").update({"is_active": False}).eq("room_id", room_id).execute()
        return result.data[0] if result.data else None

    @staticmethod
    def cleanup_expired_sessions() -> int:
        """Deactivate expired sessions."""
        client = SupabaseClient.get_client()
        now = datetime.utcnow().isoformat()
        
        # Determine expired sessions
        result = client.table("knot_sessions")\
            .update({"is_active": False})\
            .lt("expires_at", now)\
            .eq("is_active", True)\
            .execute()
            
        return len(result.data) if result.data else 0

    @staticmethod
    def is_session_active(room_id: str) -> bool:
        """Check if session is active and valid."""
        session = KnotService.get_knot_session(room_id)
        return bool(session and session.get("is_active"))
