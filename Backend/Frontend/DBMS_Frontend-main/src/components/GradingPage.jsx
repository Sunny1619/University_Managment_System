import React, { useState, useEffect } from 'react';
import axios from 'axios';

const GradingPage = () => {
    const [subjects, setSubjects] = useState([]);
    const [students, setStudents] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState('');
    const [grades, setGrades] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    // const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    // Fetch professor's subjects
    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const token = localStorage.getItem("University_user_token");
                const res = await axios.post(
                    "http://localhost:5000/api/get_professor_subjects",
                    {},
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                if (res.status === 200) {
                    const fetchedSubjects = res.data.subjects.map(([name, id]) => ({ name, id }));
                    setSubjects(fetchedSubjects);
                    if (fetchedSubjects.length > 0) {
                        setSelectedSubject(fetchedSubjects[0].id);
                    }
                }
            } catch (err) {
                console.error("Failed to load subjects:", err);
                setError("Failed to load subjects");
                setLoading(false);
            }
        };

        fetchSubjects();
    }, []);

    // Fetch students for selected subject
    useEffect(() => {
        const fetchStudents = async () => {
            if (!selectedSubject) return;

            try {
                setLoading(true);
                const token = localStorage.getItem("University_user_token");
                const res = await axios.post(
                    "http://localhost:5000/api/fetch_students_in_subject",
                    { subject_id: selectedSubject },
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                if (res.status === 200) {
                    const fetchedStudents = res.data.students.map(student => ({
                        reg_no: student.reg_no,
                        name: student.name,
                        roll_no: student.roll_no,
                    }));
                    setStudents(fetchedStudents);
                    initializeStudentData(fetchedStudents);
                }
            } catch (err) {
                console.error("Failed to load students:", err);
                setError("Failed to load students");
            } finally {
                setLoading(false);
            }
        };

        fetchStudents();
    }, [selectedSubject]);

    // Initialize grades state
    const initializeStudentData = (students) => {
        const initialGrades = {};
        students.forEach(student => {
            initialGrades[student.reg_no] = '';
        });
        setGrades(initialGrades);
    };

    const handleGradeChange = (regNo, value) => {
        setGrades(prev => ({
            ...prev,
            [regNo]: value
        }));
    };

    const handleSubmit = async () => {
        try {
            const token = localStorage.getItem("University_user_token");
            const gradeData = students.map(student => ({
                reg_no: student.reg_no,
                grade: grades[student.reg_no]
            }));
    
            const res = await axios.post(
                "http://localhost:5000/api/mark_grade",
                {
                    subject_id: selectedSubject, // ✅ Move this to the top level
                    grades: gradeData
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    withCredentials: true
                }
            );
    
            if (res.status === 200) {
                alert('Grades submitted successfully!');
                initializeStudentData(students);
            }
        } catch (err) {
            console.error("Error submitting grades:", err);
            alert('Error submitting grades');
        }
    };
    

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-red-500 text-xl p-4 border border-red-200 rounded-lg bg-red-50">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Professor Dashboard</h1>
                    <p className="text-gray-600 mt-2">
                        Managing {subjects.find(sub => sub.id === selectedSubject)?.name || ''}
                    </p>
                </header>

                <section className="bg-white rounded-xl shadow-lg p-6">
                    <h2 className="text-2xl font-semibold text-gray-700 mb-4">Grade Evaluation</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <SubjectSelector
                            subjects={subjects}
                            selectedSubject={selectedSubject}
                            onChange={setSelectedSubject}
                        />

                        <div>
                            <label className="block text-gray-700 mb-2">Date</label>
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                    </div>

                    <StudentList
                        students={students}
                        renderItem={(student) => (
                            <div className="flex items-center justify-between">
                                <StudentInfo student={student} />
                                <GradeInput
                                    value={grades[student.reg_no]}
                                    onChange={(e) => handleGradeChange(student.reg_no, e.target.value)}
                                />
                            </div>
                        )}
                    />

                    <ActionButton
                        onClick={handleSubmit}
                        color="green"
                        label="Submit Grades"
                        disabled={!selectedDate}
                    />
                </section>
            </div>
        </div>
    );
};

// Reusable Components
const SubjectSelector = ({ subjects, selectedSubject, onChange }) => (
    <div className="mb-6">
        <label className="block text-gray-700 mb-2">Select Subject</label>
        <select
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            value={selectedSubject}
            onChange={(e) => onChange(e.target.value)}
        >
            {subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                    {subject.name}
                </option>
            ))}
        </select>
    </div>
);

const StudentList = ({ students, renderItem }) => (
    <div className="overflow-x-auto">
        <h3 className="text-lg font-medium text-gray-600 mb-3">Student List</h3>
        <div className="space-y-3">
            {students.map((student) => (
                <div key={student.reg_no} className="p-3 bg-gray-50 rounded-lg">
                    {renderItem(student)}
                </div>
            ))}
        </div>
    </div>
);

const StudentInfo = ({ student }) => (
    <div>
        <p className="font-medium">{student.name}</p>
        <div className="flex gap-4">
            <p className="text-sm text-gray-500">Reg: {student.reg_no}</p>
            <p className="text-sm text-gray-500">Roll: {student.roll_no}</p>
        </div>
    </div>
);

const GradeInput = ({ value, onChange }) => (
    <select
        value={value}
        onChange={onChange}
        className="w-24 px-2 py-1 border rounded-md text-sm focus:ring-2 focus:ring-green-500"
        required
    >
        <option value="">Select</option>
        <option value="A">A</option>
        <option value="B">B</option>
        <option value="C">C</option>
        <option value="D">D</option>
        <option value="F">F</option>
    </select>
);

const ActionButton = ({ onClick, color, label, disabled }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className={`mt-6 w-full text-white py-2 px-4 rounded-lg transition-colors 
            bg-${color}-600 hover:bg-${color}-700 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
        {label}
    </button>
);

export default GradingPage;