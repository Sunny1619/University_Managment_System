import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';

const Register = () => {
  const Location = useLocation();
  const role = Location.state?.role || "Student";

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('');
  const [regNo, setRegNo] = useState('');
  const [rollNo, setRollNo] = useState('');
  const [profId, setProfId] = useState('');
  const [asstId, setAsstId] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    const payload = {
      username,
      password,
      email,
      name,
      department,
      role
    };

    if (role.toLowerCase() === "student") {
      payload.reg_no = regNo;
      payload.roll_no = rollNo;
    }

    if (role.toLowerCase() === "professor") {
      payload.prof_id = profId;
    }

    if (role.toLowerCase() === "assistant") {
      payload.asst_id = asstId;
    }

    try {
      setLoading(true);
      const response = await axios.post("http://localhost:5000/api/register", payload);
      toast.success(response.data.message);
      setLoading(false);

      navigate(`/${role}/dashboard`, { state: { user: response.config.data } });
    } catch (error) {
      setLoading(false);
      console.error('Error during registration:', error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.response?.data?.errors) {
        const errors = Object.values(error.response.data.errors).flat();
        toast.error(errors[0] || 'Validation error');
      } else {
        toast.error('Registration failed. Please try again.');
      }
    }
  };

  return (
    <div className='flex items-center justify-center h-screen'>
      <div className="flex mt-20 sm:mt-18 lg:mt-96 flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm flex flex-col items-center justify-center gap-4">
          <img
            alt="IIIT KALYANI"
            src="/IIITK_img.png"
            className="mx-auto w-[20vw] sm:w-[15vw] md:w-[12vw] lg:w-[10vw] xl:w-[8vw]"
          />
          <h2 className="text-center text-2xl/9 font-bold tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-2 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-900">Username</label>
              <input type="text" required value={username} onChange={(e) => setUsername(e.target.value)}
                className="mt-1 block w-full rounded-md border px-3 py-2 text-gray-900" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900">Password</label>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full rounded-md border px-3 py-2 text-gray-900" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900">Email</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-md border px-3 py-2 text-gray-900" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900">Name</label>
              <input type="text" required value={name} onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full rounded-md border px-3 py-2 text-gray-900" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900">Department</label>
              <input type="text" required value={department} onChange={(e) => setDepartment(e.target.value)}
                className="mt-1 block w-full rounded-md border px-3 py-2 text-gray-900" />
            </div>

            {role === "Student" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-900">Registration No</label>
                  <input type="text" required value={regNo} onChange={(e) => setRegNo(e.target.value)}
                    className="mt-1 block w-full rounded-md border px-3 py-2 text-gray-900" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900">Roll No</label>
                  <input type="text" required value={rollNo} onChange={(e) => setRollNo(e.target.value)}
                    className="mt-1 block w-full rounded-md border px-3 py-2 text-gray-900" />
                </div>
              </>
            )}

            {role === "Professor" && (
              <div>
                <label className="block text-sm font-medium text-gray-900">Professor ID</label>
                <input type="text" required value={profId} onChange={(e) => setProfId(e.target.value)}
                  className="mt-1 block w-full rounded-md border px-3 py-2 text-gray-900" />
              </div>
            )}

            {role === "Assistant" && (
              <div>
                <label className="block text-sm font-medium text-gray-900">Assistant ID</label>
                <input type="text" required value={asstId} onChange={(e) => setAsstId(e.target.value)}
                  className="mt-1 block w-full rounded-md border px-3 py-2 text-gray-900" />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-900">Role</label>
              <input type="text" disabled value={role}
                className="mt-1 block w-full rounded-md bg-gray-100 px-3 py-2 text-gray-600 font-medium cursor-not-allowed" />
            </div>

            <div>
              <button
                type="submit"
                className="w-full rounded-md bg-indigo-600 px-3 py-2 text-white font-semibold hover:bg-indigo-500"
              >
                {loading ? 'Registering...' : 'Register'}
              </button>
            </div>
          </form>

          <div className="mt-2 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <span
              onClick={() => navigate('/login')}
              className="cursor-pointer font-semibold text-indigo-600 hover:text-indigo-500"
            >
              Login
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
