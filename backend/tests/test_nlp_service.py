import sys
import os
sys.path.append(os.getcwd())

import unittest
from app.services.nlp_service import NLPService
from app.models.star import Emotion

class TestNLPService(unittest.TestCase):
    def test_emotion_detection_keywords(self):
        """Test keyword-based emotion detection."""
        # Joy
        self.assertEqual(NLPService.detect_emotion("I am so happy and excited!"), Emotion.JOY.value)
        # Sadness
        self.assertEqual(NLPService.detect_emotion("I miss you so much it hurts."), Emotion.SADNESS.value)
        # Anger
        self.assertEqual(NLPService.detect_emotion("I hate this stupid situation."), Emotion.ANGER.value)
        # Fear
        self.assertEqual(NLPService.detect_emotion("I am terrified of the dark."), Emotion.FEAR.value)
        # Gratitude
        self.assertEqual(NLPService.detect_emotion("Thank you for everything."), Emotion.GRATITUDE.value)

    def test_emotion_fallback(self):
        """Test fallback to hope/neutral."""
        self.assertEqual(NLPService.detect_emotion(""), Emotion.HOPE.value)
        
    def test_language_detection(self):
        """Test language detection."""
        self.assertEqual(NLPService.detect_language("Hello world this is a test."), "en")
        # Spanish: Hola a todos, espero que tengan un buen día.
        self.assertEqual(NLPService.detect_language("Hola a todos, espero que tengan un buen día."), "es") 

    def test_sentiment_score(self):
        """Test sentiment scoring."""
        score = NLPService.get_sentiment_score("I love this!")
        self.assertGreater(score['polarity'], 0)
        
        score_neg = NLPService.get_sentiment_score("I hate this!")
        self.assertLess(score_neg['polarity'], 0)

if __name__ == '__main__':
    unittest.main()
