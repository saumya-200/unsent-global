from functools import wraps
from flask import request
from . import api_bp
from ...services.star_service import StarService
from ...services.nlp_service import NLPService
from ...utils.response_helpers import success_response, error_response
from ...decorators import validate_json, require_fields, sanitize_input
from ...middleware.rate_limiter import limiter
from ...configuration import Config
from ...exceptions import ValidationError, DatabaseError

@api_bp.route('/submit', methods=['POST'])
@limiter.limit("10 per hour") # Strict limit for submission
@validate_json
@require_fields('message')
@sanitize_input('message')
def submit_message():
    """
    Submit a new anonymous message.
    1. Validate input
    2. Detect language & emotion
    3. Save to database
    4. Return result
    """
    data = request.get_json()
    message_text = data['message']
    
    # 1. Input Validation Logic (Custom checks beyond basic sanitization)
    if len(message_text) < 1:
        return error_response("Message cannot be empty", "INVALID_LENGTH")
    
    # 2. NLP Processing
    try:
        # Detect Language
        language = NLPService.detect_language(message_text)
        
        # Detect Emotion (use provided if available, otherwise NLP)
        provided_emotion = data.get('emotion')
        if provided_emotion:
            emotion = provided_emotion
        else:
            emotion = NLPService.detect_emotion(message_text)
        
        # Get Sentiment Scores
        sentiment = NLPService.get_sentiment_score(message_text)
        
    except Exception as e:
        # Log error but don't fail user request, fallback to defaults
        # In a real app we'd log this with the logger utility
        print(f"NLP Error: {e}") 
        language = 'en'
        emotion = 'hope'
        sentiment = {}

    # 3. Create Star
    try:
        metadata = {
            "sentiment": sentiment,
            "client_ip": request.remote_addr 
        }
        
        star = StarService.create_star(
            message_text=message_text,
            emotion=emotion,
            language=language,
            metadata=metadata
        )
        
        return success_response({
            "star_id": star['id'],
            "emotion": star['emotion'],
            "language": star['language'],
            "resonance_count": star['resonance_count'],
            "message": "Your message has been added to the constellation"
        }, status_code=201)
        
    except ValidationError as e:
        return error_response(e.message, "VALIDATION_ERROR", e.details)
    except DatabaseError as e:
        # Don't expose internal DB error details to user
        print(f"Database Error: {e}")
        return error_response("Failed to save message. Please try again.", "SERVER_ERROR", status_code=500)
    except Exception as e:
        print(f"Unexpected Error: {e}")
        return error_response("An unexpected error occurred.", "SERVER_ERROR", status_code=500)
@api_bp.route('/stars', methods=['GET'])
@limiter.limit("100 per hour") # High limit for polling
def get_stars():
    """Fetch stars for the map with pagination and filters."""
    try:
        # Get query parameters
        limit = request.args.get('limit', default=100, type=int)
        offset = request.args.get('offset', default=0, type=int)
        emotion = request.args.get('emotion', default=None)
        order_by = request.args.get('order_by', default='created_at')
        order_direction = request.args.get('order_direction', default='desc')
        include_message = request.args.get('include_message', default='false').lower() == 'true'
        
        # Validate limit
        if limit > 500:
            return error_response("Limit cannot exceed 500", "INVALID_PARAMETER", status_code=400)
            
        result = StarService.get_stars(
            limit=limit,
            offset=offset,
            emotion=emotion,
            order_by=order_by,
            order_direction=order_direction,
            include_message=include_message
        )
        
        response_data = {"data": result}
        
        # Add cache header (1 minute)
        from flask import make_response
        response = make_response(success_response(response_data))
        response.headers['Cache-Control'] = 'public, max-age=60'
        return response
        
    except ValidationError as e:
        return error_response(str(e), "INVALID_PARAMETER", status_code=400)
    except Exception as e:
        print(f"Error fetching stars: {e}")
        return error_response("Failed to retrieve stars", "SERVER_ERROR", status_code=500)

@api_bp.route('/stats', methods=['GET'])
def get_stats():
    """Get global statistics."""
    try:
        stats = StarService.get_stats()
        return success_response(stats)
    except Exception as e:
        print(f"Error fetching stats: {e}")
        return error_response("Failed to retrieve stats", "SERVER_ERROR", status_code=500)

@api_bp.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint."""
    from ...utils.supabase_client import SupabaseClient
    from flask import current_app
    from datetime import datetime
    
    db_connected, db_msg = SupabaseClient.health_check()
    
    # Feature Flags & Status
    nlp_available = True
    try:
        NLPService.detect_emotion("test")
    except:
        nlp_available = False

    return success_response({
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
            "supabase_writable": db_connected
        }
    })

@api_bp.route('/emotions', methods=['GET'])
def get_emotions():
    """Get list of all valid emotions."""
    from ...models.star import Emotion
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
    return success_response({"emotions": emotions_data})
