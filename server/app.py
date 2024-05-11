from flask import Flask
from config import ApplicationConfig
from models import db
from passenger_auth import passenger_auth_blueprint
from admin_auth import admin_auth_blueprint
from driver_auth import driver_auth_blueprint

app = Flask(__name__)
app.config.from_object(ApplicationConfig)

db.init_app(app)

# Register blueprints
app.register_blueprint(passenger_auth_blueprint)
app.register_blueprint(admin_auth_blueprint)
app.register_blueprint(driver_auth_blueprint)

# Define a route for the root URL
@app.route('/')
def index():
    return "Welcome to the Go-Basi API"

if __name__ == '__main__':
    app.run(debug=True)
