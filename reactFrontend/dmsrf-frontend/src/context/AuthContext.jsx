import { createContext, useState, useEffect } from "react";
import api from "../api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // true while fetching user
  const [token, setToken] = useState(localStorage.getItem("access"));
  
  // NEW state for volunteer join request status
  const [volunteerStatus, setVolunteerStatus] = useState(null);

  // Fetch user data
  const fetchUser = async () => {
    try {
      const res = await api.get("account/api/users/");
      setUser(res.data);
      console.log("User data:", res.data);
    } catch (err) {
      console.error("Failed to fetch user", err);
      setUser(null);
    }
  };

  // NEW: Fetch volunteer join request status
  const fetchVolunteerStatus = async () => {
    try {
      const res = await api.get("volunteer/api/join-requests/");
      if (res.data.length > 0) {
        setVolunteerStatus(res.data[0].status); // e.g. 'accepted', 'pending', etc.
      } else {
        setVolunteerStatus(null);
      }
    } catch (err) {
      console.error("Failed to fetch volunteer status", err);
      setVolunteerStatus(null);
    }
  };

  useEffect(() => {
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setLoading(true);
      fetchUser();
      fetchVolunteerStatus();  // <-- fetch volunteer status after user fetch started
      setLoading(false);
    } else {
      setUser(null);
      setVolunteerStatus(null);
      setLoading(false);
    }
  }, [token]);

  const updateToken = (newToken) => {
    if (newToken) {
      localStorage.setItem("access", newToken);
    } else {
      localStorage.removeItem("access");
    }
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setUser(null);
    setVolunteerStatus(null); // clear status on logout
    setToken(null);
    setLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        logout,
        updateToken,
        volunteerStatus, // <-- expose volunteer status here
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
