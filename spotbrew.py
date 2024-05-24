
import Plugins
import threading
from flask import Flask, request, jsonify
import uuid
from flask_socketio import SocketIO
from flask_cors import CORS



app = Flask(__name__)
PRIORITY = 4

app.config['SECRET_KEY'] = 'secret!'
CORS(app,resources={r"/*":{"origins":"*"}})
socketio = SocketIO(app,cors_allowed_origins="*")

PRIORITY = 4

products = [{"id":"can_1","name":"Cola","desc":"blabla vla lva","price":"30"},
            {"id":"can_2","name":"Cola_alad","desc":"blabla vla lva","price":"30"},
            {"id":"can_3","name":"Coldkeksa","desc":"blabla vla lva","price":"30"}]


def callbacker(robot, user_id):
    print("hehe")
    print(user_id)
    socketio.emit('Delivered', str(user_id))

@app.route("/products")
def members():
    return products

@app.route('/send_data')
def send_data():
    if len(users) > 0:
        socketio.emit('Delivered', str(users[0]))
        print(users)
    return 'Data sent to clients'


@app.route('/', methods=['POST'])
def submit_data():
    global global_taskmanager
    data = request.get_json()  # Parse JSON data from the request
    # Process the data as needed
    print("Received data from React:", data)
    users_id = (uuid.uuid4())
    MoveSpotToPoint = global_taskmanager.Point(3,0)
    global_taskmanager.createNewTask(MoveSpotToPoint,PRIORITY,callbacker, None, users_id)
    return jsonify({"userid": users_id})

@socketio.on('connect')
def handle_connect():
    # Emit a message when a client connects
    socketio.emit('message', 'Welcome!')

@socketio.on('message')
def handle_message(message):
    print('Received message: ' + message)
    # Broadcast the message to all connected clients
    socketio.emit('message', message)
    










global_taskmanager = None

class SpotBrew(Plugins.Base):

    def __init__(self, taskmanger):
        global global_taskmanager
        print("[SpotBrew] Enabled!")
        global_taskmanager = taskmanger


threading.Thread(target=app.run).start()


print("noblock")