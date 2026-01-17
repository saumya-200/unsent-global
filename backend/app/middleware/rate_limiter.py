from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask import jsonify

def get_limiter():
    """Create Flask-Limiter instance."""
    limiter = Limiter(
        key_func=get_remote_address,
        default_limits=["100 per hour"],
        storage_uri="memory://", # Use Redis in production via env var
        strategy="fixed-window"
    )
    
    # Custom error response
    @limiter.request_filter
    def ip_whitelist():
        # Exclude health check from rate limiting for monitoring
        from flask import request
        if request.path == '/api/health' or request.path == '/health':
            return True
        return False

    return limiter

limiter = get_limiter()

def init_app(app):
    """Initialize limiter with app."""
    limiter.init_app(app)
    
    # Customize 429 error
    @app.errorhandler(429)
    def ratelimit_handler(e):
        return jsonify({
            "error": "Rate limit exceeded",
            "message": str(e.description),
            "code": "RATE_LIMIT_EXCEEDED"
        }), 429
