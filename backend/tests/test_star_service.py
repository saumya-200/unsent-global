import sys
import os
sys.path.append(os.getcwd())
import unittest
from app.services.star_service import StarService
from app.exceptions import ValidationError

class TestStarService(unittest.TestCase):
    def test_validation_error(self):
        """Test that invalid emotion raises ValidationError."""
        with self.assertRaises(ValidationError):
            StarService.create_star("Hello", "invalid_emotion")

    def test_message_length_validation(self):
        """Test that empty message raises ValidationError."""
        with self.assertRaises(ValidationError):
            StarService.create_star("", "joy")

if __name__ == '__main__':
    unittest.main()
