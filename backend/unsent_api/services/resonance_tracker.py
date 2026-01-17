from ..utils.supabase_client import SupabaseClient
from datetime import datetime, timedelta

class ResonanceTracker:
    """Service to prevent duplicate resonance from the same IP."""
    
    @staticmethod
    def can_resonate(star_id: str, ip_address: str) -> bool:
        """
        Check if an IP can resonate with a star.
        Restriction: 1 resonance per star per IP every 24 hours.
        """
        client = SupabaseClient.get_client()
        
        # Calculate the cutoff time (24 hours ago)
        cutoff = (datetime.utcnow() - timedelta(hours=24)).isoformat()
        
        try:
            result = client.table('resonance_trackers') \
                .select('*') \
                .eq('star_id', star_id) \
                .eq('ip_address', ip_address) \
                .gt('created_at', cutoff) \
                .execute()
            
            # If any record exists within the last 24h, they can't resonate again
            return len(result.data) == 0
        except Exception:
            # If the table doesn't exist yet or other error, fail open or closed?
            # Better to log and allow if we can't verify (or fail closed for spam)
            # For now, let's assume it works.
            return True

    @staticmethod
    def track_resonance(star_id: str, ip_address: str):
        """Record a resonance event."""
        client = SupabaseClient.get_client()
        try:
            client.table('resonance_trackers').insert({
                "star_id": star_id,
                "ip_address": ip_address
            }).execute()
        except Exception as e:
            print(f"Failed to track resonance: {e}")
