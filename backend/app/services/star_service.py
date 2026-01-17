from app.utils.supabase_client import SupabaseClient
from app.models.star import Star
from app.exceptions import DatabaseError, ValidationError, ResourceNotFoundError
from datetime import datetime
import time

class StarService:
    """Service for managing Stars (messages)."""
    
    # Simple in-memory cache for stats (timestamp, data)
    _stats_cache = (0, None)
    
    @staticmethod
    def create_star(message_text: str, emotion: str, language: str = 'en', metadata: dict = None) -> dict:
        """Create a new star in the constellation."""
        # 1. Validate Input
        try:
            star_data = {
                "message_text": message_text,
                "emotion": emotion,
                "language": language,
                "metadata": metadata or {}
            }
            star_model = Star(**star_data) # Pydantic validation
        except Exception as e:
            raise ValidationError(f"Invalid star data: {str(e)}")

        # 2. Insert into Database
        client = SupabaseClient.get_client()
        try:
            # Prepare data for insertion (exclude None fields to let DB defaults work)
            data = star_model.dict(exclude={'id', 'created_at', 'expires_at', 'resonance_count'})
            # We explicitly want to use the enum value string
            data['emotion'] = star_model.emotion.value
            
            result = client.table('stars').insert(data).execute()
            
            if not result.data:
                raise DatabaseError("Failed to create star: No data returned")
                
            return result.data[0]
            
        except Exception as e:
            raise DatabaseError(f"Database insertion failed: {str(e)}")

    @staticmethod
    def get_stars(limit: int = 100, offset: int = 0, emotion: str = None, order_by: str = 'created_at') -> list[dict]:
        """Fetch stars to map."""
        client = SupabaseClient.get_client()
        query = client.table('stars').select('*')
        
        if emotion:
            query = query.eq('emotion', emotion)
            
        # Order by
        if order_by == 'resonance_count':
            query = query.order('resonance_count', desc=True)
        else:
            query = query.order('created_at', desc=True)
            
        try:
            result = query.range(offset, offset + limit - 1).execute()
            return result.data
        except Exception as e:
            raise DatabaseError(f"Failed to fetch stars: {str(e)}")

    @staticmethod
    def increment_resonance(star_id: str) -> dict:
        """Increment resonance count for a star atomically."""
        client = SupabaseClient.get_client()
        try:
            client.rpc('increment_resonance', {'star_row_id': star_id}).execute()
            # Fetch updated star
            updated = client.table('stars').select('*').eq('id', star_id).execute()
            if not updated.data:
                 raise ResourceNotFoundError(f"Star {star_id} not found")
            return updated.data[0]
        except Exception as e:
            raise DatabaseError(f"Failed to resonate: {str(e)}")

    @classmethod
    def get_stats(cls) -> dict:
        """Get global stats with 60s caching."""
        now = time.time()
        if cls._stats_cache[0] > now - 60 and cls._stats_cache[1]:
             return cls._stats_cache[1]

        client = SupabaseClient.get_client()
        try:
            # This is expensive, in real prod we'd use a dedicated stats table or materialized view
            # For hackathon, we'll keep it simple or mock parts if too slow
            
            # Count total
            total_res = client.table('stars').select('id', count='exact').limit(1).execute()
            total_stars = total_res.count
            
            # This 'sum' is tricky without a dedicated function, we might just skip resonance sum for MVP 
            # or add an RPC function for it. Let's return basics.
            
            stats = {
                "total_stars": total_stars,
                "last_updated": datetime.now().isoformat()
            }
            
            cls._stats_cache = (now, stats)
            return stats
            
        except Exception as e:
            # Fallback to empty stats on error to not break UI
            return {"total_stars": 0, "error": str(e)}
