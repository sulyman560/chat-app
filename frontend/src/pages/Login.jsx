import { socket } from "../socket"; // path ঠিক করে নিও
import React from 'react'
import axios from 'axios'
import { AuthContext } from '../context/AuthContext'
import { useContext } from 'react';
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import Loading from '../components/Loading';

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { user, login, API } = useContext(AuthContext);
  const navigate = useNavigate();

  const [state, setState] = React.useState("login")
  const [isLogin, setIsLogin] = useState(true);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  // input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let res;

      if (isLogin) {
        // 🔹 LOGIN
        res = await axios.post(
          `${API}/api/users/login`,
          {
            email: formData.email,
            password: formData.password,
          }
        );
      } else {
        // 🔹 REGISTER
        res = await axios.post(
          `${API}/api/users/register`,
          formData
        );
      }

      // success
      login(res.data.user);

      // 🔥 SOCKET CONNECT + ONLINE
      socket.connect();
      socket.emit("addUser", res.data.user._id);

      navigate("/chat");


    } catch (err) {
      console.log(err.response?.data);
      alert(err.response?.data?.error || "Something went wrong");
    }
  };


  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="sm:w-87.5 z-20 w-full text-center backdrop-blur-sm border border-gray-800 rounded-2xl px-8">
        <h1 className='text-2xl font-semibold text-indigo-500 text-center mt-10 mb-2'>Realtime Chat your friends</h1>
        <h1 className="text-white text-3xl font-medium">
          {isLogin ? "Login" : "Sign up"}
        </h1>

        <p className="text-gray-400 text-sm mt-2">Please sign in to continue</p>

        {!isLogin && (
          <div className="flex items-center mt-6 w-full bg-white/5 ring-2 ring-white/10 focus-within:ring-indigo-500/60 h-12 rounded-full overflow-hidden pl-6 gap-2 transition-all ">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-white/60" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"> <circle cx="12" cy="8" r="5" /> <path d="M20 21a8 8 0 0 0-16 0" /> </svg>
            <input type="text" name="username" placeholder="Username" value={formData.username}
              onChange={handleChange}
              className="w-full bg-transparent text-white placeholder-white/60 border-none outline-none " required />
          </div>
        )}

        <div className="flex items-center w-full mt-4 bg-white/5 ring-2 ring-white/10 focus-within:ring-indigo-500/60 h-12 rounded-full overflow-hidden pl-6 gap-2 transition-all ">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-white/75" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"> <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" /> <rect x="2" y="4" width="20" height="16" rx="2" /> </svg>
          <input type="email" name="email" placeholder="Email id" value={formData.email}
            onChange={handleChange}
            className="w-full bg-transparent text-white placeholder-white/60 border-none outline-none" required />
        </div>

        <div className=" flex items-center mt-4 w-full bg-white/5 ring-2 ring-white/10 focus-within:ring-indigo-500/60 h-12 rounded-full overflow-hidden pl-6 gap-2 transition-all ">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-white/75" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"> <rect width="18" height="11" x="3" y="11" rx="2" ry="2" /> <path d="M7 11V7a5 5 0 0 1 10 0v4" /> </svg>
          <input type="password" name="password" placeholder="Password" value={formData.password}
            onChange={handleChange}
            className="w-full bg-transparent text-white placeholder-white/60 border-none outline-none" required />
        </div>

        <div className="mt-4 text-left">
          <button className="text-sm text-indigo-400 hover:underline">
            Forget password?
          </button>
        </div>

        <button type="submit" className="cursor-pointer mt-2 w-full h-11 rounded-full text-white bg-indigo-600 hover:bg-indigo-700 transition " >
          {isLogin ? "Login" : "Sign up"}
        </button>

        <p onClick={() => setIsLogin(prev => !prev)} className="text-gray-400 text-sm mt-3 mb-11 cursor-pointer" >
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <span className="text-indigo-400 hover:underline ml-1">click here</span>
        </p>
      </form>


    </>
  )
}

export default Login
