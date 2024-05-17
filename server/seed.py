from faker import Faker
import random
from datetime import datetime, timedelta
from models import db, User, Bus, Booking
from app import app

fake = Faker()

def add_users():
    users = [
        User(username='admin', email='admin@gmail.com', password='admin', role='Admin'),
        User(username='driver', email='driver@gmail.com', password='driver', role='Driver'),
        User(username='customer', email='customer@gmail.com', password='customer', role='Customer')
    ]
    for _ in range(10):  # Adding additional users
        username = fake.user_name()
        email = fake.email()
        password = fake.password()
        role = random.choice(['Driver', 'Customer'])
        users.append(User(username=username, email=email, password=password, role=role))
    db.session.bulk_save_objects(users)
    db.session.commit()

def add_buses():
    drivers = User.query.filter_by(role='Driver').all()
    buses = []
    for driver in drivers:
        for _ in range(2):  # Assuming each driver has 2 buses
            number_plate = fake.license_plate()
            no_of_seats = random.randint(20, 50)
            cost_per_seat = round(random.uniform(10, 50), 2)
            route = fake.street_name()
            departure_time = datetime.now() + timedelta(days=random.randint(1, 10))
            buses.append(Bus(
                number_plate=number_plate,
                no_of_seats=no_of_seats,
                cost_per_seat=cost_per_seat,
                route=route,
                departure_time=departure_time,
                driver_id=driver.id
            ))
    db.session.bulk_save_objects(buses)
    db.session.commit()

def add_bookings():
    users = User.query.filter_by(role='Customer').all()
    buses = Bus.query.all()
    bookings = []
    for _ in range(50):  # Total 50 bookings
        user = random.choice(users)
        bus = random.choice(buses)
        seat_number = random.randint(1, bus.no_of_seats)
        booking_time = datetime.now()
        bookings.append(Booking(
            user_id=user.id,
            bus_id=bus.id,
            seat_number=seat_number,
            booking_time=booking_time
        ))
    db.session.bulk_save_objects(bookings)
    db.session.commit()

def seed():
    add_users()
    add_buses()
    add_bookings()

if __name__ == '__main__':
    with app.app_context():
        seed()
        print('Database seeded successfully.')
