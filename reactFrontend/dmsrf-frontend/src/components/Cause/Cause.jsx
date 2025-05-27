"use client"

import { useState, useEffect, useRef } from "react"
import { Heart, Clock, MapPin, ArrowRight, Share2, X } from "lucide-react"
import { useLoaderData } from "react-router"

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
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-full"></div>
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Skeleton */}
      <div className="h-96 bg-slate-800/50 animate-pulse relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="h-16 bg-slate-700/50 rounded-lg w-96 mx-auto"></div>
            <div className="h-8 bg-slate-700/30 rounded-lg w-80 mx-auto"></div>
          </div>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <div className="h-12 bg-slate-700/50 rounded-lg mb-4 max-w-md mx-auto animate-pulse"></div>
          <div className="h-6 bg-slate-700/30 rounded-lg max-w-2xl mx-auto animate-pulse"></div>
        </div>

        {/* Featured Campaign Skeletons */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {[1, 2].map((i) => (
            <div key={i} className="bg-slate-800/50 rounded-2xl overflow-hidden border border-slate-700 animate-pulse">
              <div className="h-64 bg-slate-700/50"></div>
              <div className="p-6 space-y-4">
                <div className="h-4 bg-slate-700/40 rounded w-3/4"></div>
                <div className="h-8 bg-slate-700/50 rounded w-full"></div>
                <div className="h-20 bg-slate-700/30 rounded w-full"></div>
                <div className="h-3 bg-slate-700/40 rounded w-full"></div>
                <div className="h-12 bg-slate-700/50 rounded w-full"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Campaign Grid Skeletons */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-slate-800/50 rounded-xl overflow-hidden border border-slate-700 animate-pulse">
              <div className="h-48 bg-slate-700/50"></div>
              <div className="p-5 space-y-3">
                <div className="h-4 bg-slate-700/40 rounded w-2/3"></div>
                <div className="h-6 bg-slate-700/50 rounded w-full"></div>
                <div className="h-16 bg-slate-700/30 rounded w-full"></div>
                <div className="h-2 bg-slate-700/40 rounded w-full"></div>
                <div className="h-10 bg-slate-700/50 rounded w-full"></div>
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

function CampaignCard({ campaign, featured = false, delay = 0, onDonate }) {
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
      } ${featured ? "lg:col-span-1" : ""}`}
      style={{ transitionDelay: `${delay}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Glow Effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>

      <div
        className={`relative bg-slate-900/90 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-xl group-hover:shadow-2xl transition-all duration-500 group-hover:scale-105 overflow-hidden ${
          featured ? "h-full" : ""
        }`}
      >
        {/* Image Section */}
        <div className={`relative overflow-hidden ${featured ? "h-64" : "h-48"}`}>
          <img
            src={campaign.image || "/placeholder.svg?height=300&width=400"}
            alt={campaign.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />

          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

          {/* Badges */}
          <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
            {featured && (
              <span className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 shadow-lg">
                ⭐ Featured
              </span>
            )}
            <span className="bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-lg ml-auto">
              🚨 Urgent
            </span>
          </div>

          {/* Floating particles effect */}
          {isHovered && (
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-white rounded-full animate-float opacity-60"
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
        <div className={`p-${featured ? "8" : "6"} space-y-${featured ? "6" : "4"}`}>
          {/* Location and Time */}
          <div className="flex items-center space-x-4 text-sm text-slate-400">
            <span className="flex items-center gap-1">
              <MapPin className="h-4 w-4 text-purple-400" />
              {campaign.location || "Global"}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4 text-pink-400" />
              {Math.floor(Math.random() * 30) + 5} days left
            </span>
          </div>

          {/* Title */}
          <h3
            className={`${
              featured ? "text-2xl" : "text-xl"
            } font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent group-hover:from-purple-300 group-hover:to-pink-300 transition-all duration-300 leading-tight`}
          >
            {campaign.title}
          </h3>

          {/* Description */}
          <p className="text-slate-300 leading-relaxed group-hover:text-slate-200 transition-colors duration-300">
            {campaign.description}
          </p>

          {/* Progress Section */}
          <div className="space-y-4">
            <div className="flex justify-between text-sm font-medium">
              <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                {formatCurrency(totalCollected)} raised
              </span>
              <span className="text-slate-400">of {formatCurrency(goal)} goal</span>
            </div>

            <AnimatedProgressBar percentage={percentage} delay={delay + 500} size={featured ? "large" : "small"} />

            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-400">{Math.floor(Math.random() * 500) + 100} donors</span>
              <span className="font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
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
        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-30"></div>

        <div className="relative">
          {/* Header */}
          <div className="p-6 pb-0">
            <div className="flex items-start justify-between">
              <div className="flex-1 pr-4">
                <h3 className="text-xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent mb-2">
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
                        ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white border-purple-500 shadow-lg"
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
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white border-purple-500 shadow-lg"
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
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
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

  const heroRef = useRef(null)
  const featuredRef = useRef(null)
  const allCampaignsRef = useRef(null)
  const ctaRef = useRef(null)

  const isHeroVisible = useIntersectionObserver(heroRef, { threshold: 0.1 })
  const isFeaturedVisible = useIntersectionObserver(featuredRef, { threshold: 0.1 })
  const isAllCampaignsVisible = useIntersectionObserver(allCampaignsRef, { threshold: 0.1 })
  const isCtaVisible = useIntersectionObserver(ctaRef, { threshold: 0.1 })

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

  const featuredCampaigns = campaigns.filter((campaign) => campaign.featured)
  const allCampaigns = campaigns

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Hero Section */}
      <div
        ref={heroRef}
        className={`relative h-96 overflow-hidden transition-all duration-1000 ${
          isHeroVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/80 via-pink-900/80 to-red-900/80"></div>
        <img src="/placeholder.svg?height=400&width=1200" alt="Hero" className="w-full h-full object-cover" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center space-y-6 max-w-4xl mx-auto px-4">
            <h1
              className={`text-5xl md:text-6xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent transition-all duration-1000 ${
                isHeroVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              }`}
            >
              Make a Difference Today
            </h1>
            <p
              className={`text-xl text-white/90 leading-relaxed transition-all duration-1000 delay-300 ${
                isHeroVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              }`}
            >
              Join thousands of changemakers supporting causes that matter. Every donation creates ripples of positive
              impact.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Featured Campaigns */}
        <div
          ref={featuredRef}
          className={`mb-16 transition-all duration-1000 ${
            isFeaturedVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent mb-4">
              Featured Campaigns
            </h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
              These urgent campaigns need your immediate support to reach their goals and create lasting impact.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {featuredCampaigns.map((campaign, index) => (
              <CampaignCard
                key={campaign.id}
                campaign={campaign}
                featured={true}
                delay={index * 200}
                onDonate={openDonationModal}
              />
            ))}
          </div>
        </div>

        {/* All Campaigns */}
        <div
          ref={allCampaignsRef}
          className={`mb-16 transition-all duration-1000 ${
            isAllCampaignsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent mb-12 text-center">
            All Active Campaigns
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {allCampaigns.map((campaign, index) => (
              <CampaignCard
                key={campaign.id}
                campaign={campaign}
                featured={false}
                delay={index * 150}
                onDonate={openDonationModal}
              />
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div
          ref={ctaRef}
          className={`transition-all duration-1000 ${
            isCtaVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-12 scale-95"
          }`}
        >
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>
            <div className="relative bg-gradient-to-r from-emerald-500/90 to-teal-600/90 backdrop-blur-xl rounded-2xl p-12 text-center text-white border border-emerald-500/20">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Make an Impact?</h2>
              <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto leading-relaxed">
                Every donation, no matter the size, creates ripples of positive change. Join our community of
                changemakers today.
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
            opacity: 0;
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
            opacity: 1;
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
      `}</style>
    </div>
  )
}
