from flask import jsonify
from models import Professor, Student, Assistant

def dashboard(user):
    if user.role == "professor":
        temp = Professor.query.filter_by(id=user.id).first()
        return jsonify(
        {
            "username" : user.username,
            "email" : user.email,
            "role" : user.role,
            "department" : temp.department,
            "name" : temp.name,
            "prof_id": temp.prof_id
        }
    )
    elif user.role == "student":
        temp = Student.query.filter_by(id=user.id).first()
        return jsonify(
            {
                "username" : user.username,
                "email" : user.email,
                "role" : user.role,
                "department" : temp.department,
                "name" : temp.name,
                "reg_no" : temp.reg_no,
                "roll_no" : temp.roll_no
            }
        )
    else:
        temp = Assistant.query.filter_by(id=user.id).first()
        return jsonify(
            {
                "username" : user.username,
                "email" : user.email,
                "role" : user.role,
                "department" : temp.department,
                "name" : temp.name,
                "asst_id" : temp.asst_id
                
            }
        )
    