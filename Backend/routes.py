from flask import jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_cors import cross_origin
from models import *
from professor_functions import *
from students_functions import *
from auth_functions import *
from dashboard_function import *


# Register User (POST /api/register)
@app.route("/api/register", methods=["POST"])
def register_func():
    return register()

@app.route("/api/login", methods=["POST"])
def login_func():
    return login()

# Logout User (POST /api/logout)
@app.route("/api/logout", methods=["POST"])
@jwt_required()
def logout_func():
    return logout()

# Dashboard with Role-Based Access (GET /api/dashboard)
@app.route("/api/dashboard", methods=["GET"])
@jwt_required()
def dashboard_func():
    current_user = get_jwt_identity()
    user = User.query.filter_by(id=current_user["id"]).first()
    return dashboard(user)
    

@app.route("/api/get_professor_subjects", methods=["POST"])
@jwt_required()
def get_professor_subjects_func():
    current_user = get_jwt_identity()
    if current_user["role"]=="professor":
        professor = Professor.query.filter_by(id=current_user["id"]).first()
        return get_professor_subjects(professor)
    return jsonify({"error": "Unauthorized"}), 403

@app.route("/api/fetch_students_in_subject", methods=["POST"])
@jwt_required()
def fetch_students_in_subject_func():
    current_user = get_jwt_identity()
    if current_user["role"]=="professor":
        return fetch_students_in_subject()
    return jsonify({"error": "Unauthorized"}), 403

@app.route("/api/mark_attendance", methods=["POST"])
@jwt_required()
def mark_attendance_func():
    current_user = get_jwt_identity()
    if current_user["role"]=="professor":
        return mark_attendance()
    return jsonify({"error": "Unauthorized"}), 403


@app.route("/api/mark_grade", methods=["POST"])
@jwt_required()
def mark_grade_func():
    current_user = get_jwt_identity()
    if current_user["role"]=="professor":
        return mark_grade()
    return jsonify({"error": "Unauthorized"}), 403

@app.route("/api/assign_subject", methods=["POST"])
@jwt_required()
def assign_subject_func():
    current_user = get_jwt_identity()
    if current_user["role"]=="professor":
        professor = Professor.query.filter_by(id=current_user["id"]).first()
        return assign_subject(professor)
    return jsonify({"error": "Unauthorized"}), 403
    
# Student Routes

@app.route("/api/student_courses", methods=["GET"])
@jwt_required()
@cross_origin(supports_credentials=True, origins=["http://localhost:5173"])
def get_student_courses():
    try:
        current_user = get_jwt_identity()
        if current_user["role"] != "student":
            return jsonify({"error": "Forbidden: Student access only"}), 403
            
        student = Student.query.filter_by(id=current_user["id"]).first()
        if not student:
            return jsonify({"error": "Student not found"}), 404

        return fetch_student_courses(student)
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/student_attendance", methods=["GET", "OPTIONS"])
@jwt_required(optional=True)  # Allow OPTIONS without auth
@cross_origin(supports_credentials=True, 
             origins="http://localhost:5173",
             allow_headers=["Authorization", "Content-Type"])
def get_student_attendance():
    if request.method == "OPTIONS":
        return _build_preflight_response()
    
    try:
        current_user = get_jwt_identity()
        if not current_user or current_user["role"] != "student":
            return jsonify({"error": "Forbidden: Student access only"}), 403

        student = Student.query.filter_by(id=current_user["id"]).first()
        if not student:
            return jsonify({"error": "Student not found"}), 404

        return fetch_student_attendance_data(student)
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def _build_preflight_response():
    response = jsonify({"status": "preflight"})
    response.headers.add("Access-Control-Allow-Origin", "http://localhost:5173")
    response.headers.add("Access-Control-Allow-Headers", "Authorization, Content-Type")
    response.headers.add("Access-Control-Allow-Methods", "GET, OPTIONS")
    return response


@app.route("/api/student_grades", methods=["GET", "OPTIONS"])
@jwt_required(optional=True)
@cross_origin(supports_credentials=True, origins="http://localhost:5173", allow_headers=["Authorization", "Content-Type"])
def handle_student_grades():
    if request.method == "OPTIONS":
        return _build_preflight_response()
    
    try:
        current_user = get_jwt_identity()
        if not current_user or current_user["role"] != "student":
            return jsonify({"error": "Forbidden: Student access only"}), 403

        # Get student using user ID from the JWT token
        student = Student.query.filter_by(id=current_user["id"]).first()
        if not student:
            return jsonify({"error": "Student not found"}), 404

        # Fetch grade records through the student relationship
        grades = []
        for grade_record in student.grade_records:
            grades.append({
                "subject_id": grade_record.subject_id,
                "subject_name": grade_record.subject.name,
                "grade": grade_record.grade
            })

        return jsonify({
            "student_id": student.reg_no,
            "student_name": student.name,
            "grades": grades
        }), 200
        
    except Exception as e:
        app.logger.error(f"Error fetching grades: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500
