from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity
from datetime import timedelta

# Initialize app
app = Flask(__name__)
CORS(app)

# JWT Configuration
app.config['JWT_SECRET_KEY'] = 'super-secret-key'  # Change this to a secure, secret key!
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=1)

jwt = JWTManager(app)

# MySQL config
db_config = {
    'host': 'localhost',
    'user': 'root',
    'password': 'harsh3113',
    'database': 'ecommerce'
}

def get_connection():
    return mysql.connector.connect(**db_config)

# Route: Home
@app.route('/', methods=['GET'])
def home():
    return ' Backend is working!'


# Route: Login
@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM users WHERE email=%s AND password=%s", (email, password))
    user = cursor.fetchone()
    cursor.close()
    conn.close()

    if user:
        access_token = create_access_token(identity=user['email'])
        return jsonify({"status": "success", "message": "Logged in successfully", "token": access_token})
    else:
        return jsonify({"status": "fail", "message": "Invalid email or password"}), 401


# Route: Product
@app.route('/api/query', methods=['POST'])
@jwt_required()
def query():
    data = request.get_json()
    msg = data.get('message', '').lower()
    session_id = data.get('session_id')
    user_email = get_jwt_identity()

    if not session_id or not msg:
        return jsonify({'error': 'Missing session_id or message'}), 400

    try:
        conn = get_connection()
        cur = conn.cursor()

        # Store user message
        cur.execute(
            "INSERT INTO messages (session_id, sender, text) VALUES (%s, %s, %s)",
            (session_id, 'user', msg)
        )

        # 🟢 FIXED: Case-insensitive matching
        cur.execute("SELECT name, price, category FROM products WHERE LOWER(name) LIKE %s LIMIT 5", (f"%{msg}%",))
        results = cur.fetchall()

        if not results:
            bot_reply = "Sorry, no matching products found."
        else:
            bot_reply = "Here are some matching products:\n" + "\n".join(
                [f"- {name} (₹{price:.2f}) in {category}" for name, price, category in results]
            )

        # Store bot response
        cur.execute(
            "INSERT INTO messages (session_id, sender, text) VALUES (%s, %s, %s)",
            (session_id, 'bot', bot_reply)
        )

        conn.commit()
        return jsonify(reply=bot_reply)

    except mysql.connector.Error as e:
        print("MySQL Error:", e)
        return jsonify(reply="Server error. Please try again later."), 500
    finally:
        if conn.is_connected():
            cur.close()
            conn.close()




# Route: Register
@app.route('/api/register', methods=['POST'])
def register():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'status': 'fail', 'message': 'Email and password required'}), 400

    try:
        conn = get_connection()
        cursor = conn.cursor()

        # Check if user exists
        cursor.execute("SELECT * FROM users WHERE email=%s", (email,))
        if cursor.fetchone():
            return jsonify({'status': 'fail', 'message': 'Email already exists'}), 409

        # Insert new user
        cursor.execute("INSERT INTO users (email, password) VALUES (%s, %s)", (email, password))
        conn.commit()

        return jsonify({'status': 'success', 'message': 'User registered successfully'})

    except mysql.connector.Error as e:
        print("MySQL Error:", e)
        return jsonify({'status': 'fail', 'message': 'Server error'}), 500

    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()


# Route: Get Chat History
@app.route('/api/history', methods=['GET'])
@jwt_required()
def get_history():
    user_email = get_jwt_identity()

    try:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute(
            "SELECT sender, text, timestamp FROM messages WHERE user_email=%s ORDER BY timestamp ASC",
            (user_email,)
        )
        rows = cursor.fetchall()
        return jsonify({"history": rows})
    except mysql.connector.Error as e:
        return jsonify({"error": "Database error"}), 500
    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()


@app.route('/api/sessions', methods=['POST'])
@jwt_required()
def create_session():
    user_email = get_jwt_identity()
    title = request.json.get('title', 'Untitled Chat')

    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO chat_sessions (user_email, title) VALUES (%s, %s)",
            (user_email, title)
        )
        session_id = cursor.lastrowid
        conn.commit()
        return jsonify({'status': 'success', 'session_id': session_id})
    except mysql.connector.Error as e:
        print("MySQL Error:", e)
        return jsonify({'status': 'fail', 'message': 'Database error'}), 500
    finally:
        cursor.close()
        conn.close()


# Start the server
if __name__ == '__main__':
    app.run(debug=True)
