import os
import sys

# Add current directory to path
sys.path.append(os.getcwd())

# Set production env
os.environ['FLASK_ENV'] = 'production'
os.environ['SUPABASE_URL'] = 'https://fake.supabase.co'
os.environ['SUPABASE_SERVICE_KEY'] = 'fake-key'

try:
    from app import create_app
    app = create_app('production')
    
    print("\n--- Registered Flask Routes ---")
    for rule in app.url_map.iter_rules():
        print(f"Endpoint: {rule.endpoint:25} Methods: {str(list(rule.methods)):30} Path: {rule}")
    print("-------------------------------\n")
    
except Exception as e:
    print(f"FAILED TO INITIALIZE APP: {e}")
    import traceback
    traceback.print_exc()
