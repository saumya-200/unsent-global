import json
from unittest.mock import patch

def test_get_stars_default(client):
    """Test fetching stars with default parameters."""
    with patch('unsent_api.services.star_service.StarService.get_stars') as mock_get:
        mock_get.return_value = {
            'stars': [{'id': '1', 'emotion': 'joy', 'message_preview': 'Hello...'}],
            'total': 1,
            'limit': 100,
            'offset': 0,
            'has_more': False
        }
        
        response = client.get('/api/stars')
        data = json.loads(response.data)
        
        assert response.status_code == 200
        assert len(data['stars']) == 1
        assert data['pagination']['total'] == 1
        assert 'Cache-Control' in response.headers

def test_get_stars_pagination(client):
    """Test pagination (offset and limit)."""
    with patch('unsent_api.services.star_service.StarService.get_stars') as mock_get:
        client.get('/api/stars?limit=50&offset=10')
        mock_get.assert_called_with(
            limit=50,
            offset=10,
            emotion=None,
            order_by='created_at',
            order_direction='desc',
            include_message=False
        )

def test_get_stars_filtering(client):
    """Test filtering by emotion."""
    with patch('unsent_api.services.star_service.StarService.get_stars') as mock_get:
        client.get('/api/stars?emotion=sadness')
        mock_get.assert_called_with(
            limit=100,
            offset=0,
            emotion='sadness',
            order_by='created_at',
            order_direction='desc',
            include_message=False
        )

def test_get_stars_ordering(client):
    """Test ordering by resonance_count."""
    with patch('unsent_api.services.star_service.StarService.get_stars') as mock_get:
        client.get('/api/stars?order_by=resonance_count&order_direction=asc')
        mock_get.assert_called_with(
            limit=100,
            offset=0,
            emotion=None,
            order_by='resonance_count',
            order_direction='asc',
            include_message=False
        )

def test_get_stars_include_message(client):
    """Test include_message parameter."""
    with patch('unsent_api.services.star_service.StarService.get_stars') as mock_get:
        client.get('/api/stars?include_message=true')
        mock_get.assert_called_with(
            limit=100,
            offset=0,
            emotion=None,
            order_by='created_at',
            order_direction='desc',
            include_message=True
        )

def test_get_stars_invalid_limit(client):
    """Test invalid limit returns 400."""
    response = client.get('/api/stars?limit=1000')
    assert response.status_code == 400
    data = json.loads(response.data)
    assert data['code'] == 'INVALID_PARAMETER'

def test_get_stars_invalid_order(client):
    """Test invalid order_by returns 400."""
    from unsent_api.exceptions import ValidationError
    with patch('unsent_api.services.star_service.StarService.get_stars', side_effect=ValidationError("Invalid order_by")):
        response = client.get('/api/stars?order_by=invalid')
        assert response.status_code == 400
