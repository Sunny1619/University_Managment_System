import React, { useEffect, useState } from 'react';
import Modal from '../assets/Modal';
import { LocalStorageManage } from '../assets/LocalStorageManage';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [auth, setAuth] = useState("Register");
  const navigate = useNavigate();
  let token;

  const toggleOpen = (ing) => {
    setAuth(ing);
    setIsOpen(!isOpen);
  };
  
  const handleLogout = async () => {
    const token = LocalStorageManage();  // ✅ Get token inside the function
    if (!token) {
      toast.error("No token found. Already logged out?");
      return;
    }
  
    try {
      const response = await axios.post(
        "http://localhost:5000/api/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (response.status === 200) {
        localStorage.removeItem("University_user_token");
        setAuthenticated(false);
        toast.success("Logout Successful");
        navigate('/');
      }
    } catch (error) {
      console.error('Error during Logout:', error);
      toast.error('Logout failed. Please try again.');
    }
  };
  
  
let tokenised; // ✅ Get token inside the function
  useEffect(() => {
    tokenised = LocalStorageManage(); // ✅ Get token inside the function
    setAuthenticated(!!tokenised);
  }, [tokenised]);

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-7xl">
      {/* Institution Header */}
      <div className="flex items-center justify-between mb-8 border-b pb-4">
        <div className="flex items-center gap-4">
          <img
            src="https://upload.wikimedia.org/wikipedia/en/d/d3/Indian_Institute_of_Information_Technology%2C_Kalyani_logo.png"
            alt="IIIT Kalyani Logo"
            className="h-12 w-auto"
          />
          <div className="border-l-2 border-gray-300 pl-4">
            <h1 className="text-xl font-bold text-gray-800">
              INDIAN INSTITUTE OF INFORMATION TECHNOLOGY
            </h1>
            <p className="text-blue-600 font-semibold">KALYANI</p>
          </div>
        </div>

        {/* User Section */}
        {!authenticated ? (
          <div className="flex items-center gap-4">
            <button
              onClick={() => toggleOpen("Register")}
              className="hidden sm:block text-gray-700 font-semibold hover:text-blue-600 transition-colors"
            >
              REGISTER
            </button>
            <button
              onClick={() => toggleOpen("Login")}
              className="text-gray-700 font-semibold hover:text-blue-600 transition-colors"
            >
              LOGIN
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <button
              onClick={handleLogout}
              className="text-gray-700 font-semibold hover:text-blue-600 transition-colors"
            >
              Logout
            </button>
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png"
              alt="User Profile"
              className="h-8 w-8 rounded-full"
            />
          </div>
        )}
      </div>

      {isOpen && <Modal setIsOpen={setIsOpen} auth={auth} />}
    </div>
  );
};

export default Navbar;
