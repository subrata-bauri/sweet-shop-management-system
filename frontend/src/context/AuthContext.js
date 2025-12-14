import { createContext, useState } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

const getUserFromToken = (token) => {
  if (!token) return null;
  try {
    return jwtDecode(token);
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const storedToken = localStorage.getItem("token");
  const [token, setToken] = useState(storedToken);
  const [user, setUser] = useState(getUserFromToken(storedToken));

  const login = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    setUser(getUserFromToken(newToken));
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
