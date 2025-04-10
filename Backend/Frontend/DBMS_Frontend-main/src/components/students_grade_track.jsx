import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const StudentGradesPage = () => {
    const [grades, setGrades] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchGrades = async () => {
            try {
                const token = localStorage.getItem("University_user_token");
                if (!token) {
                    toast.error("Please login first");
                    navigate('/login');
                    return;
                }

                const response = await axios.get(
                    "http://localhost:5000/api/student_grades",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        },
                        withCredentials: true,
                        timeout: 10000
                    }
                );

                if (response.status === 200) {
                    setGrades(response.data.grades || []);
                }
            } catch (error) {
                handleFetchError(error);
            } finally {
                setLoading(false);
            }
        };

        const handleFetchError = (error) => {
            console.error("Error fetching grades:", error);
            if (error.response) {
                switch(error.response.status) {
                    case 401:
                        localStorage.removeItem("University_user_token");
                        navigate('/login');
                        toast.error("Session expired. Please login again");
                        break;
                    case 403:
                        navigate('/');
                        toast.error("You don't have permission to view this page");
                        break;
                    case 500:
                        toast.error("Server error. Please try again later");
                        break;
                    default:
                        toast.error("Failed to load grade data");
                }
            } else {
                toast.error("Network error. Check your connection");
            }
        };

        fetchGrades();
    }, [navigate]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 md:p-8 max-w-7xl">
            <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl md:text-2xl font-semibold text-gray-700 mb-4">
                    Academic Grades
                </h2>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b-2 border-gray-200">
                                <th className="text-left p-3 text-gray-600">Subject Code</th>
                                <th className="text-left p-3 text-gray-600">Subject Name</th>
                                <th className="text-left p-3 text-gray-600">Grade</th>
                            </tr>
                        </thead>
                        <tbody>
                            {grades.length > 0 ? (
                                grades.map((grade) => (
                                    <tr key={`${grade.subject_id}-${grade.grade}`} className="hover:bg-gray-50">
                                        <td className="p-3 font-medium text-gray-800">{grade.subject_id}</td>
                                        <td className="p-3 text-gray-600">{grade.subject_name}</td>
                                        <td className="p-3 text-gray-600 font-semibold">{grade.grade}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" className="p-3 text-center text-gray-500">
                                        No grade records found
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

export default StudentGradesPage;