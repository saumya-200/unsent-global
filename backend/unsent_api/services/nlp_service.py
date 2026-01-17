from textblob import TextBlob
from langdetect import detect, LangDetectException
from ..models.star import Emotion

class NLPService:
    """Service for Natural Language Processing and Emotion Detection."""
    
    # Keywords mapped to emotions
    KEYWORDS = {
        Emotion.GRATITUDE: ['grateful', 'thank', 'thanks', 'appreciate', 'blessed'],
        Emotion.JOY: ['happy', 'joy', 'excited', 'wonderful', 'amazing', 'yay', 'hooray'],
        Emotion.REGRET: ['sorry', 'wish', 'regret', 'should have', 'mistake', 'forgive', 'apologize'],
        Emotion.SADNESS: ['miss', 'sad', 'gone', 'cry', 'tears', 'hurt', 'pain', 'lost', 'broken'],
        Emotion.ANGER: ['angry', 'hate', 'furious', 'mad', 'stupid', 'worst', 'rage'],
        Emotion.FEAR: ['scared', 'afraid', 'terrified', 'fear', 'worry', 'anxious', 'nervous'],
        Emotion.LOVE: ['love', 'adore', 'cherish', 'heart', 'soulmate', 'beloved'],
        Emotion.LONELINESS: ['alone', 'lonely', 'isolated', 'nobody', 'empty', 'solitude'],
        Emotion.HOPE: ['hope', 'dream', 'wish', 'future', 'believe', 'maybe', 'someday']
    }

    @staticmethod
    def detect_emotion(text: str) -> str:
        """
        Detect emotion from text using Sentiment Analysis + Keyword Matching.
        Priority:
        1. Explicit keywords with high intensity
        2. Sentiment polarity mapping
        """
        if not text:
            return Emotion.HOPE.value

        text_lower = text.lower()
        blob = TextBlob(text)
        polarity = blob.sentiment.polarity # -1.0 to 1.0

        # 1. Keyword Check
        matched_emotions = []
        for emotion, keywords in NLPService.KEYWORDS.items():
            if any(k in text_lower for k in keywords):
                matched_emotions.append(emotion)
        
        # If we have matches, refine using polarity
        if matched_emotions:
            # If multiple matches, we could pick based on context. 
            # For MVP, return the first valid match that aligns loosely with sentiment or just the first.
            # Let's try to be smart:
            # If positive sentiment, prefer positive emotions.
            if polarity > 0.2:
                for e in matched_emotions:
                    if e in [Emotion.JOY, Emotion.GRATITUDE, Emotion.LOVE, Emotion.HOPE]:
                        return e.value
            elif polarity < -0.2:
                for e in matched_emotions:
                    if e in [Emotion.SADNESS, Emotion.ANGER, Emotion.REGRET, Emotion.FEAR, Emotion.LONELINESS]:
                        return e.value
            
            # Fallback: just return the first keyword match
            return matched_emotions[0].value

        # 2. No keywords? Use Sentiment Polarity Fallback
        if polarity > 0.5:
            return Emotion.JOY.value
        elif polarity > 0.1:
            return Emotion.HOPE.value
        elif polarity < -0.5:
            return Emotion.ANGER.value
        elif polarity < -0.1:
            return Emotion.SADNESS.value
        
        # Neutral/Unknown
        return Emotion.HOPE.value

    @staticmethod
    def detect_language(text: str) -> str:
        """Detect language code (ISO 639-1). Default 'en'."""
        try:
            return detect(text)
        except LangDetectException:
            return 'en'

    @staticmethod
    def get_sentiment_score(text: str) -> dict:
        """Get raw sentiment scores."""
        blob = TextBlob(text)
        return {
            "polarity": round(blob.sentiment.polarity, 2),
            "subjectivity": round(blob.sentiment.subjectivity, 2)
        }
