import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { socket } from "../socket";
import ChatSidebar from "../components/ChatSidebar";
import ChatWindow from "../components/ChatWindow";
import { Menu, X } from 'lucide-react'; 

const Chat = () => {
  const { user, API } = useContext(AuthContext);

  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [activeUser, setActiveUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [userStatus, setUserStatus] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API}/api/users`);
        setUsers(res.data.filter(u => u._id !== user._id));
      } catch (err) { console.log(err); }
      setLoading(false);
    };
    if (user) fetchUsers();
  }, [user]);

  // add user to socket
  useEffect(() => { if (user) socket.emit("addUser", user._id); }, [user]);

  // receive message
  useEffect(() => {
    const handleMessage = (data) => {
      if (data.senderId === user._id) return;
      if (activeUser && data.senderId === activeUser._id) setMessages(prev => [...prev, data]);
    };
    socket.on("getMessage", handleMessage);
    return () => socket.off("getMessage", handleMessage);
  }, [activeUser, user]);

  // fetch messages when user selected
  const selectUser = async (u) => {
    setActiveUser(u);
    try {
      const res = await axios.get(`${API}/api/messages/${user._id}/${u._id}`);
      setMessages(res.data);
    } catch (err) { console.log(err); }
  };

  // send message
  const sendMessage = async () => {
    if (!input.trim() || !activeUser) return;
    const msg = { senderId: user._id, receiverId: activeUser._id, text: input };
    try {
      const res = await axios.post(`${API}/api/messages`, msg);
      setMessages(prev => [...prev, res.data]);
      socket.emit("sendMessage", res.data);
      setInput("");
    } catch (err) { console.log(err); }
  };

  // user status listener
  useEffect(() => {
  const handleStatus = (users) => {
    const statusObj = {};
    users.forEach(u => {
      statusObj[u._id] = {
        online: u.online,
        lastSeen: u.lastSeen
      };
    });
    setUserStatus(statusObj);
  };

  socket.on("allUsersStatus", handleStatus);
  return () => socket.off("allUsersStatus", handleStatus);
}, []);

  useEffect(() => {
  if (!user) return;

  socket.connect(); // 🔹 ensure socket connected

  socket.emit("addUser", user._id); // 🔹 tell server user is online

  socket.on("connect", () => {
    console.log("SOCKET RECONNECTED");
    socket.emit("addUser", user._id); // 🔹 reconnect after reload
  });

  return () => socket.off("connect");
}, [user]);

  return (
    <div className="w-full flex h-screen backdrop-blur-sm border border-gray-800 rounded-2xl">
      <ChatSidebar
        loading={loading} setLoading={setLoading}
        sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}
        users={users} selectUser={selectUser} activeUser={activeUser}
        userStatus={userStatus}
      />

      {sidebarOpen ?
        <X onClick={() => setSidebarOpen(false)} className='cursor-pointer absolute top-3 right-3 p-2 z-100 bg-white rounded-md shadow w-10 h-10 text-gray-600 sm:hidden' />
        : <Menu onClick={() => setSidebarOpen(true)} className=' absolute top-3 right-3 p-2 z-100 bg-white rounded-md shadow w-10 h-10 text-gray-600 sm:hidden' />
      }

      <ChatWindow
        sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}
        messages={messages} user={user} activeUser={activeUser}
        sendMessage={sendMessage} input={input} setInput={setInput}
      />
    </div>
  );
};

export default Chat;