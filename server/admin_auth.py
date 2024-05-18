from flask import Blueprint, session, jsonify, request
from models import db, User
from flask_bcrypt import Bcrypt

bcrypt = Bcrypt()
admin_auth_blueprint = Blueprint('admin_auth', __name__)

@admin_auth_blueprint.route('/register/admin', methods=['POST'])
def register_admin():
    email = request.json.get("email")
    password = request.json.get("password")

    user_exists = User.query.filter_by(email=email).first() is not None

    if user_exists:
        return jsonify({"error": "User already exists"}), 409

    hashed_password = bcrypt.generate_password_hash(password).decode("utf-8")
    new_admin = User(email=email, password=hashed_password, is_admin=True)
    db.session.add(new_admin)
    db.session.commit()

    session["user_id"] = new_admin.id

    return jsonify({
        "id": new_admin.id,
        "email": new_admin.email,
        "role": "admin"
    })

@admin_auth_blueprint.route('/login/admin', methods=['POST'])
def login_admin():
    email = request.json.get("email")
    password = request.json.get("password")

    user = User.query.filter_by(email=email, is_admin=True).first()

    if user is None:
        return jsonify({"error": "Unauthorized"}), 401

    if not bcrypt.check_password_hash(user.password, password):
        return jsonify({"error": "Unauthorized"}), 401
    
    session["user_id"] = user.id

    return jsonify({
        "id": user.id,
        "email": user.email,
        "role": "admin"
    })

@admin_auth_blueprint.route('/logout/admin', methods=['POST'])
def logout_admin():
    if "user_id" in session:
        session.pop("user_id")
        return jsonify({"message": "Logout successful"}), 200
    else:
        return jsonify({"error": "User not logged in"}), 400
