import { createContext, useState } from "react";
import socket from "../services/socket";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  const [token, setToken] = useState(
    localStorage.getItem("token") || null
  );

  // Login function with socket connection & join event
  const login = (userData, tokenData) => {
    setUser(userData);
    setToken(tokenData);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", tokenData);

    // Socket Connection & Join Event Trigger
    if (userData) {
      if (!socket.connected) {
        socket.connect();
      }
      const userId = userData._id || userData.id;
      socket.emit("join", userId);
    }
  };

  // Logout function with socket disconnect
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.clear();

    // Disconnect active socket session
    socket.disconnect();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};