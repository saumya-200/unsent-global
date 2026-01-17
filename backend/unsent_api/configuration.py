import os
from dotenv import load_dotenv

load_dotenv()

class BaseConfig:
    """Base configuration."""
    SECRET_KEY = os.getenv('FLASK_SECRET_KEY', os.urandom(24).hex())
    DEBUG = False
    TESTING = False
    
    # Supabase Defaults
    SUPABASE_URL = os.getenv('SUPABASE_URL')
    SUPABASE_SERVICE_KEY = os.getenv('SUPABASE_SERVICE_KEY')
    
    # Optimization
    JSON_SORT_KEYS = False
    JSONIFY_PRETTYPRINT_REGULAR = False

class DevelopmentConfig(BaseConfig):
    """Development configuration."""
    DEBUG = True
    LOG_LEVEL = 'DEBUG'
    # Allow both 3000 and 3001 in dev, or read from ENV
    CORS_ORIGINS = os.getenv('CORS_ORIGINS', 'http://localhost:3000,http://localhost:3001').split(',')

class TestingConfig(BaseConfig):
    """Testing configuration."""
    DEBUG = True
    TESTING = True
    LOG_LEVEL = 'DEBUG'
    PRESERVE_CONTEXT_ON_EXCEPTION = False

class ProductionConfig(BaseConfig):
    """Production configuration."""
    LOG_LEVEL = 'INFO'
    # In production, we expect CORS_ORIGINS to be a comma-separated string
    CORS_ORIGINS = os.getenv('CORS_ORIGINS', '').split(',')

# Alias for standard config reference
Config = BaseConfig

config_by_name = {
    'development': DevelopmentConfig,
    'testing': TestingConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
}

def validate_config():
    """Validate critical configuration variables."""
    required_vars = ['SUPABASE_URL', 'SUPABASE_SERVICE_KEY']
    missing = [var for var in required_vars if not os.getenv(var)]
    
    if missing:
        if os.getenv('FLASK_ENV') == 'production':
             raise ValueError(f"Missing required environment variables: {', '.join(missing)}")
        else:
             print(f"WARNING: Missing environment variables: {', '.join(missing)}")
