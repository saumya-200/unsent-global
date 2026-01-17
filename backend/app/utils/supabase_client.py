from supabase import create_client, Client
from app.configuration import BaseConfig as Config
import time
from app.exceptions import DatabaseError

class SupabaseClient:
    _instance = None
    _client: Client = None

    @classmethod
    def get_client(cls) -> Client:
        """Get or create singleton Supabase client."""
        if cls._client is None:
            cls._initialize()
        return cls._client

    @classmethod
    def _initialize(cls):
        """Initialize connection with retry logic."""
        if not Config.SUPABASE_URL or not Config.SUPABASE_SERVICE_KEY:
            # In production, this should halt; locally maybe warn.
            # Config.validate() handles hard failure.
            raise DatabaseError("Missing Supabase credentials.")

        try:
            cls._client = create_client(Config.SUPABASE_URL, Config.SUPABASE_SERVICE_KEY)
            # Optional: Configure postgrest options if available in lib
        except Exception as e:
            raise DatabaseError(f"Failed to initialize Supabase client: {str(e)}")

    @classmethod
    def health_check(cls, retries=3):
        """Verify database connectivity with retries."""
        client = cls.get_client()
        last_error = None
        
        for attempt in range(retries):
            try:
                # Lightweight query
                client.table('stars').select('id', count='exact').limit(1).execute()
                return True, "Connected"
            except Exception as e:
                last_error = e
                # Exponential backoff: 0.5s, 1s, 2s
                time.sleep(0.5 * (2 ** attempt))
        
        return False, f"Connection failed after {retries} attempts: {str(last_error)}"

# Convenience function for legacy support
def check_connection():
    return SupabaseClient.health_check()
