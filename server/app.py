from flask import Flask, request, jsonify, session
from flask_migrate import Migrate
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from flask_session import Session
from datetime import datetime
from sqlalchemy.exc import IntegrityError
from flask import abort
from models import db, Admin, Passenger, Driver,Bus,Booking
from werkzeug.security import generate_password_hash, check_password_hash



app = Flask(__name__)
bcrypt = Bcrypt(app)
CORS(app)



# Configure SQLAlchemy
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.json.compact = False

# Configure Flask-Session
app.config['SESSION_TYPE'] = 'filesystem'  # or 'redis', 'memcached', etc.
Session(app)


db.init_app(app) 

migrate = Migrate(app, db)



# Create database tables within the application context
with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(debug=True)

@app.route('/')
def index():
    return "Welcome to the Go-Bus API"
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    # Check if the username or email already exists
    existing_user = Driver.query.filter(
        (Driver.username == username) | (Driver.email == email)
    ).first()
    if existing_user:
        return jsonify({'error': 'Username or email already exists.'}), 400

    # Hash the password using the default method
    hashed_password = generate_password_hash(password)

    # Create a new driver
    new_driver = Driver(
        username=username,
        email=email,
        password=hashed_password
    )
    db.session.add(new_driver)
    db.session.commit()

    return jsonify({'message': 'Registration successful!'}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    # Find the driver by email
    driver = Driver.query.filter_by(email=email).first()

    if driver and check_password_hash(driver.password, password):
        return jsonify({'message': 'Login successful!'})
    else:
        return jsonify({'error': 'Invalid email or password.'}), 401
    
@app.route('/register/passenger', methods=['POST'])
def register_passenger():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    # Check if the username or email already exists
    existing_user = Passenger.query.filter(
        (Passenger.username == username) | (Passenger.email == email)
    ).first()
    if existing_user:
        return jsonify({'error': 'Username or email already exists.'}), 400

    # Hash the password
    hashed_password = generate_password_hash(password)

    # Create a new passenger
    new_passenger = Passenger(
        username=username,
        email=email,
        password=hashed_password
    )
    db.session.add(new_passenger)
    db.session.commit()

    return jsonify({'message': 'Registration successful!'}), 201

@app.route('/login/passenger', methods=['POST'])
def login_passenger():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    # Find the passenger by email
    passenger = Passenger.query.filter_by(email=email).first()

    if passenger and check_password_hash(passenger.password, password):
        return jsonify({'message': 'Login successful!'})
    else:
        return jsonify({'error': 'Invalid email or password.'}), 401


# Routes for bus management (for drivers)
@app.route('/buses', methods=['POST'])
def create_bus():
    try:
        data = request.get_json()
        driver_id = data.get('driver_id')

        
        bus = Bus(
            company_name=data.get('company_name'),
            number_plate=data.get('number_plate'),
            no_of_seats=data.get('no_of_seats'),
            cost_per_seat=data.get('cost_per_seat'),
            route=data.get('route'),
            #driver_id=data.get('driver_id')
            driver_id=driver_id
        )
        db.session.add(bus)
        db.session.commit()
        return jsonify({'message': 'Bus created successfully'}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
    
@app.route('/buses', methods=['GET'])
def get_buses():
    try:
        buses = Bus.query.all()
        return jsonify([bus.to_dict() for bus in buses]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/buses/<int:bus_id>', methods=['GET'])
def get_bus(bus_id):
    try:
        bus = Bus.query.get(bus_id)
        if not bus:
            return jsonify({'error': 'Bus not found'}), 404
        return jsonify(bus.to_dict()), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@app.route('/buses/cost-per-seat', methods=['GET'])
def get_cost_per_seat():
    try:
        buses = Bus.query.all()
        cost_per_seat_info = [{
            "bus_id": bus.id,
            "cost_per_seat": bus.cost_per_seat
        } for bus in buses]
        return jsonify(cost_per_seat_info), 200
    except Exception as e:
        app.logger.error(f"Error fetching cost per seat: {e}")
        return jsonify({'error': str(e)}), 500
    

@app.route('/buses/cost-per-seat/<int:bus_id>', methods=['GET'])
def get_cost_per_seat_by_id(bus_id):
    bus = Bus.query.get(bus_id)
    if not bus:
        return jsonify({'error': 'Bus not found'}), 404

    return jsonify({'cost_per_seat': bus.cost_per_seat})


@app.route('/buses/schedule', methods=['POST'])
def schedule_bus():
    try:
        data = request.json
        existing_bus = Bus.query.filter_by(number_plate=data.get('number_plate')).first()
        
        if not existing_bus:
            return jsonify({'error': 'Bus does not exist: Add bus first'}), 404

        # Schedule the existing bus with provided details
        departure_time = datetime.strptime(data.get('departure_time'), '%Y-%m-%dT%H:%M')
        route = data.get('route')  

        # Update the departure time, route
        existing_bus.departure_time = departure_time
        existing_bus.route = route
        
        db.session.commit()
        return jsonify({'message': 'Bus scheduled successfully'}), 201
    except ValueError as e:
        db.session.rollback()  
        return jsonify({'error': 'Invalid datetime format for departure_time'}), 400
    except Exception as e:
        db.session.rollback()  
        return jsonify({'error': str(e)}), 500
    
@app.route('/buses/scheduled', methods=['GET'])
def get_scheduled_buses():
    try:
        # Query the database for buses with a scheduled departure time
        scheduled_buses = Bus.query.filter(Bus.departure_time.isnot(None)).all()
        
        # Serialize the scheduled buses to JSON format
        serialized_buses = [bus.serialize() for bus in scheduled_buses]
        
        # Return the serialized buses as a JSON response
        return jsonify(serialized_buses), 200

    except Exception as e:
        # Handle any unexpected errors
        return jsonify({'error': str(e)}), 500

            
@app.route('/buses/<int:bus_id>/prices', methods=['POST'])
def add_price_per_seat(bus_id):
    try:
        data = request.get_json()
        new_price_per_seat = data.get('price_per_seat')
        if new_price_per_seat is None:
            return jsonify({'error': 'Price per seat is required'}), 400
        
        bus = Bus.query.get(bus_id)
        if not bus:
            return jsonify({'error': 'Bus not found'}), 404

        bus.cost_per_seat = new_price_per_seat
        db.session.commit()
        return jsonify({'message': 'Price per seat updated successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@app.route('/buses/<int:bus_id>', methods=['PUT'])
def update_bus(bus_id):
    try:
        data = request.json
        bus = Bus.query.get(bus_id)
        if not bus:
            return jsonify({'error': 'Bus not found'}), 404

        # Update the bus attributes
        if 'number_plate' in data:
            bus.number_plate = data['number_plate']
        if 'no_of_seats' in data:
            bus.no_of_seats = data['no_of_seats']
        if 'cost_per_seat' in data:
            bus.cost_per_seat = data['cost_per_seat']
        if 'route' in data:
            bus.route = data['route']
        if 'departure_time' in data:
            bus.departure_time = datetime.fromisoformat(data['departure_time'])  # Handle ISO format

        # Commit changes to the database
        db.session.commit()

        return jsonify({'message': 'Bus updated successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@app.route('/buses/<int:bus_id>', methods=['DELETE'])
def remove_bus(bus_id):
    try:
        bus = Bus.query.get(bus_id)
        if bus:
            
            Booking.query.filter_by(bus_id=bus_id).delete()
            db.session.delete(bus)
            db.session.commit()
            return jsonify({'message': 'Bus and related bookings removed successfully'}), 200
        else:
            return jsonify({'error': 'Bus not found'}), 404
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
    
# Routes for Bookings (for Customers)

@app.route('/bookings', methods=['POST'])
def make_booking():
    try:
        data = request.get_json()
        passenger_id = data.get('passenger_id')
        bus_id = data.get('bus_id')
        seat_number = data.get('seat_number')
        
        # Check if the seat is already booked
        existing_booking = Booking.query.filter_by(bus_id=bus_id, seat_number=seat_number).first()
        if existing_booking:
            return jsonify({'error': 'Seat already booked'}), 400
        
        # Check if the bus exists
        bus = Bus.query.get(bus_id)
        if not bus:
            return jsonify({'error': 'Bus not found'}), 404
        
        # Check if all seats are booked
        if len(bus.bookings) >= bus.no_of_seats:
            return jsonify({'error': 'All seats are booked'}), 400
        
        # Create a new booking
        new_booking = Booking(passenger_id=passenger_id, bus_id=bus_id, seat_number=seat_number)
        db.session.add(new_booking)
        db.session.commit()
        
        return jsonify({'message': 'Booking created successfully'}), 201
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@app.route('/bookings/<int:booking_id>', methods=['DELETE'])
def delete_booking(booking_id):
    booking = Booking.query.get(booking_id)
    if booking:
        db.session.delete(booking)
        db.session.commit()
        return jsonify({'message': 'Booking deleted successfully'})
    else:
        abort(404, description='Booking not found')

@app.route('/bookings/<int:booking_id>', methods=['PUT'])
def update_booking(booking_id):
    data = request.json
    booking = Booking.query.get(booking_id)
    if booking:
        # Update the booking attributes with the new data
        booking.passanger_id = data.get('passenger_id', booking.passenger_id)
        booking.bus_id = data.get('bus_id', booking.bus_id)
        booking.seat_number = data.get('seat_number', booking.seat_number)
        
        # Update the booking time if provided in the request data
        new_booking_time_str = data.get('booking_time')
        if new_booking_time_str:
            new_booking_time = datetime.strptime(new_booking_time_str, '%Y-%m-%d %H:%M:%S')
            booking.booking_time = new_booking_time
        
        # Commit the changes to the database
        db.session.commit()
        return jsonify({'message': 'Booking updated successfully'})
    else:
        abort(404, description='Booking not found')

@app.route('/buses/available-seats/<int:bus_id>', methods=['GET'])
def get_available_seats(bus_id):
    bus = Bus.query.get(bus_id)
    if not bus:
        return jsonify({'error': 'Bus not found'}), 404

    total_seats = bus.no_of_seats
    booked_seats = Booking.query.filter_by(bus_id=bus_id).count()
    available_seats = total_seats - booked_seats

    return jsonify({'available_seats': available_seats})


@app.route('/buses/<int:bus_id>/seats', methods=['GET'])
def view_available_seats(bus_id):
    bus = Bus.query.get(bus_id)
    if not bus:
        return jsonify({'error': 'Bus not found'}), 404

    total_seats = range(1, bus.no_of_seats + 1)  # Generates a list of all seat numbers
    booked_seats = [booking.seat_number for booking in Booking.query.filter_by(bus_id=bus_id).all()]
    available_seats = [seat for seat in total_seats if seat not in booked_seats]

    # Exclude the driver's seat if necessary
    if bus.no_of_seats >= 3:  # Assuming the third seat is always the driver's seat in a certain layout
        available_seats.remove(3)  # Removing the driver's seat from available seats

    return jsonify({'available_seats': available_seats, 'total_seats': bus.no_of_seats, 'booked_seats': len(booked_seats)})

from flask import request, jsonify

@app.route('/buses/<int:bus_id>/book', methods=['POST'])
def book_seat(bus_id):
    data = request.get_json()
    seat_number = data.get('seat_number')
    passenger_id = data.get('passenger_id')  # Assuming you have a way to identify the passenger

    # Check if the seat is available
    bus = Bus.query.get(bus_id)
    if not bus:
        return jsonify({'error': 'Bus not found'}), 404

    if seat_number in [booking.seat_number for booking in Booking.query.filter_by(bus_id=bus_id).all()]:
        return jsonify({'error': 'Seat already booked'}), 400

    # Create a new booking
    booking = Booking(passenger_id=passenger_id, bus_id=bus_id, seat_number=seat_number)
    db.session.add(booking)
    db.session.commit()

    return jsonify({'success': True, 'message': 'Seat booked successfully'})



if __name__ == '__main__':
    # Create the database tables
    db.create_all()
    # Run the Flask app
    app.run(port=5555, debug=True)

