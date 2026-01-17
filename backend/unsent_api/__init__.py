from flask import Flask, jsonify
from flask_cors import CORS
from . import configuration
config_by_name = configuration.config_by_name
validate_config = configuration.validate_config
from .utils.logger import setup_logger
from .blueprints import register_blueprints
import os

def create_app(config_name=None):
    """Application factory function."""
    if config_name is None:
        config_name = os.getenv('FLASK_ENV', 'development')
    
    # 1. Validate environment
    validate_config()
    
    # 2. Initialize Flask
    app = Flask(__name__)
    
    # 3. Load Config
    app.config.from_object(config_by_name[config_name])
    app.config['VERSION'] = '1.0.0'
    
    # 4. Initialize Extensions
    # Handle CORS - if production, use specific origins, else allow all or specific local
    origins = app.config.get('CORS_ORIGINS', '*')
    CORS(app, resources={r"/api/*": {"origins": origins}})
    
    # 5. Setup Logging
    logger = setup_logger(__name__, app.config.get('LOG_LEVEL', 'INFO'))
    app.logger.handlers = logger.handlers
    app.logger.setLevel(logger.level)

    # 6. Register Middleware
    from .middleware import register_middleware
    register_middleware(app)
    
    # 7. Register Blueprints
    register_blueprints(app)
    # 6. Base Routes
    @app.route('/')
    def index():
        return jsonify({
            "name": "UNSENT API",
            "version": "1.0.0",
            "status": "online",
            "endpoints": {
                "health": "/api/health",
                "emotions": "/api/emotions",
                "stats": "/api/stats"
            }
        }), 200
    
    # Legacy Support: /health (redirect/alias to /api/health logic)
    from .blueprints.api.routes import health_check
    app.add_url_rule('/health', 'health_check_legacy', health_check, methods=['GET'])

    # 7. Error Handlers
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({"error": "Not Found", "message": str(error)}), 404

    @app.errorhandler(500)
    def internal_error(error):
        return jsonify({"error": "Internal Server Error", "message": "An unexpected error occurred."}), 500

    app.logger.info(f"App initialized in {config_name} mode")
    
    return app
