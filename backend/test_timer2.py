import socketio
import time

sio = socketio.Client()

@sio.event
def connect():
    print('Client 2: Connected')
    time.sleep(2)
    sio.emit('request_knot', {'star_id': 'timer-test'})

@sio.event
def knot_started(data):
    print(f"Client 2: Knot started!")

@sio.event
def timer_update(data):
    print(f"Client 2: Time remaining: {data['remaining_formatted']}")

@sio.event
def session_ended(data):
    print(f"Client 2: Session ended: {data['reason']}")
    sio.disconnect()

# Corrected port to 5002
sio.connect('http://localhost:5002')
sio.wait()
