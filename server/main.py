from flask import Flask, request, jsonify
import uuid
app = Flask(__name__)
from flask_socketio import SocketIO
from flask_cors import CORS
app.config['SECRET_KEY'] = 'secret!'
CORS(app,resources={r"/*":{"origins":"*"}})
socketio = SocketIO(app,cors_allowed_origins="*")
users = [""]

products = [{"id":"can_1","name":"Cola","desc":"blabla vla lva","price":"30"},
            {"id":"can_2","name":"Cola_alad","desc":"blabla vla lva","price":"30"},
            {"id":"can_3","name":"Coldkeksa","desc":"blabla vla lva","price":"30"}]

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
    data = request.get_json()  # Parse JSON data from the request
    # Process the data as needed
    print("Received data from React:", data)
    users[0] = (uuid.uuid4())
    return jsonify({"userid": str(users[0])})

@socketio.on('connect')
def handle_connect():
    # Emit a message when a client connects
    socketio.emit('message', 'Welcome!')

@socketio.on('message')
def handle_message(message):
    print('Received message: ' + message)
    # Broadcast the message to all connected clients
    socketio.emit('message', message)

if __name__ == "__main__":
    app.run()