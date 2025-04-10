import React from 'react';

const StudentManagementPage = () => {
    // Sample student data
    const students = [
        { name: 'John Doe', email: 'john@iiitkalyani.ac.in' },
        { name: 'Jane Smith', email: 'jane@iiitkalyani.ac.in' },
        { name: 'Robert Johnson', email: 'robert@iiitkalyani.ac.in' },
        { name: 'Emily Davis', email: 'emily@iiitkalyani.ac.in' },
        { name: 'Michael Wilson', email: 'michael@iiitkalyani.ac.in' },
    ];

    return (
        <div className="container mx-auto p-4 md:p-8 max-w-7xl">
            {/* Header Section */}
            <div className="text-center mb-6 md:mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">My Classroom</h1>
            </div>

            {/* Student List Section */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6 md:mb-8">
                <h2 className="text-xl md:text-2xl font-semibold text-gray-700 mb-4">
                    List of Students
                </h2>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b-2 border-gray-200">
                                <th className="text-left p-3 text-gray-600">Student Name</th>
                                <th className="text-left p-3 text-gray-600">Student Email</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map((student, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    <td className="p-3 font-medium text-gray-800">{student.name}</td>
                                    <td className="p-3 text-gray-600">{student.email}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
};


export default StudentManagementPage;