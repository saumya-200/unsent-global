import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    FLASK_ENV = os.getenv('FLASK_ENV', 'development')
    SECRET_KEY = os.getenv('FLASK_SECRET_KEY', 'dev-secret-key')
    PORT = int(os.getenv('PORT', 5000))
    
    SUPABASE_URL = os.getenv('SUPABASE_URL')
    SUPABASE_SERVICE_KEY = os.getenv('SUPABASE_SERVICE_KEY')
    
    # Parse CORS origins from comma-separated string
    CORS_ORIGINS = os.getenv('CORS_ORIGINS', '*').split(',')
    SOCKET_CORS_ORIGINS = os.getenv('SOCKET_CORS_ORIGINS', '*').split(',')

    @staticmethod
    def validate():
        """Validate critical environment variables"""
        missing = []
        if not Config.SUPABASE_URL: missing.append('SUPABASE_URL')
        if not Config.SUPABASE_SERVICE_KEY: missing.append('SUPABASE_SERVICE_KEY')
        
        # Only raise error in production to allow local dev setup without them initially
        if missing and Config.FLASK_ENV == 'production':
            raise ValueError(f"Missing required environment variables: {', '.join(missing)}")
