import os
import sys

# Ensure the backend directory is in the Python path for module resolution
current_dir = os.path.dirname(os.path.abspath(__file__))
if current_dir not in sys.path:
    sys.path.insert(0, current_dir)

from unsent_api import create_app

config_name = os.getenv('FLASK_ENV', 'development')
app = create_app(config_name)

if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
