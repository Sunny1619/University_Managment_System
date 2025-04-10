from flask import jsonify, request
from models import *

def get_professor_subjects(professor):
    subjects = [(course.subject.name, course.subject.id) for course in professor.professor_courses]
    return jsonify({"subjects" : subjects}), 200


def fetch_students_in_subject():
    subject_id = request.json.get("subject_id")
    
    if not subject_id:
        return jsonify({"error": "subject_id is required"}), 400

    subject = Subject.query.get(subject_id)
    if not subject:
        return jsonify({"error": "Subject not found"}), 404

    students = [
        {
            "reg_no": course.student.reg_no,
            "roll_no": course.student.roll_no,
            "name" : course.student.name
        }
        for course in subject.student_courses
    ]

    return jsonify({
        "subject_id": subject_id,
        "subject_name": subject.name,
        "students": students
    }), 200

def mark_attendance():
    data = request.get_json()
    subject_id = data.get("subject_id")
    reg_nos = data.get("reg_nos")

    if not subject_id or not isinstance(reg_nos, list):
        return jsonify({"error": "Invalid data format"}), 400

    for reg_no in reg_nos:
        attendance = AttendanceMark.query.filter_by(reg_no=reg_no, subject_id=subject_id).first()

        if attendance:
            attendance.attendance_count += 1
        else:
            # Create a new attendance record if not exists
            new_attendance = AttendanceMark(reg_no=reg_no, subject_id=subject_id, attendance_count=1)
            db.session.add(new_attendance)

    db.session.commit()
    return jsonify({"message": "Attendance marked successfully"}), 200

def mark_grade():
    data = request.get_json()
    subject_id = data.get("subject_id")
    grades = data.get("grades")

    if not subject_id or not grades:
        return jsonify({"error": "subject_id and grades are required"}), 400

    for entry in grades:
        reg_no = entry.get("reg_no")
        grade = entry.get("grade")

        if not reg_no or grade is None:
            continue  # Skip invalid entries

        grade_record = GradeMark.query.filter_by(reg_no=reg_no, subject_id=subject_id).first()

        if grade_record:
            # Update existing grade
            grade_record.grade = grade
        else:
            # Create new grade record
            new_grade = GradeMark(reg_no=reg_no, subject_id=subject_id, grade=grade)
            db.session.add(new_grade)

    db.session.commit()
    return jsonify({"message": "Grades updated successfully"}), 200


def assign_subject(professor):
    prof_id = professor.prof_id
    subject_id = request.json.get("subject_id")
    
    if not prof_id or not subject_id:
        return jsonify({"error": "prof_id and subject_id are required"}), 400

    # Check if assignment already exists
    existing = ProfessorCourse.query.filter_by(prof_id=prof_id, subject_id=subject_id).first()

    if existing:
        return jsonify({"message": "This course is already assigned to the professor."}), 409  # Conflict

    try:
        new_assignment = ProfessorCourse(prof_id=prof_id, subject_id=subject_id)
        db.session.add(new_assignment)
        db.session.commit()
        return jsonify({"message": "Course assigned successfully!"}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
    
def delete_subject(professor):
    prof_id = professor.prof_id
    subject_id = request.json.get("subject_id")

    if not prof_id or not subject_id:
        return jsonify({"error": "prof_id and subject_id are required"}), 400

    assignment = ProfessorCourse.query.filter_by(prof_id=prof_id, subject_id=subject_id).first()

    if not assignment:
        return jsonify({"error": "Assignment not found"}), 404

    try:
        db.session.delete(assignment)
        db.session.commit()
        return jsonify({"message": "Assignment deleted successfully."}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

    





