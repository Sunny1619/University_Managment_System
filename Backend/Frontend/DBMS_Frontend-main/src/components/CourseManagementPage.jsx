import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const CourseManagementPage = () => {
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const token = localStorage.getItem("University_user_token");
                const response = await axios.post(
                    "http://localhost:5000/api/get_professor_subjects",
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                if (response.status === 200) {
                    const courseList = response.data.subjects.map(([name, id]) => ({
                        id,
                        name
                    }));
                    setCourses(courseList);
                }
            } catch (error) {
                console.error("Error fetching professor subjects:", error);
                toast.error("Failed to load courses");
            }
        };

        fetchCourses();
    }, []);

    return (
        <div className="container mx-auto p-4 md:p-8 max-w-7xl">
            {/* Course Table Section */}
            <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl md:text-2xl font-semibold text-gray-700 mb-4">
                    Course Management
                </h2>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b-2 border-gray-200">
                                <th className="text-left p-3 text-gray-600">Course ID</th>
                                <th className="text-left p-3 text-gray-600">Course Name</th>
                            </tr>
                        </thead>
                        <tbody>
                            {courses.length > 0 ? (
                                courses.map((course) => (
                                    <tr key={course.id} className="hover:bg-gray-50">
                                        <td className="p-3 font-medium text-gray-800">{course.id}</td>
                                        <td className="p-3 text-gray-600">{course.name}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="2" className="p-3 text-center text-gray-500">
                                        No courses available.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default CourseManagementPage;
