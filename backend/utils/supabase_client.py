from supabase import create_client, Client
from config import Config

def get_supabase_client() -> Client:
    """Initialize and return Supabase client"""
    try:
        url = Config.SUPABASE_URL
        key = Config.SUPABASE_SERVICE_KEY
        
        if not url or not key:
            print("Warning: Supabase credentials missing.")
            return None
            
        return create_client(url, key)
    except Exception as e:
        print(f"Error initializing Supabase client: {e}")
        return None

def check_connection():
    """Test connection to Supabase instance"""
    client = get_supabase_client()
    if not client:
        return False, "Client initialization failed"
    
    try:
        # Simple query to check connection - assuming 'stars' table exists
        # Using count instead of select to minimize data transfer
        response = client.table('stars').select('id', count='exact').limit(1).execute()
        return True, "Connected"
    except Exception as e:
        return False, str(e)
