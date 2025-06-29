"use client"

import { useEffect, useContext, useState } from "react"
import { Link , useNavigate} from "react-router"
import { AuthContext } from "../../context/AuthContext"
import { Menu, X, Home, Target, Trophy, Map, User, Shield, LogOut, Bell, Search, Bot, Newspaper} from "lucide-react"

const Navbar = () => {
  
  const { volunteerStatus } = useContext(AuthContext)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeItem, setActiveItem] = useState("/")
  const [showNotifications, setShowNotifications] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  function logout() {
    localStorage.removeItem("access")
    localStorage.removeItem("refresh")
    window.location.href = "/login"
  }

    



  const isAccepted = volunteerStatus === "accepted"

  const navItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/cause", label: "Campaigns", icon: Target },
    { path: "/leaderboard", label: "Leaderboard", icon: Trophy },
    { path: "/heatmap", label: "Heat Map", icon: Map },
    { path: "/profile", label: "Profile", icon: User },

  ]

  return (
    <>
      {/* Main Navbar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ease-out ${
          isScrolled
            ? "bg-white/10 backdrop-blur-2xl border-b border-white/20 shadow-2xl shadow-black/10"
            : "bg-transparent backdrop-blur-sm"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo Section */}
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center group cursor-pointer">
                <div className="relative">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl flex items-center justify-center transform group-hover:scale-110 transition-all duration-300 shadow-lg group-hover:shadow-white/20">
                    <span className="text-white font-bold text-lg drop-shadow-lg">D</span>
                  </div>
                  <div className="absolute -inset-1 bg-white/10 rounded-2xl blur opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                </div>
                <span className="ml-3 text-xl font-bold text-white drop-shadow-lg">MSRF</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setActiveItem(item.path)}
                    className={`relative px-4 py-2 rounded-2xl transition-all duration-300 flex items-center space-x-2 group ${
                      activeItem === item.path
                        ? "bg-white/20 text-white shadow-lg backdrop-blur-sm border border-white/30"
                        : "text-white/80 hover:text-white hover:bg-white/10 backdrop-blur-sm"
                    }`}
                  >
                    <Icon
                      size={16}
                      className="transition-transform duration-300 group-hover:scale-110 drop-shadow-sm"
                    />
                    <span className="font-medium drop-shadow-sm">{item.label}</span>
                    {activeItem === item.path && (
                      <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full shadow-lg"></div>
                    )}
                  </Link>
                )
              })}

              {/* Volunteer Dashboard */}
              <div className="ml-4">
                {isAccepted ? (
                  <Link
                    to="/volunteer"
                    className="relative px-6 py-2 bg-green-500/80 backdrop-blur-sm border border-green-400/50 text-white rounded-2xl font-medium transition-all duration-300 hover:bg-green-500/90 hover:scale-105 shadow-lg hover:shadow-green-500/30 flex items-center space-x-2"
                  >
                    <Shield size={16} className="drop-shadow-sm" />
                    <span className="drop-shadow-sm">Volunteer Dashboard</span>
                  </Link>
                ) : (
                  <div className="relative group">
                    <span className="px-6 py-2 bg-gray-500/30 backdrop-blur-sm border border-gray-400/30 text-gray-300 rounded-2xl font-medium cursor-not-allowed flex items-center space-x-2">
                      <Shield size={16} />
                      <span>Volunteer Dashboard</span>
                    </span>
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-black/90 backdrop-blur-sm text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap border border-white/10">
                      Volunteer request pending approval
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-2">
              {/* NewsPapper Button */}
              <Link
                to="/news"
                className="p-2 text-white/80 hover:text-red-300 hover:bg-red-500/20 rounded-xl transition-all duration-300 group backdrop-blur-sm"
              >
                <Newspaper size={20} className="group-hover:scale-110 transition-transform duration-300 drop-shadow-sm" />
              </Link>

              {/* Notifications */}


              {/* Logout Button */}
              <Link
                to="/rescuebot"
                className="p-2 text-white/80 hover:text-red-300 hover:bg-red-500/20 rounded-xl transition-all duration-300 group backdrop-blur-sm"
              >
                <Bot size={20} className="group-hover:scale-110 transition-transform duration-300 drop-shadow-sm" />
              </Link>
               {/* Logout Button */}
              <button
                onClick={logout}
                className="p-2 text-white/80 hover:text-red-300 hover:bg-red-500/20 rounded-xl transition-all duration-300 group backdrop-blur-sm"
              >
                <LogOut size={20} className="group-hover:scale-110 transition-transform duration-300 drop-shadow-sm" />
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-300 backdrop-blur-sm"
              >
                {isMenuOpen ? (
                  <X size={24} className="drop-shadow-sm" />
                ) : (
                  <Menu size={24} className="drop-shadow-sm" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden transition-all duration-500 overflow-hidden ${
            isMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="bg-black/90 backdrop-blur-2xl border-t border-white/20">
            <div className="px-4 py-6 space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => {
                      setActiveItem(item.path)
                      setIsMenuOpen(false)
                    }}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 backdrop-blur-sm ${
                      activeItem === item.path
                        ? "bg-white/20 text-white border border-white/30 shadow-lg"
                        : "text-white/80 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <Icon size={20} className="drop-shadow-sm" />
                    <span className="font-medium drop-shadow-sm">{item.label}</span>
                  </Link>
                )
              })}

              {/* Mobile Volunteer Dashboard */}
              <div className="pt-4 border-t border-white/20">
                {isAccepted ? (
                  <Link
                    to="/volunteer"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center space-x-3 px-4 py-3 bg-green-500/80 backdrop-blur-sm border border-green-400/50 text-white rounded-xl font-medium shadow-lg"
                  >
                    <Shield size={20} className="drop-shadow-sm" />
                    <span className="drop-shadow-sm">Volunteer Dashboard</span>
                  </Link>
                ) : (
                  <div className="flex items-center space-x-3 px-4 py-3 bg-gray-500/30 backdrop-blur-sm border border-gray-400/30 text-gray-300 rounded-xl">
                    <Shield size={20} />
                    <span>Volunteer Dashboard (Pending)</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Spacer to prevent content from hiding behind fixed navbar */}
      <div className="h-16"></div>

      {/* Background overlay when mobile menu is open */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </>
  )
}

export default Navbar
