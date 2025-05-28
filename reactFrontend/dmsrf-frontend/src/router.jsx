// src/router.jsx
import { createBrowserRouter } from "react-router-dom";
import React from "react";

// Lazy load components
const Root = React.lazy(() => import("./components/Root/Root"));
const Home = React.lazy(() => import("./components/Home/Home"));
const Login = React.lazy(() => import("./components/Login/Login"));
const Register = React.lazy(() => import("./components/Register/Register"));
const ProtectedRoute = React.lazy(() => import("./components/ProtectedRoute/ProtectedRoute"));
const NotFound = React.lazy(() => import("./components/NotFound/NotFound"));
const Profile = React.lazy(() => import("./components/Profile/Profile"));

import { homeLoader } from "./Loaders/homeLoader";
import Donations from "./components/Donations/Donations";
import { donationLoader } from "./Loaders/DonationsLoader";
import News from "./components/News/News";
import DonationPage from "./components/Donate/Donate";
import DonateSuccess from "./components/DonateSuccess/DonateSuccess";
import Cause from "./components/Cause/Cause";
import { CauseLoader } from "./Loaders/CauseLoader";
import Leaderboard from "./components/LeaderBoard/LeaderBoard";
import { LeaderboarddonationLoader } from "./Loaders/LeaderBoardLoader";
import DisasterMapPage from "./components/DisasterMap/DisasterMap";
import { heatmapLoader } from "./Loaders/Heatmap";
import VolunteerDashboard from "./components/VolunteerDashboard/VolunteerDashboard";


const router = createBrowserRouter([
    {
    path: "/",
    element: <Root />,
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        ),
        loader: homeLoader,
      },
      {
        path: "/profile",
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
        loader:donationLoader,
      },
      {
        path: '/donations',
        element : (
          <ProtectedRoute>
            <Donations></Donations>
          </ProtectedRoute>
        ),
        loader:donationLoader,
      },
      {
        path: '/news',
        element : (
          <ProtectedRoute>
            <News></News>
          </ProtectedRoute>
        ),
      },
      {
        path: '/donatePage',
        element : (
          <ProtectedRoute>
            <DonationPage></DonationPage>
          </ProtectedRoute>
        ),
      },
      {
        path: '/donateSuccess',
        element : (
          <ProtectedRoute>
            <DonateSuccess></DonateSuccess>
          </ProtectedRoute>
        ),
      },
      {
        path: '/cause',
        element : (
          <ProtectedRoute>
            <Cause></Cause>
          </ProtectedRoute>
        ),
        loader : CauseLoader,
      },
      {
        path: '/leaderboard',
        element : (
          <ProtectedRoute>
            <Leaderboard></Leaderboard>
          </ProtectedRoute>
        ),
        loader : LeaderboarddonationLoader,
      },
      {
        path: '/heatmap',
        element : (
          <ProtectedRoute>
            <DisasterMapPage></DisasterMapPage>
          </ProtectedRoute>
        ),
        loader: heatmapLoader,
      },
      {
        path: '/volunteer',
        element : (
          <ProtectedRoute>
            <VolunteerDashboard></VolunteerDashboard>
          </ProtectedRoute>
        ),

      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },

  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;
