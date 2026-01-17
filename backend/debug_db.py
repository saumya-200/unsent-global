import dotenv
import os
dotenv.load_dotenv()

from unsent_api.utils.supabase_client import SupabaseClient

def debug():
    client = SupabaseClient.get_client()
    print(f"URL: {os.getenv('SUPABASE_URL')}")
    try:
        print("Checking connection...")
        res = client.table('stars').select('count', count='highlights').limit(0).execute()
        print("Table 'stars' exists.")
    except Exception as e:
        print(f"ERROR: {e}")
        
    try:
        print("Attempting simple insert...")
        res = client.table('stars').insert({"message_text": "test", "emotion": "joy"}).execute()
        print(f"Inserted: {res.data}")
    except Exception as e:
        print(f"INSERT ERROR: {repr(e)}")

if __name__ == "__main__":
    debug()
