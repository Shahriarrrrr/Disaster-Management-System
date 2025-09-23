"use client"

import { useState, useRef, useEffect } from "react"
import {
  Eye,
  EyeOff,
  User,
  Mail,
  Lock,
  Phone,
  MapPin,
  Calendar,
  CheckCircle,
  AlertCircle,
  Loader2,
  Heart,
} from "lucide-react"
import axios from "axios"

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

const interestOptions = [
  "Emergency Relief",
  "Education Support",
  "Healthcare Aid",
  "Environmental Conservation",
  "Community Development",
  "Disaster Response",
  "Food Security",
  "Clean Water Projects",
]

export default function Register() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    dateOfBirth: "",
    location: "",
    interests: [],
    agreeToTerms: false,
    subscribeNewsletter: true,
  })

  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [registrationStatus, setRegistrationStatus] = useState("idle")
  const [errorMessage, setErrorMessage] = useState("")
  const [successMessage, setSuccessMessage] = useState("")

  const formRef = useRef(null)
  const isVisible = useIntersectionObserver(formRef, { threshold: 0.1 })

  const validateForm = () => {
    const newErrors = {}

    // Name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required"
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required"
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email) {
      newErrors.email = "Email is required"
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long"
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password"
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    // Phone validation
    const phoneRegex = /^\+?[\d\s-()]+$/
    if (!formData.phone) {
      newErrors.phone = "Phone number is required"
    } else if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number"
    }

    // Date of birth validation
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = "Date of birth is required"
    } else {
      const birthDate = new Date(formData.dateOfBirth)
      const today = new Date()
      const age = today.getFullYear() - birthDate.getFullYear()
      if (age < 13) {
        newErrors.dateOfBirth = "You must be at least 13 years old to register"
      }
    }

    // Location validation
    if (!formData.location.trim()) {
      newErrors.location = "Location is required"
    }

    // Terms validation
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "You must agree to the terms and conditions"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const handleInterestToggle = (interest) => {
    const newInterests = formData.interests.includes(interest)
      ? formData.interests.filter((i) => i !== interest)
      : [...formData.interests, interest]

    handleInputChange("interests", newInterests)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    setErrorMessage("")
    setSuccessMessage("")

    try {
      // Make API call using axios
      const response = await axios.post("http://127.0.0.1:8000/account/api/users/", {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        dateOfBirth: formData.dateOfBirth,
        location: formData.location,
        interests: formData.interests,
        subscribeNewsletter: formData.subscribeNewsletter,
        groups: [],
      })

      // Handle successful registration
      setRegistrationStatus("success")
      setSuccessMessage("Registration successful! Welcome to our community of changemakers.")

      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        phone: "",
        dateOfBirth: "",
        location: "",
        interests: [],
        agreeToTerms: false,
        subscribeNewsletter: true,
      })

      // Redirect after success (optional)
      setTimeout(() => {
        // window.location.href = "/login" // Uncomment if you want to redirect
      }, 3000)
    } catch (error) {
      console.error("Registration error:", error)

      // Handle different error scenarios
      if (error.response) {
        // Server responded with error status
        setErrorMessage(error.response.data.message || "Registration failed. Please try again.")
      } else if (error.request) {
        // Request was made but no response received
        setErrorMessage("Network error. Please check your connection and try again.")
      } else {
        // Something else happened
        setErrorMessage("An unexpected error occurred. Please try again.")
      }

      setRegistrationStatus("error")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Reset status after showing success/error
  useEffect(() => {
    if (registrationStatus !== "idle") {
      const timer = setTimeout(() => {
        setRegistrationStatus("idle")
        setErrorMessage("")
        setSuccessMessage("")
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [registrationStatus])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-green-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-emerald-400/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          ></div>
        ))}
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="max-w-4xl w-full">
          <div
            ref={formRef}
            className={`transition-all duration-1000 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            {/* Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white via-emerald-200 to-teal-200 bg-clip-text text-transparent">
                  Join Our Mission
                </h1>
              </div>
              <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
                Become part of a global community dedicated to creating positive change. Together, we can build a better
                tomorrow through compassion and action.
              </p>
              <div className="flex items-center justify-center gap-8 mt-8 text-emerald-300">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                  <span className="text-sm">10,000+ Active Members</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-teal-400 rounded-full animate-pulse"></div>
                  <span className="text-sm">$2M+ Raised</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm">50+ Countries</span>
                </div>
              </div>
            </div>

            {/* Success Message */}
            {registrationStatus === "success" && (
              <div className="mb-8">
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl blur opacity-30"></div>
                  <div className="relative bg-emerald-500/20 backdrop-blur-xl rounded-2xl p-6 border border-emerald-400/30">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white mb-1">Welcome to the Family! 🎉</h3>
                        <p className="text-emerald-200">{successMessage}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Registration Form */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>

              <div className="relative bg-slate-900/90 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-slate-700/50 shadow-2xl">
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Personal Information Section */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <h2 className="text-2xl font-bold text-white">Personal Information</h2>
                    </div>

                    {/* Name Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-emerald-200">First Name *</label>
                        <div className="relative group">
                          <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-emerald-400 transition-colors" />
                          <input
                            type="text"
                            value={formData.firstName}
                            onChange={(e) => handleInputChange("firstName", e.target.value)}
                            className={`w-full pl-12 pr-4 py-4 bg-slate-800/50 border rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 ${
                              errors.firstName
                                ? "border-red-400 ring-2 ring-red-400/20"
                                : "border-slate-600 hover:border-slate-500"
                            }`}
                            placeholder="Enter your first name"
                          />
                          {errors.firstName && (
                            <div className="absolute -bottom-6 left-0 flex items-center gap-1">
                              <AlertCircle className="w-4 h-4 text-red-400" />
                              <span className="text-sm text-red-400">{errors.firstName}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-emerald-200">Last Name *</label>
                        <div className="relative group">
                          <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-emerald-400 transition-colors" />
                          <input
                            type="text"
                            value={formData.lastName}
                            onChange={(e) => handleInputChange("lastName", e.target.value)}
                            className={`w-full pl-12 pr-4 py-4 bg-slate-800/50 border rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 ${
                              errors.lastName
                                ? "border-red-400 ring-2 ring-red-400/20"
                                : "border-slate-600 hover:border-slate-500"
                            }`}
                            placeholder="Enter your last name"
                          />
                          {errors.lastName && (
                            <div className="absolute -bottom-6 left-0 flex items-center gap-1">
                              <AlertCircle className="w-4 h-4 text-red-400" />
                              <span className="text-sm text-red-400">{errors.lastName}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-emerald-200">Email Address *</label>
                      <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-emerald-400 transition-colors" />
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          className={`w-full pl-12 pr-4 py-4 bg-slate-800/50 border rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 ${
                            errors.email
                              ? "border-red-400 ring-2 ring-red-400/20"
                              : "border-slate-600 hover:border-slate-500"
                          }`}
                          placeholder="Enter your email address"
                        />
                        {errors.email && (
                          <div className="absolute -bottom-6 left-0 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4 text-red-400" />
                            <span className="text-sm text-red-400">{errors.email}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Password Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-emerald-200">Password *</label>
                        <div className="relative group">
                          <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-emerald-400 transition-colors" />
                          <input
                            type={showPassword ? "text" : "password"}
                            value={formData.password}
                            onChange={(e) => handleInputChange("password", e.target.value)}
                            className={`w-full pl-12 pr-12 py-4 bg-slate-800/50 border rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 ${
                              errors.password
                                ? "border-red-400 ring-2 ring-red-400/20"
                                : "border-slate-600 hover:border-slate-500"
                            }`}
                            placeholder="Create a strong password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-emerald-400 transition-colors"
                          >
                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                          </button>
                          {errors.password && (
                            <div className="absolute -bottom-6 left-0 flex items-center gap-1">
                              <AlertCircle className="w-4 h-4 text-red-400" />
                              <span className="text-sm text-red-400">{errors.password}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-emerald-200">Confirm Password *</label>
                        <div className="relative group">
                          <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-emerald-400 transition-colors" />
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            value={formData.confirmPassword}
                            onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                            className={`w-full pl-12 pr-12 py-4 bg-slate-800/50 border rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 ${
                              errors.confirmPassword
                                ? "border-red-400 ring-2 ring-red-400/20"
                                : "border-slate-600 hover:border-slate-500"
                            }`}
                            placeholder="Confirm your password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-emerald-400 transition-colors"
                          >
                            {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                          </button>
                          {errors.confirmPassword && (
                            <div className="absolute -bottom-6 left-0 flex items-center gap-1">
                              <AlertCircle className="w-4 h-4 text-red-400" />
                              <span className="text-sm text-red-400">{errors.confirmPassword}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Contact Information Section */}
                  <div className="space-y-6 pt-8 border-t border-slate-700/50">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full flex items-center justify-center">
                        <Phone className="w-4 h-4 text-white" />
                      </div>
                      <h2 className="text-2xl font-bold text-white">Contact Details</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-emerald-200">Phone Number *</label>
                        <div className="relative group">
                          <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-emerald-400 transition-colors" />
                          <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => handleInputChange("phone", e.target.value)}
                            className={`w-full pl-12 pr-4 py-4 bg-slate-800/50 border rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 ${
                              errors.phone
                                ? "border-red-400 ring-2 ring-red-400/20"
                                : "border-slate-600 hover:border-slate-500"
                            }`}
                            placeholder="Enter your phone number"
                          />
                          {errors.phone && (
                            <div className="absolute -bottom-6 left-0 flex items-center gap-1">
                              <AlertCircle className="w-4 h-4 text-red-400" />
                              <span className="text-sm text-red-400">{errors.phone}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-emerald-200">Date of Birth *</label>
                        <div className="relative group">
                          <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-emerald-400 transition-colors" />
                          <input
                            type="date"
                            value={formData.dateOfBirth}
                            onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                            className={`w-full pl-12 pr-4 py-4 bg-slate-800/50 border rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 ${
                              errors.dateOfBirth
                                ? "border-red-400 ring-2 ring-red-400/20"
                                : "border-slate-600 hover:border-slate-500"
                            }`}
                          />
                          {errors.dateOfBirth && (
                            <div className="absolute -bottom-6 left-0 flex items-center gap-1">
                              <AlertCircle className="w-4 h-4 text-red-400" />
                              <span className="text-sm text-red-400">{errors.dateOfBirth}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-emerald-200">Location *</label>
                      <div className="relative group">
                        <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-emerald-400 transition-colors" />
                        <input
                          type="text"
                          value={formData.location}
                          onChange={(e) => handleInputChange("location", e.target.value)}
                          className={`w-full pl-12 pr-4 py-4 bg-slate-800/50 border rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 ${
                            errors.location
                              ? "border-red-400 ring-2 ring-red-400/20"
                              : "border-slate-600 hover:border-slate-500"
                          }`}
                          placeholder="Enter your city, country"
                        />
                        {errors.location && (
                          <div className="absolute -bottom-6 left-0 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4 text-red-400" />
                            <span className="text-sm text-red-400">{errors.location}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Interests Section */}
                  <div className="space-y-6 pt-8 border-t border-slate-700/50">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                        <Heart className="w-4 h-4 text-white" />
                      </div>
                      <h2 className="text-2xl font-bold text-white">Areas of Interest</h2>
                      <span className="text-sm text-slate-400">(Optional)</span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {interestOptions.map((interest) => (
                        <button
                          key={interest}
                          type="button"
                          onClick={() => handleInterestToggle(interest)}
                          className={`group relative px-4 py-3 text-sm font-medium border rounded-xl transition-all duration-300 transform hover:scale-105 ${
                            formData.interests.includes(interest)
                              ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-emerald-500 shadow-lg shadow-emerald-500/25"
                              : "bg-slate-800/50 text-slate-300 border-slate-600 hover:bg-slate-700/50 hover:border-emerald-500/50 hover:text-emerald-300"
                          }`}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/20 to-teal-600/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          <span className="relative">{interest}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Terms and Newsletter */}
                  <div className="space-y-4 pt-8 border-t border-slate-700/50">
                    <div className="space-y-4">
                      <div className="flex items-start gap-4">
                        <input
                          type="checkbox"
                          id="agreeToTerms"
                          checked={formData.agreeToTerms}
                          onChange={(e) => handleInputChange("agreeToTerms", e.target.checked)}
                          className="mt-1 h-5 w-5 text-emerald-600 focus:ring-emerald-500 border-slate-600 rounded bg-slate-800 transition-colors"
                        />
                        <label htmlFor="agreeToTerms" className="text-sm text-slate-300 leading-relaxed">
                          I agree to the{" "}
                          <a href="/terms" className="text-emerald-400 hover:text-emerald-300 underline font-medium">
                            Terms and Conditions
                          </a>{" "}
                          and{" "}
                          <a href="/privacy" className="text-emerald-400 hover:text-emerald-300 underline font-medium">
                            Privacy Policy
                          </a>
                          . I understand that my information will be used to create my account and connect me with
                          donation opportunities. *
                        </label>
                      </div>
                      {errors.agreeToTerms && (
                        <div className="flex items-center gap-2 ml-9">
                          <AlertCircle className="w-4 h-4 text-red-400" />
                          <span className="text-sm text-red-400">{errors.agreeToTerms}</span>
                        </div>
                      )}

                      <div className="flex items-start gap-4">
                        <input
                          type="checkbox"
                          id="subscribeNewsletter"
                          checked={formData.subscribeNewsletter}
                          onChange={(e) => handleInputChange("subscribeNewsletter", e.target.checked)}
                          className="mt-1 h-5 w-5 text-emerald-600 focus:ring-emerald-500 border-slate-600 rounded bg-slate-800 transition-colors"
                        />
                        <label htmlFor="subscribeNewsletter" className="text-sm text-slate-300 leading-relaxed">
                          Subscribe to our newsletter for inspiring stories, campaign updates, and ways to make a bigger
                          impact in your community.
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Error Message */}
                  {registrationStatus === "error" && errorMessage && (
                    <div className="relative group">
                      <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-red-500 rounded-xl blur opacity-30"></div>
                      <div className="relative bg-red-500/20 backdrop-blur-xl rounded-xl p-4 border border-red-400/30">
                        <div className="flex items-center gap-3">
                          <AlertCircle className="w-6 h-6 text-red-400" />
                          <div>
                            <h4 className="font-medium text-red-300">Registration Failed</h4>
                            <p className="text-red-200 text-sm">{errorMessage}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="pt-6">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full group relative px-8 py-5 bg-gradient-to-r from-emerald-500 via-teal-500 to-green-500 text-white font-bold text-lg rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                      <span className="relative flex items-center justify-center gap-3">
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-6 h-6 animate-spin" />
                            Creating Your Account...
                          </>
                        ) : (
                          <>
                            <Heart className="w-6 h-6" />
                            Join Our Community
                          </>
                        )}
                      </span>
                    </button>
                  </div>

                  {/* Login Link */}
                  <div className="text-center pt-6">
                    <p className="text-slate-400">
                      Already have an account?{" "}
                      <a
                        href="/login"
                        className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors underline"
                      >
                        Sign in here
                      </a>
                    </p>
                  </div>
                </form>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="mt-12 text-center">
              <div className="flex items-center justify-center gap-8 text-slate-400 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                  <span>Secure & Encrypted</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-teal-500 rounded-full"></div>
                  <span>Privacy Protected</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>Trusted by Thousands</span>
                </div>
              </div>
            </div>
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

        .animate-float {
          animation: float 3s infinite ease-in-out;
        }
      `}</style>
    </div>
  )
}
