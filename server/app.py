from flask import Flask, request, jsonify, session
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from flask_session import Session
from config import ApplicationConfig
from models import db, User
from admin_auth import admin_auth_blueprint
from driver_auth import driver_auth_blueprint
from passenger_auth import passenger_auth_blueprint

app = Flask(__name__)
app.config.from_object(ApplicationConfig)

bcrypt = Bcrypt(app)
CORS(app, supports_credentials=True)
Session(app)  # Initialize Flask-Session with the Flask app
db.init_app(app)

with app.app_context():
    db.create_all()

# Register authentication blueprints
app.register_blueprint(admin_auth_blueprint)
app.register_blueprint(driver_auth_blueprint)
app.register_blueprint(passenger_auth_blueprint)

@app.route('/')
def index():
    return "Welcome to the Go-Bus API"

@app.route('/@me')
def get_current_user():
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401
    
    user = User.query.filter_by(id=user_id).first()
    return jsonify({
        "id": user.id,
        "email": user.email,
    })


@app.route("/register", methods=["POST"])
def register():
    email = request.json.get("email")
    password = request.json.get("password")

    user_exists = User.query.filter_by(email=email).first() is not None

    if user_exists:
        return jsonify({"error":"User already exists"}), 409
    hashed_password = bcrypt.generate_password_hash(password).decode("utf-8")
    new_user = User(email=email , password=hashed_password)
    db.session.add(new_user)
    db.session.commit()

    session["user_id"] = new_user.id

    return jsonify({
        "id": new_user.id,
        "email": new_user.email,
    })

@app.route("/login", methods=["POST"])
def login_user():
    email = request.json.get("email")
    password = request.json.get("password")

    user = User.query.filter_by(email=email).first()

    if user is None:
        return jsonify({"error": "Unauthorized"}), 401

    if not bcrypt.check_password_hash(user.password, password):
        return jsonify({"error": "Unauthorized"}), 401
    
    session["user_id"] = user.id

    return jsonify({
        "id": user.id,
        "email": user.email,
    })

@app.route("/logout", methods=["POST"])
def logout_user():
    if "user_id" in session:
        session.pop("user_id")
        return jsonify({"message": "Logout successful"}), 200
    else:
        return jsonify({"error": "User not logged in"}), 400

if __name__ == "__main__":
    app.run(debug=True)
