import React from 'react';

const ClassroomPage = () => {
    const managementItems = [
        "Course Management",
        "Student Management",
        "Schedule & Timetable Management",
        "Grade & Performance Evaluation",
        "Leave & Request Management",
        "Fee & Payroll Management",
        "Attendance MAnagment",
    ];

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
                <div className="text-sm md:text-base text-gray-600">Date Day</div>
            </div>

            {/* Management Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 mb-6 md:mb-8">
                {managementItems.map((item, index) => (
                    <div
                        key={index}
                        className="bg-white p-4 md:p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                    >
                        <h3 className="text-base md:text-lg font-medium text-gray-700 text-center">
                            {item}
                        </h3>
                    </div>
                ))}
            </div>

            {/* PhD Supervision Section */}
            <div className="lg:col-span-3">
                <div className="bg-white p-4 md:p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                    <h3 className="text-base md:text-lg font-medium text-gray-700 text-center">
                        PhD Student Supervision & Thesis Tracking
                    </h3>
                </div>
            </div>
        </div>
    );
};

export default ClassroomPage;