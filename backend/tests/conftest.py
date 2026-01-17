import pytest
import os
import sys

# Ensure the backend directory is in the Python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from unsent_api import create_app

@pytest.fixture
def app():
    """Create and configure a new app instance for each test."""
    app = create_app('testing')
    yield app

@pytest.fixture
def client(app):
    """A test client for the app."""
    return app.test_client()
