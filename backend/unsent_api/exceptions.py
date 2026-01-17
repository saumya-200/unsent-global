class DatabaseError(Exception):
    """Base class for database errors."""
    def __init__(self, message, details=None):
        super().__init__(message)
        self.message = message
        self.details = details or {}

class ValidationError(Exception):
    """Input validation error."""
    def __init__(self, message, details=None):
        super().__init__(message)
        self.message = message
        self.details = details or {}

class ResourceNotFoundError(Exception):
    """Resource not found error."""
    def __init__(self, message, details=None):
        super().__init__(message)
        self.message = message
        self.details = details or {}

class DuplicateResourceError(Exception):
    """Duplicate resource error."""
    def __init__(self, message, details=None):
        super().__init__(message)
        self.message = message
        self.details = details or {}
