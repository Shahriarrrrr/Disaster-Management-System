"use client"

import { useState, useEffect, useRef } from "react"
import { Heart, Shield, Users, Clock, Leaf, Zap } from "lucide-react"

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
      className="relative w-full bg-slate-800/50 rounded-full h-3 overflow-hidden backdrop-blur-sm"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/20 to-teal-600/20 rounded-full"></div>
      <div
        className="h-full bg-gradient-to-r from-emerald-500 via-teal-500 to-green-500 rounded-full shadow-lg transition-all duration-2000 ease-out relative overflow-hidden"
        style={{ width: `${animatedPercentage}%` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 opacity-50 blur-sm"></div>
      </div>
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900">
      <div className="h-96 bg-slate-800/50 animate-pulse relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/20 to-teal-600/20"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="h-16 bg-slate-700/50 rounded-lg w-96 mx-auto"></div>
            <div className="h-8 bg-slate-700/30 rounded-lg w-80 mx-auto"></div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700 animate-pulse">
              <div className="space-y-6">
                <div className="h-8 bg-slate-700/50 rounded w-48"></div>
                <div className="h-32 bg-slate-700/30 rounded"></div>
                <div className="h-48 bg-slate-700/30 rounded"></div>
              </div>
            </div>
          </div>
          <div className="space-y-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700 animate-pulse">
                <div className="h-6 bg-slate-700/50 rounded w-32 mb-4"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-slate-700/30 rounded"></div>
                  <div className="h-4 bg-slate-700/30 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
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

function HopePulse() {
  return (
    <div className="absolute top-4 right-4">
      <div className="relative">
        <div className="w-4 h-4 bg-emerald-500 rounded-full animate-ping"></div>
        <div className="absolute top-0 left-0 w-4 h-4 bg-emerald-500 rounded-full animate-pulse"></div>
      </div>
    </div>
  )
}

function GrowthWave() {
  return (
    <div className="absolute bottom-0 left-0 right-0 overflow-hidden">
      <svg className="w-full h-16 text-emerald-500/20" viewBox="0 0 1200 120" preserveAspectRatio="none">
        <path
          d="M0,60 C150,100 350,0 600,60 C850,120 1050,20 1200,60 L1200,120 L0,120 Z"
          fill="currentColor"
          className="animate-wave"
        />
      </svg>
    </div>
  )
}

const DonationPage = () => {
  const [selectedAmount, setSelectedAmount] = useState(50)
  const [customAmount, setCustomAmount] = useState("")
  const [donationType, setDonationType] = useState("one-time")
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [loading, setLoading] = useState(false)
  const [isPageLoading, setIsPageLoading] = useState(true)

  const heroRef = useRef(null)
  const formRef = useRef(null)
  const sidebarRef = useRef(null)

  const isHeroVisible = useIntersectionObserver(heroRef, { threshold: 0.1 })
  const isFormVisible = useIntersectionObserver(formRef, { threshold: 0.1 })
  const isSidebarVisible = useIntersectionObserver(sidebarRef, { threshold: 0.1 })

  const predefinedAmounts = [25, 50, 100, 250, 500, 1000]

  const impactData = [
    { amount: 25, impact: "Provides clean water for 5 families for a week", icon: "💧" },
    { amount: 50, impact: "Supplies emergency food for 10 people for 3 days", icon: "🍞" },
    { amount: 100, impact: "Delivers medical supplies to a disaster zone", icon: "🏥" },
    { amount: 250, impact: "Builds temporary shelter for a displaced family", icon: "🏠" },
    { amount: 500, impact: "Funds emergency response team for 24 hours", icon: "🚑" },
    { amount: 1000, impact: "Establishes a relief distribution center", icon: "🏢" },
  ]

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoading(false)
    }, 1500)
    return () => clearTimeout(timer)
  }, [])

  const getCurrentImpact = () => {
    const amount = customAmount ? Number.parseInt(customAmount) : selectedAmount
    const impact = impactData.find((item) => item.amount <= amount)
    return impact || { impact: "Makes a significant difference in disaster relief efforts", icon: "🌱" }
  }

  const handleDonate = async () => {
    setLoading(true)
    const token = localStorage.getItem("access")
    const donationAmount = customAmount ? Number.parseInt(customAmount) : selectedAmount 

    try {
      const response = await fetch("http://127.0.0.1:8000/donation/api/donation/initiate/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          donation_cause: 1,
          donation_amount: donationAmount,
          cus_phone: "01722382459",
          donor_remarks: "Hope and recovery donation",
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to process donation")
      }

      const data = await response.json()

      if (data.payment_url) {
        window.location.href = data.payment_url
      } else {
        console.error("No redirect URL returned.")
      }
    } catch (error) {
      console.error("Donation error:", error)
      alert("Donation failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (isPageLoading) {
    return <LoadingSkeleton />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-green-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Hero Section */}
      <div
        ref={heroRef}
        className="relative bg-gradient-to-r from-emerald-600/90 via-teal-600/90 to-green-600/90 backdrop-blur-sm overflow-hidden"
      >
        <div className="absolute inset-0 bg-black/20"></div>
        <HopePulse />
        <GrowthWave />

        <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-24">
          <div
            className={`text-center transition-all duration-1000 ${
              isHeroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
            }`}
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <Leaf className="w-8 h-8 text-green-300 animate-pulse" />
              <span className="bg-emerald-500 text-white px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider">
                Hope & Recovery
              </span>
              <Leaf className="w-8 h-8 text-green-300 animate-pulse" />
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-emerald-200 to-teal-200 bg-clip-text text-transparent">
              Plant Seeds of Hope
              <span className="block text-emerald-200 animate-pulse">Today</span>
            </h1>

            <p className="text-xl md:text-2xl text-emerald-100 mb-8 max-w-3xl mx-auto leading-relaxed">
              Your donation nurtures recovery and rebuilds communities affected by disasters. Together, we grow hope and
              create lasting positive change.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center text-sm">
              <div className="flex items-center gap-2 bg-emerald-500/20 backdrop-blur-sm rounded-full px-4 py-2 border border-emerald-400/30">
                <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
                <span className="text-emerald-200">100% of donations go directly to relief efforts</span>
              </div>
              <div className="flex items-center gap-2 bg-teal-500/20 backdrop-blur-sm rounded-full px-4 py-2 border border-teal-400/30">
                <div className="w-3 h-3 bg-teal-400 rounded-full animate-pulse"></div>
                <span className="text-teal-200">Trusted by 50,000+ donors worldwide</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Donation Form */}
          <div
            ref={formRef}
            className={`lg:col-span-2 transition-all duration-1000 ${
              isFormVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
              <div className="relative bg-slate-900/90 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-2xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Zap className="w-6 h-6 text-emerald-400" />
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-emerald-200 bg-clip-text text-transparent">
                    Make a Difference
                  </h2>
                </div>

                {/* Donation Type */}
                <div className="mb-8">
                  <div className="flex gap-4 mb-6">
                    <button
                      onClick={() => setDonationType("one-time")}
                      className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                        donationType === "one-time"
                          ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg"
                          : "bg-slate-800/50 text-slate-300 hover:bg-slate-700/50 border border-slate-600"
                      }`}
                    >
                      One-time
                    </button>
                    <button
                      onClick={() => setDonationType("monthly")}
                      className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                        donationType === "monthly"
                          ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg"
                          : "bg-slate-800/50 text-slate-300 hover:bg-slate-700/50 border border-slate-600"
                      }`}
                    >
                      Monthly
                    </button>
                  </div>
                  {donationType === "monthly" && (
                    <div className="bg-emerald-500/20 border border-emerald-400/30 rounded-xl p-4 backdrop-blur-sm">
                      <div className="flex items-center gap-2 text-emerald-300">
                        <Heart className="w-5 h-5" />
                        <span className="font-medium">Monthly donors provide 3x more sustainable impact over time</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Amount Selection */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-white mb-4">Select Amount</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                    {predefinedAmounts.map((amount) => (
                      <button
                        key={amount}
                        onClick={() => {
                          setSelectedAmount(amount)
                          setCustomAmount("")
                        }}
                        className={`p-4 rounded-xl border-2 font-semibold transition-all duration-300 transform hover:scale-105 ${
                          selectedAmount === amount && !customAmount
                            ? "border-emerald-500 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-300 shadow-lg"
                            : "border-slate-600 bg-slate-800/50 hover:border-slate-500 text-slate-300 hover:bg-slate-700/50"
                        }`}
                      >
                        ${amount}
                      </button>
                    ))}
                  </div>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 font-medium">
                      BDT 
                    </span>
                    <input
                      type="number"
                      placeholder="Custom amount"
                      value={customAmount}
                      onChange={(e) => {
                        setCustomAmount(e.target.value)
                        setSelectedAmount(0)
                      }}
                      className="w-full pl-8 pr-4 py-4 bg-slate-800/50 border-2 border-slate-600 rounded-xl text-white placeholder-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all backdrop-blur-sm"
                    />
                  </div>
                </div>

                {/* Impact Display */}
                <div className="mb-8 relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl blur opacity-20 group-hover:opacity-30 transition duration-500"></div>
                  <div className="relative p-6 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 backdrop-blur-sm rounded-xl border border-emerald-400/30">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{getCurrentImpact().icon}</span>
                      <h4 className="font-semibold text-emerald-300">Your Impact</h4>
                    </div>
                    <p className="text-emerald-200">{getCurrentImpact().impact}</p>
                  </div>
                </div>

                {/* Donor Information */}
                {/* <div className="mb-8">
                  <h3 className="text-lg font-semibold text-white mb-4">Donor Information</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">First Name</label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all backdrop-blur-sm"
                        placeholder="John"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Last Name</label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all backdrop-blur-sm"
                        placeholder="Doe"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
                      <input
                        type="email"
                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all backdrop-blur-sm"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>
                </div> */}

                {/* Payment Method */}
                {/* <div className="mb-8">
                  <h3 className="text-lg font-semibold text-white mb-4">Payment Method</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
                    {[
                      { id: "card", label: "Credit Card", icon: "💳" },
                      { id: "paypal", label: "PayPal", icon: "🅿️" },
                      { id: "bank", label: "Bank Transfer", icon: "🏦" },
                    ].map((method) => (
                      <button
                        key={method.id}
                        onClick={() => setPaymentMethod(method.id)}
                        className={`p-4 rounded-xl border-2 font-medium transition-all duration-300 flex items-center justify-center gap-2 transform hover:scale-105 ${
                          paymentMethod === method.id
                            ? "border-emerald-500 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-300 shadow-lg"
                            : "border-slate-600 bg-slate-800/50 hover:border-slate-500 text-slate-300 hover:bg-slate-700/50"
                        }`}
                      >
                        <span className="text-lg">{method.icon}</span>
                        {method.label}
                      </button>
                    ))}
                  </div>

                  {paymentMethod === "card" && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Card Number</label>
                        <input
                          type="text"
                          className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all backdrop-blur-sm"
                          placeholder="1234 5678 9012 3456"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-2">Expiry Date</label>
                          <input
                            type="text"
                            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all backdrop-blur-sm"
                            placeholder="MM/YY"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-2">CVV</label>
                          <input
                            type="text"
                            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all backdrop-blur-sm"
                            placeholder="123"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div> */}

                {/* Privacy & Terms */}
                <div className="mb-8">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      className="mt-1 w-4 h-4 text-emerald-600 rounded bg-slate-800 border-slate-600"
                    />
                    <span className="text-sm text-slate-300">
                      I agree to the{" "}
                      <a href="#" className="text-emerald-400 hover:text-emerald-300 hover:underline">
                        Terms of Service
                      </a>{" "}
                      and{" "}
                      <a href="#" className="text-emerald-400 hover:text-emerald-300 hover:underline">
                        Privacy Policy
                      </a>
                    </span>
                  </label>
                </div>

                {/* Donate Button */}
                <button
                  onClick={handleDonate}
                  disabled={loading}
                  className="w-full group relative py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative flex items-center justify-center gap-2">
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        🌱 Donate ${customAmount || selectedAmount} {donationType === "monthly" ? "Monthly" : "Now"}
                      </>
                    )}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div
            ref={sidebarRef}
            className={`space-y-8 transition-all duration-1000 ${
              isSidebarVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            {/* Current Campaign */}
            <AnimatedCard delay={200}>
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
                <div className="relative bg-slate-900/90 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-xl p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Leaf className="w-5 h-5 text-emerald-400" />
                    <h3 className="text-lg font-bold text-white">Recovery in Progress</h3>
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse ml-auto"></div>
                  </div>
                  <div className="relative overflow-hidden rounded-xl mb-4">
                    <img
                      src="/placeholder.svg?height=200&width=400"
                      alt="Recovery efforts"
                      className="w-full h-40 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  </div>
                  <h4 className="font-semibold text-white mb-2">Rebuilding Communities in Turkey</h4>
                  <p className="text-slate-300 text-sm mb-4">
                    Supporting families as they rebuild their lives and communities with hope and resilience.
                  </p>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Raised</span>
                      <span className="font-semibold text-white">BDT 2,847,392</span>
                    </div>
                    <AnimatedProgressBar percentage={71} delay={500} />
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Goal: BDT 4,000,000</span>
                      <span className="text-emerald-400 font-semibold">71% funded</span>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedCard>

            {/* Trust Indicators */}
            <AnimatedCard delay={400}>
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
                <div className="relative bg-slate-900/90 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-xl p-6">
                  <h3 className="text-lg font-bold text-white mb-4">Why Trust Us?</h3>
                  <div className="space-y-4">
                    {[
                      {
                        icon: Shield,
                        title: "100% Transparent",
                        description: "Every dollar is tracked and reported",
                        color: "emerald",
                      },
                      {
                        icon: Shield,
                        title: "Secure Payments",
                        description: "Bank-level encryption protects your data",
                        color: "teal",
                      },
                      {
                        icon: Users,
                        title: "Global Impact",
                        description: "Creating positive change in 50+ countries",
                        color: "green",
                      },
                    ].map((item, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center flex-shrink-0 border border-emerald-400/30">
                          <item.icon className="w-4 h-4 text-emerald-400" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-white">{item.title}</h4>
                          <p className="text-sm text-slate-300">{item.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </AnimatedCard>

            {/* Recent Donors */}
            <AnimatedCard delay={600}>
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
                <div className="relative bg-slate-900/90 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-xl p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Heart className="w-5 h-5 text-emerald-400" />
                    <h3 className="text-lg font-bold text-white">Recent Supporters</h3>
                  </div>
                  <div className="space-y-3">
                    {[
                      { name: "Sarah M.", amount: 100, time: "2 minutes ago" },
                      { name: "John D.", amount: 50, time: "5 minutes ago" },
                      { name: "Anonymous", amount: 250, time: "8 minutes ago" },
                      { name: "Maria L.", amount: 75, time: "12 minutes ago" },
                    ].map((donor, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                            {donor.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-medium text-white">{donor.name}</div>
                            <div className="text-xs text-slate-400 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {donor.time}
                            </div>
                          </div>
                        </div>
                        <div className="font-semibold text-emerald-400">${donor.amount}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </AnimatedCard>
          </div>
        </div>
      </div>

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
        @keyframes wave {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
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
        .animate-wave {
          animation: wave 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}

export default DonationPage
