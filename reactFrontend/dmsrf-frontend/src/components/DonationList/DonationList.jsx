import { useState } from "react";

export default function DonationTable({ donation, user }) {
  const [currentPage, setCurrentPage] = useState(1);
  const donationsPerPage = 10;
  const { user_profile_image, user_total_donate } = user[0];

  // Filter states
  const [filterStatus, setFilterStatus] = useState("");
  const [filterCampaign, setFilterCampaign] = useState("");
  const [filterMinAmount, setFilterMinAmount] = useState("");
  const [filterStartDate, setFilterStartDate] = useState("");
  const [filterEndDate, setFilterEndDate] = useState("");

  // Filter donation array based on active filters
  const filteredDonations = donation.filter((d) => {
    const donationDate = new Date(d.donated_at);

    if (filterStatus && d.status !== filterStatus) return false;
    if (filterCampaign && d.donation_cause_display !== filterCampaign) return false;
    if (filterMinAmount && d.donation_amount < Number(filterMinAmount)) return false;
    if (filterStartDate && donationDate < new Date(filterStartDate)) return false;
    if (filterEndDate && donationDate > new Date(filterEndDate)) return false;

    return true;
  });

  // Reverse filtered donations for most recent first
  const reversedDonations = filteredDonations.slice().reverse();

  const totalPages = Math.ceil(filteredDonations.length / donationsPerPage);
  const indexOfLastDonation = currentPage * donationsPerPage;
  const indexOfFirstDonation = indexOfLastDonation - donationsPerPage;
  const currentDonations = reversedDonations.slice(indexOfFirstDonation, indexOfLastDonation);

  // Pagination controls
  const goToPreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  // Reset page to 1 when any filter changes
  const handleFilterChange = (setter) => (e) => {
    setter(e.target.value);
    setCurrentPage(1);
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "BDT",
    }).format(amount);

  const getStatusColor = (status) => {
    switch (status) {
      case "Success":
        return "bg-green-100 text-green-800 border-green-200";
      case "Pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Failed":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getCampaignColor = (campaign) => {
    switch (campaign) {
      case "Annual Fundraiser":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "Building Project":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Emergency Relief":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "Education Fund":
        return "bg-teal-100 text-teal-800 border-teal-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
            <div className="text-sm font-medium text-gray-500 mb-1">Total Donations</div>
            <div className="text-2xl font-bold text-gray-900">{formatCurrency(user_total_donate)}</div>
          </div>
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
            <div className="text-sm font-medium text-gray-500 mb-1">Total Donors</div>
            <div className="text-2xl font-bold text-gray-900">{filteredDonations.length}</div>
          </div>
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
            <div className="text-sm font-medium text-gray-500 mb-1">Average Donation</div>
            <div className="text-2xl font-bold text-gray-900">
              {filteredDonations.length > 0
                ? formatCurrency(
                    user_total_donate / filteredDonations.length
                  )
                : formatCurrency(0)}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={handleFilterChange(setFilterStatus)}
            className="p-2 border border-gray-300 rounded"
          >
            <option value="">All Statuses</option>
            <option value="Success">Success</option>
            <option value="Pending">Pending</option>
            <option value="Failed">Failed</option>
          </select>

          {/* Campaign Filter */}
          <select
            value={filterCampaign}
            onChange={handleFilterChange(setFilterCampaign)}
            className="p-2 border border-gray-300 rounded"
          >
            <option value="">All Campaigns</option>
            <option value="Annual Fundraiser">Annual Fundraiser</option>
            <option value="Building Project">Building Project</option>
            <option value="Emergency Relief">Emergency Relief</option>
            <option value="Education Fund">Education Fund</option>
          </select>

          {/* Minimum Amount Filter */}
          <input
            type="number"
            min="0"
            step="0.01"
            placeholder="Min Amount"
            value={filterMinAmount}
            onChange={handleFilterChange(setFilterMinAmount)}
            className="p-2 border border-gray-300 rounded"
          />

          {/* Start Date Filter */}
          <input
            type="date"
            value={filterStartDate}
            onChange={handleFilterChange(setFilterStartDate)}
            className="p-2 border border-gray-300 rounded"
          />

          {/* End Date Filter */}
          <input
            type="date"
            value={filterEndDate}
            onChange={handleFilterChange(setFilterEndDate)}
            className="p-2 border border-gray-300 rounded"
          />
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          {/* Table Header */}
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Recent Donations</h2>
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-500">{filteredDonations.length} donations</span>
                <button className="px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors">
                  Add Donation
                </button>
              </div>
            </div>
          </div>

          {/* Donation Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50/50">
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Donor</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Amount</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Campaign</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Payment Method</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Status</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentDonations.map((d) => (
                  <tr key={d.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <img
                          src={user_profile_image || "/placeholder.svg"}
                          alt={d.donor_name}
                          className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                        />
                        <div>
                          <div className="font-medium text-gray-900">{d.donor_name}</div>
                          <div className="text-sm text-gray-500">{d.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm font-bold text-gray-900">{formatCurrency(d.donation_amount)}</td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getCampaignColor(
                          d.donation_cause_display
                        )}`}
                      >
                        {d.donation_cause_display}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">Bkash</td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                          d.status
                        )}`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full mr-2 ${
                            d.status === "Success"
                              ? "bg-green-500"
                              : d.status === "Pending"
                              ? "bg-yellow-500"
                              : "bg-red-500"
                          }`}
                        />
                        {d.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">
                      {new Date(d.donated_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2"></div>
                    </td>
                  </tr>
                ))}
                {currentDonations.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center py-6 text-gray-500">
                      No donations match the selected filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing {filteredDonations.length === 0 ? 0 : indexOfFirstDonation + 1} to{" "}
                {Math.min(indexOfLastDonation, filteredDonations.length)} of {filteredDonations.length} results
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm font-medium text-gray-500 hover:text-gray-700 disabled:opacity-50"
                >
                  Previous
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-3 py-1 text-sm font-medium rounded ${
                      currentPage === i + 1 ? "bg-emerald-600 text-white" : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 text-sm font-medium text-gray-500 hover:text-gray-700 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
