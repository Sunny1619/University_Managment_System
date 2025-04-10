import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const SubjectClassesPage = () => {
    const [subjects, setSubjects] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const token = localStorage.getItem("University_user_token");
                const response = await axios.post(
                    "http://localhost:5000/api/get_professor_subjects",
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (response.status === 200) {
                    const subjectList = response.data.subjects.map(([name, id]) => ({ name, id }));
                    setSubjects(subjectList);
                }
            } catch (error) {
                console.error("Error fetching subjects:", error);
                toast.error("Failed to load subjects.");
            }
        };

        fetchSubjects();
    }, []);

    return (
        <div className="container mx-auto p-4 md:p-8 max-w-7xl">
            {/* Header Section */}
            <div className="text-center mb-6 md:mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">My Classroom</h1>
            </div>

            {/* Upcoming Classes Section */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6 md:mb-8">
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

                {/* Subjects Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {subjects.length > 0 ? (
                        subjects.map((subject, index) => (
                            <div
                                onClick={()=> navigate(`/${subject.id}/attendance`)}
                                key={index}
                                className="bg-gray-50 p-4 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                            >
                                <h3 className="text-lg font-medium text-gray-700">{subject.name}</h3>
                                <p className="text-sm text-gray-400 mt-1">{subject.id}</p>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 col-span-full">No subjects available.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SubjectClassesPage;
