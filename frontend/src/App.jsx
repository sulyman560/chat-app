import React from 'react'
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import { Navigate, Route, Router, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Chat from "./pages/Chat";
import { AuthContext } from "./context/AuthContext";
import Loading from './components/Loading'

function App() {
  const [count, setCount] = useState(0)

  const { user, logout } = React.useContext(AuthContext);


  return (
    <>
        <div className='flex flex-col items-center justify-center md:w-full h-screen relative overflow-hidden'>

          <Routes>
            <Route path="/" element={!user ? <Login /> : <Navigate to="/chat" />} />
            <Route path="/chat" element={user ? <Chat /> : <Navigate to="/" />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>

        </div>
        {/* Soft Backdrop*/}
        <div className='fixed bg-black inset-0 -z-1 pointer-events-none'>
          <div className='absolute left-1/2 top-20 -translate-x-1/2 w-245 h-115 bg-linear-to-tr from-indigo-800/35 to-transparent rounded-full blur-3xl' />
          <div className='absolute right-12 bottom-10 w-105 h-55 bg-linear-to-bl from-indigo-700/35 to-transparent rounded-full blur-2xl' />
        </div>
      
    </>
  )
}

export default App
