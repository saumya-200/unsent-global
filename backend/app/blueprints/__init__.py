from app.blueprints.api import api_bp

def register_blueprints(app):
    """Register all blueprints for the application."""
    app.register_blueprint(api_bp, url_prefix='/api')
    # Future blueprints (e.g. auth, socket, etc) go here
