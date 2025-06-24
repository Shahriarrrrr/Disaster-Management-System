"use client"

import { useState, useEffect, useRef } from "react"
import { useLoaderData } from "react-router"
import api from "../../api"

function getAvailableMonths(donations) {
  const months = new Set()
  donations.forEach((donation) => {
    const date = new Date(donation.donated_at)
    const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
    months.add(monthYear)
  })
  return Array.from(months).sort().reverse()
}

async function getDonorNameandImage(id) {
  try {
    const userRes = await api.get(`donation/api/public-donors/${id}/`)
    return {
      userData: userRes.data,
    }
  } catch (error) {
    console.error("Loader error:", error)
    throw new Error("Failed to load donor data")
  }
}

function filterDonationsByMonth(donations, selectedMonth) {
  if (selectedMonth === "all") return donations

  return donations.filter((donation) => {
    const date = new Date(donation.donated_at)
    const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
    return monthYear === selectedMonth
  })
}

function formatMonthDisplay(monthYear) {
  if (monthYear === "all") return "All Time"
  const [year, month] = monthYear.split("-")
  const date = new Date(year, month - 1)
  return date.toLocaleDateString("en-US", { year: "numeric", month: "long" })
}

function processDonationData(donData) {
  const successfulDonations = donData.filter((donation) => donation.status === "Success")
  const donorMap = new Map()

  successfulDonations.forEach((donation) => {
    const donorName = donation.donor_name
    const amount = Number.parseFloat(donation.donation_amount)
    const donatedAt = new Date(donation.donated_at)
    const donorID = donation.donor

    if (donorMap.has(donorName)) {
      const existing = donorMap.get(donorName)
      existing.totalAmount += amount
      existing.donationCount += 1
      existing.causes.add(donation.donation_cause_display)
      if (donatedAt < existing.firstDonation) {
        existing.firstDonation = donatedAt
      }
      if (donatedAt > existing.lastDonation) {
        existing.lastDonation = donatedAt
      }
    } else {
      donorMap.set(donorName, {
        name: donorName,
        realId: donorID,
        totalAmount: amount,
        donationCount: 1,
        causes: new Set([donation.donation_cause_display]),
        firstDonation: donatedAt,
        lastDonation: donatedAt,
        avatar: "/placeholder.svg?height=60&width=60",
      })
    }
  })

  const leaderboardData = Array.from(donorMap.values())
    .sort((a, b) => b.totalAmount - a.totalAmount)
    .map((donor, index) => ({
      id: index + 1,
      name: donor.name,
      username: `@${donor.name.toLowerCase().replace(/\s+/g, "")}`,
      score: donor.totalAmount,
      rank: index + 1,
      totalTime: calculateTimeSinceFirst(donor.firstDonation),
      challenges: donor.donationCount,
      causes: Array.from(donor.causes),
      avatar: donor.avatar,
      realId: donor.realId,
    }))

  return leaderboardData
}

function calculateTimeSinceFirst(firstDonation) {
  const now = new Date()
  const diffMs = now - firstDonation
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))

  if (diffDays > 0) {
    return `${diffDays}d ${diffHours}h ${diffMinutes}m`
  } else {
    return `${diffHours}h ${diffMinutes}m`
  }
}

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header Skeleton */}
        <div className="text-center mb-8 animate-pulse">
          <div className="h-12 bg-slate-700/50 rounded-lg w-96 mx-auto mb-4"></div>
          <div className="h-6 bg-slate-700/30 rounded w-64 mx-auto mb-2"></div>
          <div className="h-4 bg-slate-700/20 rounded w-48 mx-auto"></div>
        </div>

        {/* Filter Skeleton */}
        <div className="mb-8 flex justify-center">
          <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4 animate-pulse">
            <div className="h-4 bg-slate-700/50 rounded w-24 mb-2"></div>
            <div className="h-10 bg-slate-700/30 rounded w-48"></div>
          </div>
        </div>

        {/* Top 3 Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-slate-800/50 rounded-xl p-6 h-64 border border-slate-700 animate-pulse">
              <div className="flex flex-col items-center space-y-4">
                <div className="w-16 h-16 bg-slate-700/50 rounded-full"></div>
                <div className="h-6 bg-slate-700/40 rounded w-24"></div>
                <div className="h-4 bg-slate-700/30 rounded w-16"></div>
                <div className="h-8 bg-slate-700/40 rounded w-20"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Table Skeleton */}
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
          <div className="p-6 space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center space-x-4 animate-pulse">
                <div className="w-8 h-8 bg-slate-700/50 rounded"></div>
                <div className="w-10 h-10 bg-slate-700/50 rounded-full"></div>
                <div className="h-6 bg-slate-700/40 rounded flex-1"></div>
                <div className="h-6 bg-slate-700/30 rounded w-24"></div>
                <div className="h-6 bg-slate-700/30 rounded w-16"></div>
                <div className="h-6 bg-slate-700/40 rounded w-20"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function MonthFilter({ availableMonths, selectedMonth, onMonthChange }) {
  const filterRef = useRef(null)
  const isVisible = useIntersectionObserver(filterRef, { threshold: 0.1 })

  return (
    <div
      ref={filterRef}
      className={`mb-12 flex justify-center transition-all duration-1000 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
        <div className="relative bg-slate-900/90 backdrop-blur-xl rounded-xl border border-slate-700/50 p-6 shadow-2xl">
          <label htmlFor="month-filter" className="block text-slate-300 text-sm font-medium mb-3 tracking-wide">
            Filter by Month
          </label>
          <select
            id="month-filter"
            value={selectedMonth}
            onChange={(e) => onMonthChange(e.target.value)}
            className="bg-slate-800/80 text-white border border-slate-600/50 rounded-xl px-6 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent min-w-[240px] transition-all duration-300 hover:bg-slate-700/80 backdrop-blur-sm"
          >
            <option value="all">All Time</option>
            {availableMonths.map((month) => (
              <option key={month} value={month}>
                {formatMonthDisplay(month)}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}

function TopThreeCard({ player, position, userImages, delay = 0 }) {
  const cardRef = useRef(null)
  const isVisible = useIntersectionObserver(cardRef, { threshold: 0.1 })

  const getCardHeight = () => {
    if (position === 1) return "h-80"
    if (position === 2) return "h-72"
    return "h-64"
  }

  const getRankBadgeColor = () => {
    if (position === 1) return "bg-gradient-to-r from-yellow-400 to-yellow-600"
    if (position === 2) return "bg-gradient-to-r from-gray-300 to-gray-500"
    return "bg-gradient-to-r from-amber-500 to-orange-600"
  }

  const getGlowColor = () => {
    if (position === 1) return "shadow-yellow-500/25"
    if (position === 2) return "shadow-gray-400/25"
    return "shadow-amber-500/25"
  }

  const handleImageError = (e) => {
    e.target.src = "/placeholder.svg?height=60&width=60"
  }

  const playerImage = userImages[player.realId] || player.avatar

  return (
    <div
      ref={cardRef}
      className={`relative group transition-all duration-1000 ${
        isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-12 scale-95"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {/* Glow Effect */}
      <div
        className={`absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 ${getGlowColor()}`}
      ></div>

      <div
        className={`relative bg-slate-900/90 backdrop-blur-xl rounded-2xl p-8 ${getCardHeight()} flex flex-col items-center justify-between border border-slate-700/50 shadow-2xl group-hover:shadow-3xl transition-all duration-500 group-hover:scale-105`}
      >
        {/* Rank Badge */}
        <div
          className={`absolute -top-3 -right-3 ${getRankBadgeColor()} text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg transform group-hover:scale-110 transition-transform duration-300`}
        >
          #{player.rank}
        </div>

        {/* Crown for #1 */}
        {position === 1 && (
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
            <div className="text-yellow-400 text-2xl animate-bounce">👑</div>
          </div>
        )}

        <div className="flex flex-col items-center space-y-4">
          {/* Profile Image */}
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
            <img
              src={playerImage || "/placeholder.svg?height=60&width=60"}
              alt={player.name}
              className="relative w-20 h-20 rounded-full border-4 border-slate-600/50 object-cover shadow-xl group-hover:border-purple-500/50 transition-all duration-500"
              onError={handleImageError}
            />
          </div>

          {/* Name and Username */}
          <div className="text-center space-y-2">
            <h3 className="text-white font-bold text-lg tracking-wide group-hover:text-purple-300 transition-colors duration-300">
              {player.name}
            </h3>
            <span className="text-slate-400 text-sm font-medium">{player.username}</span>
          </div>
        </div>

        {/* Amount */}
        <div className="text-center space-y-2">
          <div className="text-slate-400 text-xs uppercase tracking-wider font-medium">Total Donated</div>
          <div className="text-white font-bold text-xl bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            {formatCurrency(player.score)}
          </div>
        </div>
      </div>
    </div>
  )
}

function LeaderboardRow({ player, userImages, index }) {
  const rowRef = useRef(null)
  const isVisible = useIntersectionObserver(rowRef, { threshold: 0.1 })

  const handleImageError = (e) => {
    e.target.src = "/placeholder.svg?height=60&width=60"
  }

  const playerImage = userImages[player.realId] || player.avatar

  return (
    <tr
      ref={rowRef}
      className={`border-b border-slate-700/50 hover:bg-slate-800/30 transition-all duration-500 group ${
        isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <td className="px-8 py-6">
        <div className="text-white font-bold text-lg group-hover:text-purple-300 transition-colors duration-300">
          {player.rank}
        </div>
      </td>
      <td className="px-8 py-6">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur opacity-0 group-hover:opacity-30 transition duration-500"></div>
            <img
              src={playerImage || "/placeholder.svg?height=60&width=60"}
              alt={player.name}
              className="relative w-12 h-12 rounded-full object-cover border-2 border-slate-600/50 group-hover:border-purple-500/50 transition-all duration-300"
              onError={handleImageError}
            />
          </div>
          <span className="text-white font-semibold text-lg group-hover:text-purple-300 transition-colors duration-300">
            {player.name}
          </span>
        </div>
      </td>
      <td className="px-8 py-6">
        <span className="bg-slate-700/50 text-slate-300 px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm group-hover:bg-purple-600/20 group-hover:text-purple-300 transition-all duration-300">
          {player.username}
        </span>
      </td>
      <td className="px-8 py-6 text-slate-300 font-medium group-hover:text-slate-200 transition-colors duration-300">
        {player.totalTime}
      </td>
      <td className="px-8 py-6 text-slate-300 font-medium group-hover:text-slate-200 transition-colors duration-300">
        {player.challenges}
      </td>
      <td className="px-8 py-6">
        <span className="text-white font-bold text-lg bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          {formatCurrency(player.score)}
        </span>
      </td>
    </tr>
  )
}

function StatsCard({ title, value, delay = 0 }) {
  const cardRef = useRef(null)
  const isVisible = useIntersectionObserver(cardRef, { threshold: 0.1 })

  return (
    <div
      ref={cardRef}
      className={`relative group transition-all duration-1000 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
      <div className="relative bg-slate-900/90 backdrop-blur-xl rounded-xl p-8 border border-slate-700/50 shadow-xl group-hover:shadow-2xl transition-all duration-500 group-hover:scale-105">
        <h3 className="text-slate-300 text-sm uppercase tracking-wider font-medium mb-4">{title}</h3>
        <p className="text-white text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          {value}
        </p>
      </div>
    </div>
  )
}

export default function Leaderboard() {
  const donData = useLoaderData()
  const [leaderboardData, setLeaderboardData] = useState([])
  const [availableMonths, setAvailableMonths] = useState([])
  const [selectedMonth, setSelectedMonth] = useState("all")
  const [isLive, setIsLive] = useState(true)
  const [userImages, setUserImages] = useState({})
  const [loadingImages, setLoadingImages] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const headerRef = useRef(null)
  const tableRef = useRef(null)
  const isHeaderVisible = useIntersectionObserver(headerRef, { threshold: 0.1 })
  const isTableVisible = useIntersectionObserver(tableRef, { threshold: 0.1 })

  // Simulate initial loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (leaderboardData.length > 0) {
      setLoadingImages(true)
      const uniqueDonorIds = [...new Set(leaderboardData.map((player) => player.realId))]

      Promise.all(
        uniqueDonorIds.map(async (donorId) => {
          try {
            const result = await getDonorNameandImage(donorId)
            return {
              donorId,
              imageUrl: result?.userData?.user_profile_image || null,
            }
          } catch (error) {
            console.error(`Error fetching data for donor ${donorId}:`, error)
            return { donorId, imageUrl: null }
          }
        }),
      )
        .then((results) => {
          const imageMap = {}
          results.forEach(({ donorId, imageUrl }) => {
            if (imageUrl) {
              imageMap[donorId] = imageUrl
            }
          })
          setUserImages(imageMap)
          setLoadingImages(false)
        })
        .catch((error) => {
          console.error("Error fetching user images:", error)
          setLoadingImages(false)
        })
    }
  }, [leaderboardData])

  useEffect(() => {
    if (donData && donData.donations && donData.donations.length > 0) {
      const months = getAvailableMonths(donData.donations)
      setAvailableMonths(months)
      const processedData = processDonationData(donData.donations)
      setLeaderboardData(processedData)
    }
  }, [donData])

  useEffect(() => {
    if (donData && donData.donations && donData.donations.length > 0) {
      const filteredDonations = filterDonationsByMonth(donData.donations, selectedMonth)
      const processedData = processDonationData(filteredDonations)
      setLeaderboardData(processedData)
    }
  }, [selectedMonth, donData])

  useEffect(() => {
    if (leaderboardData.length === 0) return
    const interval = setInterval(() => {
      setLeaderboardData((prevData) => {
        return prevData.map((player) => ({
          ...player,
          totalTime: calculateTimeSinceFirst(new Date(Date.now() - Math.random() * 86400000 * 30)),
        }))
      })
    }, 30000)
    return () => clearInterval(interval)
  }, [leaderboardData])

  const topThree = leaderboardData.slice(0, 3).sort((a, b) => a.rank - b.rank)
  const remainingPlayers = leaderboardData.slice(3)

  if (isLoading || !donData || !donData.donations || donData.donations.length === 0) {
    return <LoadingSkeleton />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div
            ref={headerRef}
            className={`text-center mb-16 transition-all duration-1000 ${
              isHeaderVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
            }`}
          >
            <div className="flex items-center justify-center space-x-4 mb-6">
              <h1 className="text-6xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent tracking-tight">
                Realtime Donations
              </h1>
              {isLive && (
                <div className="flex items-center space-x-2 bg-red-500/20 backdrop-blur-sm rounded-full px-4 py-2 border border-red-500/30">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-lg shadow-red-500/50"></div>
                  <span className="text-red-400 text-sm font-bold tracking-wide">LIVE</span>
                </div>
              )}
            </div>
            <p className="text-slate-300 text-xl mb-4 font-light">Top contributors making a difference</p>
            <p className="text-slate-400 text-lg">
              Showing data for:{" "}
              <span className="font-semibold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                {formatMonthDisplay(selectedMonth)}
              </span>
            </p>
            {loadingImages && (
              <div className="mt-4 flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
                <span className="text-slate-400 text-sm ml-2">Loading profile images...</span>
              </div>
            )}
          </div>

          {/* Month Filter */}
          <MonthFilter
            availableMonths={availableMonths}
            selectedMonth={selectedMonth}
            onMonthChange={setSelectedMonth}
          />

          {/* Top 3 Podium */}
          {topThree.length >= 3 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <div className="md:order-1 mt-8">
                <TopThreeCard player={topThree[1]} position={2} userImages={userImages} delay={200} />
              </div>
              <div className="md:order-2">
                <TopThreeCard player={topThree[0]} position={1} userImages={userImages} delay={0} />
              </div>
              <div className="md:order-3 mt-8">
                <TopThreeCard player={topThree[2]} position={3} userImages={userImages} delay={400} />
              </div>
            </div>
          )}

          {/* No data message */}
          {leaderboardData.length === 0 && (
            <div className="text-center py-16">
              <div className="text-slate-400 text-xl mb-6">
                No donations found for {formatMonthDisplay(selectedMonth)}
              </div>
              <button
                onClick={() => setSelectedMonth("all")}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                View All Time
              </button>
            </div>
          )}

          {/* Detailed Leaderboard */}
          {leaderboardData.length > 0 && (
            <div
              ref={tableRef}
              className={`relative group transition-all duration-1000 ${
                isTableVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
              }`}
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
              <div className="relative bg-slate-900/90 backdrop-blur-xl rounded-2xl border border-slate-700/50 overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-800/80 backdrop-blur-sm">
                      <tr>
                        <th className="px-8 py-6 text-left text-slate-300 font-bold uppercase tracking-wider text-sm">
                          Rank
                        </th>
                        <th className="px-8 py-6 text-left text-slate-300 font-bold uppercase tracking-wider text-sm">
                          Donor Name
                        </th>
                        <th className="px-8 py-6 text-left text-slate-300 font-bold uppercase tracking-wider text-sm">
                          Username
                        </th>
                        <th className="px-8 py-6 text-left text-slate-300 font-bold uppercase tracking-wider text-sm">
                          Time Active
                        </th>
                        <th className="px-8 py-6 text-left text-slate-300 font-bold uppercase tracking-wider text-sm">
                          Donations
                        </th>
                        <th className="px-8 py-6 text-left text-slate-300 font-bold uppercase tracking-wider text-sm">
                          Total Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-slate-900/50 backdrop-blur-sm">
                      {remainingPlayers.map((player, index) => (
                        <LeaderboardRow key={player.id} player={player} userImages={userImages} index={index} />
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Stats Summary */}
          {leaderboardData.length > 0 && (
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
              <StatsCard
                title="Total Donations"
                value={formatCurrency(leaderboardData.reduce((sum, player) => sum + player.score, 0))}
                delay={0}
              />
              <StatsCard title="Total Donors" value={leaderboardData.length.toLocaleString()} delay={200} />
              <StatsCard
                title="Total Contributions"
                value={leaderboardData.reduce((sum, player) => sum + player.challenges, 0).toLocaleString()}
                delay={400}
              />
            </div>
          )}

          {/* Live Update Indicator */}
          <div className="text-center mt-12">
            <p className="text-slate-400 text-sm font-medium">
              Last updated: <span className="text-purple-400">{new Date().toLocaleTimeString()}</span>
            </p>
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
