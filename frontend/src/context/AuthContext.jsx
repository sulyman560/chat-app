import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("chatUser");
    if(storedUser){
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const API = "https://chat-app-server-rsgf.onrender.com"; // backend URL --- IGNORE ---
  const login = (userData) => {
    localStorage.setItem("chatUser", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("chatUser");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, API }}>
      {children}
    </AuthContext.Provider>
  );
};