from functools import wraps
from flask import request, jsonify
from models import Passenger, Driver, Admin
import secrets

def token_required(func):
    @wraps(func)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({'error': 'Missing or invalid Authorization header'}), 401
        token = auth_header.split(' ')[1]
        if not verify_token(token):
            return jsonify({'error': 'Invalid token'}), 401
        return func(*args, **kwargs)
    return decorated

def verify_token(token):
    user = Passenger.query.filter_by(token=token).first() or Driver.query.filter_by(token=token).first() or Admin.query.filter_by(token=token).first()
    if user:
        return user
    else:
        return None

def generate_token():
    token = secrets.token_urlsafe(32)
    return token