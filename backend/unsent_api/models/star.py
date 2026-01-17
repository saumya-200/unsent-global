from pydantic import BaseModel, Field, validator
from typing import Optional
from datetime import datetime
from enum import Enum

class Emotion(str, Enum):
    JOY = 'joy'
    SADNESS = 'sadness'
    ANGER = 'anger'
    FEAR = 'fear'
    GRATITUDE = 'gratitude'
    REGRET = 'regret'
    LOVE = 'love'
    HOPE = 'hope'
    LONELINESS = 'loneliness'

class Star(BaseModel):
    """Pydantic model for a Star (message)."""
    id: Optional[str] = None
    message_text: str = Field(..., min_length=1, max_length=1000)
    emotion: Emotion
    language: str = Field(default='en', min_length=2, max_length=2)
    resonance_count: int = Field(default=0, ge=0)
    created_at: Optional[datetime] = None
    expires_at: Optional[datetime] = None
    metadata: dict = Field(default_factory=dict)
    
    @property
    def is_expired(self) -> bool:
        if not self.expires_at:
            return False
        return datetime.utcnow() > self.expires_at

    def to_dict(self):
        """Convert to dictionary with serializable types."""
        d = self.dict()
        if self.created_at:
            d['created_at'] = self.created_at.isoformat()
        if self.expires_at:
            d['expires_at'] = self.expires_at.isoformat()
        d['emotion'] = self.emotion.value
        return d
    
    @classmethod
    def from_dict(cls, data: dict):
        """Create Star instance from dictionary."""
        return cls(**data)
