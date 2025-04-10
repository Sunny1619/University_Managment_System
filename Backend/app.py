from flask import Flask
from config import Config
from models import db
from flask_jwt_extended import JWTManager
from flask_cors import CORS 

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173"], supports_credentials=True)
app.config.from_object(Config)
db.init_app(app)
jwt = JWTManager(app)

from routes import *

if __name__ == "__main__":
    with app.app_context():
        db.create_all()  # Create database tables
        print(db.engine.table_names()) 
    app.run(debug=True)
