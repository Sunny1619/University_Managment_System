import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const StudentAttendancePage = () => {
    const [attendance, setAttendance] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAttendance = async () => {
            try {
                const token = localStorage.getItem("University_user_token");
                if (!token) {
                    toast.error("Please login first");
                    navigate('/login');
                    return;
                }

                const response = await axios.get(
                    "http://localhost:5000/api/student_attendance",
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
                    setAttendance(response.data.attendance || []);
                }
            } catch (error) {
                console.error("Error fetching attendance:", error);
                if (error.response) {
                    // Handle HTTP error statuses
                    if (error.response.status === 401) {
                        toast.error("Session expired. Please login again");
                        localStorage.removeItem("University_user_token");
                        navigate('/login');
                    } else if (error.response.status === 403) {
                        toast.error("You don't have permission to view this page");
                        navigate('/');
                    } else {
                        toast.error("Failed to load attendance data");
                    }
                } else if (error.code === "ECONNABORTED") {
                    toast.error("Request timed out. Please try again");
                } else if (error.code === "ERR_NETWORK") {
                    toast.error("Network error. Check your connection");
                } else {
                    toast.error("An unexpected error occurred");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchAttendance();
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
                    Attendance Overview
                </h2>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b-2 border-gray-200">
                                <th className="text-left p-3 text-gray-600">Subject ID</th>
                                <th className="text-left p-3 text-gray-600">Subject Name</th>
                                <th className="text-left p-3 text-gray-600">Classes Attended</th>
                                <th className="text-left p-3 text-gray-600">Attendance (%)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {attendance.length > 0 ? (
                                attendance.map((record) => (
                                    <tr key={`${record.subject_id}-${record.attendance_count}`} className="hover:bg-gray-50">
                                        <td className="p-3 font-medium text-gray-800">{record.subject_id}</td>
                                        <td className="p-3 text-gray-600">{record.subject_name}</td>
                                        <td className="p-3 text-gray-600">{record.attendance_count}</td>
                                        <td className="p-3 text-gray-600">
                                            {typeof record.attendance_percentage === 'number' 
                                                ? `${record.attendance_percentage.toFixed(2)}%`
                                                : 'N/A'}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="p-3 text-center text-gray-500">
                                        No attendance records found
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

export default StudentAttendancePage;