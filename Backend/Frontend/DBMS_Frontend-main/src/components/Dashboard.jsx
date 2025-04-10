import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // const user = location.state?.user || null;
  const path = location.pathname.toLowerCase();

  let managementItems = [];

  if (path.includes('professor')) {
    managementItems = [
      { label: "Course Management", path: "/Professor/dashboard/courses/professor" },
      { label: "Subject Management", path: "/Professor/dashboard/subjects" },
      { label: "Student Management", path: "/Professor/dashboard/studentList" },
      { label: "Schedule & Timetable Management", path: "/schedule" },
      { label: "Grade & Performance Evaluation", path: "/grades" },
      { label: "Leave & Request Management", path: "/leave-requests" },
      { label: "Fee & Payroll Management", path: "/fees-payroll" },
      { label: "Attendance Management", path: "/attendance" },
      { label: "PhD Student Supervision & Thesis Tracking", path: "/phd-tracking" }
    ];
  } else if (path.includes('student')) {
    managementItems = [
      { label: "Course Management", path: "/Student/dashboard/courses/students" },
      { label: "Attendance Tracking", path: "/student/attendance" },  
      { label: "Fees and Payments Management", path: "/fees" },
      { label: "Performance & Grade Tracking", path: "/student/grades" },
      { label: "Hostel and Transport Management", path: "/hostel-transport" },
      { label: "Career and Placement Support", path: "/placement" },
      { label: "Student Clubs and Extracurriculars", path: "/clubs" },
      { label: "Library Book Issue", path: "/library" }
    ];
  } else if (path.includes('assistant')) {
    managementItems = [
      { label: "Course Management", path: "/courses" },
      { label: "Professor Management", path: "/professors" },
      { label: "Attendance Monitoring", path: "/attendance" },
      { label: "Course And Department Management", path: "/course-dept" },
      { label: "Fee and Payment Management", path: "/payments" },
      { label: "Exam And Result Management Timetable", path: "/exams" },
      { label: "Library Management", path: "/library" },
      { label: "Security and User Access Management", path: "/security" }
    ];
  }

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-7xl">

      {/* Header Section */}
      <div className="text-center mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">My Classroom</h1>
      </div>

      {/* Upcoming Events Section */}
      <div className="bg-blue-100 p-3 md:p-4 rounded-lg mb-6 md:mb-8">
        <h2 className="text-lg md:text-xl font-semibold text-gray-700 mb-2">
          Upcoming classes, exams, and assignments
        </h2>
        <div className="text-sm md:text-base text-gray-600">
          {new Date().toLocaleString('en-US', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          })}
        </div>
      </div>

      {/* Management Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 mb-6 md:mb-8">
        {managementItems.map((item, index) => (
          <div
            key={index}
            onClick={() => navigate(item.path)}
            className="cursor-pointer bg-white p-4 md:p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <h3 className="text-base md:text-lg font-medium text-gray-700 text-center">
              {item.label}
            </h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
