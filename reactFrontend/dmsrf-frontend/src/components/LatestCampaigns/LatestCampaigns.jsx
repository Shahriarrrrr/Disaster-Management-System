"use client"

import { useState, useEffect, useRef } from "react"

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

function AnimatedProgressBar({ percentage, delay = 0 }) {
  const [animatedPercentage, setAnimatedPercentage] = useState(0)
  const progressRef = useRef(null)
  const isVisible = useIntersectionObserver(progressRef, { threshold: 0.1 })

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        setAnimatedPercentage(percentage)
      }, delay)
      return () => clearTimeout(timer)
    }
  }, [isVisible, percentage, delay])

  return (
    <div
      ref={progressRef}
      className="relative w-full bg-slate-800/50 rounded-full h-4 mb-4 overflow-hidden backdrop-blur-sm"
    >
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-full"></div>

      {/* Progress bar */}
      <div
        className="h-full bg-gradient-to-r from-emerald-500 via-teal-500 to-green-500 rounded-full shadow-lg transition-all duration-2000 ease-out relative overflow-hidden"
        style={{ width: `${animatedPercentage}%` }}
      >
        {/* Shimmer effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>

        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-green-400 opacity-50 blur-sm"></div>
      </div>

      {/* Percentage indicator */}
      {animatedPercentage > 10 && (
        <div
          className="absolute top-1/2 transform -translate-y-1/2 text-white text-xs font-bold transition-all duration-2000 ease-out"
          style={{ left: `${Math.max(animatedPercentage - 8, 2)}%` }}
        >
          {Math.round(animatedPercentage)}%
        </div>
      )}
    </div>
  )
}

const AnimatedLatestCampaigns = ({ campaign }) => {
  const cardRef = useRef(null)
  const isVisible = useIntersectionObserver(cardRef, { threshold: 0.1 })
  const [isHovered, setIsHovered] = useState(false)

  const totalCollected = campaign.updates?.[campaign.updates.length - 1]?.total_collected || 0
  const goal = campaign.goal_amount || 0
  const percentage = goal > 0 ? Math.min(100, Math.floor((totalCollected / goal) * 100)) : 0

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-BD", {
      style: "currency",
      currency: "BDT",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
      .format(amount)
      .replace("BDT", "৳")
  }

  return (
    <div
      ref={cardRef}
      className={`relative group transition-all duration-1000 ${
        isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-95"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Glow Effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>

      <div className="relative bg-slate-900/90 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50 shadow-xl group-hover:shadow-2xl transition-all duration-500 group-hover:scale-105 h-full flex flex-col">
        {/* Campaign Status Badge */}
        <div className="absolute -top-3 -right-3">
          <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            Active
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent mb-4 group-hover:from-purple-300 group-hover:to-pink-300 transition-all duration-300 leading-tight">
          {campaign.title}
        </h3>

        {/* Description */}
        <p className="text-slate-300 mb-6 flex-grow leading-relaxed group-hover:text-slate-200 transition-colors duration-300">
          {campaign.description || "No description provided."}
        </p>

        {/* Progress Section */}
        <div className="space-y-4">
          {/* Progress Bar */}
          <AnimatedProgressBar percentage={percentage} delay={500} />

          {/* Stats */}
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <p className="text-sm text-slate-400 font-medium">Raised</p>
              <p className="text-lg font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                {formatCurrency(totalCollected)}
              </p>
            </div>
            <div className="space-y-1 text-right">
              <p className="text-sm text-slate-400 font-medium">Goal</p>
              <p className="text-lg font-bold text-white">{formatCurrency(goal)}</p>
            </div>
          </div>

          {/* Additional Stats */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-700/50">
            <div className="text-center">
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Donors</p>
              <p className="text-sm font-bold text-purple-400">
                {campaign.donor_count || Math.floor(Math.random() * 100) + 10}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Days Left</p>
              <p className="text-sm font-bold text-pink-400">
                {campaign.days_left || Math.floor(Math.random() * 30) + 5}
              </p>
            </div>
          </div>

          {/* Donate Button */}
          <button
            className={`w-full mt-6 px-6 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 relative overflow-hidden group/btn ${
              isHovered ? "from-emerald-400 to-teal-400" : ""
            }`}
          >
            {/* Button glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>

            {/* Button content */}
            <span className="relative flex items-center justify-center gap-2">
              <span>💝</span>
              Donate Now
              <svg
                className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </button>
        </div>

        {/* Floating particles effect */}
        {isHovered && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-purple-400 rounded-full animate-float opacity-60"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${2 + Math.random() * 2}s`,
                }}
              ></div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
            opacity: 0;
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
            opacity: 1;
          }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        .animate-float {
          animation: float 3s infinite ease-in-out;
        }
      `}</style>
    </div>
  )
}

export default AnimatedLatestCampaigns
