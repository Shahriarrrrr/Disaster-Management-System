"use client"

import { useState, useEffect, useRef } from "react"
import { MapPin, Calendar, Clock, Award, BookOpen, Target, Filter, Search, Send, User, X, Globe } from "lucide-react"
import { AuthContext } from "../../context/AuthContext"
import { useContext } from "react"
import { useLoaderData } from "react-router"
import api from "../../api"
//ongoingMissions,skillprograms loader deye kehane pass koraite hbe
// Mock API functions
const fetchVolunteerData = (data, volundata, missionData, requestedData, coursedData) => {
  const datas = volundata.joined_missions
  console.log('joined' , datas)
  console.log('REQ : ', requestedData[0]) //Array of objects
  //volunData[0].joined_missions
  console.log('Coooooooourse: ',coursedData)
  

  return {
    volunteer: {
      id: data[0].id,
      name: data[0].user_name,
      email: data[0].email,
      phone: data[0].user_phone,
      location: data[0].user_state,
      joinDate: "2023-01-15",
      totalCauses : volundata.volunData?.[0]?.joined_missions?.length || 0,
      totalHours: volundata.volunData?.[0]?.working_hours?.length || 0,
      skillLevel: "Advanced",
      badges: ["First Aid Certified", "Team Leader", "Emergency Response", "Community Builder"],
      avatar: data[0].user_profile_image,
    },

availableMissions: missionData?.map((mission) => {
  const matchedRequest = requestedData.find(
    (request) => request.mission === mission.title
  );

  const requestStatus = matchedRequest
    ? matchedRequest.status.toLowerCase()
    : null;

  return {
    id: mission.id,
    title: mission.title,
    type: mission.type || "General",
    location: mission.location || "Unknown",
    startDate: mission.start_date,
    endDate: mission.end_date,
    urgency: mission.urgency || "Medium",
    volunteersNeeded: mission.volunteers_needed || 0,
    volunteersJoined: parseInt(mission.volunteers_joined) || 0,
    description: mission.description || "",
    skills: mission.skills || [],
    coordinator: mission.coordinator || "N/A",
    status: mission.status || "Active",
    progress: mission.progress || 0,

    // New field to represent request status (null if none found)
    requested: requestStatus, // "accepted", "pending", "rejected", or null
  };
}) || [],




     ongoingMissions: volundata[0].joined_missions?.map((mission) => ({
      id: mission.id,
      title: mission.title,
      type: mission.type || "General", // fallback if `type` missing
      location: mission.location || "Unknown",
      startDate: mission.start_date,
      endDate: mission.end_date,
      urgency: mission.urgency || "Medium",
      volunteersNeeded: mission.volunteers_needed || 0,
      volunteersJoined: mission.volunteers_joined || 0,
      description: mission.description || "",
      skills: mission.skills || [],
      coordinator: mission.coordinator || "N/A",
      status: mission.status || "Active",
      progress: mission.progress || 0,
    })) || [],
skillPrograms : coursedData.map((data) => ({
        id: data.id,
        title: data.title,
        category: data.category,
        duration: data.duration,
        level: data.level,
        instructor: data.instructor,
        startDate: data.start_date,
        endDate: data.end_date,
        maxParticipants: data.max_participants || 0,
        enrolled: data.enrolled || 0,
        description: data.description,
        skills: data.skills?.map(skill => skill.name) || [],
        certification: data.certification,
        cost: data.cost,
        location: data.location,
        status: data.status,

    })),
  }
}

function useIntersectionObserver(ref, options = {}) {
  const [isIntersecting, setIsIntersecting] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting)
    }, options)

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      observer.disconnect()
    }
  }, [ref, options])

  return isIntersecting
}

function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header Skeleton */}
        <div className="mb-8 animate-pulse">
          <div className="h-12 bg-slate-700/50 rounded-lg w-96 mb-4"></div>
          <div className="h-6 bg-slate-700/30 rounded w-64"></div>
        </div>

        {/* Stats Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-slate-800/50 rounded-xl p-6 animate-pulse border border-slate-700">
              <div className="h-6 bg-slate-700/50 rounded w-20 mb-2"></div>
              <div className="h-8 bg-slate-700/40 rounded w-16 mb-2"></div>
              <div className="h-4 bg-slate-700/30 rounded w-24"></div>
            </div>
          ))}
        </div>

        {/* Content Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {[1, 2].map((i) => (
            <div key={i} className="bg-slate-800/50 rounded-2xl p-6 animate-pulse border border-slate-700">
              <div className="h-6 bg-slate-700/50 rounded w-48 mb-6"></div>
              <div className="space-y-4">
                {[1, 2, 3].map((j) => (
                  <div key={j} className="h-32 bg-slate-700/30 rounded-lg"></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function AnimatedCard({ children, delay = 0, className = "" }) {
  const cardRef = useRef(null)
  const isVisible = useIntersectionObserver(cardRef, { threshold: 0.1 })

  return (
    <div
      ref={cardRef}
      className={`transition-all duration-1000 ${
        isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-95"
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

function StatsCard({ title, value, subtitle, icon, color, delay = 0 }) {
  const cardRef = useRef(null)
  const isVisible = useIntersectionObserver(cardRef, { threshold: 0.1 })

  return (
    <div
      ref={cardRef}
      className={`relative group transition-all duration-1000 ${
        isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-95"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
      <div className="relative bg-slate-900/90 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 shadow-xl group-hover:shadow-2xl transition-all duration-500 group-hover:scale-105">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <div className="text-slate-300 text-sm font-medium tracking-wide">{title}</div>
            <div className={`text-3xl font-bold bg-gradient-to-r ${color} bg-clip-text text-transparent`}>{value}</div>
            <div className="text-xs text-slate-400">{subtitle}</div>
          </div>
          <div
            className={`p-3 rounded-xl bg-gradient-to-r ${color.replace("text-transparent", "from-opacity-20 to-opacity-30")} backdrop-blur-sm`}
          >
            <div className="text-xl">{icon}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

function MissionCard({ mission, type = "ongoing", onJoinRequest }) {
  const [showDetails, setShowDetails] = useState(false)
  console.log('BOOL: ',mission)

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case "High":
        return "bg-red-500/20 border-red-400/30 text-red-300"
      case "Medium":
        return "bg-yellow-500/20 border-yellow-400/30 text-yellow-300"
      case "Low":
        return "bg-green-500/20 border-green-400/30 text-green-300"
      default:
        return "bg-slate-500/20 border-slate-400/30 text-slate-300"
    }
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case "Emergency Response":
        return "🚨"
      case "Community Support":
        return "🤝"
      case "Education":
        return "📚"
      case "Recovery":
        return "🔧"
      default:
        return "🌟"
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <div className="relative group">
      <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl blur opacity-20 group-hover:opacity-30 transition duration-500"></div>
      <div className="relative bg-slate-900/90 backdrop-blur-xl rounded-xl border border-slate-700/50 p-6 shadow-xl group-hover:shadow-2xl transition-all duration-500">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{getTypeIcon(mission.type)}</span>
            <div>
              <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors duration-300">
                {mission.title}
              </h3>
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <MapPin className="w-4 h-4" />
                <span>{mission.location}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getUrgencyColor(mission.urgency)}`}>
              {mission.urgency} Priority
            </span>
            {type === "ongoing" && (
              <span className="bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 px-3 py-1 rounded-full text-xs font-medium">
                Participating
              </span>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-slate-400">Volunteers</span>
            <span className="text-white">
              {mission.volunteersJoined}/{mission.volunteersNeeded}
            </span>
          </div>
          <div className="w-full bg-slate-800/50 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-1000"
              style={{ width: `${mission.progress}%` }}
            ></div>
          </div>
        </div>

        {/* Description */}
        <p className="text-slate-300 text-sm mb-4 leading-relaxed">{mission.description}</p>

        {/* Skills Required */}
        <div className="mb-4">
          <div className="text-xs text-slate-400 mb-2">Skills Required:</div>
          <div className="flex flex-wrap gap-2">
            {mission.skills.map((skill, index) => (
              <span
                key={index}
                className="bg-slate-800/50 text-slate-300 px-2 py-1 rounded-lg text-xs border border-slate-600"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Dates */}
        <div className="flex items-center gap-4 text-sm text-slate-400 mb-4">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(mission.startDate)}</span>
          </div>
          <span>-</span>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{formatDate(mission.endDate)}</span>
          </div>
        </div>

        {/* Coordinator */}
        <div className="flex items-center gap-2 text-sm text-slate-400 mb-4">
          <User className="w-4 h-4" />
          <span>Coordinator: {mission.coordinator}</span>
        </div>

        {/* Actions */}
<div className="flex gap-3">
  <button
    onClick={() => setShowDetails(true)}
    className="flex-1 px-4 py-2 bg-slate-800/50 text-slate-300 rounded-lg hover:bg-slate-700/50 transition-all duration-300 border border-slate-600"
  >
    View Details
  </button>

{type === "available" && (
  <button
    onClick={() => onJoinRequest(mission)}
    disabled={
  mission.requested === "accepted" ||
  mission.requested === "pending" ||
  mission.requested === "rejected"
}
    className={`flex-1 px-4 py-2 rounded-lg transition-all duration-300 transform
      ${
        mission.requested === "accepted"
          ? "bg-green-600 text-white cursor-not-allowed"
          : mission.requested === "pending"
          ? "bg-gray-400 text-gray-200 cursor-not-allowed"
          : mission.requested === "rejected"
          ? "bg-red-600 text-white hover:bg-red-700"
          : "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 hover:scale-105"
      }`}
  >
    {
      mission.requested === "accepted"
        ? "Already Joined"
        : mission.requested === "pending"
        ? "Request Sent"
        : mission.requested === "rejected"
        ? "Not Eligible"
        : "Request to Join"
    }
  </button>
)}


      </div>


        {/* Details Modal */}
        {showDetails && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="relative bg-slate-900/95 backdrop-blur-xl rounded-2xl max-w-2xl w-full border border-slate-700/50 shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-30"></div>

              <div className="relative p-6">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{getTypeIcon(mission.type)}</span>
                    <div>
                      <h2 className="text-2xl font-bold text-white">{mission.title}</h2>
                      <p className="text-slate-400">{mission.type}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowDetails(false)}
                    className="p-2 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg transition-all duration-200"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Mission Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-800/50 rounded-lg p-4">
                      <div className="text-sm text-slate-400 mb-1">Location</div>
                      <div className="text-white font-medium">{mission.location}</div>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-4">
                      <div className="text-sm text-slate-400 mb-1">Duration</div>
                      <div className="text-white font-medium">
                        {formatDate(mission.startDate)} - {formatDate(mission.endDate)}
                      </div>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-4">
                      <div className="text-sm text-slate-400 mb-1">Volunteers Needed</div>
                      <div className="text-white font-medium">
                        {mission.volunteersJoined}/{mission.volunteersNeeded}
                      </div>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-4">
                      <div className="text-sm text-slate-400 mb-1">Coordinator</div>
                      <div className="text-white font-medium">{mission.coordinator}</div>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <h3 className="text-lg font-bold text-white mb-3">Mission Description</h3>
                    <p className="text-slate-300 leading-relaxed">{mission.description}</p>
                  </div>

                  {/* Skills */}
                  <div>
                    <h3 className="text-lg font-bold text-white mb-3">Required Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {mission.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="bg-purple-500/20 border border-purple-400/30 text-purple-300 px-3 py-2 rounded-lg text-sm font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  {type === "available" && (
                    <div className="flex gap-3 pt-4 border-t border-slate-700/50">
                      <button
                        onClick={() => {
                          onJoinRequest(mission)
                          setShowDetails(false)
                        }}
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                      >
                        Request to Join Mission
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function SkillProgramCard({ program, onEnroll }) {
  const [showDetails, setShowDetails] = useState(false)

  const getLevelColor = (level) => {
    switch (level) {
      case "Beginner":
        return "bg-green-500/20 border-green-400/30 text-green-300"
      case "Intermediate":
        return "bg-yellow-500/20 border-yellow-400/30 text-yellow-300"
      case "Advanced":
        return "bg-red-500/20 border-red-400/30 text-red-300"
      default:
        return "bg-slate-500/20 border-slate-400/30 text-slate-300"
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Open":
        return "bg-emerald-500/20 border-emerald-400/30 text-emerald-300"
      case "Almost Full":
        return "bg-yellow-500/20 border-yellow-400/30 text-yellow-300"
      case "Full":
        return "bg-red-500/20 border-red-400/30 text-red-300"
      default:
        return "bg-slate-500/20 border-slate-400/30 text-slate-300"
    }
  }

  const getCategoryIcon = (category) => {
    switch (category) {
      case "Medical":
        return "🏥"
      case "Leadership":
        return "👑"
      case "Mental Health":
        return "🧠"
      case "Operations":
        return "⚙️"
      case "Communication":
        return "📢"
      case "Technology":
        return "💻"
      default:
        return "📚"
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const enrollmentPercentage = (program.enrolled / program.maxParticipants) * 100

  return (
    <div className="relative group">
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl blur opacity-20 group-hover:opacity-30 transition duration-500"></div>
      <div className="relative bg-slate-900/90 backdrop-blur-xl rounded-xl border border-slate-700/50 p-6 shadow-xl group-hover:shadow-2xl transition-all duration-500">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{getCategoryIcon(program.category)}</span>
            <div>
              <h3 className="text-lg font-bold text-white group-hover:text-blue-300 transition-colors duration-300">
                {program.title}
              </h3>
              <div className="text-sm text-slate-400">{program.category}</div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getLevelColor(program.level)}`}>
              {program.level}
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(program.status)}`}>
              {program.status}
            </span>
          </div>
        </div>

        {/* Enrollment Progress */}
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-slate-400">Enrollment</span>
            <span className="text-white">
              {program.enrolled}/{program.maxParticipants}
            </span>
          </div>
          <div className="w-full bg-slate-800/50 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-1000"
              style={{ width: `${enrollmentPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Description */}
        <p className="text-slate-300 text-sm mb-4 leading-relaxed">{program.description}</p>

        {/* Program Details */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-slate-800/50 rounded-lg p-3">
            <div className="text-xs text-slate-400">Duration</div>
            <div className="text-sm font-medium text-white">{program.duration}</div>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-3">
            <div className="text-xs text-slate-400">Instructor</div>
            <div className="text-sm font-medium text-white">{program.instructor}</div>
          </div>
        </div>

        {/* Dates */}
        <div className="flex items-center gap-4 text-sm text-slate-400 mb-4">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(program.startDate)}</span>
          </div>
          <span>-</span>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{formatDate(program.endDate)}</span>
          </div>
        </div>

        {/* Certification */}
        <div className="flex items-center gap-2 text-sm mb-4">
          <Award className="w-4 h-4 text-yellow-400" />
          <span className="text-slate-300">{program.certification}</span>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={() => setShowDetails(true)}
            className="flex-1 px-4 py-2 bg-slate-800/50 text-slate-300 rounded-lg hover:bg-slate-700/50 transition-all duration-300 border border-slate-600"
          >
            View Details
          </button>
          <button
            onClick={() => onEnroll(program)}
            disabled={program.status === "Full"}
            className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {program.status === "Full" ? "Full" : "Enroll"}
          </button>
        </div>

        {/* Details Modal */}
        {showDetails && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="relative bg-slate-900/95 backdrop-blur-xl rounded-2xl max-w-2xl w-full border border-slate-700/50 shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl blur opacity-30"></div>

              <div className="relative p-6">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{getCategoryIcon(program.category)}</span>
                    <div>
                      <h2 className="text-2xl font-bold text-white">{program.title}</h2>
                      <p className="text-slate-400">
                        {program.category} • {program.level}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowDetails(false)}
                    className="p-2 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg transition-all duration-200"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Program Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-800/50 rounded-lg p-4">
                      <div className="text-sm text-slate-400 mb-1">Duration</div>
                      <div className="text-white font-medium">{program.duration}</div>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-4">
                      <div className="text-sm text-slate-400 mb-1">Instructor</div>
                      <div className="text-white font-medium">{program.instructor}</div>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-4">
                      <div className="text-sm text-slate-400 mb-1">Schedule</div>
                      <div className="text-white font-medium">
                        {formatDate(program.startDate)} - {formatDate(program.endDate)}
                      </div>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-4">
                      <div className="text-sm text-slate-400 mb-1">Location</div>
                      <div className="text-white font-medium">{program.location}</div>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <h3 className="text-lg font-bold text-white mb-3">Program Description</h3>
                    <p className="text-slate-300 leading-relaxed">{program.description}</p>
                  </div>

                  {/* Skills */}
                  <div>
                    <h3 className="text-lg font-bold text-white mb-3">Skills You'll Learn</h3>
                    <div className="flex flex-wrap gap-2">
                      {program.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="bg-blue-500/20 border border-blue-400/30 text-blue-300 px-3 py-2 rounded-lg text-sm font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Certification */}
                  <div className="bg-yellow-500/10 border border-yellow-400/30 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Award className="w-5 h-5 text-yellow-400" />
                      <h3 className="text-lg font-bold text-white">Certification</h3>
                    </div>
                    <p className="text-yellow-300">{program.certification}</p>
                    <p className="text-slate-400 text-sm mt-1">
                      Upon successful completion, you'll receive an official certificate.
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-4 border-t border-slate-700/50">
                    <button
                      onClick={() => {
                        onEnroll(program)
                        setShowDetails(false)
                      }}
                      disabled={program.status === "Full"}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {program.status === "Full" ? "Program Full" : "Enroll in Program"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function JoinRequestModal({ isOpen, mission, onClose, onSubmit }) {
  
  const [formData, setFormData] = useState({
    motivation: "",
    experience: "",
    availability: "",
    skills: "",
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
try {
    const response = await api.post('/mission/api/mission-requests/', {
      mission_id: mission.id,
    });

    console.log('Join request successful:', response.data);

    onSubmit?.(mission, response.data); // optional callback
    setFormData({ motivation: "", experience: "", availability: "", skills: "" });
    onClose();

  } catch (error) {
    console.error('Error submitting join request:', error.response?.data || error.message);
  }
  }

  if (!isOpen || !mission) return null

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="relative bg-slate-900/95 backdrop-blur-xl rounded-2xl max-w-2xl w-full border border-slate-700/50 shadow-2xl">
        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-30"></div>

        <div className="relative p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Join Mission Request</h2>
              <p className="text-slate-400">{mission.title}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg transition-all duration-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Why do you want to join this mission?
              </label>
              <textarea
                value={formData.motivation}
                onChange={(e) => setFormData({ ...formData, motivation: e.target.value })}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all resize-none"
                rows={4}
                placeholder="Share your motivation and what drives you to help..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Relevant Experience</label>
              <textarea
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all resize-none"
                rows={3}
                placeholder="Describe any relevant experience or training you have..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Availability</label>
              <textarea
                value={formData.availability}
                onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all resize-none"
                rows={2}
                placeholder="When are you available? (days, times, duration)"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Additional Skills</label>
              <textarea
                value={formData.skills}
                onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all resize-none"
                rows={2}
                placeholder="Any additional skills or qualifications you'd like to mention..."
              />
            </div>

            <div className="flex gap-3 pt-4 border-t border-slate-700/50">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 bg-slate-800/50 text-slate-300 rounded-xl hover:bg-slate-700/50 transition-all duration-300 border border-slate-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <span className="flex items-center justify-center gap-2">
                  <Send className="w-4 h-4" />
                  Submit Request
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default function VolunteerDashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("ongoing")
  const [showJoinModal, setShowJoinModal] = useState(false)
  const [selectedMission, setSelectedMission] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("All")
  const [filterLevel, setFilterLevel] = useState("All")
  const { user } = useContext(AuthContext);
  const {volunData, missionData, requestedData, coursedData} = useLoaderData()
  const [requestedMissions, setRequestedMissions] = useState(new Set());
  // console.log('Volundata', volunData[0])
  // console.log('MissionData' , missionData)
  // console.log('RequestedData' , requestedData[0].id)
  // console.log(requestedMissions)
  // //have to setRequested
  // console.log(user)

  const headerRef = useRef(null)
  const statsRef = useRef(null)
  const contentRef = useRef(null)

  const isHeaderVisible = useIntersectionObserver(headerRef, { threshold: 0.1 })
  const isStatsVisible = useIntersectionObserver(statsRef, { threshold: 0.1 })
  const isContentVisible = useIntersectionObserver(contentRef, { threshold: 0.1 })

  useEffect(() => {
    const loadData = async () => {
      try {
        const volunteerData =  fetchVolunteerData(user, volunData, missionData, requestedData, coursedData)
        console.log(volunteerData)
        setData(volunteerData)
      } catch (error) {
        console.error("Error loading volunteer data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const handleJoinRequest = (mission) => {
    
    setSelectedMission(mission)
    setShowJoinModal(true)
  }

  const handleSubmitJoinRequest = (mission, formData ,) => {

    console.log("Join request submitted:", { mission: mission.id, formData })
    setShowJoinModal(false)
    setSelectedMission(null)
    // Here you would typically send the request to your backend
    alert("Your join request has been submitted! You'll hear back from the coordinator soon.")
  }

  const handleEnrollProgram = (program) => {
    console.log("Enrolling in program:", program.id)
    // Here you would typically send the enrollment request to your backend
    alert(`You've successfully enrolled in "${program.title}"! Check your email for further details.`)
  }

  const filteredMissions =
    data?.availableMissions?.filter((mission) => {
      const matchesSearch =
        mission.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mission.location.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesType = filterType === "All" || mission.type === filterType
      return matchesSearch && matchesType
    }) || []

  const filteredPrograms =
    data?.skillPrograms?.filter((program) => {
      const matchesSearch =
        program.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        program.category.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesLevel = filterLevel === "All" || program.level === filterLevel
      return matchesSearch && matchesLevel
    }) || []

  if (loading) {
    return <LoadingSkeleton />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden pb-200">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div
          ref={headerRef}
          className={`mb-12 transition-all duration-1000 ${
            isHeaderVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`}
        >
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
            <div className="relative bg-slate-900/90 backdrop-blur-xl p-8 rounded-2xl border border-slate-700/50 shadow-2xl">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between">
                <div className="flex items-center gap-6 mb-6 lg:mb-0">
                  <div className="relative">
                    <img
                      src={data?.volunteer?.avatar || "/placeholder.svg?height=100&width=100"}
                      alt={data?.volunteer?.name}
                      className="w-20 h-20 rounded-full border-4 border-purple-500/50 object-cover"
                    />
                    <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                      {data?.volunteer?.skillLevel}
                    </div>
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
                      Welcome back, {data?.volunteer?.name}!
                    </h1>
                    <p className="text-slate-300 text-lg">Ready to make a difference today?</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-slate-400">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {data?.volunteer?.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Volunteer since {new Date(data?.volunteer?.joinDate).getFullYear()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {data?.volunteer?.badges?.slice(0, 3).map((badge, index) => (
                    <span
                      key={index}
                      className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30 text-purple-300 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {badge}
                    </span>
                  ))}
                  {data?.volunteer?.badges?.length > 3 && (
                    <span className="bg-slate-800/50 border border-slate-600 text-slate-300 px-3 py-1 rounded-full text-sm">
                      +{data.volunteer.badges.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div
          ref={statsRef}
          className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 transition-all duration-1000 ${
            isStatsVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          <StatsCard
            title="Causes Served"
            value={data?.volunteer?.totalCauses?.toString() || "0"}
            subtitle="Total missions completed"
            icon="🎯"
            color="from-purple-400 to-purple-600"
            delay={0}
          />
          <StatsCard
            title="Volunteer Hours"
            value={data?.volunteer?.totalHours?.toString() || "0"}
            subtitle="Time dedicated to helping"
            icon="⏰"
            color="from-blue-400 to-blue-600"
            delay={200}
          />
          <StatsCard
            title="Active Missions"
            value={data?.ongoingMissions?.length?.toString() || "0"}
            subtitle="Currently participating"
            icon="🚀"
            color="from-emerald-400 to-emerald-600"
            delay={400}
          />
          <StatsCard
            title="Skill Level"
            value={data?.volunteer?.skillLevel || "Beginner"}
            subtitle="Based on experience"
            icon="⭐"
            color="from-yellow-400 to-yellow-600"
            delay={600}
          />
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8 flex justify-center">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl blur opacity-20 group-hover:opacity-30 transition duration-500"></div>
            <div className="relative bg-slate-900/90 backdrop-blur-xl rounded-xl border border-slate-700/50 p-2">
              <div className="flex gap-2">
                {[
                  { id: "ongoing", label: "My Missions", icon: Target },
                  { id: "available", label: "Available Missions", icon: Globe },
                  { id: "programs", label: "Skill Programs", icon: BookOpen },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                      activeTab === tab.id
                        ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                        : "text-slate-300 hover:text-white hover:bg-slate-800/50"
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        {(activeTab === "available" || activeTab === "programs") && (
          <div className="mb-8 flex flex-col lg:flex-row gap-4 justify-center items-center">
            {/* Search */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl blur opacity-20 group-hover:opacity-30 transition duration-500"></div>
              <div className="relative bg-slate-900/90 backdrop-blur-xl rounded-xl border border-slate-700/50 p-4">
                <div className="flex items-center gap-3">
                  <Search className="w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder={`Search ${activeTab === "available" ? "missions" : "programs"}...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-transparent text-white placeholder-slate-400 outline-none w-64"
                  />
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl blur opacity-20 group-hover:opacity-30 transition duration-500"></div>
              <div className="relative bg-slate-900/90 backdrop-blur-xl rounded-xl border border-slate-700/50 p-4">
                <div className="flex items-center gap-3">
                  <Filter className="w-5 h-5 text-slate-400" />
                  {activeTab === "available" ? (
                    <select
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                      className="bg-transparent text-white outline-none"
                    >
                      <option value="All">All Types</option>
                      <option value="Emergency Response">Emergency Response</option>
                      <option value="Community Support">Community Support</option>
                      <option value="Education">Education</option>
                      <option value="Recovery">Recovery</option>
                    </select>
                  ) : (
                    <select
                      value={filterLevel}
                      onChange={(e) => setFilterLevel(e.target.value)}
                      className="bg-transparent text-white outline-none"
                    >
                      <option value="All">All Levels</option>
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        <div
          ref={contentRef}
          className={`transition-all duration-1000 ${
            isContentVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {activeTab === "ongoing" && (
            <div className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent mb-4">
                  Your Active Missions
                </h2>
                <p className="text-slate-300 text-lg">Missions you're currently participating in</p>
              </div>

              {data?.ongoingMissions?.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {data.ongoingMissions.map((mission, index) => (
                    <AnimatedCard key={mission.id} delay={index * 200}>
                      <MissionCard mission={mission} type="ongoing" />
                    </AnimatedCard>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <Target className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">No Active Missions</h3>
                  <p className="text-slate-400 mb-6">You're not currently participating in any missions.</p>
                  <button
                    onClick={() => setActiveTab("available")}
                    className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    Browse Available Missions
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === "available" && (
            <div className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent mb-4">
                  Available Missions
                </h2>
                <p className="text-slate-300 text-lg">Join new missions and make a difference</p>
              </div>

              {filteredMissions.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {filteredMissions.map((mission, index) => (
                    <AnimatedCard key={mission.id} delay={index * 200}>
                      <MissionCard mission={mission} type="available" onJoinRequest={handleJoinRequest} />
                    </AnimatedCard>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <Globe className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">No Missions Found</h3>
                  <p className="text-slate-400">Try adjusting your search or filter criteria.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "programs" && (
            <div className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent mb-4">
                  Skill Development Programs
                </h2>
                <p className="text-slate-300 text-lg">Enhance your skills and become a more effective volunteer</p>
              </div>

              {filteredPrograms.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {filteredPrograms.map((program, index) => (
                    <AnimatedCard key={program.id} delay={index * 200}>
                      <SkillProgramCard program={program} onEnroll={handleEnrollProgram} />
                    </AnimatedCard>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <BookOpen className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">No Programs Found</h3>
                  <p className="text-slate-400">Try adjusting your search or filter criteria.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Join Request Modal */}
      <JoinRequestModal
        isOpen={showJoinModal}
        mission={selectedMission}
        onClose={() => {
          setShowJoinModal(false)
          setSelectedMission(null)
        }}
        onSubmit={handleSubmitJoinRequest}
      />

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  )
}
