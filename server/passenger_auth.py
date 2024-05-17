from flask import Blueprint, session, jsonify, request
from models import db, User
from flask_bcrypt import Bcrypt

bcrypt = Bcrypt()
passenger_auth_blueprint = Blueprint('passenger_auth', __name__)

@passenger_auth_blueprint.route('/register/passenger', methods=['POST'])
def register_passenger():
    email = request.json.get("email")
    password = request.json.get("password")

    user_exists = User.query.filter_by(email=email).first() is not None

    if user_exists:
        return jsonify({"error": "User already exists"}), 409

    hashed_password = bcrypt.generate_password_hash(password).decode("utf-8")
    new_passenger = User(email=email, password=hashed_password)
    db.session.add(new_passenger)
    db.session.commit()

    session["user_id"] = new_passenger.id

    return jsonify({
        "id": new_passenger.id,
        "email": new_passenger.email,
        "role": "passenger"
    })

@passenger_auth_blueprint.route('/login/passenger', methods=['POST'])
def login_passenger():
    email = request.json.get("email")
    password = request.json.get("password")

    user = User.query.filter_by(email=email, is_admin=False, is_driver=False).first()

    if user is None:
        return jsonify({"error": "Unauthorized"}), 401

    if not bcrypt.check_password_hash(user.password, password):
        return jsonify({"error": "Unauthorized"}), 401
    
    session["user_id"] = user.id

    return jsonify({
        "id": user.id,
        "email": user.email,
        "role": "passenger"
    })

@passenger_auth_blueprint.route('/logout/passenger', methods=['POST'])
def logout_passenger():
    if "user_id" in session:
        session.pop("user_id")
        return jsonify({"message": "Logout successful"}), 200
    else:
        return jsonify({"error": "User not logged in"}), 400
