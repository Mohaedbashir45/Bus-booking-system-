from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData

metadata = MetaData(naming_convention={
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
})

db = SQLAlchemy(metadata=metadata)

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), unique=True, nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False)
    role = db.Column(db.String(50), nullable=False)  # Admin, Driver, or Customer

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
