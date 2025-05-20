import React, { useContext } from 'react';
import { AuthContext } from "../../context/AuthContext";

const Home = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <p>Loading user info...</p>;
  if (!user || user.length === 0) return <p>No user data</p>;

  const currentUser = user[0]; // assuming user is an array

  return (
    <div>
      <h1>Home</h1>
      <h1>Length: {user.length}</h1>
      <h2>Welcome, {currentUser.user_name}</h2>
    </div>
  );
};

export default Home;
