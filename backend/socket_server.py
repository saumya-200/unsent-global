import socketio
import eventlet
import os
from flask import Flask, jsonify
from unsent_api.configuration import BaseConfig as Config

# Create a simple Flask app for the health check
app = Flask(__name__)

# Basic health check for the socket service
@app.route('/socket/health', methods=['GET'])
def health():
    return jsonify({
        "status": "healthy",
        "service": "socket.io",
        "environment": Config.FLASK_ENV
    }), 200

# Configure Socket.IO
sio = socketio.Server(
    cors_allowed_origins=Config.SOCKET_CORS_ORIGINS,
    async_mode='eventlet'
)

# Wrap Flask app with Socket.IO
app = socketio.WSGIApp(sio, app)

@sio.event
def connect(sid, environ):
    print(f"Client connected: {sid}")

@sio.event
def disconnect(sid):
    print(f"Client disconnected: {sid}")

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5001))
    print(f"Starting Socket.IO server on port {port}")
    eventlet.wsgi.server(eventlet.listen(('0.0.0.0', port)), app)
