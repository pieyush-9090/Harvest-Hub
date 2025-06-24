from flask import Flask, send_from_directory, request, jsonify
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from pymongo import MongoClient
from dotenv import load_dotenv
from bson.objectid import ObjectId
from datetime import datetime, timezone, timedelta
import os

# Load environment variables
load_dotenv('data.env')

# Initialize Flask app and Bcrypt
app = Flask(__name__)
bcrypt = Bcrypt(app)
CORS(app)  

# Connect to MongoDB Atlas
mongo_uri = os.getenv("MONGO_URI")
client = MongoClient(mongo_uri)
db = client['Harvest-Hub']
users_collection = db['users']
orders_collection = db['orders']
@app.route('/')
def home_page():
    return send_from_directory('.', 'index.html')

@app.route('/<path:filename>')
def serve_file(filename):
    return send_from_directory('.', filename)


# Route: Signup
@app.route('/signup', methods=['POST'])
def signup():
    data = request.json
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')

    # Check if user already exists
    if users_collection.find_one({'email': email}):
        return jsonify({'error': 'User already exists'}), 400

    # Hash the password
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

    # Save user to database
    users_collection.insert_one({'name': name, 'email': email, 'password': hashed_password})
    return jsonify({'message': 'User registered successfully'}), 201

# Route: Login
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    # Find user in database
    user = users_collection.find_one({'email': email})
    if not user or not bcrypt.check_password_hash(user['password'], password):
        return jsonify({'error': 'Invalid email or password'}), 401

    # Include user_id in the response
    return jsonify({
        'message': 'Login successful',
        'name': user['name'],
        'email': user['email'],
        'user_id': str(user['_id'])  # Convert ObjectId to string for frontend storage
    }), 200

@app.route('/checkout', methods=['POST'])
def checkout():
    data = request.json
    app.logger.info(f"Checkout Data Received: {data}")  # Log received data

    user_id = data.get('user_id')  # Logged-in user's ID
    items = data.get('items')  # Cart items (name, price, quantity)
    total = data.get('total')  # Total price

    if not user_id or not items or total is None:
        app.logger.error("Invalid checkout data")  # Log error for invalid data
        return jsonify({'error': 'Invalid data'}), 400

    try:
        # Save order in MongoDB
        order = {
            'user_id': ObjectId(user_id),
            'items': items,
            'total': total,
            'date': datetime.utcnow() + timedelta(hours=5, minutes=30)
        }
        orders_collection.insert_one(order)
        app.logger.info("Order saved successfully")  # Log success message
        return jsonify({'message': 'Order placed successfully'}), 201
    except Exception as e:
        app.logger.error(f"Error saving order: {e}")  # Log exception details
        return jsonify({'error': str(e)}), 500



@app.route('/profile', methods=['GET'])
def profile():
    user_id = request.args.get('user_id')  # Get user ID from query params

    if not user_id:
        return jsonify({'error': 'User ID is required'}), 400

    def generate_order_number(order_id):
        # Generate a consistent random order number based on ObjectId
        return f"ORD-{hash(str(order_id)) % 10000}"

    try:
        # Fetch user data from MongoDB
        user = users_collection.find_one({'_id': ObjectId(user_id)})
        if not user:
            return jsonify({'error': 'User not found'}), 404

        # Fetch recent 5 orders
        recent_orders = list(orders_collection.find({'user_id': ObjectId(user_id)}).sort('date', -1).limit(5))

        # Fetch all orders
        all_orders = list(orders_collection.find({'user_id': ObjectId(user_id)}).sort('date', -1))

        # Format response
        response = {
            'name': user['name'],
            'email': user['email'],
            'recent_orders': [
                {
                    'order_number': generate_order_number(order['_id']),
                    'items': order['items'],
                    'total': order['total'],
                    'date': order['date'].strftime('%Y-%m-%d %H:%M:%S')
                }
                for order in recent_orders
            ],
            'all_orders': [
                {
                    'order_number': generate_order_number(order['_id']),
                    'items': order['items'],
                    'total': order['total'],
                    'date': order['date'].strftime('%Y-%m-%d %H:%M:%S')
                }
                for order in all_orders
            ]
        }
        return jsonify(response), 200

    except Exception as e:
        app.logger.error(f"Error processing profile: {e}")
        return jsonify({'error': str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
