import re
import uuid
from ..models.star import Emotion

def is_valid_emotion(emotion: str) -> bool:
    """Check if emotion is one of the allowed types."""
    try:
        Emotion(emotion)
        return True
    except ValueError:
        return False

def is_valid_language(language: str) -> bool:
    """Check if language is a valid ISO 639-1 code (2 chars)."""
    return bool(re.match(r'^[a-z]{2}$', language))

def is_valid_uuid(uuid_str: str) -> bool:
    """Check if string is a valid UUID."""
    try:
        uuid.UUID(str(uuid_str))
        return True
    except ValueError:
        return False

def sanitize_text(text: str, max_length: int = 1000) -> str:
    """
    Sanitize input text:
    - Trim whitespace
    - Remove null bytes
    - Enforce max length
    """
    if not text:
        return ""
    
    # Remove null bytes
    text = text.replace('\0', '')
    
    # Trim whitespace
    text = text.strip()
    
    # Enforce max length
    if len(text) > max_length:
        text = text[:max_length]
        
    return text

def contains_profanity(text: str) -> bool:
    """Check if text contains profanity using better-profanity."""
    from better_profanity import profanity
    return profanity.contains_profanity(text)
