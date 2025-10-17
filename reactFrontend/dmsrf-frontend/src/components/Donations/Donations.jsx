"use client"

import { useLoaderData } from "react-router"
import { useContext, useState } from "react"
import { AuthContext } from "../../context/AuthContext"
import { TrendingUp, Award, DollarSign, Users, Calendar, Filter, Download, Search } from "lucide-react"
import DonationList from "../DonationList/DonationList";


const Donations = () => {
  const { user, loading } = useContext(AuthContext)
  const { user_awards, user_total_donate } = user[0]
  const data = useLoaderData()
  const { donations } = data
  const [searchTerm, setSearchTerm] = useState("")

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  const stats = [
    {
      title: "Total Donations",
      value: `${user_total_donate?.toLocaleString() || "0"} / -`,
      icon: DollarSign,
      gradient: "from-green-500 to-emerald-600",
      bgGradient: "from-green-500/10 to-emerald-600/10",
      change: "+12.5%",
      changeType: "positive",
    },
    {
      title: "Number of Donations",
      value: donations?.length || 0,
      icon: TrendingUp,
      gradient: "from-blue-500 to-cyan-600",
      bgGradient: "from-blue-500/10 to-cyan-600/10",
      change: "+8.2%",
      changeType: "positive",
    },
    {
      title: "Awards Earned",
      value: user_awards || 0,
      icon: Award,
      gradient: "from-purple-500 to-pink-600",
      bgGradient: "from-purple-500/10 to-pink-600/10",
      change: "+3",
      changeType: "positive",
    },
    {
      title: "Impact Score",
      value: Math.floor((user_total_donate || 0) / 100),
      icon: Users,
      gradient: "from-orange-500 to-red-600",
      bgGradient: "from-orange-500/10 to-red-600/10",
      change: "+15.3%",
      changeType: "positive",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-3xl"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent mb-4">
              Donation Dashboard
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Track your impact and manage your contributions with our comprehensive donation analytics
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <div
                  key={index}
                  className={`relative group bg-gradient-to-br ${stat.bgGradient} backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/25`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`p-3 rounded-xl bg-gradient-to-r ${stat.gradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}
                    >
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div
                      className={`text-sm font-medium px-2 py-1 rounded-full ${
                        stat.changeType === "positive" ? "text-green-400 bg-green-400/10" : "text-red-400 bg-red-400/10"
                      }`}
                    >
                      {stat.change}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-2xl md:text-3xl font-bold text-white">{stat.value}</p>
                    <p className="text-gray-400 text-sm">{stat.title}</p>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              )
            })}
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-4 justify-center mb-8">
            <button className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-purple-500/25">
              <Download className="h-5 w-5" />
              <span>Export Report</span>
            </button>
            <button className="flex items-center space-x-2 px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-xl font-medium hover:bg-white/20 transition-all duration-300 hover:scale-105">
              <Calendar className="h-5 w-5" />
              <span>Schedule Donation</span>
            </button>
            <button className="flex items-center space-x-2 px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-xl font-medium hover:bg-white/20 transition-all duration-300 hover:scale-105">
              <Filter className="h-5 w-5" />
              <span>Advanced Filters</span>
            </button>
          </div>
        </div>
      </div>

      {/* Donations Table Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <h2 className="text-2xl font-bold text-white mb-4 md:mb-0">Recent Donations</h2>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search donations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                />
              </div>
            </div>
          </div>
          <DonationList donation={donations} user={user} searchTerm={searchTerm} />
        </div>
      </div>
    </div>
  )
}

export default Donations
