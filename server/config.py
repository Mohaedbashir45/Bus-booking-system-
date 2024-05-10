import redis
import os
from dotenv import load_dotenv

load_dotenv()

class ApplicationConfig:
    SECRET_KEY = os.environ.get("SECRET_KEY")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ECHO = True
    SQLALCHEMY_DATABASE_URI = f"sqlite:///{os.environ.get('DATABASE_NAME', 'your_database_name.db')}"

    SESSION_TYPE = "redis"
    SESSION_PERMANENT = False
    SESSION_USE_SIGNER = True
    SESSION_REDIS = redis.from_url(os.environ.get("REDIS_URL", "redis://127.0.0.1:6379"))
