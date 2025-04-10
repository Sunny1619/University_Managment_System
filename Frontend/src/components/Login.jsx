import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast';
import axios from 'axios'

const Login = () => {
  const Location = useLocation();
  const role = Location.state?.role || "Student";
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post("http://localhost:5000/api/login", {
        email,
        password,
      });
      console.log(response);
      localStorage.setItem("University_user_token", response.data.token);
      toast.success("Login successful");
      setEmail('');
      setPassword('');
      setLoading(false);
      navigate(`/${role}/dashboard`, { state: { user: response.config.data } });
    } catch (error) {
      console.error('Error during login:', error);
      toast.error(error?.response?.data?.message || "Login failed. Please try again.");
      setLoading(false);
    }
  }
  useEffect(() => {
    if (!Location.state?.role) {
      navigate("/", { replace: true }); // redirect home instead of infinite loop
    }
  }, []);
  return (
    <div className='flex items-center justify-center h-screen'>
      <div className="flex mt-10 sm:mt-18 lg:mt-24 flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm flex flex-col items-center justify-center gap-4">
          <img
            alt="IIIT KALYANI"
            src="/IIITK_img.png"
            className="mx-auto w-[20vw] sm:w-[15vw] md:w-[12vw] lg:w-[10vw] xl:w-[8vw]"
          />
          <h2 className="text-center text-2xl/9 font-bold tracking-tight text-gray-900">
            Log in to your account
          </h2>
        </div>

        <div className="mt-2 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
                Email
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">
                  Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>

            <div>
              <label htmlFor="role" className="block text-sm/6 font-medium text-gray-900">
                Role
              </label>
              <div className="mt-1">
                <input
                  id="role"
                  name="role"
                  type="text"
                  disabled
                  value={role}
                  className="block w-full rounded-md bg-zinc-100 px-3 py-1.5 text-base font-semibold text-gray-600 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 sm:text-sm/6 cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                {loading ? "..." : "Log in"}
              </button>
            </div>
          </form>

          <div className="mt-2 text-center text-sm/6 text-gray-500 flex items-center justify-center gap-2">
            <p>New User?</p>
            <div
              onClick={() => navigate('/register', { state: { role } })}
              className="cursor-pointer font-semibold text-indigo-600 hover:text-indigo-500"
            >
              Register
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login;
