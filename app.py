import os
import sqlite3
import datetime
from flask import Flask, render_template, request, redirect, url_for, session, jsonify, flash
from werkzeug.security import generate_password_hash, check_password_hash

# Initialize Flask app
app = Flask(__name__)
# Use environment variable for secret key with fallback for development
app.secret_key = os.environ.get('FLASK_SECRET_KEY', os.urandom(24))

# Database setup
DATABASE_DIR = 'database'
DATABASE_PATH = os.path.join(DATABASE_DIR, 'period_tracker.db')

def get_db_connection():
    """Create a database connection and return the connection object"""
    if not os.path.exists(DATABASE_DIR):
        os.makedirs(DATABASE_DIR)
    conn = sqlite3.connect(DATABASE_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    """Initialize the database with the users table if it doesn't exist"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Create users table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    ''')
    
    conn.commit()
    conn.close()

# Initialize database on startup
init_db()

# Helper functions
def is_email_valid(email):
    """Basic email validation"""
    return '@' in email and '.' in email

def is_username_valid(username):
    """Username validation - alphanumeric and at least 3 characters"""
    return username.isalnum() and len(username) >= 3

def is_password_valid(password):
    """Password validation - at least 8 characters"""
    return len(password) >= 8

# Routes
@app.route('/')
def index():
    """Home page route - redirects to login if not authenticated"""
    if 'user_id' not in session:
        return redirect(url_for('login'))
    return render_template('index.html', username=session.get('username'), email=session.get('email'))

@app.route('/login', methods=['GET', 'POST'])
def login():
    """Handle user login"""
    if request.method == 'POST':
        email = request.form.get('email').strip().lower()
        password = request.form.get('password')
        
        conn = get_db_connection()
        user = conn.execute('SELECT * FROM users WHERE email = ?', (email,)).fetchone()
        conn.close()
        
        if user and check_password_hash(user['password'], password):
            session['user_id'] = user['id']
            session['username'] = user['username']
            session['email'] = user['email']
            return redirect(url_for('index'))
        else:
            flash('Invalid email or password')
    
    return render_template('login.html')

@app.route('/signup', methods=['GET', 'POST'])
def signup():
    """Handle user registration"""
    if request.method == 'POST':
        username = request.form.get('username')
        email = request.form.get('email').strip().lower()
        password = request.form.get('password')
        
        # Validate input
        if not is_username_valid(username):
            flash('Username must be alphanumeric and at least 3 characters')
            return render_template('signup.html')
        
        if not is_email_valid(email):
            flash('Please enter a valid email address')
            return render_template('signup.html')
        
        if not is_password_valid(password):
            flash('Password must be at least 8 characters')
            return render_template('signup.html')
        
        # Hash the password
        hashed_password = generate_password_hash(password)
        
        conn = get_db_connection()
        try:
            conn.execute(
                'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
                (username, email, hashed_password)
            )
            conn.commit()
            
            # Get the user ID for the session
            user = conn.execute('SELECT id FROM users WHERE username = ?', (username,)).fetchone()
            session['user_id'] = user['id']
            session['username'] = username
            session['email'] = email
            
            conn.close()
            return redirect(url_for('index'))
        except sqlite3.IntegrityError:
            conn.close()
            flash('Username or email already exists')
            return render_template('signup.html')
    
    return render_template('signup.html')

@app.route('/logout')
def logout():
    """Handle user logout"""
    session.pop('user_id', None)
    session.pop('username', None)
    return redirect(url_for('login'))

# API Endpoints
@app.route('/api/login', methods=['POST'])
def api_login():
    """API endpoint for login via AJAX"""
    data = request.get_json()
    email = data.get('email').strip().lower()
    password = data.get('password')
    
    conn = get_db_connection()
    user = conn.execute('SELECT * FROM users WHERE email = ?', (email,)).fetchone()
    conn.close()
    
    if user and check_password_hash(user['password'], password):
        session['user_id'] = user['id']
        session['username'] = user['username']
        return jsonify({'success': True, 'message': 'Login successful'})
    else:
        return jsonify({'success': False, 'message': 'Invalid email or password'}), 401

@app.route('/api/signup', methods=['POST'])
def api_signup():
    """API endpoint for signup via AJAX"""
    data = request.get_json()
    username = data.get('username')
    email = data.get('email').strip().lower()
    password = data.get('password')
    
    # Validate input
    if not is_username_valid(username):
        return jsonify({'success': False, 'message': 'Username must be alphanumeric and at least 3 characters'}), 400
    
    if not is_email_valid(email):
        return jsonify({'success': False, 'message': 'Please enter a valid email address'}), 400
    
    if not is_password_valid(password):
        return jsonify({'success': False, 'message': 'Password must be at least 8 characters'}), 400
    
    # Hash the password
    hashed_password = generate_password_hash(password)
    
    conn = get_db_connection()
    try:
        conn.execute(
            'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
            (username, email, hashed_password)
        )
        conn.commit()
        
        # Get the user ID for the session
        user = conn.execute('SELECT id FROM users WHERE username = ?', (username,)).fetchone()
        session['user_id'] = user['id']
        session['username'] = username
        
        conn.close()
        return jsonify({'success': True, 'message': 'Signup successful'})
    except sqlite3.IntegrityError:
        conn.close()
        return jsonify({'success': False, 'message': 'Username or email already exists'}), 409

# Run the application
if __name__ == '__main__':
    # For development only. In production:
    # 1. Set debug=False for security
    # 2. Use a production WSGI server like Gunicorn or uWSGI
    # 3. Example Gunicorn command: gunicorn -w 4 -b 0.0.0.0:5000 app:app
    # 4. Ensure FLASK_SECRET_KEY environment variable is properly set
    app.run(debug=True)
