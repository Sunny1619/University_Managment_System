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

        if not User.query.first():
            # Users
            users = [
                User(id=1, email='alice@univ.edu', username='alice123', password='hashed_pw1', role='student'),
                User(id=2, email='bob@univ.edu', username='bob456', password='hashed_pw2', role='professor'),
                User(id=3, email='carol@univ.edu', username='carol789', password='hashed_pw3', role='assistant'),
            ]
            db.session.add_all(users)

            # Student
            student = Student(id=1, reg_no=1001, roll_no='STU01', name='Alice Smith', department='Computer Science')
            db.session.add(student)

            # Professor
            professor = Professor(id=2, prof_id='PROF01', name='Dr. Bob Johnson', department='Computer Science')
            db.session.add(professor)

            # Assistant
            assistant = Assistant(id=3, asst_id='ASST01', name='Carol White', department='Computer Science')
            db.session.add(assistant)

            # Subjects
            subjects = [
                Subject(id='CS101', name='Introduction to Programming'),
                Subject(id='CS102', name='Data Structures'),
            ]
            db.session.add_all(subjects)

            # Student Courses
            student_courses = [
                StudentCourse(reg_no=1001, subject_id='CS101'),
                StudentCourse(reg_no=1001, subject_id='CS102'),
            ]
            db.session.add_all(student_courses)

            # Professor Courses
            professor_courses = [
                ProfessorCourse(prof_id='PROF01', subject_id='CS101'),
                ProfessorCourse(prof_id='PROF01', subject_id='CS102'),
            ]
            db.session.add_all(professor_courses)

            # Attendance
            attendance = [
                AttendanceMark(reg_no=1001, subject_id='CS101', attendance_count=12),
                AttendanceMark(reg_no=1001, subject_id='CS102', attendance_count=9),
            ]
            db.session.add_all(attendance)

            # Grades
            grades = [
                GradeMark(reg_no=1001, subject_id='CS101', grade='A'),
                GradeMark(reg_no=1001, subject_id='CS102', grade='B+'),
            ]
            db.session.add_all(grades)

            # Timetable
            timetable_entries = [
                Timetable(prof_id='PROF01', subject_id='CS101', day_of_week='Monday', start_time=time(9, 0), end_time=time(10, 30)),
                Timetable(prof_id='PROF01', subject_id='CS102', day_of_week='Wednesday', start_time=time(11, 0), end_time=time(12, 30)),
            ]
            db.session.add_all(timetable_entries)

            db.session.commit()
            print("Dummy data inserted.")

        print(db.engine.table_names()) 
    app.run(debug=True)
