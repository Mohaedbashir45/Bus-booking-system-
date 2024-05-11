# models.py
from flask_sqlalchemy import SQLAlchemy
from uuid import uuid4

db = SQLAlchemy()

def get_uuid():
    return uuid4().hex

class User(db.Model):
    __tablename__ = "users"
    id = db.Column(db.String(32), primary_key=True, default=get_uuid)
    email = db.Column(db.String(255), unique=True, nullable=False) 
    password = db.Column(db.Text, nullable=False)
    is_admin = db.Column(db.Boolean, default=False)
    is_driver = db.Column(db.Boolean, default=False)
    is_passenger = db.Column(db.Boolean, default=False)  # New field for passengers

    def __init__(self, email, password, is_admin=False, is_driver=False, is_passenger=False):
        self.email = email
        self.password = password
        self.is_admin = is_admin
        self.is_driver = is_driver
        self.is_passenger = is_passenger
