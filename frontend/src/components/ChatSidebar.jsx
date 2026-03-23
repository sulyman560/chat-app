import { socket } from "../socket";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { assets } from "../assets/assets";
import Loading from "./Loading";
import { useNavigate } from "react-router-dom";

const ChatSidebar = ({ loading, sidebarOpen, setSidebarOpen, users, selectUser, activeUser, userStatus }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div className={`bg-white w-70 xl:w-80 p-4 border-r border-gray-200 flex flex-col justify-between items-center 
      max-sm:absolute top-0 bottom-0 z-20 ${sidebarOpen ? 'translate-x-0' : 'max-sm:-translate-x-full'} 
      transition-all duration-300 ease-in-out`}>

      <div className="w-full flex flex-col ">
        <div>
          <h1 className='text-2xl font-bold text-indigo-500 text-center mb-2'>Realtime Chat your friends</h1>
        </div>

        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          All Users <span className="text-sm text-gray-500">( {users.length} )</span>
        </h2>
        <p className="text-sm text-gray-500 mb-2">Select a user to start chatting</p>

        {users.map(u => {
          const status = userStatus[u._id];
          const isOnline = status?.online;
          const lastSeenMinutes = status?.lastSeen ? Math.floor((new Date() - new Date(status.lastSeen)) / 60000) : null;

          return (
            <div
              key={u._id}
              onClick={() => selectUser(u)}
              className={`flex gap-2 items-center border border-gray-500 m-1 p-2 rounded-lg cursor-pointer ${activeUser?._id === u._id ? "bg-gray-300 border-l-4 border-l-green-500" : "hover:bg-gray-300"}`}
            >
              <img src={assets.profile_icon} className="w-8 h-8" alt="Profile" />
              <span>
                {u.username}
                {isOnline ? (
                  <span className="text-xs text-green-600 ml-1">Active now</span>
                ) : (
                  <span className="text-xs text-gray-600 ml-1">Offline</span>
                )}
              </span>
              <span>
                {isOnline ? (
                  <span className="w-2 h-2 bg-green-600 border border-green-700 rounded-full inline-block"></span>
                ) : lastSeenMinutes !== null ? (
                  <small className="text-red-500 text-xs">{lastSeenMinutes} min ago</small>
                ) : null}
              </span>
            </div>
          );
        })}

        <div className='absolute bottom-6 left-2 gap-5 flex justify-between items-center text-sm text-gray-600'>
          <div className='flex items-center gap-2 text-md font-semibold text-gray-500 border px-2 py-2 rounded-lg'>
            <img src={assets.profile_icon} className="w-6 h-6" alt="Profile" />
            <span className='text-blue-500'>{user.username}!</span>
          </div>
          <button onClick={() => {
            socket.disconnect();
            logout();
            navigate(`/login`);
          }} className="cursor-pointer text-md text-white rounded-md bg-red-600 hover:bg-red-700 transition px-4 py-2">
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatSidebar;