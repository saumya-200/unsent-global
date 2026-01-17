from flask import Blueprint, jsonify, current_app
from datetime import datetime
from app.utils.supabase_client import SupabaseClient
from app.services.star_service import StarService

api_bp = Blueprint('api', __name__)

# Register routes
from . import routes

@api_bp.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint."""
    db_connected, db_msg = SupabaseClient.health_check()

    return jsonify({
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "environment": current_app.config.get('ENV'),
        "database": {
            "connected": db_connected,
            "message": db_msg
        },
        "version": current_app.config.get('VERSION', 'unknown')
    }), 200

@api_bp.route('/stats', methods=['GET'])
def get_stats():
    """Get global star statistics."""
    stats = StarService.get_stats()
    return jsonify(stats), 200
