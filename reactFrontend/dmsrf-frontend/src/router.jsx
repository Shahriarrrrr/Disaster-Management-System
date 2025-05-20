// src/router.jsx
import { createBrowserRouter } from "react-router-dom";
import Root from "./components/Root/Root";
import Home from "./components/Home/Home";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import NotFound from "./components/NotFound/NotFound";
import Profile from "./components/Profile/Profile";

const router = createBrowserRouter([
  // Public routes (no layout)
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },

  // Protected layout with navbar/footer
  {
    path: "/",
    element: <Root />,
    children: [
      {
        index: true, // same as path: "/"
        element: (
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        ),
      },
      {
        path : '/profile',
                element: (
          <ProtectedRoute>
            <Profile></Profile>
          </ProtectedRoute>
        ),
      },
    ],
  },

  // Catch-all for 404
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;
