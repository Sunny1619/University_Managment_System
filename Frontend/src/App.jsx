import { useState } from 'react'
import Navbar from './components/Navbar'
import LandingPage from './components/LandingPage'
import { Routes, Route } from 'react-router-dom'
import Register from './components/Register'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import { Toaster } from 'react-hot-toast'
import ClassroomPage from './components/ClassroomPage'
import AttendancePage from './components/AttendancePage.jsx'
import GradingPage from './components/GradingPage.jsx'
import CourseManagementPage from './components/CourseManagementPage.jsx'
import SubjectClassesPage from './components/SubjectClassesPage.jsx'
import StudentManagementPage from './components/StudentManagmentPage.jsx'
function App() {

  return (
    <>
      {/* <h1 className='font-bold underline'>Hello DBMS</h1> */}
      <Navbar />
      <Toaster position='top-right' reverseOrder={false} />
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path='/:role/dashboard' element={<Dashboard />} />
        <Route path='/classroompage' element={<ClassroomPage />} />
        <Route path='/grading' element={<GradingPage />} />
        <Route path= '/:role/dashboard/courses' element={<CourseManagementPage/>}/>
        <Route path= '/:role/dashboard/subjects' element={<SubjectClassesPage/>}/>
        <Route path= '/:role/dashboard/studentList' element={<StudentManagementPage/>}/>
        <Route path= '/:subjectId/attendance' element={<AttendancePage/>}/>
      </Routes>

    </>
  )
}

export default App
