from ...services.socket_service import SocketService

socketio = SocketService.get_socketio()

@socketio.on('connect')
def handle_connect(sid, environ):
    # print(f"Client connected: {sid}")
    pass

@socketio.on('disconnect')
def handle_disconnect(sid):
    # print(f"Client disconnected: {sid}")
    pass
