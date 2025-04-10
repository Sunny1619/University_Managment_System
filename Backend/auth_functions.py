from models import *
from forms import RegisterForm, LoginForm
from flask_jwt_extended import create_access_token
from flask_bcrypt import Bcrypt
from flask import jsonify, request
from app import app, db

bcrypt = Bcrypt(app)
hashed = bcrypt.generate_password_hash("123456").decode("utf-8")
print(hashed)

def register():
    form = RegisterForm(data=request.json)  # Ensure we pass JSON data

    if form.validate():
        existing_user1 = User.query.filter_by(email=form.email.data).first()
        existing_user2 = User.query.filter_by(username=form.username.data).first()
        if existing_user1 or existing_user2:
            return jsonify({"message": "Email or Username already taken"}), 400  # Bad Request
        hashed_password = bcrypt.generate_password_hash(form.password.data).decode("utf-8")
        new_user = User(email=form.email.data, username=form.username.data, password=hashed_password, role=form.role.data.lower())
        db.session.add(new_user)
        db.session.flush()

        if form.role.data.lower() == "professor":
            if Professor.query.filter_by(prof_id=form.prof_id.data).first():
                db.session.rollback()
                return jsonify({"message": "Professor ID already exists"}), 400
            new_professor = Professor(id=new_user.id, prof_id=form.prof_id.data, name=form.name.data, department=form.department.data)
            db.session.add(new_professor)

        elif form.role.data.lower() == "student":
            if Student.query.filter_by(reg_no=form.reg_no.data).first() or Student.query.filter_by(roll_no=form.roll_no.data).first():
                db.session.rollback()
                return jsonify({"message": "Studnet Reg/Roll already exists"}), 400
            new_student = Student(id=new_user.id, reg_no=form.reg_no.data, roll_no=form.roll_no.data, name=form.name.data, department=form.department.data)
            db.session.add(new_student)
            
        elif form.role.data.lower() == "assistant":
            if Assistant.query.filter_by(asst_id=form.asst_id.data).first():
                db.session.rollback()
                return jsonify({"message": "Assistant ID already exists"}), 400
            new_assistant = Assistant(id=new_user.id, asst_id=form.asst_id.data, name=form.name.data, department=form.department.data)
            db.session.add(new_assistant)

        db.session.commit()
        return jsonify({"message": "Registration successful"}), 201
    else:
        return jsonify({"errors": form.errors}), 400  # Return validation errors
    

def login():
    form = LoginForm(data=request.json)  # Pass JSON data to Flask-WTF form

    if form.validate():  # Validate input fields
        user = User.query.filter_by(email=form.email.data).first()
        
        if user and bcrypt.check_password_hash(user.password, form.password.data):
            access_token = create_access_token(identity={"id": user.id, "role": user.role})
            return jsonify({"token": access_token}), 200  # Successful login

        return jsonify({"message": "Invalid Email or password"}), 401  # Unauthorized
    else:
        return jsonify({"errors": form.errors}), 400  # Return validation errors
    
def logout():
    #"Delete the JWT token in Frontend"
    return jsonify({"message": "Done"}), 200