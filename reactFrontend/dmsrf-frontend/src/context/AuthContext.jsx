import { createContext, useState, useEffect } from "react";
import api from "../api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // true while fetching user
  const [token, setToken] = useState(localStorage.getItem("access"));

  const fetchUser = async () => {
    try {
      const res = await api.get("account/api/users/");
      setUser(res.data);
      console.log("User data:", res.data); 
    } catch (err) {
      console.error("Failed to fetch user", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      // Set token in axios headers globally
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      fetchUser();
    } else {
      setUser(null);
      setLoading(false);
    }
  }, [token]);

  // ✅ Function to update token and trigger user fetch
  const updateToken = (newToken) => {
    if (newToken) {
      localStorage.setItem("access", newToken);
    } else {
      localStorage.removeItem("access");
    }
    setToken(newToken); // triggers useEffect
  };

  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setUser(null);
    setToken(null);
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, logout, updateToken }}>
      {children}
    </AuthContext.Provider>
  );
};
