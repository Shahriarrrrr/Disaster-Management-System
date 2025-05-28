"use client"

import { useEffect, useContext } from "react"
import { Link } from "react-router"
import { AuthContext } from "../../context/AuthContext"

const Navbar = () => {
  const { volunteerStatus } = useContext(AuthContext);

  useEffect(() => {
    const menu = document.querySelector(".menu")
    const sidebar = document.querySelector(".sidebar")
    const Menulist = document.querySelectorAll(".Menulist li")

    menu.onclick = () => {
      menu.classList.toggle("active")
      sidebar.classList.toggle("active")
    }

    Menulist.forEach((item) =>
      item.addEventListener("click", function () {
        Menulist.forEach((item) => item.classList.remove("active"))
        this.classList.add("active")
      }),
    )
  }, [])

  function logout() {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    window.location.href = '/login'; // or '/' or any route you prefer
  }

  const isAccepted = volunteerStatus === "accepted";

  return (
    <div className="navbar bg-gradient-to-r from-gray-700 via-gray-900 to-black text-white shadow-md transition-all duration-300">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost hover:bg-white/10 lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content rounded-box z-10 mt-3 w-52 p-2 shadow-lg bg-purple-500 border border-white/10 text-white"
          >
            <li><a className="hover:bg-white/10 rounded-md transition-colors duration-200">Home</a></li>
            <li>
              <a className="hover:bg-white/10 rounded-md transition-colors duration-200">Parent</a>
              <ul className="p-2 bg-purple-600/80 rounded-md mt-1">
                <li><a className="hover:bg-white/10 rounded-md transition-colors duration-200">Submenu 1</a></li>
                <li><a className="hover:bg-white/10 rounded-md transition-colors duration-200">Submenu 2</a></li>
              </ul>
            </li>
            <li><a className="hover:bg-white/10 rounded-md transition-colors duration-200">Item 3</a></li>
          </ul>
        </div>
        <a className="btn btn-ghost text-xl font-bold tracking-wide hover:bg-white/10">
          <span className="bg-white/20 text-white px-2 py-1 rounded mr-2">D</span>
          MSRF
        </a>
      </div>

      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li><Link to='/' className="hover:bg-white/10 rounded-md mx-1 transition-colors duration-200">Home</Link></li>
          <li><Link to='/cause' className="hover:bg-white/10 rounded-md mx-1 transition-colors duration-200">Campaigns</Link></li>
          <li><Link to='/leaderboard' className="hover:bg-white/10 rounded-md mx-1 transition-colors duration-200">Leader Boards</Link></li>
          <li><Link to='/heatmap' className="hover:bg-white/10 rounded-md mx-1 transition-colors duration-200">Heat Map</Link></li>
          <li><Link to='/profile' className="hover:bg-white/10 rounded-md mx-1 transition-colors duration-200">Profile</Link></li>

          {/* Volunteer Dashboard: enabled only if accepted */}
          <li>
            {isAccepted ? (
              <Link
                to="/volunteer"
                className="hover:bg-green-600 rounded-md mx-1 px-3 py-1 bg-green-600 text-white transition-colors duration-200"
              >
                Volunteer Dashboard
              </Link>
            ) : (
              <span
                className="rounded-md mx-1 px-3 py-1 bg-gray-400 text-gray-700 cursor-not-allowed select-none"
                title="Volunteer request not accepted yet"
              >
                Volunteer Dashboard
              </span>
            )}
          </li>
        </ul>
      </div>

      <div className="navbar-end">
        <button className="btn btn-soft btn-error" onClick={logout}>
          <svg height="20" viewBox="0 0 48 48" width="48" xmlns="http://www.w3.org/2000/svg">
            <path d="m33.749 7.759-.93 1.55a1 1 0 0 0 .314 1.339 16.2 16.2 0 1 1 -18.258 0 1 1 0 0 0 .313-1.338l-.926-1.546a1.012 1.012 0 0 0 -1.418-.334 20 20 0 1 0 22.315 0 1 1 0 0 0 -1.41.329z" />
            <rect height="20" rx="1" width="4" x="22" y="2" />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default Navbar
