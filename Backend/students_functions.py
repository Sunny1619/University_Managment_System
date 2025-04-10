from flask import jsonify
from models import Student, ProfessorCourse, StudentCourse

def fetch_student_courses(student):
    subjects = [(course.subject.name, course.subject.id) for course in student.student_courses]
    return jsonify({"subjects": subjects}), 200


def fetch_student_attendance_data(student):
    attendance_data = []
    total_classes = 30  # You might want to make this dynamic based on your system
    
    for record in student.attendance_records:
        subject = record.subject
        percentage = (record.attendance_count / total_classes) * 100
        
        attendance_data.append({
            "subject_id": subject.id,
            "subject_name": subject.name,
            "attendance_count": record.attendance_count,
            "attendance_percentage": round(percentage, 2)
        })

    return jsonify({
        "student_id": student.reg_no,
        "student_name": student.name,
        "attendance": attendance_data
    }), 200

def fetch_student_grades_data(student):
    grades = []
    
    for record in student.grade_records:
        subject = record.subject
        grades.append({
            "subject_id": subject.id,
            "subject_name": subject.name,
            "grade": record.grade,
            "last_updated": record.last_updated.isoformat() if record.last_updated else None
        })
    
    return jsonify({
        "student_id": student.reg_no,
        "student_name": student.name,
        "grades": grades
    }), 200