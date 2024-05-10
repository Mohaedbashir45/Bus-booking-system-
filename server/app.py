from flask import Flask, request, jsonify, session  
from flask_bcrypt import Bcrypt 
from flask_cors import CORS  
from flask_session import Session  
from config import ApplicationConfig  
from models import db, User  

app = Flask(__name__) 
app.config.from_object(ApplicationConfig)  

bcrypt = Bcrypt(app)  
CORS(app, supports_credentials=True)  
Session(app) 
db.init_app(app) 

with app.app_context():
    db.create_all() 

@app.route('/@me')  #  a route for getting the current user
def get_current_user():
    user_id = session.get("user_id") 
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401  
    
    user = User.query.get(user_id)  
    if not user:
        return jsonify({"error": "User not found"}), 404  
    
    return jsonify({
        "id": user.id,
        "email": user.email,
        "role": "admin" if user.is_admin else ("driver" if user.is_driver else "passenger")
        # Return user details along with their role (admin, driver, or passenger)
    })

if __name__ == "__main__":
    app.run(debug=True)  