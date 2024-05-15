# models.py
from flask_sqlalchemy import SQLAlchemy
from uuid import uuid4
# from sqlalchemy import MetaData

# metadata = MetaData(naming_convention={
#     "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
# })

# db = SQLAlchemy(metadata=metadata)


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

# from flask_sqlalchemy import SQLAlchemy
# from sqlalchemy import MetaData

class Bus(db.Model):
    __tablename__ = 'bus'
    id = db.Column(db.Integer, primary_key=True)
    number_plate = db.Column(db.String(20), nullable=False, unique=True)
    no_of_seats = db.Column(db.Integer, nullable=False)
    cost_per_seat = db.Column(db.Float, nullable=False)
    route = db.Column(db.String(100), nullable=False)
    departure_time = db.Column(db.DateTime, nullable=False)

    # Define relationship with Driver
    driver_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    driver = db.relationship('User', backref=db.backref('buses', lazy=True))

class Booking(db.Model):
    __tablename__ = 'bookings'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    user = db.relationship('User', backref=db.backref('bookings', lazy=True))
    bus_id = db.Column(db.Integer, db.ForeignKey('bus.id'), nullable=False)
    bus = db.relationship('Bus', backref=db.backref('bookings', lazy=True))
    seat_number = db.Column(db.Integer, nullable=False)
    booking_time = db.Column(db.DateTime, nullable=False)
