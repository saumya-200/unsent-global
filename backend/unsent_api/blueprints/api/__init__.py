from flask import Blueprint, jsonify, current_app
from datetime import datetime
from ...utils.supabase_client import SupabaseClient
from ...services.star_service import StarService

api_bp = Blueprint('api', __name__)

# Register routes
from . import routes
