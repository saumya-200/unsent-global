import socketio
import time

sio = socketio.Client()

@sio.event
def connect():
    print('Connected')
    sio.emit('request_knot', {'star_id': 'timer-test'})

@sio.event
def waiting_for_partner(data):
    print('Waiting...')

@sio.event
def knot_started(data):
    print(f"Knot started! Duration: {data['duration']} seconds")

@sio.event
def timer_update(data):
    print(f"Time remaining: {data['remaining_formatted']}")

@sio.event
def timer_warning(data):
    print(f"WARNING: {data['message']}")

@sio.event
def session_ended(data):
    print(f"Session ended: {data['reason']}")
    sio.disconnect()

# Corrected port to 5002
sio.connect('http://localhost:5002')
sio.wait()
