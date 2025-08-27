"use client"

import { useState, useMemo } from "react"
import {
  ChevronLeft,
  ChevronRight,
  Filter,
  Calendar,
  DollarSign,
  CheckCircle,
  Clock,
  XCircle,
  Eye,
  MoreHorizontal,
} from "lucide-react"

export default function DonationList({ donation, user, searchTerm = "" }) {
  const [currentPage, setCurrentPage] = useState(1)
  const [donationsPerPage, setDonationsPerPage] = useState(10)
  const { user_profile_image, user_total_donate } = user[0]

  // Filter states
  const [filterStatus, setFilterStatus] = useState("")
  const [filterCampaign, setFilterCampaign] = useState("")
  const [filterMinAmount, setFilterMinAmount] = useState("")
  const [filterStartDate, setFilterStartDate] = useState("")
  const [filterEndDate, setFilterEndDate] = useState("")
  const [showFilters, setShowFilters] = useState(false)

  // Memoized filtered donations
  const filteredDonations = useMemo(() => {
    return donation.filter((d) => {
      const donationDate = new Date(d.donated_at)
      const matchesSearch =
        searchTerm === "" ||
        d.donor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.donation_cause_display.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.email.toLowerCase().includes(searchTerm.toLowerCase())

      if (!matchesSearch) return false
      if (filterStatus && d.status !== filterStatus) return false
      if (filterCampaign && d.donation_cause_display !== filterCampaign) return false
      if (filterMinAmount && d.donation_amount < Number(filterMinAmount)) return false
      if (filterStartDate && donationDate < new Date(filterStartDate)) return false
      if (filterEndDate && donationDate > new Date(filterEndDate)) return false

      return true
    })
  }, [donation, searchTerm, filterStatus, filterCampaign, filterMinAmount, filterStartDate, filterEndDate])

  const reversedDonations = filteredDonations.slice().reverse()
  const totalPages = Math.ceil(filteredDonations.length / donationsPerPage)
  const indexOfLastDonation = currentPage * donationsPerPage
  const indexOfFirstDonation = indexOfLastDonation - donationsPerPage
  const currentDonations = reversedDonations.slice(indexOfFirstDonation, indexOfLastDonation)

  const handleFilterChange = (setter) => (e) => {
    setter(e.target.value)
    setCurrentPage(1)
  }

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)

  const getStatusConfig = (status) => {
    switch (status) {
      case "Success":
        return {
          color: "text-green-400",
          bg: "bg-green-400/10",
          border: "border-green-400/20",
          icon: CheckCircle,
        }
      case "Pending":
        return {
          color: "text-yellow-400",
          bg: "bg-yellow-400/10",
          border: "border-yellow-400/20",
          icon: Clock,
        }
      case "Failed":
        return {
          color: "text-red-400",
          bg: "bg-red-400/10",
          border: "border-red-400/20",
          icon: XCircle,
        }
      default:
        return {
          color: "text-gray-400",
          bg: "bg-gray-400/10",
          border: "border-gray-400/20",
          icon: Clock,
        }
    }
  }

  const getCampaignColor = (campaign) => {
    const colors = [
      "from-purple-500 to-pink-500",
      "from-blue-500 to-cyan-500",
      "from-green-500 to-emerald-500",
      "from-orange-500 to-red-500",
      "from-indigo-500 to-purple-500",
    ]
    const index = campaign.length % colors.length
    return colors[index]
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 backdrop-blur-sm border border-green-500/20 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-400 text-sm font-medium">Total Amount</p>
              <p className="text-2xl font-bold text-white">{formatCurrency(user_total_donate)}</p>
            </div>

          </div>
        </div>
        <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 backdrop-blur-sm border border-blue-500/20 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-400 text-sm font-medium">Total Donations</p>
              <p className="text-2xl font-bold text-white">{filteredDonations.length}</p>
            </div>
            <Calendar className="h-8 w-8 text-blue-400" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-400 text-sm font-medium">Average Donation</p>
              <p className="text-2xl font-bold text-white">
                {filteredDonations.length > 0 ? formatCurrency(user_total_donate / filteredDonations.length) : "$0"}
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-purple-400" />
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Filters</h3>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white transition-all duration-300"
          >
            <Filter className="h-4 w-4" />
            <span>{showFilters ? "Hide" : "Show"} Filters</span>
          </button>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <select
              value={filterStatus}
              onChange={handleFilterChange(setFilterStatus)}
              className="p-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="" className="bg-gray-800">
                All Statuses
              </option>
              <option value="Success" className="bg-gray-800">
                Success
              </option>
              <option value="Pending" className="bg-gray-800">
                Pending
              </option>
              <option value="Failed" className="bg-gray-800">
                Failed
              </option>
            </select>

            <select
              value={filterCampaign}
              onChange={handleFilterChange(setFilterCampaign)}
              className="p-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="" className="bg-gray-800">
                All Campaigns
              </option>
              <option value="Annual Fundraiser" className="bg-gray-800">
                Annual Fundraiser
              </option>
              <option value="Building Project" className="bg-gray-800">
                Building Project
              </option>
              <option value="Emergency Relief" className="bg-gray-800">
                Emergency Relief
              </option>
              <option value="Education Fund" className="bg-gray-800">
                Education Fund
              </option>
            </select>

            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="Min Amount"
              value={filterMinAmount}
              onChange={handleFilterChange(setFilterMinAmount)}
              className="p-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />

            <input
              type="date"
              value={filterStartDate}
              onChange={handleFilterChange(setFilterStartDate)}
              className="p-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />

            <input
              type="date"
              value={filterEndDate}
              onChange={handleFilterChange(setFilterEndDate)}
              className="p-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        )}
      </div>

      {/* Enhanced Table */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-300">Donor</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-300">Amount</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-300">Campaign</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-300">Status</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-300">Date</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {currentDonations.map((d) => {
                const statusConfig = getStatusConfig(d.status)
                const StatusIcon = statusConfig.icon
                return (
                  <tr key={d.id} className="hover:bg-white/5 transition-colors duration-200">
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <img
                            src={user_profile_image || "/placeholder.svg?height=40&width=40"}
                            alt={d.donor_name}
                            className="w-10 h-10 rounded-full object-cover border-2 border-white/20"
                          />
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-900"></div>
                        </div>
                        <div>
                          <div className="font-medium text-white">{d.donor_name}</div>
                          <div className="text-sm text-gray-400">{d.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-lg font-bold text-white">{formatCurrency(d.donation_amount)}</div>
                      <div className="text-xs text-gray-400">via Bkash</div>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getCampaignColor(
                          d.donation_cause_display,
                        )} text-white`}
                      >
                        {d.donation_cause_display}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${statusConfig.bg} ${statusConfig.color} ${statusConfig.border}`}
                      >
                        <StatusIcon className="w-3 h-3 mr-2" />
                        {d.status}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-white">
                        {new Date(d.donated_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </div>
                      <div className="text-xs text-gray-400">
                        {new Date(d.donated_at).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200">
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
              {currentDonations.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-400">
                    <div className="flex flex-col items-center space-y-2">
                      <Calendar className="h-12 w-12 text-gray-600" />
                      <p className="text-lg">No donations found</p>
                      <p className="text-sm">Try adjusting your filters or search terms</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Enhanced Pagination */}
        <div className="px-6 py-4 border-t border-white/10 bg-white/5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-400">
                Showing {filteredDonations.length === 0 ? 0 : indexOfFirstDonation + 1} to{" "}
                {Math.min(indexOfLastDonation, filteredDonations.length)} of {filteredDonations.length} results
              </div>
              <select
                value={donationsPerPage}
                onChange={(e) => {
                  setDonationsPerPage(Number(e.target.value))
                  setCurrentPage(1)
                }}
                className="px-3 py-1 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value={5} className="bg-gray-800">
                  5 per page
                </option>
                <option value={10} className="bg-gray-800">
                  10 per page
                </option>
                <option value={25} className="bg-gray-800">
                  25 per page
                </option>
                <option value={50} className="bg-gray-800">
                  50 per page
                </option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-200"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Previous</span>
              </button>

              <div className="flex items-center space-x-1">
                {[...Array(Math.min(5, totalPages))].map((_, i) => {
                  const pageNum = i + 1
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                        currentPage === pageNum
                          ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                          : "text-gray-400 hover:text-white hover:bg-white/10"
                      }`}
                    >
                      {pageNum}
                    </button>
                  )
                })}
              </div>

              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-200"
              >
                <span>Next</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
