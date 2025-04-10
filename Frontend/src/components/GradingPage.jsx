import React, { useState, useEffect } from 'react';

const GradingPage = () => {
    const [subjects, setSubjects] = useState([]);
    const [students, setStudents] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState('');
    const [grades, setGrades] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedDay, setSelectedDay] = useState('');
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    // Fetch subjects and initial data
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                // Simulate API call for subjects
                const mockSubjects = ["Mathematics", "Computer Science", "Physics"];
                await new Promise(resolve => setTimeout(resolve, 500));

                setSubjects(mockSubjects);
                setSelectedSubject(mockSubjects[0]);

                // Simulate API call for students
                const mockStudents = [
                    { id: 1, name: "John Doe", roll: "CS101" },
                    { id: 2, name: "Jane Smith", roll: "CS102" },
                    { id: 3, name: "Bob Wilson", roll: "CS103" },
                ];
                await new Promise(resolve => setTimeout(resolve, 500));

                setStudents(mockStudents);
                initializeStudentData(mockStudents);

                // Set initial date and day
                const today = new Date();
                const localDate = today.toISOString().split('T')[0];
                setSelectedDate(localDate);
                const dayName = today.toLocaleDateString('en-US', { weekday: 'long' });
                setSelectedDay(dayName);

                setError('');
            } catch (err) {
                setError('Failed to load initial data');
            } finally {
                setLoading(false);
            }
        };

        fetchInitialData();
    }, []);

    // Update day when date changes
    useEffect(() => {
        if (selectedDate) {
            const [year, month, day] = selectedDate.split('-');
            const dateObj = new Date(year, month - 1, day);
            const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
            setSelectedDay(dayName);
        }
    }, [selectedDate]);

    // Initialize grades state
    const initializeStudentData = (students) => {
        const initialGrades = {};
        students.forEach(student => {
            initialGrades[student.id] = '';
        });
        setGrades(initialGrades);
    };

    const handleGradeChange = (studentId, value) => {
        setGrades(prev => ({
            ...prev,
            [studentId]: value
        }));
    };

    const handleSubmit = async () => {
        try {
            const gradingData = {
                date: selectedDate,
                day: selectedDay,
                subject: selectedSubject,
                grades: grades
            };
            console.log('Grades submitted:', gradingData);
            alert('Grades submitted successfully!');
        } catch (err) {
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
                    <p className="text-gray-600 mt-2">Managing {selectedSubject}</p>
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
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 mb-2">Day</label>
                            <select
                                value={selectedDay}
                                onChange={(e) => setSelectedDay(e.target.value)}
                                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            >
                                {daysOfWeek.map(day => (
                                    <option key={day} value={day}>{day}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <StudentList
                        students={students}
                        renderItem={(student) => (
                            <div className="flex items-center justify-between">
                                <StudentInfo student={student} />
                                <GradeInput
                                    value={grades[student.id]}
                                    onChange={(e) => handleGradeChange(student.id, e.target.value)}
                                />
                            </div>
                        )}
                    />

                    <ActionButton
                        onClick={handleSubmit}
                        color="green"
                        label="Submit Grades"
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
            {subjects.map((subject, index) => (
                <option key={index} value={subject}>{subject}</option>
            ))}
        </select>
    </div>
);

const StudentList = ({ students, renderItem }) => (
    <div className="overflow-x-auto">
        <h3 className="text-lg font-medium text-gray-600 mb-3">Student List</h3>
        <div className="space-y-3">
            {students.map((student) => (
                <div key={student.id} className="p-3 bg-gray-50 rounded-lg">
                    {renderItem(student)}
                </div>
            ))}
        </div>
    </div>
);

const StudentInfo = ({ student }) => (
    <div>
        <p className="font-medium">{student.name}</p>
        <p className="text-sm text-gray-500">{student.roll}</p>
    </div>
);

const GradeInput = ({ value, onChange }) => (
    <select
        value={value}
        onChange={onChange}
        className="w-24 px-2 py-1 border rounded-md text-sm focus:ring-2 focus:ring-green-500"
    >
        <option value="">Select</option>
        <option value="A">A</option>
        <option value="B">B</option>
        <option value="C">C</option>
        <option value="D">D</option>
        <option value="F">F</option>
    </select>
);

const ActionButton = ({ onClick, color, label }) => {
    const colors = {
        green: 'bg-green-600 hover:bg-green-700'
    };

    return (
        <button
            onClick={onClick}
            className={`mt-6 w-full text-white py-2 px-4 rounded-lg transition-colors ${colors[color]}`}
        >
            {label}
        </button>
    );
};

export default GradingPage;