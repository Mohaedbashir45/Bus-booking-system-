from flask import Flask, request, jsonify
from flask_migrate import Migrate
from flask_cors import CORS
from flask_session import Session
from datetime import datetime
from flask_login import LoginManager, login_user, logout_user, current_user, login_required
from models import db, Admin, Passenger, Driver, Bus, Booking
from datetime import datetime
from auth import token_required, verify_token, generate_token

app = Flask(__name__)
cors = CORS(app, resources={
    r"/buses/*": {
        "origins": ["http://localhost:3000"],
        "supports_credentials": True
    },
    r"/register": {
        "origins": ["http://localhost:3000"],
        "supports_credentials": True
    },
    r"/login": {
        "origins": ["http://localhost:3000"],
        "supports_credentials": True
    }
})

# Configure SQLAlchemy
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.json.compact = False

# Configure Flask-Session
app.config['SESSION_TYPE'] = 'filesystem'

# Initialize extensions
db.init_app(app)
migrate = Migrate(app, db)
Session(app)
login_manager = LoginManager()
login_manager.init_app(app)

@login_manager.user_loader
def load_user(user_id):
    return Passenger.query.get(int(user_id)) or Driver.query.get(int(user_id)) or Admin.query.get(int(user_id))

@app.route('/')
def index():
    return "Welcome to the Go-Bus API"

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    role = data.get('role')  # Get the role from the request

    if role == 'passenger':
        user = Passenger(username=username, email=email)
        user.password = password
    elif role == 'driver':
        user = Driver(username=username, email=email)
        user.password = password
    elif role == 'admin':
        user = Admin(username=username, email=email)
        user.password = password
    else:
        return jsonify({'error': 'Invalid role selected'}), 400

    db.session.add(user)
    token = generate_token()  # Generate a token
    user.token = token  # Assign the token to the user
    db.session.commit()
    return jsonify({'message': 'Registration successful', 'token': token}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = Passenger.query.filter_by(email=email).first() or Driver.query.filter_by(email=email).first() or Admin.query.filter_by(email=email).first()

    if user and user.verify_password(password):
        login_user(user)
        token = generate_token()  # Generate a new token
        user.token = token  # Assign the new token to the user
        db.session.commit()
        return jsonify({'token': token}), 200
    else:
        return jsonify({'error': 'Invalid email or password'}), 401

@app.route('/logout', methods=['POST'])
@login_required
def logout():
    logout_user()
    return jsonify({'message': 'You have been logged out'}), 200

# Routes for bus management (for drivers)
@app.route('/buses', methods=['POST'])
@token_required
def create_bus():
    try:
        driver = current_user
        if isinstance(driver, Driver):
            data = request.get_json()
            if not data:
                return jsonify({'error': 'Request body is missing'}), 422

            company_name = data.get('company_name')
            number_plate = data.get('number_plate')
            no_of_seats = data.get('no_of_seats')
            cost_per_seat = data.get('cost_per_seat')
            route = data.get('route')
            boarding_point = data.get('boarding_point')
            destination = data.get('destination')
            departure_time = datetime.fromisoformat(data.get('departure_time'))
            arrival_time = datetime.fromisoformat(data.get('arrival_time'))

            if not all([company_name, number_plate, no_of_seats, cost_per_seat, route, boarding_point, destination, departure_time, arrival_time]):
                return jsonify({'error': 'Missing required fields'}), 422

            bus = Bus(
                company_name=company_name,
                number_plate=number_plate,
                no_of_seats=no_of_seats,
                cost_per_seat=cost_per_seat,
                route=route,
                boarding_point=boarding_point,
                destination=destination,
                departure_time=departure_time,
                arrival_time=arrival_time,
                driver_id=driver.id
            )
            db.session.add(bus)
            db.session.commit()
            return jsonify({'message': 'Bus created successfully'}), 201
        else:
            return jsonify({'error': 'You must be a logged-in driver to create a bus.'}), 401
    except Exception as e:
        db.session.rollback()
        app.logger.error(f"Error creating bus: {str(e)}")
        return jsonify({'error': str(e)}), 500

#Schedule buses
@app.route('/buses/schedule', methods=['POST'])
def schedule_bus():
    try:
        data = request.json
        # Parse the departure time string into a datetime object
        departure_time = datetime.strptime(data.get('departure_time'), '%Y-%m-%d %I:%M %p')
        # Create a new bus object with the parsed departure time and other data from the request
        new_bus = Bus(
            company_name=data.get('company_name'),
            number_plate=data.get('number_plate'),
            no_of_seats=data.get('no_of_seats'),
            cost_per_seat=data.get('cost_per_seat'),
            route=data.get('route'),
            departure_time=departure_time,
            driver_id=data.get('driver_id')
        )
        db.session.add(new_bus)
        db.session.commit()
        return jsonify({'message': 'Bus scheduled successfully'}), 201
    except Exception as e:
        db.session.rollback()
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
            bus.departure_time = datetime.strptime(data['departure_time'], '%I:%M %p')

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
        
        # Create a new booking with the current timestamp
        booking_time = datetime.now()
        new_booking = Booking(passenger_id=passenger_id, bus_id=bus_id, seat_number=seat_number, booking_time=booking_time)
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
        return jsonify({'message': 'Booking deleted successfully'}), 200
    else:
        return jsonify({'error': 'Booking not found'}), 404

@app.route('/bookings/<int:booking_id>', methods=['PUT'])
def update_booking(booking_id):
    data = request.json
    booking = Booking.query.get(booking_id)
    if booking:
        # Update the booking attributes with the new data
        booking.passenger_id = data.get('passenger_id', booking.passenger_id)
        booking.bus_id = data.get('bus_id', booking.bus_id)
        booking.seat_number = data.get('seat_number', booking.seat_number)

        # Update the booking time if provided in the request data
        new_booking_time_str = data.get('booking_time')
        if new_booking_time_str:
            try:
                new_booking_time = datetime.strptime(new_booking_time_str, '%Y-%m-%d %H:%M:%S')
                booking.booking_time = new_booking_time
            except ValueError:
                return jsonify({'error': 'Invalid date format'}), 400
        
        # Commit the changes to the database
        db.session.commit()
        return jsonify({'message': 'Booking updated successfully'}), 200
    else:
        return jsonify({'error': 'Booking not found'}), 404


@app.route('/buses/<int:bus_id>/seats', methods=['GET'])
def view_available_seats(bus_id):
    bus = Bus.query.get(bus_id)
    if not bus:
        return jsonify({'error': 'Bus not found'}), 404

    total_seats = bus.no_of_seats
    booked_seats = Booking.query.filter_by(bus_id=bus_id).count()
    available_seats = total_seats - booked_seats

    return jsonify({'available_seats': available_seats})
if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(port=5555, debug=True)