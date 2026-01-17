from utils.supabase_client import check_connection
from config import Config
import sys

# Force reload config in case
# But since this is a fresh process, it should load fine.

def verify():
    print(f"Testing connection to: {Config.SUPABASE_URL}")
    print(f"Key length: {len(Config.SUPABASE_SERVICE_KEY) if Config.SUPABASE_SERVICE_KEY else 0}")
    
    success, message = check_connection()
    
    if success:
        print("SUCCESS: Connected to database.")
        sys.exit(0)
    else:
        print(f"FAILURE: {message}")
        sys.exit(1)

if __name__ == "__main__":
    verify()
