from flask import jsonify

def success_response(data: dict = None, message: str = None, status_code: int = 200):
    """Format success response."""
    response = {"success": True}
    if message:
        response["message"] = message
    if data:
        response.update(data)
    return jsonify(response), status_code

def error_response(message: str, code: str = "ERROR", details: dict = None, status_code: int = 400):
    """Format error response."""
    response = {
        "error": message,
        "code": code
    }
    if details:
        response["details"] = details
    return jsonify(response), status_code
