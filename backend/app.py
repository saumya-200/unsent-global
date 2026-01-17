from flask import Flask, jsonify
from flask_cors import CORS
from config import Config
from datetime import datetime
from utils.supabase_client import check_connection

def create_app():
    # Validate config
    try:
        Config.validate()
    except ValueError as e:
        print(f"Configuration Error: {e}")
    
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Configure CORS
    CORS(app, resources={r"/*": {"origins": Config.CORS_ORIGINS}})
    
    @app.route('/health', methods=['GET'])
    def health_check():
        db_status, db_message = check_connection()
        
        return jsonify({
            "status": "healthy",
            "timestamp": datetime.now().isoformat(),
            "environment": Config.FLASK_ENV,
            "database": {
                "connected": db_status,
                "message": db_message
            }
        }), 200

    return app

app = create_app()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=Config.PORT)
