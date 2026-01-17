import os
import sys
from datetime import datetime

# Add the parent directory to sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from dotenv import load_dotenv
load_dotenv()

from unsent_api.utils.supabase_client import SupabaseClient

def seed():
    print("✨ Seeding UNSENT Universe...")
    
    stars = [
        {
            "emotion": "joy",
            "message_text": "I finally found someone who makes me feel at home. I just wanted to tell the world.",
            "resonance_count": 15,
            "language": "en"
        },
        {
            "emotion": "sadness",
            "message_text": "I miss the way we used to talk until 3 AM about nothing and everything.",
            "resonance_count": 8,
            "language": "en"
        },
        {
            "emotion": "hope",
            "message_text": "Tomorrow is a new day, and I am finally starting to believe that it will be better.",
            "resonance_count": 22,
            "language": "en"
        },
        {
            "emotion": "gratitude",
            "message_text": "Thank you for being there when I was at my lowest. You saved me.",
            "resonance_count": 45,
            "language": "en"
        },
        {
            "emotion": "fear",
            "message_text": "I'm terrified of losing what we have, but I'm even more terrified of staying stuck.",
            "resonance_count": 5,
            "language": "en"
        }
    ]

    client = SupabaseClient.get_client()
    
    for star_data in stars:
        # We need to compute message_preview as the table expects it or handle it in service
        # Let's just use the direct insert for seeding
        star_data["message_preview"] = star_data["message_text"][:50] + "..."
        star_data["created_at"] = datetime.utcnow().isoformat()
        
        try:
            result = client.table('stars').insert(star_data).execute()
            print(f"✅ Added {star_data['emotion']} star")
        except Exception as e:
            print(f"❌ Error adding star: {e}")

if __name__ == "__main__":
    seed()
