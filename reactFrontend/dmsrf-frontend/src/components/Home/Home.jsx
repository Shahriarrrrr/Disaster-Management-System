"use client"

import { useContext, useState, useEffect, useRef } from "react"
import { AuthContext } from "../../context/AuthContext"
import { Link, useLoaderData } from "react-router"
import LatestDonation from "../LatestDonation/LatestDonation"
import LatestCampaigns from "../LatestCampaigns/LatestCampaigns"
import api from "../../api"

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
        <div className="grid gap-8">
          {/* Welcome Section Skeleton */}
          <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 animate-pulse">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div className="space-y-3">
                <div className="h-8 bg-slate-700/50 rounded w-80"></div>
                <div className="h-4 bg-slate-700/30 rounded w-64"></div>
              </div>
              <div className="flex gap-3 mt-4 md:mt-0">
                <div className="h-12 bg-slate-700/50 rounded-xl w-20"></div>
                <div className="h-12 bg-slate-700/50 rounded-xl w-24"></div>
              </div>
            </div>
          </div>

          {/* Stats Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700 animate-pulse">
                <div className="flex justify-between items-start">
                  <div className="space-y-3">
                    <div className="h-4 bg-slate-700/50 rounded w-20"></div>
                    <div className="h-8 bg-slate-700/40 rounded w-16"></div>
                    <div className="h-3 bg-slate-700/30 rounded w-24"></div>
                  </div>
                  <div className="w-12 h-12 bg-slate-700/50 rounded-xl"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Table Skeleton */}
          <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700 animate-pulse">
            <div className="h-6 bg-slate-700/50 rounded w-48 mb-6"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center space-x-4">
                  <div className="h-4 bg-slate-700/40 rounded flex-1"></div>
                  <div className="h-4 bg-slate-700/40 rounded w-24"></div>
                  <div className="h-4 bg-slate-700/40 rounded w-16"></div>
                  <div className="h-4 bg-slate-700/40 rounded w-20"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
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

function StatsCard({ title, value, subtitle, icon, color, delay = 0 }) {
  const cardRef = useRef(null)
  const isVisible = useIntersectionObserver(cardRef, { threshold: 0.1 })

  return (
    <div
      ref={cardRef}
      className={`relative group transition-all duration-1000 ${
        isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-95"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
      <div className="relative bg-slate-900/90 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 shadow-xl group-hover:shadow-2xl transition-all duration-500 group-hover:scale-105">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <div className="text-slate-300 text-sm font-medium tracking-wide">{title}</div>
            <div className={`text-3xl font-bold bg-gradient-to-r ${color} bg-clip-text text-transparent`}>{value}</div>
            <div className="text-xs text-slate-400 flex items-center gap-1">{subtitle}</div>
          </div>
          <div
            className={`p-3 rounded-xl bg-gradient-to-r ${color.replace("text-transparent", "from-opacity-20 to-opacity-30")} backdrop-blur-sm`}
          >
            <div className="text-xl">{icon}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

function EventCard({ event, delay = 0 }) {
  const cardRef = useRef(null)
  const isVisible = useIntersectionObserver(cardRef, { threshold: 0.1 })

  return (
    <div
      ref={cardRef}
      className={`relative group transition-all duration-1000 ${
        isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-95"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
      <div className="relative bg-slate-900/90 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 shadow-xl group-hover:shadow-2xl transition-all duration-500 group-hover:scale-105 overflow-hidden">
        <div className="flex items-start gap-4">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-xl text-center min-w-16 flex flex-col items-center shadow-lg">
            <div className="text-white font-bold text-xl">{event.day}</div>
            <div className="text-sm text-purple-100">{event.month}</div>
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg text-white mb-2 group-hover:text-purple-300 transition-colors duration-300">
              {event.title}
            </h3>
            <div className="flex items-center gap-2 text-sm text-slate-300 mb-1">
              <div className="w-4 h-4 text-purple-400">📍</div>
              <span>{event.location}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-300 mb-3">
              <div className="w-4 h-4 text-purple-400">🕒</div>
              <span>{event.time}</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">{event.description}</p>
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <button className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
            RSVP
          </button>
        </div>
      </div>
    </div>
  )
}



const Home = () => {
  const { user, loading } = useContext(AuthContext)
  const { donations, causes } = useLoaderData()
  const [isPageLoading, setIsPageLoading] = useState(true)
  const [cause, setCause] = useState('');
  const [contact, setContact] = useState('');
  const [age, setAge] = useState('');
  const [success, setSuccess] = useState(null);
  const [message, setMessage] = useState(null);
  const [loadings, setLoadings] = useState(false);
  const [isApplied, setIsApplied] = useState(false);

  const welcomeRef = useRef(null)
  const statsRef = useRef(null)
  const historyRef = useRef(null)
  const campaignsRef = useRef(null)
  const volunteerRef = useRef(null)
  const eventsRef = useRef(null)

  const isWelcomeVisible = useIntersectionObserver(welcomeRef, { threshold: 0.1 })
  const isStatsVisible = useIntersectionObserver(statsRef, { threshold: 0.1 })
  const isHistoryVisible = useIntersectionObserver(historyRef, { threshold: 0.1 })
  const isCampaignsVisible = useIntersectionObserver(campaignsRef, { threshold: 0.1 })
  const isVolunteerVisible = useIntersectionObserver(volunteerRef, { threshold: 0.1 })
  const isEventsVisible = useIntersectionObserver(eventsRef, { threshold: 0.1 })
  const successfulDonations = donations?.filter((d) => d.status === "Success") || []


  const applyVolunteer = async () => {
    setLoadings(true);
    setMessage(null);
    try {
      const response = await api.post('/volunteer/api/join-requests/', {
        cause_of_joining: cause,
        emergency_contact: contact,
        age: parseInt(age),
      });

      setMessage({ type: 'success', text: 'Application submitted successfully!' });
      setCause('');
      setContact('');
      setAge('');
    } catch (error) {
      console.error('Apply error:', error);
      setMessage({
        type: 'error',
        text: error.response?.data?.detail || 'Failed to apply. You may have already submitted.',
      });
    } finally {
      setLoadings(false);
    }
  };
  useEffect(() => {
  const fetchExistingRequest = async () => {
    try {
      const response = await api.get('volunteer/api/join-requests/');
      if (response.data.length > 0) {
        setMessage({ type: 'info', text: 'You have already submitted a request.' });
        setIsApplied(true);
      }
    } catch (err) {
      console.error('Error checking request:', err);
    }
  };

  fetchExistingRequest();
}, []);


  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoading(false)
    }, 1500)
    return () => clearTimeout(timer)
  }, [])

  if (loading || isPageLoading) return <LoadingSkeleton />
  if (!user || user.length === 0) return <p className="text-white text-center">No user data</p>

  const currentUser = user[0]
  const { user_total_donate, user_name, user_awards } = currentUser

  const events = [
    {
      day: "15",
      month: "May",
      title: "Disaster Preparedness Workshop",
      location: "Community Center, Downtown",
      time: "10:00 AM - 2:00 PM",
      description: "Learn essential skills for preparing your family for natural disasters.",
    },
    {
      day: "22",
      month: "May",
      title: "Fundraising Gala Dinner",
      location: "Grand Hotel Ballroom",
      time: "7:00 PM - 10:00 PM",
      description: "Annual fundraising event with special guests and entertainment.",
    },
    {
      day: "29",
      month: "May",
      title: "Volunteer Training Session",
      location: "Relief Fund Headquarters",
      time: "9:00 AM - 12:00 PM",
      description: "Training for new volunteers joining our emergency response teams.",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <main className="relative z-10 flex-1 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
        <div className="grid gap-12">
          {/* Welcome Section */}
          <div
            ref={welcomeRef}
            className={`transition-all duration-1000 ${
              isWelcomeVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
            }`}
          >
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
              <div className="relative bg-slate-900/90 backdrop-blur-xl p-8 rounded-2xl border border-slate-700/50 shadow-2xl">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                  <div className="space-y-3">
                    <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent tracking-tight">
                      Welcome back,{" "}
                      <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                        {user_name}
                      </span>
                    </h1>
                    <p className="text-slate-300 text-lg font-light">Your generosity is making a difference.</p>
                  </div>
                  <div className="flex gap-4 mt-6 md:mt-0">
                    <Link
                      to="/SOS"
                      className="group relative px-8 py-4 bg-gradient-to-r from-red-500 to-red-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <span className="relative flex items-center gap-2">🚨 SOS</span>
                    </Link>
                    <Link
                      to="/aid"
                      className="group relative px-8 py-4 bg-gradient-to-r from-yellow-600 to-red-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-yellow-600 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <span className="relative flex items-center gap-2">
                         Aid Request
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
                      </span>
                    </Link>
                    <Link
                      to="/donatePage"
                      className="group relative px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <span className="relative flex items-center gap-2">
                        💝 Donate
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
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div
            ref={statsRef}
            className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 transition-all duration-1000 ${
              isStatsVisible ? "opacity-100" : "opacity-0"
            }`}
          >
            <StatsCard
              title="Total Donated"
              value={`৳${user_total_donate}`}
              subtitle="Since January 2023"
              icon="💰"
              color="from-blue-400 to-blue-600"
              delay={0}
            />
            <StatsCard
              title="Tier"
              value={user_awards}
              subtitle="3 (30%) more than last year"
              icon="🏆"
              color="from-purple-400 to-purple-600"
              delay={200}
            />
            <StatsCard
              title="People Helped"
              value="~1,200"
              subtitle="Through your contributions"
              icon="👥"
              color="from-amber-400 to-amber-600"
              delay={400}
            />
            <StatsCard
              title="Countries Reached"
              value="8"
              subtitle="Global impact"
              icon="🌍"
              color="from-teal-400 to-teal-600"
              delay={600}
            />
          </div>

          {/* Donation History */}
          <div
            ref={historyRef}
            className={`transition-all duration-1000 ${
              isHistoryVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
              <div className="relative bg-slate-900/90 backdrop-blur-xl p-8 rounded-2xl border border-slate-700/50 shadow-xl">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                    Your Donation History
                  </h2>
                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                    Recent
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="table-auto w-full">
                    <thead>
                      <tr className="border-b border-slate-700/50">
                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300 tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300 tracking-wider">
                          Campaign
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300 tracking-wider">
                          Amount
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300 tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {successfulDonations.slice(0, 3).map((donation, index) => (
                        <LatestDonation key={index} donation={donation} />
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-8 text-right">
                  <Link
                    className="group inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 font-medium transition-all duration-300"
                    to="/donations"
                  >
                    View All Donations
                    <svg
                      className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Active Campaigns */}
          <div
            ref={campaignsRef}
            className={`transition-all duration-1000 ${
              isCampaignsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                Active Campaigns
              </h2>
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse shadow-lg shadow-emerald-500/50"></div>
                <span className="text-emerald-400 font-medium">Live updates</span>
              </div>
            </div>
            <div className="relative h-3 w-full bg-slate-800/50 rounded-full mb-10 overflow-hidden backdrop-blur-sm">
              <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full w-3/4 shadow-lg animate-pulse"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {causes?.map((campaign, index) => (
                <AnimatedCard key={index} delay={index * 200}>
                  <LatestCampaigns campaign={campaign} />
                </AnimatedCard>
              ))}
            </div>
          </div>

          {/* Volunteer Section */}
          <div
            ref={volunteerRef}
            className={`transition-all duration-1000 ${
              isVolunteerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
    <div className="relative group">
      <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
      <div className="relative bg-slate-900/90 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-xl overflow-hidden">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/2 p-10">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent mb-6">
              Become a Volunteer
            </h2>
            <p className="text-slate-300 mb-8 leading-relaxed">
              Join our team of dedicated volunteers and make a direct impact in disaster-affected areas. We need people
              with various skills and backgrounds.
            </p>

            <div className="space-y-4 mb-6">
              <textarea
                placeholder="Why do you want to join?"
                value={cause}
                onChange={(e) => setCause(e.target.value)}
                className="w-full p-3 rounded-lg bg-slate-800 text-white placeholder-slate-400"
              />
              <input
                type="text"
                placeholder="Emergency Contact"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                className="w-full p-3 rounded-lg bg-slate-800 text-white placeholder-slate-400"
              />
              <input
                type="number"
                placeholder="Your Age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full p-3 rounded-lg bg-slate-800 text-white placeholder-slate-400"
              />
            </div>

            {message && (
              <p
                className={`mb-4 text-sm ${
                  message.type === 'error' ? 'text-red-500' : 'text-green-500'
                }`}
              >
                {message.text}
              </p>
            )}

            <ul className="space-y-4 mb-8">
              {[
                'On-site disaster response',
                'Medical assistance',
                'Logistics and distribution',
                'Remote support and coordination',
                'Fundraising and awareness',
              ].map((item, index) => (
                <li key={index} className="flex items-center gap-3 text-slate-300">
                  <div className="w-6 h-6 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  {item}
                </li>
              ))}
            </ul>

            <div className="flex gap-4">
<button
  onClick={applyVolunteer}
  disabled={loading || isApplied}
  className={`px-8 py-4 font-semibold rounded-xl shadow-lg transition-all duration-300 transform ${
    loading || isApplied
      ? 'bg-gray-500 cursor-not-allowed'
      : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:scale-105'
  } text-white`}
>
  {isApplied ? 'Already Applied' : loading ? 'Applying...' : 'Apply Now'}
</button>
              <button className="px-8 py-4 border border-slate-600 text-slate-300 font-semibold rounded-xl hover:bg-slate-800/50 transition-all duration-300 backdrop-blur-sm">
                Learn More
              </button>
            </div>
          </div>

          <div className="md:w-1/2 h-full min-h-[400px] relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20"></div>
            <img
              src="https://placehold.co/500x400"
              alt="Volunteers working"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
          </div>

          {/* Upcoming Events */}
          <div
            ref={eventsRef}
            className={`transition-all duration-1000 ${
              isEventsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent mb-8">
              Upcoming Events
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map((event, index) => (
                <EventCard key={index} event={event} delay={index * 200} />
              ))}
            </div>
          </div>
        </div>
      </main>

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

export default Home
