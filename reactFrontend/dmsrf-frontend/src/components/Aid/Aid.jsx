"use client"

import React, { useContext, useState } from "react"
import { Upload, Heart, DollarSign, MapPin, Phone, Calendar, CreditCard } from "lucide-react"
import api from "../../api"
import { AuthContext } from "../../context/AuthContext"
// Mock context for demo - replace with your actual AuthContext


const Aid = () => {
  const { user } = useContext(AuthContext)
  const [formData, setFormData] = useState({
    title: "",
    amount_needed: "",
    address: "",
    state: "",
    contact_number: "",
    reason: "",
    total_family_members: "",
    category: "medical",
    urgency: "low",
    needed_by: "",
    bkash_number: "",
    bank_name: "",
    bank_account_name: "",
    bank_account_number: "",
    user: user[0].id,
  })

  const [proofOfCause, setProofOfCause] = useState(null)
  const [relatedPictures, setRelatedPictures] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e) => {
    const { name, files } = e.target
    if (name === "proof_of_cause") setProofOfCause(files?.[0] || null)
    else if (name === "related_pictures") setRelatedPictures(files?.[0] || null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    console.log("Form submission started...")
    console.log("Form data:", formData)
    console.log("Files:", { proofOfCause, relatedPictures })

    const data = new FormData()

    // Add form data
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== "") {
        data.append(key, value)
        console.log(`Added ${key}:`, value)
      }
    })

    // Add files
    if (proofOfCause) {
      data.append("proof_of_cause", proofOfCause)
      console.log("Added proof_of_cause file:", proofOfCause.name)
    }
    if (relatedPictures) {
      data.append("related_pictures", relatedPictures)
      console.log("Added related_pictures file:", relatedPictures.name)
    }

    try {
      console.log("Making API call to:", "http://127.0.0.1:8000/aid/api/Aid/")

      const response = await api.post("http://127.0.0.1:8000/aid/api/Aid/", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      console.log("API Response:", response)
      console.log("Response data:", response.data)
      console.log("Response status:", response.status)

      if (response.status === 200 || response.status === 201) {
        alert("Aid request submitted successfully!")
        console.log("Form submitted successfully")

        // Reset form after successful submission
        setFormData({
          title: "",
          amount_needed: "",
          address: "",
          state: "",
          contact_number: "",
          reason: "",
          total_family_members: "",
          category: "medical",
          urgency: "low",
          needed_by: "",
          bkash_number: "",
          bank_name: "",
          bank_account_name: "",
          bank_account_number: "",
          user: user[0].id,
        })
        setProofOfCause(null)
        setRelatedPictures(null)
      } else {
        throw new Error(`Unexpected response status: ${response.status}`)
      }
    } catch (error) {
      console.error("Detailed submission error:", error)

      if (error.response) {
        // Server responded with error status
        console.error("Error response data:", error.response.data)
        console.error("Error response status:", error.response.status)
        console.error("Error response headers:", error.response.headers)
        alert(`Server error: ${error.response.status} - ${error.response.data?.message || "Unknown error"}`)
      } else if (error.request) {
        // Request was made but no response received
        console.error("No response received:", error.request)
        alert("Network error: Unable to reach the server. Please check if the server is running.")
      } else {
        // Something else happened
        console.error("Error message:", error.message)
        alert(`Error: ${error.message}`)
      }
    } finally {
      setIsSubmitting(false)
      console.log("Form submission completed")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-violet-600 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full shadow-lg">
              <Heart className="h-10 w-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-700 to-teal-700 bg-clip-text text-transparent mb-3">
            Request Aid
          </h1>
          <p className="text-white max-w-2xl mx-auto text-lg leading-relaxed">
            Fill out this form to submit your aid request. Please provide accurate information to help us process your
            request efficiently and connect you with the support you need.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-emerald-100/50 overflow-hidden">
            <div className="px-8 py-6 bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-emerald-100">
              <h3 className="text-xl font-semibold text-emerald-800 flex items-center gap-3">
                <div className="p-2 bg-emerald-100 rounded-lg">
                </div>
                Basic Information
              </h3>
              <p className="text-emerald-600 mt-2">Provide the essential details about your aid request</p>
            </div>
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="title" className="block text-sm font-semibold text-slate-700">
                    Request Title *
                  </label>
                  <input
                    id="title"
                    name="title"
                    type="text"
                    placeholder="Brief title for your request"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-emerald-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all duration-200 bg-white/70"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="amount_needed" className="block text-sm font-semibold text-slate-700">
                    Amount Needed *
                  </label>
                  <input
                    id="amount_needed"
                    name="amount_needed"
                    type="number"
                    placeholder="Amount in BDT"
                    value={formData.amount_needed}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-emerald-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all duration-200 bg-white/70"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="category" className="block text-sm font-semibold text-slate-700">
                    Category
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-emerald-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all duration-200 bg-white/70"
                  >
                    <option value="medical">Medical</option>
                    <option value="education">Education</option>
                    <option value="food">Food</option>
                    <option value="shelter">Shelter</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="urgency" className="block text-sm font-semibold text-slate-700">
                    Urgency Level
                  </label>
                  <select
                    id="urgency"
                    name="urgency"
                    value={formData.urgency}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-emerald-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all duration-200 bg-white/70"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="reason" className="block text-sm font-semibold text-slate-700">
                  Reason for Aid Request *
                </label>
                <textarea
                  id="reason"
                  name="reason"
                  placeholder="Please explain why you need this aid..."
                  value={formData.reason}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 border border-emerald-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all duration-200 bg-white/70 resize-none"
                />
              </div>
            </div>
          </div>

          {/* Contact & Location */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-teal-100/50 overflow-hidden">
            <div className="px-8 py-6 bg-gradient-to-r from-teal-50 to-cyan-50 border-b border-teal-100">
              <h3 className="text-xl font-semibold text-teal-800 flex items-center gap-3">
                <div className="p-2 bg-teal-100 rounded-lg">
                  <MapPin className="h-5 w-5 text-teal-600" />
                </div>
                Contact & Location
              </h3>
              <p className="text-teal-600 mt-2">Your contact information and address details</p>
            </div>
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="contact_number" className="block text-sm font-semibold text-slate-700">
                    Contact Number *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-4 h-4 w-4 text-teal-400" />
                    <input
                      id="contact_number"
                      name="contact_number"
                      type="tel"
                      placeholder="+880 1234567890"
                      value={formData.contact_number}
                      onChange={handleChange}
                      required
                      className="w-full pl-12 pr-4 py-3 border border-teal-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition-all duration-200 bg-white/70"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="state" className="block text-sm font-semibold text-slate-700">
                    State/Division *
                  </label>
                  <input
                    id="state"
                    name="state"
                    type="text"
                    placeholder="e.g., Dhaka, Chittagong"
                    value={formData.state}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-teal-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition-all duration-200 bg-white/70"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="address" className="block text-sm font-semibold text-slate-700">
                  Full Address *
                </label>
                <textarea
                  id="address"
                  name="address"
                  placeholder="House/Flat no, Road, Area, City..."
                  value={formData.address}
                  onChange={handleChange}
                  required
                  rows={3}
                  className="w-full px-4 py-3 border border-teal-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition-all duration-200 bg-white/70 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="total_family_members" className="block text-sm font-semibold text-slate-700">
                    Total Family Members *
                  </label>
                  <input
                    id="total_family_members"
                    name="total_family_members"
                    type="number"
                    placeholder="Number of family members"
                    value={formData.total_family_members}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-teal-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition-all duration-200 bg-white/70"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="needed_by" className="block text-sm font-semibold text-slate-700">
                    Needed By
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-4 h-4 w-4 text-teal-400" />
                    <input
                      id="needed_by"
                      name="needed_by"
                      type="date"
                      value={formData.needed_by}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3 border border-teal-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition-all duration-200 bg-white/70"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-amber-100/50 overflow-hidden">
            <div className="px-8 py-6 bg-gradient-to-r from-amber-50 to-yellow-50 border-b border-amber-100">
              <h3 className="text-xl font-semibold text-amber-800 flex items-center gap-3">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <CreditCard className="h-5 w-5 text-amber-600" />
                </div>
                Payment Information
              </h3>
              <p className="text-amber-600 mt-2">Provide your payment details for fund transfer</p>
            </div>
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="bkash_number" className="block text-sm font-semibold text-slate-700">
                    bKash Number
                  </label>
                  <input
                    id="bkash_number"
                    name="bkash_number"
                    type="tel"
                    placeholder="01XXXXXXXXX"
                    value={formData.bkash_number}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-amber-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all duration-200 bg-white/70"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="bank_name" className="block text-sm font-semibold text-slate-700">
                    Bank Name
                  </label>
                  <select
                    id="bank_name"
                    name="bank_name"
                    value={formData.bank_name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-amber-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all duration-200 bg-white/70"
                  >
                    <option value="">Select your bank</option>
                    <option value="AB Bank">AB Bank</option>
                    <option value="Agrani Bank">Agrani Bank</option>
                    <option value="Al-Arafah Islami Bank">Al-Arafah Islami Bank</option>
                    <option value="Bangladesh Commerce Bank">Bangladesh Commerce Bank</option>
                    <option value="Bangladesh Development Bank">Bangladesh Development Bank</option>
                    <option value="Bangladesh Krishi Bank">Bangladesh Krishi Bank</option>
                    <option value="Bank Asia">Bank Asia</option>
                    <option value="BASIC Bank">BASIC Bank</option>
                    <option value="Brac Bank">Brac Bank</option>
                    <option value="Citibank N.A.">Citibank N.A.</option>
                    <option value="Commercial Bank of Ceylon">Commercial Bank of Ceylon</option>
                    <option value="Community Bank">Community Bank</option>
                    <option value="Dhaka Bank">Dhaka Bank</option>
                    <option value="Dutch-Bangla Bank">Dutch-Bangla Bank</option>
                    <option value="Eastern Bank">Eastern Bank</option>
                    <option value="Exim Bank">Exim Bank</option>
                    <option value="First Security Islami Bank">First Security Islami Bank</option>
                    <option value="Habib Bank">Habib Bank</option>
                    <option value="ICB Islamic Bank">ICB Islamic Bank</option>
                    <option value="IFIC Bank">IFIC Bank</option>
                    <option value="Islami Bank Bangladesh">Islami Bank Bangladesh</option>
                    <option value="Jamuna Bank">Jamuna Bank</option>
                    <option value="Janata Bank">Janata Bank</option>
                    <option value="Meghna Bank">Meghna Bank</option>
                    <option value="Mercantile Bank">Mercantile Bank</option>
                    <option value="Midland Bank">Midland Bank</option>
                    <option value="Modhumoti Bank">Modhumoti Bank</option>
                    <option value="Mutual Trust Bank">Mutual Trust Bank</option>
                    <option value="National Bank">National Bank</option>
                    <option value="National Bank of Pakistan">National Bank of Pakistan</option>
                    <option value="NRB Bank">NRB Bank</option>
                    <option value="NRB Commercial Bank">NRB Commercial Bank</option>
                    <option value="NRB Global Bank">NRB Global Bank</option>
                    <option value="One Bank">One Bank</option>
                    <option value="Padma Bank">Padma Bank</option>
                    <option value="Palli Sanchay Bank">Palli Sanchay Bank</option>
                    <option value="Premier Bank">Premier Bank</option>
                    <option value="Prime Bank">Prime Bank</option>
                    <option value="Pubali Bank">Pubali Bank</option>
                    <option value="Rupali Bank">Rupali Bank</option>
                    <option value="Shahjalal Islami Bank">Shahjalal Islami Bank</option>
                    <option value="Shimanto Bank">Shimanto Bank</option>
                    <option value="Social Islami Bank">Social Islami Bank</option>
                    <option value="Sonali Bank">Sonali Bank</option>
                    <option value="South Bangla Agriculture and Commerce Bank">
                      South Bangla Agriculture and Commerce Bank
                    </option>
                    <option value="Southeast Bank">Southeast Bank</option>
                    <option value="Standard Bank">Standard Bank</option>
                    <option value="Standard Chartered Bank">Standard Chartered Bank</option>
                    <option value="State Bank of India">State Bank of India</option>
                    <option value="The City Bank">The City Bank</option>
                    <option value="Trust Bank">Trust Bank</option>
                    <option value="Union Bank">Union Bank</option>
                    <option value="United Commercial Bank">United Commercial Bank</option>
                    <option value="Uttara Bank">Uttara Bank</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="bank_account_name" className="block text-sm font-semibold text-slate-700">
                    Account Holder Name
                  </label>
                  <input
                    id="bank_account_name"
                    name="bank_account_name"
                    type="text"
                    placeholder="Full name as per bank account"
                    value={formData.bank_account_name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-amber-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all duration-200 bg-white/70"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="bank_account_number" className="block text-sm font-semibold text-slate-700">
                    Account Number
                  </label>
                  <input
                    id="bank_account_number"
                    name="bank_account_number"
                    type="text"
                    placeholder="Bank account number"
                    value={formData.bank_account_number}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-amber-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all duration-200 bg-white/70"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Documents */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-rose-100/50 overflow-hidden">
            <div className="px-8 py-6 bg-gradient-to-r from-rose-50 to-pink-50 border-b border-rose-100">
              <h3 className="text-xl font-semibold text-rose-800 flex items-center gap-3">
                <div className="p-2 bg-rose-100 rounded-lg">
                  <Upload className="h-5 w-5 text-rose-600" />
                </div>
                Supporting Documents
              </h3>
              <p className="text-rose-600 mt-2">Upload documents to support your aid request</p>
            </div>
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="proof_of_cause" className="block text-sm font-semibold text-slate-700">
                    Proof of Cause
                  </label>
                  <div className="border-2 border-dashed border-rose-200 rounded-xl p-8 text-center hover:border-rose-300 hover:bg-rose-50/30 transition-all duration-200 bg-white/50">
                    <Upload className="mx-auto h-10 w-10 text-rose-400 mb-3" />
                    <input
                      id="proof_of_cause"
                      name="proof_of_cause"
                      type="file"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <label htmlFor="proof_of_cause" className="cursor-pointer">
                      <span className="text-sm text-slate-600 font-medium">
                        {proofOfCause ? proofOfCause.name : "Click to upload proof document"}
                      </span>
                    </label>
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="related_pictures" className="block text-sm font-semibold text-slate-700">
                    Related Pictures
                  </label>
                  <div className="border-2 border-dashed border-rose-200 rounded-xl p-8 text-center hover:border-rose-300 hover:bg-rose-50/30 transition-all duration-200 bg-white/50">
                    <Upload className="mx-auto h-10 w-10 text-rose-400 mb-3" />
                    <input
                      id="related_pictures"
                      name="related_pictures"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <label htmlFor="related_pictures" className="cursor-pointer">
                      <span className="text-sm text-slate-600 font-medium">
                        {relatedPictures ? relatedPictures.name : "Click to upload images"}
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-emerald-200/50"></div>

          {/* Submit Button */}
          <div className="flex justify-center pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full md:w-auto px-16 py-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-700 hover:via-teal-700 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-lg rounded-xl shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5 transition-all duration-300"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                  Submitting Request...
                </div>
              ) : (
                "Submit Aid Request"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Aid
