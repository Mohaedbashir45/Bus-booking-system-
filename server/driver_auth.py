from flask import Blueprint, session, jsonify, request
from models import db, User
from flask_bcrypt import Bcrypt

bcrypt = Bcrypt()
driver_auth_blueprint = Blueprint('driver_auth', __name__)

@driver_auth_blueprint.route('/register/driver', methods=['POST'])
def register_driver():
    email = request.json.get("email")
    password = request.json.get("password")

    user_exists = User.query.filter_by(email=email).first() is not None

    if user_exists:
        return jsonify({"error": "User already exists"}), 409

    hashed_password = bcrypt.generate_password_hash(password).decode("utf-8")
    new_driver = User(email=email, password=hashed_password, is_driver=True)
    db.session.add(new_driver)
    db.session.commit()

    session["user_id"] = new_driver.id

    return jsonify({
        "id": new_driver.id,
        "email": new_driver.email,
        "role": "driver"
    })

@driver_auth_blueprint.route('/login/driver', methods=['POST'])
def login_driver():
    email = request.json.get("email")
    password = request.json.get("password")

    user = User.query.filter_by(email=email, is_driver=True).first()

    if user is None:
        return jsonify({"error": "Unauthorized"}), 401

    if not bcrypt.check_password_hash(user.password, password):
        return jsonify({"error": "Unauthorized"}), 401
    
    session["user_id"] = user.id

    return jsonify({
        "id": user.id,
        "email": user.email,
        "role": "driver"
    })

@driver_auth_blueprint.route('/logout/driver', methods=['POST'])
def logout_driver():
    if "user_id" in session:
        session.pop("user_id")
        return jsonify({"message": "Logout successful"}), 200
    else:
        return jsonify({"error": "User not logged in"}), 400
