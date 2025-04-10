🎓 College Management System
A role-based web application built with Flask and SQLAlchemy that streamlines student, professor, and assistant interactions. 
Features include subject enrollment, attendance tracking, grade management, and dynamic dashboards based on user roles. 
Designed for efficient academic workflow management.

Runing the project is simple :

🛠️ Backend Setup
1. Install MySQL if not already installed.
2. Create a database named IIITK: "CREATE DATABASE IIITK;"
3. Configure database URI:
   Open Backend/config.py
   Locate the line: " SQLALCHEMY_DATABASE_URI = "mysql+pymysql://root:your_password92@localhost/IIITK" "
   Replace "your_password92" with your actual MySQL root password.
4. Run the backend: "py -3 app.py"
   This will Create all necessary tables and Insert dummy data (if not already present). It will then start the server.
   

⚛️ Frontend Setup
1. Install Node.js (if not already installed)
2. Go to Frontend folder and run "npm install". This will install the required dependencies.
3. Now run "npm run dev".
4. Now you will have something like this "Local:   http://localhost:5173/" access that link using your browser

I have included some dummy data in app.py it will automatically insert them in table.
you can login as either of this and use the system :
  email='alice@univ.edu', password='hashed_pw1', role='student'
  email='bob@univ.edu', password='hashed_pw2', role='professor'
  email='carol@univ.edu', password='hashed_pw3', role='assistant'
  
