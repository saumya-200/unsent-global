from datetime import datetime, timedelta

def calculate_remaining_time(created_at: str, duration: int = 1800) -> int:
    """
    Calculate seconds remaining in session.
    duration: seconds (default 30 mins)
    """
    if not created_at:
        return duration
        
    start_time = datetime.fromisoformat(created_at)
    end_time = start_time + timedelta(seconds=duration)
    remaining = (end_time - datetime.utcnow()).total_seconds()
    
    return max(0, int(remaining))

def is_session_expired(created_at: str, duration: int = 1800) -> bool:
    """Check if session exceeded duration."""
    return calculate_remaining_time(created_at, duration) <= 0

def get_expiry_timestamp(created_at: str, duration: int = 1800) -> str:
    """Get ISO formatted expiry time."""
    start_time = datetime.fromisoformat(created_at)
    return (start_time + timedelta(seconds=duration)).isoformat()

def format_time(seconds: int) -> str:
    """Format seconds as MM:SS"""
    minutes = seconds // 60
    secs = seconds % 60
    return f"{minutes:02d}:{secs:02d}"
