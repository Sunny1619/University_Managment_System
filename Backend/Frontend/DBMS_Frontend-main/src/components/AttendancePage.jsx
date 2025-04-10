import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AttendancePage = () => {
    const [subjects, setSubjects] = useState([]);
    const [students, setStudents] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState('');
    const [attendance, setAttendance] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedDay, setSelectedDay] = useState('');
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const token = localStorage.getItem("University_user_token");
                const res = await axios.post(
                    "http://localhost:5000/api/get_professor_subjects",
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
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
            } finally {
                setLoading(false);
            }
        };

        fetchSubjects();
    }, []);

    useEffect(() => {
        const fetchStudents = async () => {
            if (!selectedSubject) return;

            try {
                setLoading(true);
                const token = localStorage.getItem("University_user_token");
                const res = await axios.post(
                    "http://localhost:5000/api/fetch_students_in_subject",
                    { subject_id: selectedSubject },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
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

    useEffect(() => {
        if (selectedDate) {
            const [year, month, day] = selectedDate.split('-');
            const dateObj = new Date(year, month - 1, day);
            const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
            setSelectedDay(dayName);
        }
    }, [selectedDate]);

    const initializeStudentData = (students) => {
        const initialAttendance = {};
        students.forEach(student => {
            initialAttendance[student.reg_no] = false;
        });
        setAttendance(initialAttendance);
    };

    const handleAttendanceChange = (regNo) => {
        setAttendance(prev => ({
            ...prev,
            [regNo]: !prev[regNo]
        }));
    };

    const handleSubmit = async () => {
        try {
            const token = localStorage.getItem("University_user_token");

            const presentStudents = students
                .filter(student => attendance[student.reg_no])
                .map(student => student.reg_no);

            const res = await axios.post(
                "http://localhost:5000/api/mark_attendance",
                {
                    subject_id: selectedSubject,
                    reg_nos: presentStudents,
                    date: selectedDate
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (res.status === 200) {
                alert('Attendance submitted successfully!');
                initializeStudentData(students); // Reset checkboxes
            } else {
                alert('Failed to submit attendance.');
            }
        } catch (err) {
            console.error("Error submitting attendance:", err);
            alert('Error submitting attendance');
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
                    <h2 className="text-2xl font-semibold text-gray-700 mb-4">Attendance Tracking</h2>
                    <SubjectSelector
                        subjects={subjects}
                        selectedSubject={selectedSubject}
                        onChange={setSelectedSubject}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
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
                        <div>
                            <label className="block text-gray-700 mb-2">Day</label>
                            <select
                                value={selectedDay}
                                onChange={(e) => setSelectedDay(e.target.value)}
                                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                required
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
                                <AttendanceToggle
                                    checked={attendance[student.reg_no]}
                                    onChange={() => handleAttendanceChange(student.reg_no)}
                                />
                            </div>
                        )}
                    />

                    <ActionButton
                        onClick={handleSubmit}
                        color="blue"
                        label="Submit Attendance"
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

const AttendanceToggle = ({ checked, onChange }) => (
    <div className="flex items-center gap-2">
        <input
            type="checkbox"
            checked={checked}
            onChange={onChange}
            className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
        />
        <span className="text-sm text-gray-500">Present</span>
    </div>
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

export default AttendancePage;