from functools import wraps
from flask import request
from . import api_bp
from app.services.star_service import StarService
from app.services.nlp_service import NLPService
from app.utils.response_helpers import success_response, error_response
from app.decorators import validate_json, require_fields, sanitize_input
from app.middleware.rate_limiter import limiter
from app.configuration import Config
from app.exceptions import ValidationError, DatabaseError

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
        
        # Detect Emotion
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
