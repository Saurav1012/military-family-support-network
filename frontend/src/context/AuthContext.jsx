import { createContext, useState } from "react";
import socket from "../services/socket";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUserState] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  const [token, setToken] = useState(
    localStorage.getItem("token") || null
  );

  const setUser = (userData) => {
    setUserState(userData);
    if (userData) {
      localStorage.setItem("user", JSON.stringify(userData));
    } else {
      localStorage.removeItem("user");
    }
  };

  const login = (userData, tokenData) => {
    setUser(userData);
    setToken(tokenData);
    localStorage.setItem("token", tokenData);

    if (userData) {
      if (!socket.connected) {
        socket.connect();
      }
      const userId = userData._id || userData.id;
      socket.emit("join", userId);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.clear();
    socket.disconnect();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};