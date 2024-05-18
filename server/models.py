from flask_sqlalchemy import SQLAlchemy
from uuid import uuid4
from sqlalchemy import MetaData
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash

metadata = MetaData(naming_convention={
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
})

db = SQLAlchemy(metadata=metadata)

def get_uuid():
    return uuid4().hex

class Passenger(db.Model, UserMixin):
    __tablename__ = "passengers"
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), unique=True, nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    token = db.Column(db.String(64), unique=True)  # Added token column

    @property
    def password(self):
        raise AttributeError("Password is not a readable attribute")

    @password.setter
    def password(self, password):
        self.password_hash = generate_password_hash(password)

    def verify_password(self, password):
        return check_password_hash(self.password_hash, password)

    def __repr__(self):
        return f"<Passenger id={self.id}, username={self.username}, email={self.email}>"

class Driver(db.Model, UserMixin):
    __tablename__ = "drivers"
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), unique=True, nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    token = db.Column(db.String(64), unique=True)  # Added token column

    @property
    def password(self):
        raise AttributeError("Password is not a readable attribute")

    @password.setter
    def password(self, password):
        self.password_hash = generate_password_hash(password)

    def verify_password(self, password):
        return check_password_hash(self.password_hash, password)

    def __repr__(self):
        return f"<Driver id={self.id}, username={self.username}, email={self.email}>"

class Admin(db.Model, UserMixin):
    __tablename__ = "admins"
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), unique=True, nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    token = db.Column(db.String(64), unique=True)  # Added token column

    @property
    def password(self):
        raise AttributeError("Password is not a readable attribute")

    @password.setter
    def password(self, password):
        self.password_hash = generate_password_hash(password)

    def verify_password(self, password):
        return check_password_hash(self.password_hash, password)

    def __repr__(self):
        return f"<Admin id={self.id}, username={self.username}, email={self.email}>"

class Bus(db.Model):
    __tablename__ = 'bus'
    id = db.Column(db.Integer, primary_key=True)
    company_name = db.Column(db.String(100), nullable=False)
    driver_id = db.Column(db.Integer, db.ForeignKey('drivers.id'), unique=True, nullable=False)
    number_plate = db.Column(db.String(7), nullable=False, unique=True)
    no_of_seats = db.Column(db.Integer, nullable=False)
    cost_per_seat = db.Column(db.Integer, nullable=False)
    route = db.Column(db.String(100), nullable=False)
    boarding_point = db.Column(db.String(100), nullable=False)
    destination = db.Column(db.String(100), nullable=False)
    departure_time = db.Column(db.DateTime, nullable=False)
    arrival_time = db.Column(db.DateTime, nullable=False)
    driver = db.relationship('Driver', backref=db.backref('bus', uselist=False))

    def __repr__(self):
        return f"Bus({self.id}, {self.company_name}, {self.driver_id}, {self.number_plate}, {self.no_of_seats}, {self.cost_per_seat}, {self.route}, {self.boarding_point}, {self.destination}, {self.departure_time}, {self.arrival_time})"

class Booking(db.Model):
    __tablename__ = 'bookings'
    id = db.Column(db.Integer, primary_key=True)
    passenger_id = db.Column(db.Integer, db.ForeignKey('passengers.id'), nullable=False)
    bus_id = db.Column(db.Integer, db.ForeignKey('bus.id'), nullable=False)
    seat_number = db.Column(db.Integer, nullable=False)
    booking_time = db.Column(db.DateTime, nullable=False)

    passenger = db.relationship('Passenger', backref=db.backref('bookings', lazy=True))
    bus = db.relationship('Bus', backref=db.backref('bookings', lazy=True))

    def __repr__(self):
        return f"<Booking id={self.id}, passenger_id={self.passenger_id}, bus_id={self.bus_id}, seat_number={self.seat_number}>"
