"use client"

import { useState, useContext, useRef, useEffect } from "react"
import api from "../../api"
import { REFRESH_TOKEN } from "../../constant"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../../context/AuthContext"
import { Eye, EyeOff, Mail, Lock, Leaf, Shield, Heart } from "lucide-react"

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900 flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700 animate-pulse">
          <div className="space-y-6">
            <div className="h-8 bg-slate-700/50 rounded w-48 mx-auto"></div>
            <div className="space-y-4">
              <div className="h-12 bg-slate-700/30 rounded"></div>
              <div className="h-12 bg-slate-700/30 rounded"></div>
              <div className="h-12 bg-slate-700/50 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function FloatingElement({ children, delay = 0, className = "" }) {
  return (
    <div
      className={`animate-float opacity-60 ${className}`}
      style={{
        animationDelay: `${delay}s`,
        animationDuration: `${3 + Math.random() * 2}s`,
      }}
    >
      {children}
    </div>
  )
}

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isPageLoading, setIsPageLoading] = useState(true)
  const navigate = useNavigate()

  const { updateToken } = useContext(AuthContext)

  const formRef = useRef(null)
  const heroRef = useRef(null)
  const isFormVisible = useIntersectionObserver(formRef, { threshold: 0.1 })
  const isHeroVisible = useIntersectionObserver(heroRef, { threshold: 0.1 })

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoading(false)
    }, 1500)
    return () => clearTimeout(timer)
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await api.post(
        "/api/token/",
        {
          email: email,
          password: password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      )

      if (res.status === 200) {
        localStorage.setItem(REFRESH_TOKEN, res.data.refresh)
        updateToken(res.data.access)
        navigate("/")
      }
    } catch (error) {
      console.error(error)
      alert("Login failed. Please check your credentials.")
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

      {/* Floating Elements */}
      <FloatingElement delay={0} className="absolute top-20 left-20">
        <Leaf className="w-8 h-8 text-emerald-400/30" />
      </FloatingElement>
      <FloatingElement delay={1} className="absolute top-40 right-32">
        <Heart className="w-6 h-6 text-teal-400/30" />
      </FloatingElement>
      <FloatingElement delay={2} className="absolute bottom-32 left-32">
        <Shield className="w-7 h-7 text-green-400/30" />
      </FloatingElement>
      <FloatingElement delay={0.5} className="absolute bottom-20 right-20">
        <Leaf className="w-5 h-5 text-emerald-400/30" />
      </FloatingElement>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-12 items-center">
          {/* Hero Section */}
          <div
            ref={heroRef}
            className={`text-center lg:text-left transition-all duration-1000 ${
              isHeroVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-12"
            }`}
          >
            <div className="space-y-8">
              <div className="flex items-center gap-3 justify-center lg:justify-start">
                <Leaf className="w-8 h-8 text-emerald-400 animate-pulse" />
                <span className="bg-emerald-500 text-white px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider">
                  Relief Platform
                </span>
              </div>

              <h1 className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-white via-emerald-200 to-teal-200 bg-clip-text text-transparent leading-tight">
                Welcome Back to
                <span className="block text-emerald-300">Hope & Recovery</span>
              </h1>

              <p className="text-xl text-slate-300 leading-relaxed max-w-lg">
                Join thousands of changemakers creating positive impact worldwide. Your journey to make a difference
                continues here.
              </p>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-emerald-300">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                  <span className="text-sm">Trusted by 50,000+ donors globally</span>
                </div>
                <div className="flex items-center gap-3 text-teal-300">
                  <div className="w-2 h-2 bg-teal-400 rounded-full animate-pulse"></div>
                  <span className="text-sm">100% transparent impact tracking</span>
                </div>
                <div className="flex items-center gap-3 text-green-300">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm">Supporting communities in 50+ countries</span>
                </div>
              </div>
            </div>
          </div>

          {/* Login Form */}
          <div
            ref={formRef}
            className={`transition-all duration-1000 ${
              isFormVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"
            }`}
          >
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
              <div className="relative bg-slate-900/90 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-2xl p-8">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-emerald-200 bg-clip-text text-transparent mb-2">
                    Sign In to Your Account
                  </h2>
                  <p className="text-slate-400">Continue your journey of making a difference</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Email Field */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-300">Email Address</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-slate-400" />
                      </div>
                      <input
                        type="email"
                        placeholder="Enter your email"
                        className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all backdrop-blur-sm"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-300">Password</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-slate-400" />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        className="w-full pl-10 pr-12 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all backdrop-blur-sm"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5 text-slate-400 hover:text-slate-300 transition-colors" />
                        ) : (
                          <Eye className="h-5 w-5 text-slate-400 hover:text-slate-300 transition-colors" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Forgot Password */}
                  <div className="flex justify-end">
                    <a
                      href="#"
                      className="text-sm text-emerald-400 hover:text-emerald-300 hover:underline transition-colors"
                    >
                      Forgot your password?
                    </a>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full group relative py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <span className="relative flex items-center justify-center gap-2">
                      {loading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Signing In...
                        </>
                      ) : (
                        <>
                          <Leaf className="w-5 h-5" />
                          Sign In to Continue
                        </>
                      )}
                    </span>
                  </button>

                  {/* Divider */}
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-600"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-slate-900 text-slate-400">New to our platform?</span>
                    </div>
                  </div>

                  {/* Sign Up Link */}
                  <div className="text-center">
                    <a
                      href="#"
                      className="group inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 font-medium transition-all duration-300"
                    >
                      Create an account
                      <svg
                        className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
                    </a>
                  </div>
                </form>

                {/* Trust Indicators */}
                <div className="mt-8 pt-6 border-t border-slate-700/50">
                  <div className="flex items-center justify-center gap-6 text-xs text-slate-400">
                    <div className="flex items-center gap-1">
                      <Shield className="w-3 h-3" />
                      <span>Secure Login</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart className="w-3 h-3" />
                      <span>Trusted Platform</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Leaf className="w-3 h-3" />
                      <span>Global Impact</span>
                    </div>
                  </div>
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

export default Login
