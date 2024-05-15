from flask import Flask, request, jsonify, session
from flask_migrate import Migrate
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from flask_session import Session
from datetime import datetime
from flask import abort
from config import ApplicationConfig
from models import db, User,Bus,Booking
from admin_auth import admin_auth_blueprint
from driver_auth import driver_auth_blueprint
from passenger_auth import passenger_auth_blueprint

app = Flask(__name__)
app.config.from_object(ApplicationConfig)
bcrypt = Bcrypt(app)
CORS(app, supports_credentials=True)
Session(app)
db.init_app(app)  # Initialize Flask-SQLAlchemy with the Flask app

# Configure SQLAlchemy
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.json.compact = False

migrate = Migrate(app, db)

# Register authentication blueprints
app.register_blueprint(admin_auth_blueprint)
app.register_blueprint(driver_auth_blueprint)
app.register_blueprint(passenger_auth_blueprint)

# Create database tables within the application context
with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(debug=True)

@app.route('/')
def index():
    return "Welcome to the Go-Bus API"

@app.route('/@me')
def get_current_user():
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401
    
    user = User.query.filter_by(id=user_id).first()
    return jsonify({
        "id": user.id,
        "email": user.email,
    })


@app.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")
    user_type = data.get("userType")

    user_exists = User.query.filter_by(email=email).first() is not None

    if user_exists:
        return jsonify({"error": "User already exists"}), 409

    hashed_password = bcrypt.generate_password_hash(password).decode("utf-8")

    if user_type == "customer":
        new_user = User(name=name, email=email, password=hashed_password, is_passenger=True)
    elif user_type == "admin":
        new_user = User(name=name, email=email, password=hashed_password, is_admin=True)

    db.session.add(new_user)
    db.session.commit()

    session["user_id"] = new_user.id

    return jsonify({
        "id": new_user.id,
        "name": new_user.name,
        "email": new_user.email,
        "success": True,
        "message": "Registration successful!"
    })
@app.route("/login", methods=["POST"])
def login_user():
    email = request.json.get("email")
    password = request.json.get("password")

    user = User.query.filter_by(email=email).first()

    if user is None:
        return jsonify({"error": "Unauthorized"}), 401

    if not bcrypt.check_password_hash(user.password, password):
        return jsonify({"error": "Unauthorized"}), 401
    
    session["user_id"] = user.id

    return jsonify({
        "id": user.id,
        "email": user.email,
    })

@app.route("/logout", methods=["POST"])
def logout_user():
    if "user_id" in session:
        session.pop("user_id")
        return jsonify({"message": "Logout successful"}), 200
    else:
        return jsonify({"error": "User not logged in"}), 400

# if __name__ == "__main__":
#     app.run(debug=True)

# from flask import Flask, request, jsonify
# from flask_migrate import Migrate
# from datetime import datetime
# from flask import abort
# from models import db, User, Bus, Booking
 


# User authentication route
# @app.route('/login', methods=['POST'])
# def login():
#     data = request.json
#     email = data.get('email')
#     password = data.get('password')
#     user = User.query.filter_by(email=email, password=password).first()
#     if user:
#         return jsonify({'message': 'Login successful', 'role': user.role}), 200
#     else:
#         return jsonify({'error': 'Invalid email or password'}), 401

# Route to classify users based on their roles
# @app.route('/users/<int:user_id>/classify', methods=['GET'])
# def classify_user(user_id):
#     user = User.query.get(user_id)
#     if user:
#         return jsonify({'message': 'User role classified', 'role': user.role}), 200
#     else:
#         return jsonify({'error': 'User not found'}), 404


# Routes for bus management (for drivers)
@app.route('/buses', methods=['POST'])
def create_bus():
    try:
        data = request.get_json()
        driver_id = data.get('driver_id')
        departure_time_str = data.get('departure_time')
        departure_time = datetime.strptime(departure_time_str, '%I:%M %p')
        bus = Bus(
            number_plate=data.get('number_plate'),
            no_of_seats=data.get('no_of_seats'),
            cost_per_seat=data.get('cost_per_seat'),
            route=data.get('route'),
            departure_time=departure_time,
            driver_id=driver_id
        )
        db.session.add(bus)
        db.session.commit()
        return jsonify({'message': 'Bus created successfully'}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

#Schedule buses
@app.route('/buses/schedule', methods=['POST'])
def schedule_bus():
    try:
        data = request.json
        # Parse the departure time string into a datetime object
        departure_time = datetime.strptime(data.get('departure_time'), '%I:%M %p')
        # Create a new bus object with the parsed departure time and other data from the request
        new_bus = Bus(
            number_plate=data.get('number_plate'),
            no_of_seats=data.get('no_of_seats'),
            cost_per_seat=data.get('cost_per_seat'),
            route=data.get('route'),
            departure_time=departure_time,
            driver_id=data.get('driver_id')
        )
        # Add the new bus to the database session
        db.session.add(new_bus)
        # Commit the session to save the changes to the database
        db.session.commit()
        return jsonify({'message': 'Bus scheduled successfully'}), 201
    except Exception as e:
        # If an error occurs, rollback the session and return an error response
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
        user_id = data.get('user_id')
        bus_id = data.get('bus_id')
        seat_number = data.get('seat_number')
        
        # Check if the seat is already booked
        existing_booking = Booking.query.filter_by(bus_id=bus_id, seat_number=seat_number).first()
        if existing_booking:
            return jsonify({'error': 'Seat already booked'}), 400
        
        # Check if all seats are booked
        bus = Bus.query.get(bus_id)
        if not bus:
            return jsonify({'error': 'Bus not found'}), 404
        
        if len(bus.bookings) >= bus.no_of_seats:
            return jsonify({'error': 'All seats are booked'}), 400
        
        # Make the booking
        booking = Booking(
            user_id=user_id,
            bus_id=bus_id,
            seat_number=seat_number,
            booking_time=datetime.now()
        )
        db.session.add(booking)
        db.session.commit()
        
        return jsonify({'message': 'Booking successful'}), 201
    except Exception as e:
        db.session.rollback()
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
        booking.user_id = data.get('user_id', booking.user_id)
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
    # Create the database tables
    db.create_all()
    # Run the Flask app
    app.run(port=5555, debug=True)
