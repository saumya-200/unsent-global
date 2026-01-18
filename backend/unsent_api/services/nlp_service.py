from textblob import TextBlob
from langdetect import detect, LangDetectException
from ..models.star import Emotion

class NLPService:
    """Service for Natural Language Processing and Emotion Detection."""
    
    # Keywords mapped to emotions - expanded for better detection
    KEYWORDS = {
        Emotion.GRATITUDE: [
            'grateful', 'thank', 'thanks', 'appreciate', 'blessed', 'thankful',
            'appreciation', 'grateful for', 'meant so much', 'meant a lot'
        ],
        Emotion.JOY: [
            'happy', 'joy', 'excited', 'wonderful', 'amazing', 'yay', 'hooray',
            'celebrate', 'thrilled', 'delighted', 'elated', 'overjoyed', 'fantastic',
            'best day', 'so good', 'love this', 'finally'
        ],
        Emotion.REGRET: [
            'sorry', 'wish i', 'regret', 'should have', 'mistake', 'forgive', 
            'apologize', 'if only', 'i wish', 'never told', 'never said',
            'didn\'t tell', 'didn\'t say', 'too late', 'chance', 'opportunity'
        ],
        Emotion.SADNESS: [
            'miss', 'sad', 'gone', 'cry', 'tears', 'hurt', 'pain', 'lost', 
            'broken', 'heartbroken', 'mourning', 'grief', 'goodbye', 'farewell',
            'never see', 'passed away', 'left me', 'without you', 'emptiness'
        ],
        Emotion.ANGER: [
            'angry', 'hate', 'furious', 'mad', 'stupid', 'worst', 'rage',
            'frustrated', 'annoyed', 'irritated', 'resent', 'betrayed', 'lied'
        ],
        Emotion.FEAR: [
            'scared', 'afraid', 'terrified', 'fear', 'worry', 'anxious', 'nervous',
            'panic', 'dread', 'frightened', 'terrify', 'nightmare'
        ],
        Emotion.LOVE: [
            'love', 'adore', 'cherish', 'heart', 'soulmate', 'beloved', 'forever',
            'always', 'meant everything', 'my person', 'in love', 'fell for',
            'crush', 'feelings for', 'care about', 'loved you'
        ],
        Emotion.LONELINESS: [
            'alone', 'lonely', 'isolated', 'nobody', 'empty', 'solitude',
            'no one', 'by myself', 'on my own', 'abandoned', 'forgotten'
        ],
        Emotion.HOPE: [
            'hope', 'dream', 'future', 'believe', 'maybe', 'someday',
            'one day', 'looking forward', 'will be', 'gonna be', 'better days'
        ]
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

        # 1. Keyword Check with scoring
        emotion_scores = {}
        for emotion, keywords in NLPService.KEYWORDS.items():
            score = sum(1 for k in keywords if k in text_lower)
            if score > 0:
                emotion_scores[emotion] = score
        
        # If we have matches, pick the one with highest keyword count
        if emotion_scores:
            # Sort by score (desc), then refine by sentiment
            sorted_emotions = sorted(emotion_scores.items(), key=lambda x: x[1], reverse=True)
            top_emotion = sorted_emotions[0][0]
            
            # If polarity strongly disagrees, adjust
            if polarity > 0.3 and top_emotion in [Emotion.ANGER, Emotion.FEAR]:
                # Positive text but anger/fear keywords? Might be sarcasm or misdetection
                # Check for positive alternatives
                for e, _ in sorted_emotions:
                    if e in [Emotion.JOY, Emotion.GRATITUDE, Emotion.LOVE, Emotion.HOPE]:
                        return e.value
            elif polarity < -0.3 and top_emotion in [Emotion.JOY, Emotion.GRATITUDE]:
                # Negative text but joy/gratitude keywords? Adjust
                for e, _ in sorted_emotions:
                    if e in [Emotion.SADNESS, Emotion.REGRET, Emotion.LONELINESS]:
                        return e.value
            
            return top_emotion.value

        # 2. No keywords? Use Sentiment Polarity Fallback
        if polarity > 0.5:
            return Emotion.JOY.value
        elif polarity > 0.1:
            return Emotion.HOPE.value
        elif polarity < -0.5:
            return Emotion.SADNESS.value  # Changed from ANGER for unsent context
        elif polarity < -0.1:
            return Emotion.REGRET.value  # Changed from SADNESS for unsent context
        
        # Neutral/Unknown - for unsent messages, many are about regret or love
        return Emotion.LOVE.value  # Better default for "unsent" context

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
