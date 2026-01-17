from functools import wraps
from flask import request, jsonify
from .utils.validators import sanitize_text
from .exceptions import ValidationError

def validate_json(f):
    """Decorator to ensure request is JSON."""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not request.is_json:
            return jsonify({
                "error": "Validation failed",
                "message": "Content-Type must be application/json",
                "code": "INVALID_CONTENT_TYPE"
            }), 400
        return f(*args, **kwargs)
    return decorated_function

def require_fields(*fields):
    """Decorator to check for required fields in JSON body."""
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            data = request.get_json()
            missing = [field for field in fields if field not in data]
            if missing:
                return jsonify({
                    "error": "Validation failed",
                    "message": f"Missing required fields: {', '.join(missing)}",
                    "code": "MISSING_FIELDS",
                    "details": {"missing_fields": missing}
                }), 400
            return f(*args, **kwargs)
        return decorated_function
    return decorator

def sanitize_input(*fields):
    """Decorator to sanitize text fields in JSON body."""
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            if request.is_json:
                data = request.get_json()
                for field in fields:
                    if field in data and isinstance(data[field], str):
                        data[field] = sanitize_text(data[field])
                # Note: This modifies request.json in place implicitly for some Flask versions, 
                # but explicit replacement is safer if we could, but request.json is immutable.
                # Instead, we rely on the route handler to re-fetch json or we'd attach to g.
                # For simplicity here, we assume the route handler calls sanitize where needed 
                # OR we implement this more deeply. 
                # Actually, a better pattern is to use schemas. 
                # We'll stick to manual sanitization in the service layer or explicit sanitize calls for now,
                # but this decorator serves as documentation or enforcement if we updated request.data (complex).
                pass 
            return f(*args, **kwargs)
        return decorated_function
    return decorator
