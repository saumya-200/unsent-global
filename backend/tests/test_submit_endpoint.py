import sys
import os
sys.path.append(os.getcwd())

import unittest
from unittest.mock import patch
from unsent_api.import create_app
import json

class TestSubmitEndpoint(unittest.TestCase):
    def setUp(self):
        self.app = create_app('testing')
        self.client = self.app.test_client()
        self.ctx = self.app.app_context()
        self.ctx.push()

    def tearDown(self):
        self.ctx.pop()

    @patch('app.services.star_service.StarService.create_star')
    def test_submit_valid_message(self, mock_create):
        """Test submitting a valid message."""
        # Mock DB return
        mock_create.return_value = {
            "id": "123",
            "emotion": "joy",
            "language": "en",
            "resonance_count": 0
        }
        
        response = self.client.post('/api/submit', 
            data=json.dumps({"message": "I am so happy today!"}),
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, 201)
        data = json.loads(response.data)
        self.assertTrue(data['success'])
        self.assertEqual(data['emotion'], 'joy')
        
    def test_submit_empty_message(self):
        """Test submitting empty message."""
        response = self.client.post('/api/submit', 
            data=json.dumps({"message": ""}),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 400)

    def test_submit_missing_field(self):
        """Test missing message field."""
        response = self.client.post('/api/submit', 
            data=json.dumps({"wrong": "field"}),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 400)

if __name__ == '__main__':
    unittest.main()
