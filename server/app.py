
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

@app.route('/buses/<int:bus_id>', methods=['PUT'])
def update_bus(bus_id):
    try:
        driver = current_user
        if isinstance(driver, Driver):
            data = request.get_json()
            if not data:
                return jsonify({'error': 'Request body is missing'}), 422

            bus = Bus.query.get(bus_id)
            if not bus:
                return jsonify({'error': 'Bus not found'}), 404

            if bus.driver_id != driver.id:
                return jsonify({'error': 'You are not authorized to update this bus'}), 403

            company_name = data.get('company_name', bus.company_name)
            number_plate = data.get('number_plate', bus.number_plate)
            no_of_seats = data.get('no_of_seats', bus.no_of_seats)
            cost_per_seat = data.get('cost_per_seat', bus.cost_per_seat)
            route = data.get('route', bus.route)
            boarding_point = data.get('boarding_point', bus.boarding_point)
            destination = data.get('destination', bus.destination)
            departure_time = data.get('departure_time', bus.departure_time)
            arrival_time = data.get('arrival_time', bus.arrival_time)

            bus.company_name = company_name
            bus.number_plate = number_plate
            bus.no_of_seats = no_of_seats
            bus.cost_per_seat = cost_per_seat
            bus.route = route
            bus.boarding_point = boarding_point
            bus.destination = destination
            bus.departure_time = datetime.fromisoformat(departure_time) if departure_time else bus.departure_time
            bus.arrival_time = datetime.fromisoformat(arrival_time) if arrival_time else bus.arrival_time

            db.session.commit()
            return jsonify({'message': 'Bus updated successfully'}), 200
        else:
            return jsonify({'error': 'You must be a logged-in driver to update a bus.'}), 401
    except Exception as e:
        db.session.rollback()
        app.logger.error(f"Error updating bus: {str(e)}")
        return jsonify({'error': str(e)}), 500
@app.route('/buses/<int:bus_id>', methods=['DELETE'])
def delete_bus(bus_id):
    try:
        driver = current_user
        if isinstance(driver, Driver):
            bus = Bus.query.get(bus_id)
            if not bus:
                return jsonify({'error': 'Bus not found'}), 404

            if bus.driver_id != driver.id:
                return jsonify({'error': 'You are not authorized to delete this bus'}), 403

            db.session.delete(bus)
            db.session.commit()
            return jsonify({'message': 'Bus deleted successfully'}), 200
        else:
            return jsonify({'error': 'You must be a logged-in driver to delete a bus.'}), 401
    except Exception as e:
        db.session.rollback()
        app.logger.error(f"Error deleting bus: {str(e)}")
        return jsonify({'error': str(e)}), 500


    
# Routes for Bookings (for Customers)
@app.route('/buses/<int:bus_id>/seats', methods=['GET'])
def get_available_seats(bus_id):
    bus = Bus.query.get(bus_id)
    if not bus:
        return jsonify({'error': 'Bus not found'}), 404

    booked_seats = [booking.seat_number for booking in bus.bookings]
    available_seats = [seat for seat in range(1, bus.no_of_seats + 1) if seat not in booked_seats]

    return jsonify({'available_seats': available_seats}), 200
@app.route('/buses/<int:bus_id>/book', methods=['POST'])
@login_required
def book_seat(bus_id):
    data = request.get_json()
    seat_number = data.get('seat_number')

    bus = Bus.query.get(bus_id)
    if not bus:
        return jsonify({'error': 'Bus not found'}), 404

    if seat_number < 1 or seat_number > bus.no_of_seats:
        return jsonify({'error': 'Invalid seat number'}), 400

    booked_seats = [booking.seat_number for booking in bus.bookings]
    if seat_number in booked_seats:
        return jsonify({'error': 'Seat is already booked'}), 400

    passenger = current_user
    booking = Booking(passenger_id=passenger.id, bus_id=bus.id, seat_number=seat_number, booking_time=datetime.now())
    db.session.add(booking)
    db.session.commit()

    return jsonify({'message': 'Seat booked successfully', 'booking_id': booking.id}), 201
@app.route('/bookings/<int:booking_id>', methods=['PUT'])
@login_required
def update_booking(booking_id):
    booking = Booking.query.get(booking_id)
    if not booking:
        return jsonify({'error': 'Booking not found'}), 404

    passenger = current_user
    if booking.passenger_id != passenger.id:
        return jsonify({'error': 'You are not authorized to update this booking'}), 403

    data = request.get_json()
    new_seat_number = data.get('seat_number')

    bus = booking.bus
    if new_seat_number < 1 or new_seat_number > bus.no_of_seats:
        return jsonify({'error': 'Invalid seat number'}), 400

    booked_seats = [b.seat_number for b in bus.bookings if b.id != booking.id]
    if new_seat_number in booked_seats:
        return jsonify({'error': 'Seat is already booked'}), 400

    booking.seat_number = new_seat_number
    db.session.commit()

    return jsonify({'message': 'Booking updated successfully'}), 200
@app.route('/bookings/<int:booking_id>', methods=['DELETE'])
@login_required
def delete_booking(booking_id):
    booking = Booking.query.get(booking_id)
    if not booking:
        return jsonify({'error': 'Booking not found'}), 404

    passenger = current_user
    if booking.passenger_id != passenger.id:
        return jsonify({'error': 'You are not authorized to delete this booking'}), 403

    db.session.delete(booking)
    db.session.commit()

    return jsonify({'message': 'Booking deleted successfully'}), 200

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(port=5555, debug=True)

