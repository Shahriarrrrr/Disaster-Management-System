"use client"

import { useState, useEffect, useRef } from "react"
import {
  Heart,
  Users,
  Target,
  Clock,
  MapPin,
  Droplets,
  GraduationCap,
  Home,
  Leaf,
  Stethoscope,
  ArrowRight,
  Share2,
} from "lucide-react"
import { useLoaderData } from "react-router"

export default function Cause() {
  const [selectedAmount, setSelectedAmount] = useState("50")
  const [customAmount, setCustomAmount] = useState("")
  const [showDonationModal, setShowDonationModal] = useState(false)
  const [selectedCampaign, setSelectedCampaign] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [visibleElements, setVisibleElements] = useState(new Set())
  const observerRef = useRef(null)


  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleElements((prev) => new Set([...prev, entry.target.dataset.animateId]))
          }
        })
      },
      { threshold: 0.1, rootMargin: "50px" },
    )

    observerRef.current = observer

    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
      clearTimeout(timer)
    }
  }, [])

  // Function to observe elements
  const observeElement = (element) => {
    if (element && observerRef.current) {
      observerRef.current.observe(element)
    }
  }

  // const campaigns = [
  //   {
  //     id: 1,
  //     title: "Emergency Relief for Flood Victims",
  //     description:
  //       "Providing immediate aid including food, water, and shelter to families affected by recent flooding in the coastal regions.",
  //     image: "/placeholder.svg?height=300&width=400",
  //     category: "Disaster Relief",
  //     categoryIcon: Droplets,
  //     categoryColor: "bg-blue-500",
  //     raised: 75420,
  //     goal: 100000,
  //     donors: 1247,
  //     daysLeft: 12,
  //     location: "Coastal Region",
  //     urgency: "Critical",
  //     featured: true,
  //   },
  //   {
  //     id: 2,
  //     title: "Build Schools in Rural Communities",
  //     description:
  //       "Constructing educational facilities to provide quality education access for children in underserved rural areas.",
  //     image: "/placeholder.svg?height=300&width=400",
  //     category: "Education",
  //     categoryIcon: GraduationCap,
  //     categoryColor: "bg-emerald-500",
  //     raised: 45680,
  //     goal: 80000,
  //     donors: 892,
  //     daysLeft: 45,
  //     location: "Rural Districts",
  //     urgency: "Ongoing",
  //     featured: false,
  //   },
  //   {
  //     id: 3,
  //     title: "Clean Water Initiative",
  //     description:
  //       "Installing water purification systems and wells to provide clean, safe drinking water to communities in need.",
  //     image: "/placeholder.svg?height=300&width=400",
  //     category: "Water & Sanitation",
  //     categoryIcon: Droplets,
  //     categoryColor: "bg-cyan-500",
  //     raised: 32150,
  //     goal: 60000,
  //     donors: 567,
  //     daysLeft: 28,
  //     location: "Multiple Villages",
  //     urgency: "High",
  //     featured: false,
  //   },
  //   {
  //     id: 4,
  //     title: "Mobile Medical Clinics",
  //     description:
  //       "Bringing healthcare services directly to remote communities through fully equipped mobile medical units.",
  //     image: "/placeholder.svg?height=300&width=400",
  //     category: "Healthcare",
  //     categoryIcon: Stethoscope,
  //     categoryColor: "bg-red-500",
  //     raised: 89200,
  //     goal: 120000,
  //     donors: 1456,
  //     daysLeft: 21,
  //     location: "Remote Areas",
  //     urgency: "High",
  //     featured: true,
  //   },
  //   {
  //     id: 5,
  //     title: "Homeless Shelter Expansion",
  //     description:
  //       "Expanding shelter capacity and services to provide safe housing and support for homeless individuals and families.",
  //     image: "/placeholder.svg?height=300&width=400",
  //     category: "Housing",
  //     categoryIcon: Home,
  //     categoryColor: "bg-orange-500",
  //     raised: 67890,
  //     goal: 95000,
  //     donors: 1123,
  //     daysLeft: 35,
  //     location: "City Center",
  //     urgency: "Ongoing",
  //     featured: false,
  //   },
  //   {
  //     id: 6,
  //     title: "Reforestation Project",
  //     description:
  //       "Planting native trees and restoring degraded forest areas to combat climate change and preserve biodiversity.",
  //     image: "/placeholder.svg?height=300&width=400",
  //     category: "Environment",
  //     categoryIcon: Leaf,
  //     categoryColor: "bg-green-500",
  //     raised: 23450,
  //     goal: 50000,
  //     donors: 678,
  //     daysLeft: 60,
  //     location: "National Forest",
  //     urgency: "Ongoing",
  //     featured: false,
  //   },
  // ]

    const causes = useLoaderData()
    const camp = causes?.causes || [];


  // const getUrgencyColor = (urgency) => {
  //   switch (urgency) {
  //     case "Critical":
  //       return "bg-red-100 text-red-800 border-red-200"
  //     case "High":
  //       return "bg-orange-100 text-orange-800 border-orange-200"
  //     case "Ongoing":
  //       return "bg-green-100 text-green-800 border-green-200"
  //     default:
  //       return "bg-gray-100 text-gray-800 border-gray-200"
  //   }
  // }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const calculateProgress = (raised, goal) => {
    return Math.min((raised / goal) * 100, 100)
  }

  const donationAmounts = ["25", "50", "100", "250", "500"]

  const openDonationModal = (campaign) => {
    setSelectedCampaign(campaign)
    setShowDonationModal(true)
  }

  const closeDonationModal = () => {
    setShowDonationModal(false)
    setSelectedCampaign(null)
    setSelectedAmount("50")
    setCustomAmount("")
  }

  const LoadingSkeleton = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Hero Skeleton */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-500 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="h-16 bg-white/20 rounded-lg mb-6 animate-pulse"></div>
          <div className="h-8 bg-white/20 rounded-lg mb-8 max-w-3xl mx-auto animate-pulse"></div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <div className="h-6 w-48 bg-white/20 rounded animate-pulse"></div>
            <div className="h-6 w-48 bg-white/20 rounded animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <div className="h-12 bg-gray-200 rounded-lg mb-4 max-w-md mx-auto animate-pulse"></div>
          <div className="h-6 bg-gray-200 rounded-lg max-w-2xl mx-auto animate-pulse"></div>
        </div>

        {/* Featured Campaign Skeletons */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {[1, 2].map((i) => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-xl">
              <div className="h-64 bg-gray-200 animate-pulse"></div>
              <div className="p-6 space-y-4">
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-20 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-3 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Campaign Grid Skeletons */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-xl overflow-hidden shadow-lg">
              <div className="h-48 bg-gray-200 animate-pulse"></div>
              <div className="p-5 space-y-3">
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-16 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-2 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const DonationModal = () => {
    if (!showDonationModal || !selectedCampaign) return null

    return (
      <div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={closeDonationModal}
      >
        <div
          className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto relative"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6 pb-0 relative">
            <h3 className="text-xl font-bold text-gray-900 mb-2 pr-8">Support: {selectedCampaign.title}</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Choose your donation amount to help us reach our goal of {formatCurrency(selectedCampaign.goal)}.
            </p>
            <button
              className="absolute top-0 right-0 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 text-2xl"
              onClick={closeDonationModal}
            >
              ×
            </button>
          </div>

          <div className="p-6 space-y-6">
            <div>
              <label className="block text-base font-medium text-gray-900 mb-3">Select Amount</label>
              <div className="grid grid-cols-3 gap-3">
                {donationAmounts.map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    className={`px-3 py-2 text-sm font-medium border rounded-lg cursor-pointer transition-all ${
                      selectedAmount === amount
                        ? "bg-purple-600 text-white border-purple-600"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                    }`}
                    onClick={() => setSelectedAmount(amount)}
                  >
                    ${amount}
                  </button>
                ))}
                <button
                  type="button"
                  className={`px-3 py-2 text-sm font-medium border rounded-lg cursor-pointer transition-all ${
                    selectedAmount === "custom"
                      ? "bg-purple-600 text-white border-purple-600"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                  onClick={() => setSelectedAmount("custom")}
                >
                  Custom
                </button>
              </div>
            </div>

            {selectedAmount === "custom" && (
              <div>
                <label htmlFor="customAmount" className="block font-medium text-gray-900 mb-1">
                  Custom Amount
                </label>
                <input
                  id="customAmount"
                  type="number"
                  placeholder="Enter amount"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
            )}

            <div className="space-y-3 text-center">
              <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-6 rounded-lg transition-all">
                Donate ${selectedAmount === "custom" ? customAmount || "0" : selectedAmount}
              </button>
              <p className="text-xs text-gray-500">Your donation is secure and will be processed immediately.</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return <LoadingSkeleton />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Hero Section */}
      <div className="carousel w-full">
  <div id="slide1" className="carousel-item relative w-full">
    <img
      src="https://img.daisyui.com/images/stock/photo-1625726411847-8cbb60cc71e6.webp"
      className="w-full" />
    <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
      <a href="#slide4" className="btn btn-circle">❮</a>
      <a href="#slide2" className="btn btn-circle">❯</a>
    </div>
  </div>
  <div id="slide2" className="carousel-item relative w-full">
    <img
      src="https://img.daisyui.com/images/stock/photo-1609621838510-5ad474b7d25d.webp"
      className="w-full" />
    <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
      <a href="#slide1" className="btn btn-circle">❮</a>
      <a href="#slide3" className="btn btn-circle">❯</a>
    </div>
  </div>
  <div id="slide3" className="carousel-item relative w-full">
    <img
      src="https://img.daisyui.com/images/stock/photo-1414694762283-acccc27bca85.webp"
      className="w-full" />
    <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
      <a href="#slide2" className="btn btn-circle">❮</a>
      <a href="#slide4" className="btn btn-circle">❯</a>
    </div>
  </div>
  <div id="slide4" className="carousel-item relative w-full">
    <img
      src="https://img.daisyui.com/images/stock/photo-1665553365602-b2fb8e5d1707.webp"
      className="w-full" />
    <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
      <a href="#slide3" className="btn btn-circle">❮</a>
      <a href="#slide1" className="btn btn-circle">❯</a>
    </div>
  </div>
</div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Featured Campaigns */}
        <div
          className={`text-center mb-12 transition-all duration-1000 ${
            visibleElements.has("featured-header") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          data-animate-id="featured-header"
          ref={observeElement}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Featured Campaigns</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            These urgent campaigns need your immediate support to reach their goals and create lasting impact.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/*--FCK1-*/}
          {camp
            .filter((camps) => camps.featured)
            .map((camps, index) => (
              <div
                key={camps.id}
                className={`bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-700 group ${
                  visibleElements.has(`featured-${camps.id}`)
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-12"
                }`}
                style={{ transitionDelay: `${index * 200}ms` }}
                data-animate-id={`featured-${camps.id}`}
                ref={observeElement}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={camps.image || "/placeholder.svg"}
                    alt={camps.title}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                    <span
                      className={`bg-blue-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transform translate-x-[-100px] opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500`}
                    >
                      <Droplets className="h-3 w-3"></Droplets>
                      {/* <campaign.categoryIcon className="h-3 w-3" /> */}
                      {"Urgent"}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-lg text-xs font-semibold border bg-blue-500 transform translate-x-[100px] opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500`}
                    >
                      {"urgent"}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-100">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {camps.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {1000} days left
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 mb-3 leading-tight">{camps.title}</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">{camps.description}</p>

                  <div className="space-y-4">
                    <div className="flex justify-between text-sm font-medium">
                      <span className="text-gray-900">{formatCurrency("10000")} raised</span>
                      <span className="text-gray-500">of {formatCurrency(`10000`)} goal</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-1000 ease-out"
                        style={{
                          width: visibleElements.has(`featured-${camps.id}`)
                            ? `${calculateProgress('1000', '10000')}%` //Nedd Changes Here and Below near funded
                            : "0%",
                        }}
                      ></div>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      {/* <span className="text-gray-500">{campaign.donors.toLocaleString()} donors</span> */}
                      <span className="font-medium text-purple-600">
                        {Math.round(calculateProgress(1000, camps.goal))}% funded 
                      </span>
                    </div>
                  </div>

                  <div className="flex space-x-3 mt-6">
                    <button
                      className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-6 rounded-lg transition-all transform hover:-translate-y-1 hover:shadow-lg active:scale-95"
                      onClick={() => openDonationModal(camps)}
                    >
                      Donate Now
                    </button>
                    <button className="bg-white border border-gray-300 hover:bg-gray-50 p-3 rounded-lg transition-all flex items-center justify-center hover:scale-110 active:scale-95">
                      <Share2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>

        {/* All Campaigns */}
        <div className="mb-12">
          <h2
            className={`text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center transition-all duration-1000 ${
              visibleElements.has("all-campaigns-header") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
            data-animate-id="all-campaigns-header"
            ref={observeElement}
          >
            All Active Campaigns
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {camp
              .map((camps, index) => (
                <div
                  key={camps.id}
                  className={`bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-700 group ${
                    visibleElements.has(`campaign-${camps.id}`)
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-12"
                  }`}
                  style={{ transitionDelay: `${index * 150}ms` }}
                  data-animate-id={`campaign-${camps.id}`}
                  ref={observeElement}
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={camps.image || "/placeholder.svg"}
                      alt={camps.title}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 right-3 flex justify-between items-start opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {/* <span
                        className={`${campaign.categoryColor} text-white px-2 py-1 rounded text-xs font-semibold flex items-center gap-1`}
                      >
                        <campaign.categoryIcon className="h-3 w-3" />
                        {campaign.category}
                      </span> */}
                      {/* <span
                        className={`px-2 py-1 rounded text-xs font-semibold border ${getUrgencyColor(campaign.urgency)}`}
                      >
                        {campaign.urgency}
                      </span> */}
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="flex items-center space-x-3 text-xs text-gray-500 mb-2">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {camps.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {'10'} days left
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-gray-900 mb-2 leading-tight line-clamp-2">
                      {camps.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-3">{camps.description}</p>

                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium text-gray-900">{formatCurrency(camps.updates?.[0]?.total_collected)}</span>
                        <span className="text-gray-500">of {formatCurrency(camps.goal_amount)}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-1000 ease-out"
                          style={{
                            width: visibleElements.has(`campaign-${camps.id}`)
                              ? `${calculateProgress(parseInt(camps.updates?.[0]?.total_collected), camps.goal)}%`
                              : "0%",
                          }}
                        ></div>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        {/* <span className="text-gray-500">{campaign.donors.toLocaleString()} donors</span> FUCK*/}

                        
                        <span className="font-medium text-purple-600">
                          {Math.round(calculateProgress(camps.updates?.[0]?.total_collected, camps.goal))}% funded
                        </span>
                      </div>
                    </div>

                    <div className="flex space-x-2 mt-4">
                      <button
                        className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-all text-sm transform hover:-translate-y-0.5 active:scale-95"
                        onClick={() => openDonationModal(camps)}
                      >
                        Donate Now
                      </button>
                      <button className="bg-white border border-gray-300 hover:bg-gray-50 p-2.5 rounded-lg transition-all flex items-center justify-center hover:scale-110 active:scale-95">
                        <Share2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Call to Action */}
        <div
          className={`bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-8 md:p-12 text-center text-white transition-all duration-1000 ${
            visibleElements.has("cta") ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-12 scale-95"
          }`}
          data-animate-id="cta"
          ref={observeElement}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Make an Impact?</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto leading-relaxed">
            Every donation, no matter the size, creates ripples of positive change. Join our community of changemakers
            today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-emerald-600 hover:bg-gray-100 font-semibold py-3 px-6 rounded-lg transition-all flex items-center justify-center gap-2 transform hover:-translate-y-1 hover:shadow-lg active:scale-95">
              <Heart className="h-5 w-5" />
              Start a Campaign
            </button>
            <button className="border border-white text-white hover:bg-white hover:text-emerald-600 font-semibold py-3 px-6 rounded-lg transition-all flex items-center justify-center gap-2 transform hover:-translate-y-1 active:scale-95">
              Learn More
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <DonationModal />
    </div>
  )
}
