import sys
import os
sys.path.append(os.getcwd())

import unittest
from app.utils.validators import is_valid_emotion, is_valid_language, sanitize_text
from app.models.star import Emotion

class TestValidators(unittest.TestCase):
    def test_valid_emotions(self):
        """Test valid emotion strings."""
        for e in Emotion:
            self.assertTrue(is_valid_emotion(e.value))
            
    def test_invalid_emotion(self):
        """Test invalid emotion string."""
        self.assertFalse(is_valid_emotion("boredom"))

    def test_language_validation(self):
        """Test language code validation."""
        self.assertTrue(is_valid_language("en"))
        self.assertTrue(is_valid_language("fr"))
        self.assertFalse(is_valid_language("eng")) # Too long
        self.assertFalse(is_valid_language("12"))  # Numbers

    def test_sanitize_text(self):
        """Test text sanitization."""
        # Null bytes
        self.assertEqual(sanitize_text("Hello\0World"), "HelloWorld")
        # Whitespace
        self.assertEqual(sanitize_text("  Hello  "), "Hello")
        # Length
        long_text = "a" * 1001
        sanitized = sanitize_text(long_text, max_length=1000)
        self.assertEqual(len(sanitized), 1000)

if __name__ == '__main__':
    unittest.main()
