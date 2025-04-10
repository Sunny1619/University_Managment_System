from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)  # Used for login
    username = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(20), nullable=False)  # 'professor', 'student', 'assistant'

    student = db.relationship('Student', back_populates='user', uselist=False)
    professor = db.relationship('Professor', back_populates='user', uselist=False)
    assistant = db.relationship('Assistant', back_populates='user', uselist=False)

    def __repr__(self):
        return f"<User {self.username} - Role: {self.role}>"

class Student(db.Model):
    __tablename__ = 'students'

    id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete="CASCADE"))
    reg_no = db.Column(db.Integer, unique=True, nullable=False, primary_key=True)
    roll_no = db.Column(db.String(50), unique=True, nullable=False)
    name = db.Column(db.String(100), nullable=False)
    department = db.Column(db.String(100), nullable=False)

    user = db.relationship('User', back_populates='student')
    student_courses = db.relationship('StudentCourse', back_populates='student', cascade="all, delete-orphan")
    attendance_records = db.relationship('AttendanceMark', back_populates='student', cascade="all, delete-orphan")
    grade_records = db.relationship('GradeMark', back_populates='student', cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Student {self.name} ({self.reg_no})>"

class Professor(db.Model):
    __tablename__ = 'professors'

    id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete="CASCADE"))
    prof_id = db.Column(db.String(20), unique=True, nullable=False, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    department = db.Column(db.String(100), nullable=False)

    user = db.relationship('User', back_populates='professor')
    professor_courses = db.relationship('ProfessorCourse', back_populates='professor', cascade="all, delete-orphan")
    timetable_entries = db.relationship('Timetable', back_populates='professor', cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Professor {self.name} ({self.prof_id})>"

class Assistant(db.Model):
    __tablename__ = 'assistants'

    id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete="CASCADE"))
    asst_id = db.Column(db.String(20), unique=True, nullable=False, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    department = db.Column(db.String(100), nullable=False)

    user = db.relationship('User', back_populates='assistant')

    def __repr__(self):
        return f"<Assistant {self.name} ({self.asst_id})>"

class Subject(db.Model):
    __tablename__ = 'subjects'

    id = db.Column(db.String(50), primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)

    student_courses = db.relationship('StudentCourse', back_populates='subject', cascade="all, delete-orphan")
    professor_courses = db.relationship('ProfessorCourse', back_populates='subject', cascade="all, delete-orphan")
    attendance_records = db.relationship('AttendanceMark', back_populates='subject', cascade="all, delete-orphan")
    grade_records = db.relationship('GradeMark', back_populates='subject', cascade="all, delete-orphan")
    timetable_entries = db.relationship('Timetable', back_populates='subject', cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Subject {self.name}>"

class StudentCourse(db.Model):
    __tablename__ = 'student_course'

    reg_no = db.Column(db.Integer, db.ForeignKey('students.reg_no', ondelete="CASCADE"), primary_key=True)
    subject_id = db.Column(db.String(50), db.ForeignKey('subjects.id', ondelete="CASCADE"), primary_key=True)

    student = db.relationship('Student', back_populates='student_courses')
    subject = db.relationship('Subject', back_populates='student_courses')

    def __repr__(self):
        return f"<StudentCourse(reg_no={self.reg_no}, subject_id={self.subject_id})>"

class ProfessorCourse(db.Model):
    __tablename__ = 'professor_course'

    prof_id = db.Column(db.String(20), db.ForeignKey('professors.prof_id', ondelete="CASCADE"), primary_key=True)
    subject_id = db.Column(db.String(50), db.ForeignKey('subjects.id', ondelete="CASCADE"), primary_key=True)

    professor = db.relationship('Professor', back_populates='professor_courses')
    subject = db.relationship('Subject', back_populates='professor_courses')

    def __repr__(self):
        return f"<ProfessorCourse(professor_id={self.prof_id}, subject_id={self.subject_id})>"

class AttendanceMark(db.Model): 
    __tablename__ = 'attendance_mark'

    reg_no = db.Column(db.Integer, db.ForeignKey('students.reg_no', ondelete="CASCADE"), primary_key=True)
    subject_id = db.Column(db.String(50), db.ForeignKey('subjects.id', ondelete="CASCADE"), primary_key=True)
    attendance_count = db.Column(db.Integer, nullable=False, default=0)

    student = db.relationship('Student', back_populates='attendance_records')
    subject = db.relationship('Subject', back_populates='attendance_records')

    def __repr__(self):
        return f"<AttendanceMark(student_id={self.reg_no}, subject_id={self.subject_id}, attendance_count={self.attendance_count})>"

class GradeMark(db.Model):
    __tablename__ = 'grade_mark'

    reg_no = db.Column(db.Integer, db.ForeignKey('students.reg_no', ondelete="CASCADE"), primary_key=True)
    subject_id = db.Column(db.String(50), db.ForeignKey('subjects.id', ondelete="CASCADE"), primary_key=True)
    grade = db.Column(db.String(10), nullable=False)

    student = db.relationship('Student', back_populates='grade_records')
    subject = db.relationship('Subject', back_populates='grade_records')

    def __repr__(self):
        return f"<GradeMark(student_id={self.reg_no}, subject_id={self.subject_id}, grade={self.grade})>"

class Timetable(db.Model):
    __tablename__ = 'timetables'

    id = db.Column(db.Integer, primary_key=True)
    prof_id = db.Column(db.String(20), db.ForeignKey('professors.prof_id', ondelete="CASCADE"), nullable=False)
    subject_id = db.Column(db.String(50), db.ForeignKey('subjects.id', ondelete="CASCADE"), nullable=False)
    day_of_week = db.Column(db.String(10), nullable=False)  # e.g., Monday, Tuesday
    start_time = db.Column(db.Time, nullable=False)
    end_time = db.Column(db.Time, nullable=False)

    professor = db.relationship('Professor', back_populates='timetable_entries')
    subject = db.relationship('Subject', back_populates='timetable_entries')

    def __repr__(self):
        return f"<Timetable(professor_id={self.prof_id}, subject_id={self.subject_id}, {self.day_of_week} {self.start_time}-{self.end_time})>"
