# models.py
from flask_sqlalchemy import SQLAlchemy
from uuid import uuid4
from sqlalchemy import MetaData
from sqlalchemy import DateTime
from datetime import datetime  # Add this import statement



metadata = MetaData(naming_convention={
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
})

db = SQLAlchemy(metadata=metadata)


# db = SQLAlchemy()

def get_uuid():
    return uuid4().hex

class Passenger(db.Model):
    __tablename__ = "passengers"
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), unique=True, nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password = db.Column(db.Text, nullable=False)

    def __repr__(self):
        return f"<Passenger id={self.id}, username={self.username}, email={self.email}>"
class Driver(db.Model):
    __tablename__ = "drivers"
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), unique=True, nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password = db.Column(db.Text, nullable=False)

    def __repr__(self):
        return f"<Driver id={self.id}, username={self.username}, email={self.email}>"


class Admin(db.Model):
    __tablename__ = "admins"
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), unique=True, nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password = db.Column(db.Text, nullable=False)
    
    def __repr__(self):
        return f"Admin(id={self.id}, username={self.username}, email={self.email})"
# from flask_sqlalchemy import SQLAlchemy
# from sqlalchemy import MetaData

class Bus(db.Model):
    __tablename__ = 'bus'
    id = db.Column(db.Integer, primary_key=True)
    company_name = db.Column(db.String(100), nullable=False)
    driver_id = db.Column(db.Integer, db.ForeignKey('drivers.id'), unique=True, nullable=False)
    number_plate = db.Column(db.String(7), nullable=False, unique=True)
    no_of_seats = db.Column(db.Integer, nullable=False)
    cost_per_seat = db.Column(db.Integer, nullable=False)
    route = db.Column(db.String(100), nullable=False)
    departure_time = db.Column(DateTime)

    driver = db.relationship('Driver', backref=db.backref('bus', uselist=False))

    def __repr__(self):
        return f"<Bus id={self.id}, company_name={self.company_name}, number_plate={self.number_plate}, driver_id={self.driver_id}, route={self.route}>"

    def to_dict(self):
        return {
            'id': self.id,
            'company_name': self.company_name,
            'driver_id': self.driver_id,
            'number_plate': self.number_plate,
            'no_of_seats': self.no_of_seats,
            'cost_per_seat': self.cost_per_seat,
            'route': self.route,
            'departure_time': self.departure_time.isoformat() if self.departure_time else None
        }
    
class Booking(db.Model):
    __tablename__ = 'bookings'
    id = db.Column(db.Integer, primary_key=True)
    passenger_id = db.Column(db.Integer, db.ForeignKey('passengers.id'), nullable=False) 
    bus_id = db.Column(db.Integer, db.ForeignKey('bus.id'), nullable=False)
    seat_number = db.Column(db.Integer, nullable=False)
    booking_time = db.Column(db.String, nullable=False)

    passenger = db.relationship('Passenger', backref=db.backref('bookings', lazy=True)) 
    bus = db.relationship('Bus', backref=db.backref('bookings', lazy=True))

    def __repr__(self):
        return f"<Booking id={self.id}, passenger_id={self.passenger_id}, bus_id={self.bus_id}, seat_number={self.seat_number}>"