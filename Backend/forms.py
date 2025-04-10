from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField, SelectField, IntegerField
from wtforms.validators import DataRequired, Length, Email

class LoginForm(FlaskForm):
    email = StringField("Email", validators=[DataRequired(), Email()])
    password = PasswordField("Password", validators=[DataRequired()])
    submit = SubmitField("Login")

class RegisterForm(FlaskForm):
    username = StringField("Username", validators=[DataRequired()])
    email = StringField("Email", validators=[DataRequired(), Email()])
    password = PasswordField("Password", validators=[DataRequired(), Length(min=6)])
    role = SelectField("Role", choices=["professor", "Professor", "student", "Student", "assistant", "Assistant"], validators=[DataRequired()])
    name = StringField("Name", validators=[DataRequired()])
    department = SelectField("Role", choices=["CSE", "ECE"], validators=[DataRequired()])
    # above 6 fields are common for any tpe of user, the rest below field will be validated based on role recived in validate function
    reg_no = IntegerField("Reg")
    roll_no = StringField("Roll")
    prof_id = StringField("Prof_id")
    asst_id = StringField("Asst_id")

    def validate(self):
        rv = super().validate()
        if not rv:
            return False

        role = self.role.data.lower()

        if role == "professor":
            if not self.prof_id.data:
                self.prof_id.errors.append("Professor ID is required.")
                return False

        elif role == "student":
            if not self.reg_no.data:
                self.reg_no.errors.append("Registration number is required.")
                return False
            if not self.roll_no.data:
                self.roll_no.errors.append("Roll number is required.")
                return False
        
        elif role == 'assistant':
            if not self.asst_id.data:
                self.asst_id.errors.append("Assistant ID is required")

        return True
