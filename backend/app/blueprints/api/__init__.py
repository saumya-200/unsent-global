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

    # Feature Flags & Status
    from app.services.nlp_service import NLPService
    
    nlp_available = True
    try:
        NLPService.detect_emotion("test")
    except:
        nlp_available = False

    return jsonify({
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "environment": current_app.config.get('ENV'),
        "version": current_app.config.get('VERSION', '1.0.0'),
        "database": {
            "connected": db_connected,
            "message": db_msg
        },
        "features": {
            "nlp_available": nlp_available,
            "rate_limiting_active": True,
            "supabase_writable": db_connected # Simplified check
        }
    }), 200

@api_bp.route('/stats', methods=['GET'])
def get_stats():
    """Get global star statistics."""
    stats = StarService.get_stats()
    return jsonify(stats), 200

@api_bp.route('/emotions', methods=['GET'])
def get_emotions():
    """Get list of all valid emotions."""
    from app.models.star import Emotion
    emotions_data = [
        {"value": "joy", "label": "Joy", "description": "Happiness and delight"},
        {"value": "sadness", "label": "Sadness", "description": "Grief and loss"},
        {"value": "anger", "label": "Anger", "description": "Rage and frustration"},
        {"value": "fear", "label": "Fear", "description": "Anxiety and worry"},
        {"value": "gratitude", "label": "Gratitude", "description": "Appreciation and thanks"},
        {"value": "regret", "label": "Regret", "description": "Remorse and 'what ifs'"},
        {"value": "love", "label": "Love", "description": "Affection and deep care"},
        {"value": "hope", "label": "Hope", "description": "Optimism and belief"},
        {"value": "loneliness", "label": "Loneliness", "description": "Isolation and longing"}
    ]
    return jsonify({"emotions": emotions_data}), 200
