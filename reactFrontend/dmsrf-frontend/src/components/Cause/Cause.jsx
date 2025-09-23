"use client"

import { useState, useEffect, useRef } from "react"
import { Heart, Clock, MapPin, ArrowRight, Share2, X } from "lucide-react"
import { useLoaderData } from "react-router"
import { useNavigate } from "react-router-dom";

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




function AnimatedProgressBar({ percentage, delay = 0, size = "large" }) {
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

  const height = size === "large" ? "h-4" : "h-3"

  return (
    <div
      ref={progressRef}
      className={`relative w-full bg-slate-800/50 rounded-full ${height} overflow-hidden backdrop-blur-sm`}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/20 to-teal-600/20 rounded-full"></div>
      <div
        className={`${height} bg-gradient-to-r from-emerald-500 via-teal-500 to-green-500 rounded-full shadow-lg transition-all duration-2000 ease-out relative overflow-hidden`}
        style={{ width: `${animatedPercentage}%` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-green-400 opacity-50 blur-sm"></div>
      </div>
      {animatedPercentage > 15 && size === "large" && (
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

function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900">
      {/* Hero Skeleton */}
      <div className="h-screen bg-slate-800/50 animate-pulse relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/20 to-teal-600/20"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="h-16 bg-slate-700/50 rounded-lg w-96 mx-auto"></div>
            <div className="h-8 bg-slate-700/30 rounded-lg w-80 mx-auto"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

function HeroCampaign({ campaign, delay = 0, onDonate }) {

  const heroRef = useRef(null)
  const isVisible = useIntersectionObserver(heroRef, { threshold: 0.1 })

  const totalCollected = campaign.updates?.[campaign.updates.length - 1]?.total_collected || 0
  const goal = campaign.goal_amount || 0
  const percentage = goal > 0 ? Math.min(100, Math.floor((totalCollected / goal) * 100)) : 0

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

  // Mock story data - in real app this would come from the campaign object
  const story = {
    testimonial:
      "After the earthquake destroyed our village, we thought all hope was lost. But thanks to your support, we're rebuilding stronger than ever.",
    testimonialAuthor: "Maria Santos, Community Leader",
    impactStats: [
      { number: "1,247", label: "Families Helped", icon: "👨‍👩‍👧‍👦" },
      { number: "15", label: "Villages Rebuilt", icon: "🏘️" },
      { number: "3,890", label: "People Fed", icon: "🍽️" },
      { number: "24/7", label: "Emergency Support", icon: "🚑" },
    ],
    timeline: [
      { date: "Day 1-7", event: "Emergency Response", status: "completed" },
      { date: "Week 2-4", event: "Temporary Shelters", status: "completed" },
      { date: "Month 2-6", event: "Rebuilding Homes", status: "in-progress" },
      { date: "Month 6+", event: "Community Recovery", status: "upcoming" },
    ],
  }

  return (
    <div
      ref={heroRef}
      className={`min-h-screen relative overflow-hidden transition-all duration-1000 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {/* Background Image with Parallax Effect */}
      <div className="absolute inset-0">
        <img
          src={campaign.image || "/placeholder.svg?height=1080&width=1920"}
          alt={campaign.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Story Content */}
            <div
              className={`space-y-8 transition-all duration-1000 delay-300 ${
                isVisible ? "translate-x-0 opacity-100" : "-translate-x-12 opacity-0"
              }`}
            >
              {/* Campaign Badge */}
              <div className="flex items-center gap-3">
                <span className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider">
                  Featured Campaign
                </span>
                <span className="bg-red-500/20 border border-red-400/30 text-red-300 px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm">
                  🚨 Urgent
                </span>
              </div>

              {/* Title */}
              <h1 className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-white via-emerald-200 to-teal-200 bg-clip-text text-transparent leading-tight">
                {campaign.title}
              </h1>

              {/* Location & Time */}
              <div className="flex items-center space-x-6 text-emerald-300">
                <span className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  {campaign.location || "Global"}
                </span>
                <span className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  {Math.floor(Math.random() * 30) + 5} days left
                </span>
              </div>

              {/* Description */}
              <p className="text-xl text-slate-300 leading-relaxed max-w-2xl">{campaign.description}</p>

              {/* Testimonial */}
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl blur opacity-20 group-hover:opacity-30 transition duration-500"></div>
                <div className="relative bg-slate-900/80 backdrop-blur-xl rounded-xl p-6 border border-emerald-400/30">
                  <blockquote className="text-emerald-200 italic text-lg leading-relaxed mb-4">
                    "{story.testimonial}"
                  </blockquote>
                  <cite className="text-emerald-400 font-medium">— {story.testimonialAuthor}</cite>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => onDonate(campaign)}
                  className="group relative px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative flex items-center justify-center gap-2">
                    💝 Donate Now
                    <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                </button>
                <button className="group px-8 py-4 border-2 border-emerald-400 text-emerald-300 font-bold rounded-xl hover:bg-emerald-500 hover:text-white transition-all duration-300 transform hover:scale-105 backdrop-blur-sm">
                  <span className="flex items-center justify-center gap-2">
                    <Share2 className="w-5 h-5" />
                    Share Story
                  </span>
                </button>
              </div>
            </div>

            {/* Progress & Stats */}
            <div
              className={`space-y-8 transition-all duration-1000 delay-500 ${
                isVisible ? "translate-x-0 opacity-100" : "translate-x-12 opacity-0"
              }`}
            >
              {/* Progress Card */}
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
                <div className="relative bg-slate-900/90 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50 shadow-2xl">
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-2xl font-bold text-white">Campaign Progress</h3>
                      <span className="text-emerald-400 font-bold text-lg">{Math.round(percentage)}%</span>
                    </div>

                    <AnimatedProgressBar percentage={percentage} delay={delay + 800} />

                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                          {formatCurrency(totalCollected)}
                        </div>
                        <div className="text-slate-400 text-sm">Raised</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-white">{formatCurrency(goal)}</div>
                        <div className="text-slate-400 text-sm">Goal</div>
                      </div>
                    </div>

                    <div className="flex justify-between text-sm text-slate-300">
                      <span>{Math.floor(Math.random() * 500) + 100} donors</span>
                      <span>{Math.floor(Math.random() * 30) + 5} days left</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Impact Stats */}
              <div className="grid grid-cols-2 gap-4">
                {story.impactStats.map((stat, index) => (
                  <div
                    key={index}
                    className="relative group"
                    style={{ animationDelay: `${delay + 1000 + index * 200}ms` }}
                  >
                    <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl blur opacity-20 group-hover:opacity-30 transition duration-500"></div>
                    <div className="relative bg-slate-900/80 backdrop-blur-xl rounded-xl p-6 border border-slate-700/50 text-center">
                      <div className="text-2xl mb-2">{stat.icon}</div>
                      <div className="text-2xl font-bold text-white mb-1">{stat.number}</div>
                      <div className="text-slate-400 text-sm">{stat.label}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Timeline */}
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl blur opacity-20 group-hover:opacity-30 transition duration-500"></div>
                <div className="relative bg-slate-900/80 backdrop-blur-xl rounded-xl p-6 border border-slate-700/50">
                  <h4 className="text-lg font-bold text-white mb-4">Recovery Timeline</h4>
                  <div className="space-y-3">
                    {story.timeline.map((phase, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            phase.status === "completed"
                              ? "bg-emerald-500"
                              : phase.status === "in-progress"
                                ? "bg-yellow-500 animate-pulse"
                                : "bg-slate-600"
                          }`}
                        ></div>
                        <div className="flex-1">
                          <div className="text-white font-medium">{phase.event}</div>
                          <div className="text-slate-400 text-sm">{phase.date}</div>
                        </div>
                        {phase.status === "completed" && <span className="text-emerald-400 text-sm">✓</span>}
                        {phase.status === "in-progress" && <span className="text-yellow-400 text-sm">⏳</span>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function CampaignCard({ campaign, delay = 0, onDonate }) {
  const cardRef = useRef(null)
  const isVisible = useIntersectionObserver(cardRef, { threshold: 0.1 })
  const [isHovered, setIsHovered] = useState(false)

  const totalCollected = campaign.updates?.[campaign.updates.length - 1]?.total_collected || 0
  const goal = campaign.goal_amount || 0
  const percentage = goal > 0 ? Math.min(100, Math.floor((totalCollected / goal) * 100)) : 0

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
      style={{ transitionDelay: `${delay}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Glow Effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>

      <div className="relative bg-slate-900/90 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-xl group-hover:shadow-2xl transition-all duration-500 group-hover:scale-105 overflow-hidden">
        {/* Image Section */}
        <div className="relative overflow-hidden h-48">
          <img
            src={campaign.image || "/placeholder.svg?height=300&width=400"}
            alt={campaign.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />

          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

          {/* Floating particles effect */}
          {isHovered && (
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-emerald-400 rounded-full animate-float opacity-60"
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

        {/* Content Section */}
        <div className="p-6 space-y-4">
          {/* Location and Time */}
          <div className="flex items-center space-x-4 text-sm text-slate-400">
            <span className="flex items-center gap-1">
              <MapPin className="h-4 w-4 text-emerald-400" />
              {campaign.location || "Global"}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4 text-teal-400" />
              {Math.floor(Math.random() * 30) + 5} days left
            </span>
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold bg-gradient-to-r from-white to-emerald-200 bg-clip-text text-transparent group-hover:from-emerald-300 group-hover:to-teal-300 transition-all duration-300 leading-tight">
            {campaign.title}
          </h3>

          {/* Description */}
          <p className="text-slate-300 leading-relaxed group-hover:text-slate-200 transition-colors duration-300 line-clamp-3">
            {campaign.description}
          </p>

          {/* Progress Section */}
          <div className="space-y-3">
            <div className="flex justify-between text-sm font-medium">
              <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                {formatCurrency(totalCollected)} raised
              </span>
              <span className="text-slate-400">of {formatCurrency(goal)} goal</span>
            </div>

            <AnimatedProgressBar percentage={percentage} delay={delay + 500} size="small" />

            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-400">{Math.floor(Math.random() * 500) + 100} donors</span>
              <span className="font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                {Math.round(percentage)}% funded
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-2">
            <button
              onClick={() => onDonate(campaign)}
              className="flex-1 group/btn relative px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
              <span className="relative flex items-center justify-center gap-2">
                💝 Donate Now
                <ArrowRight className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform duration-300" />
              </span>
            </button>
            <button className="p-3 bg-slate-800/50 border border-slate-600 text-slate-300 rounded-xl hover:bg-slate-700/50 hover:text-white transition-all duration-300 transform hover:scale-110 backdrop-blur-sm">
              <Share2 className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function DonationModal({ isOpen, campaign, onClose }) {
  const [selectedAmount, setSelectedAmount] = useState("50")
  const [customAmount, setCustomAmount] = useState("")
  const modalRef = useRef(null)

  const donationAmounts = ["25", "50", "100", "250", "500"]

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

  if (!isOpen || !campaign) return null

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        className="relative bg-slate-900/95 backdrop-blur-xl rounded-2xl max-w-md w-full border border-slate-700/50 shadow-2xl transform transition-all duration-300 scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow Effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl blur opacity-30"></div>

        <div className="relative">
          {/* Header */}
          <div className="p-6 pb-0">
            <div className="flex items-start justify-between">
              <div className="flex-1 pr-4">
                <h3 className="text-xl font-bold bg-gradient-to-r from-white to-emerald-200 bg-clip-text text-transparent mb-2">
                  Support: {campaign.title}
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Choose your donation amount to help us reach our goal of {formatCurrency(campaign.goal_amount)}.
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg transition-all duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Amount Selection */}
            <div>
              <label className="block text-base font-medium text-white mb-3">Select Amount</label>
              <div className="grid grid-cols-3 gap-3">
                {donationAmounts.map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    className={`px-3 py-3 text-sm font-medium border rounded-xl transition-all duration-300 ${
                      selectedAmount === amount
                        ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-emerald-500 shadow-lg"
                        : "bg-slate-800/50 text-slate-300 border-slate-600 hover:bg-slate-700/50 hover:border-slate-500"
                    }`}
                    onClick={() => setSelectedAmount(amount)}
                  >
                    ৳{amount}
                  </button>
                ))}
                <button
                  type="button"
                  className={`px-3 py-3 text-sm font-medium border rounded-xl transition-all duration-300 ${
                    selectedAmount === "custom"
                      ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-emerald-500 shadow-lg"
                      : "bg-slate-800/50 text-slate-300 border-slate-600 hover:bg-slate-700/50 hover:border-slate-500"
                  }`}
                  onClick={() => setSelectedAmount("custom")}
                >
                  Custom
                </button>
              </div>
            </div>

            {/* Custom Amount Input */}
            {selectedAmount === "custom" && (
              <div className="space-y-2">
                <label htmlFor="customAmount" className="block font-medium text-white">
                  Custom Amount
                </label>
                <input
                  id="customAmount"
                  type="number"
                  placeholder="Enter amount"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300"
                />
              </div>
            )}

            {/* Donate Button */}
            <div className="space-y-3 text-center">
              <button className="w-full group relative px-6 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative flex items-center justify-center gap-2">
                  💝 Donate ৳{selectedAmount === "custom" ? customAmount || "0" : selectedAmount}
                </span>
              </button>
              <p className="text-xs text-slate-400">Your donation is secure and will be processed immediately.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}




export default function Cause() {
  const [showDonationModal, setShowDonationModal] = useState(false)
  const [selectedCampaign, setSelectedCampaign] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate();

  const handleDonateRedirect = () => {
    navigate('/donatePage'); // Navigate to /donate
  };
  const causes = useLoaderData()
  const campaigns = causes?.causes || []

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)
    return () => clearTimeout(timer)
  }, [])

  const openDonationModal = (campaign) => {
    setSelectedCampaign(campaign)
    setShowDonationModal(true)
  }

  const closeDonationModal = () => {
    setShowDonationModal(false)
    setSelectedCampaign(null)
  }

  if (isLoading) {
    return <LoadingSkeleton />
  }

  const featuredCampaigns = campaigns.filter((campaign) => campaign.featured) || campaigns.slice(0, 2)
  const regularCampaigns = campaigns.filter((campaign) => !campaign.featured) || campaigns.slice(2)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-green-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Featured Campaigns - Hero Style */}
      <div className="relative z-10">
        {featuredCampaigns.map((campaign, index) => (
          <HeroCampaign key={campaign.id} campaign={campaign} delay={index * 300} onDonate={handleDonateRedirect} />
        ))}
      </div>

      {/* Regular Campaigns */}
      {regularCampaigns.length > 0 && (
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-emerald-200 bg-clip-text text-transparent mb-4">
              More Ways to Help
            </h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Discover other meaningful campaigns where your support can create lasting change.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularCampaigns.map((campaign, index) => (
              <CampaignCard key={campaign.id} campaign={campaign} delay={index * 150} onDonate={openDonationModal} />
            ))}
          </div>
        </div>
      )}

      {/* Call to Action */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>
          <div className="relative bg-gradient-to-r from-emerald-500/90 to-teal-600/90 backdrop-blur-xl rounded-2xl p-12 text-center text-white border border-emerald-500/20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Make an Impact?</h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto leading-relaxed">
              Every donation, no matter the size, creates ripples of positive change. Join our community of changemakers
              today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="group relative px-8 py-4 bg-white text-emerald-600 font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 overflow-hidden">
                <div className="absolute inset-0 bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative flex items-center justify-center gap-2">
                  <Heart className="h-5 w-5" />
                  Start a Campaign
                </span>
              </button>
              <button className="group relative px-8 py-4 border-2 border-white text-white font-bold rounded-xl hover:bg-white hover:text-emerald-600 transition-all duration-300 transform hover:scale-105">
                <span className="flex items-center justify-center gap-2">
                  Learn More
                  <ArrowRight className="h-5 w-5 transform group-hover:translate-x-1 transition-transform duration-300" />
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Donation Modal */}
      <DonationModal isOpen={showDonationModal} campaign={selectedCampaign} onClose={closeDonationModal} />

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
            opacity: 0.3;
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
            opacity: 0.6;
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
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        .animate-float {
          animation: float 3s infinite ease-in-out;
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  )
}
