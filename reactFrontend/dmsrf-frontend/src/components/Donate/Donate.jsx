"use client"

import { useState } from "react"

const DonationPage = () => {
  const [selectedAmount, setSelectedAmount] = useState(50)
  const [customAmount, setCustomAmount] = useState("")
  const [donationType, setDonationType] = useState("one-time")
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [loading, setLoading] = useState(false)

  const predefinedAmounts = [25, 50, 100, 250, 500, 1000]

  const impactData = [
    { amount: 25, impact: "Provides clean water for 5 families for a week" },
    { amount: 50, impact: "Supplies emergency food for 10 people for 3 days" },
    { amount: 100, impact: "Delivers medical supplies to a disaster zone" },
    { amount: 250, impact: "Builds temporary shelter for a displaced family" },
    { amount: 500, impact: "Funds emergency response team for 24 hours" },
    { amount: 1000, impact: "Establishes a relief distribution center" },
  ]

  const getCurrentImpact = () => {
    const amount = customAmount ? Number.parseInt(customAmount) : selectedAmount
    const impact = impactData.find((item) => item.amount <= amount)
    return impact ? impact.impact : "Makes a significant difference in disaster relief efforts"
  }
    const handleDonate = async () => {
      setLoading(true)
    const token = localStorage.getItem("access") // or whatever you stored the token as
    const donationAmount = customAmount ? parseInt(customAmount) : selectedAmount

    try {
      const response = await fetch("http://127.0.0.1:8000/donation/api/donation/initiate/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          donation_cause: 3,
          donation_amount: donationAmount,
          cus_phone: "01722382459", // Replace or make dynamic as needed
          donor_remarks: "Save them as fast as you can",
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to process donation")
      }

      const data = await response.json()

      if (data.payment_url) {
        window.location.href = data.payment_url // redirect to payment gateway or thank you page
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Help Save Lives
              <span className="block text-blue-200">Today</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Your donation provides immediate relief to families affected by natural disasters worldwide. Every
              contribution makes a real difference.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-emerald-400 rounded-full"></div>
                <span>100% of donations go directly to relief efforts</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3  bg-emerald-400 rounded-full"></div>
                <span>Trusted by 50,000+ donors worldwide</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Donation Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-6">Make a Donation</h2>

              {/* Donation Type */}
              <div className="mb-8">
                <div className="flex gap-4 mb-6">
                  <button
                    onClick={() => setDonationType("one-time")}
                    className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                      donationType === "one-time"
                        ? "bg-blue-600 text-white shadow-md"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    One-time
                  </button>
                  <button
                    onClick={() => setDonationType("monthly")}
                    className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                      donationType === "monthly"
                        ? "bg-blue-600 text-white shadow-md"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    Monthly
                  </button>
                </div>
                {donationType === "monthly" && (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-emerald-700">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                      <span className="font-medium">Monthly donors provide 3x more impact over time</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Amount Selection */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Select Amount</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                  {predefinedAmounts.map((amount) => (
                    <button
                      key={amount}
                      onClick={() => {
                        setSelectedAmount(amount)
                        setCustomAmount("")
                      }}
                      className={`p-4 rounded-xl border-2 font-semibold transition-all duration-200 ${
                        selectedAmount === amount && !customAmount
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-slate-200 hover:border-slate-300 text-slate-700"
                      }`}
                    >
                      ${amount}
                    </button>
                  ))}
                </div>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500 font-medium">
                    $
                  </span>
                  <input
                    type="number"
                    placeholder="Custom amount"
                    value={customAmount}
                    onChange={(e) => {
                      setCustomAmount(e.target.value)
                      setSelectedAmount(0)
                    }}
                    className="w-full pl-8 pr-4 py-4 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Impact Display */}
              <div className="mb-8 p-6 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-200">
                <h4 className="font-semibold text-emerald-800 mb-2">Your Impact</h4>
                <p className="text-emerald-700">{getCurrentImpact()}</p>
              </div>

              {/* Donor Information */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Donor Information</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">First Name</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Last Name</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                      placeholder="Doe"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                    <input
                      type="email"
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Payment Method</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
                  <button
                    onClick={() => setPaymentMethod("card")}
                    className={`p-4 rounded-xl border-2 font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                      paymentMethod === "card"
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-slate-200 hover:border-slate-300 text-slate-700"
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                      <line x1="1" y1="10" x2="23" y2="10" />
                    </svg>
                    Credit Card
                  </button>
                  <button
                    onClick={() => setPaymentMethod("paypal")}
                    className={`p-4 rounded-xl border-2 font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                      paymentMethod === "paypal"
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-slate-200 hover:border-slate-300 text-slate-700"
                    }`}
                  >
                    PayPal
                  </button>
                  <button
                    onClick={() => setPaymentMethod("bank")}
                    className={`p-4 rounded-xl border-2 font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                      paymentMethod === "bank"
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-slate-200 hover:border-slate-300 text-slate-700"
                    }`}
                  >
                    Bank Transfer
                  </button>
                </div>

                {paymentMethod === "card" && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Card Number</label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                        placeholder="1234 5678 9012 3456"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Expiry Date</label>
                        <input
                          type="text"
                          className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                          placeholder="MM/YY"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">CVV</label>
                        <input
                          type="text"
                          className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                          placeholder="123"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Privacy & Terms */}
              <div className="mb-8">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" className="mt-1 w-4 h-4 text-blue-600 rounded" />
                  <span className="text-sm text-slate-600">
                    I agree to the{" "}
                    <a href="#" className="text-blue-600 hover:underline">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="#" className="text-blue-600 hover:underline">
                      Privacy Policy
                    </a>
                  </span>
                </label>
              </div>

              {/* Donate Button */}
              <button onClick={handleDonate} className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-lg rounded-xl shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02]">
                Donate ${customAmount || selectedAmount} {donationType === "monthly" ? "Monthly" : "Now"}
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Current Campaign */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <h3 className="text-lg font-bold text-slate-800 mb-4">Current Emergency</h3>
              <img
                src="https://placehold.co/400x200"
                alt="Emergency relief"
                className="w-full h-40 object-cover rounded-xl mb-4"
              />
              <h4 className="font-semibold text-slate-800 mb-2">Earthquake Relief in Turkey</h4>
              <p className="text-slate-600 text-sm mb-4">
                Thousands of families need immediate assistance after the devastating earthquake.
              </p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Raised</span>
                  <span className="font-semibold">$2,847,392</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full w-3/4"></div>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Goal: $4,000,000</span>
                  <span className="text-emerald-600 font-semibold">71% funded</span>
                </div>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <h3 className="text-lg font-bold text-slate-800 mb-4">Why Donate With Us?</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-emerald-600"
                    >
                      <path d="M9 12l2 2 4-4" />
                      <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3" />
                      <path d="M3 12c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800">100% Transparent</h4>
                    <p className="text-sm text-slate-600">Every dollar is tracked and reported</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-blue-600"
                    >
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800">Secure Payments</h4>
                    <p className="text-sm text-slate-600">Bank-level encryption protects your data</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-purple-600"
                    >
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800">Global Reach</h4>
                    <p className="text-sm text-slate-600">Operating in 50+ countries worldwide</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Donors */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <h3 className="text-lg font-bold text-slate-800 mb-4">Recent Donors</h3>
              <div className="space-y-3">
                {[
                  { name: "Sarah M.", amount: 100, time: "2 minutes ago" },
                  { name: "John D.", amount: 50, time: "5 minutes ago" },
                  { name: "Anonymous", amount: 250, time: "8 minutes ago" },
                  { name: "Maria L.", amount: 75, time: "12 minutes ago" },
                ].map((donor, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {donor.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium text-slate-800">{donor.name}</div>
                        <div className="text-xs text-slate-500">{donor.time}</div>
                      </div>
                    </div>
                    <div className="font-semibold text-emerald-600">${donor.amount}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DonationPage
