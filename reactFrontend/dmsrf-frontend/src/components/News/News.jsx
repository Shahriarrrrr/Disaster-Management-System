"use client"

import { useState, useEffect } from "react"
import { Calendar, Search, RefreshCw, MapPin, Filter } from "lucide-react"
import { useLoaderData } from "react-router"

// Mock API data based on your structure


const News = () => {
  const [newsData, setNewsData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedType, setSelectedType] = useState("all")
  const [refreshing, setRefreshing] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  const news = useLoaderData()
  console.log(news)

  // setNewsData(news)

  // Mock API call
  const fetchNewsData = async () => {
    setLoading(true)
  try {
    const response = await fetch(
      "https://api.reliefweb.int/v1/disasters?appname=rwint-user-0&profile=list&preset=latest&slim=1"
    );

    if (!response.ok) {
      throw new Response("Failed to fetch disaster data", { status: response.status });
    }
    const data = await response.json();
    setNewsData(data) // This will be available in your component via useLoaderData
  } catch (error) {
      console.error("Error fetching news data:", error)
    } finally {
      setLoading(false)
    }
  }

  const refreshData = async () => {
    setRefreshing(true)
    await fetchNewsData()
    setRefreshing(false)
  }

  useEffect(() => {
    fetchNewsData()
  }, [])

  // Filter data based on search and filters
  const filteredData =
    newsData?.data?.filter((item) => {
      const matchesSearch =
        item.fields.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.fields.country[0].name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = selectedStatus === "all" || item.fields.status === selectedStatus
      const matchesType =
        selectedType === "all" ||
        item.fields.type.some((type) => type.name.toLowerCase().includes(selectedType.toLowerCase()))

      return matchesSearch && matchesStatus && matchesType
    }) || []

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getUniqueTypes = () => {
    if (!newsData?.data) return []
    const types = new Set()
    newsData.data.forEach((item) => {
      item.fields.type.forEach((type) => types.add(type.name))
    })
    return Array.from(types)
  }

  const featuredStory = filteredData[0]
  const mainStories = filteredData.slice(1, 4)
  const sideStories = filteredData.slice(4)

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mb-4 mx-auto"></div>
          <p className="text-gray-600 font-serif">Loading latest reports...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b-4 border-gray-900 bg-white">
        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Top Bar */}
          <div className="flex items-center justify-between mb-6 text-sm text-gray-600">
            <div className="flex items-center space-x-4">
              <span>
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
              <span>•</span>
              <span>Global Edition</span>
            </div>
            <div className="flex items-center space-x-4">
              <span>Updated {formatTime(new Date().toISOString())}</span>
              <button
                onClick={refreshData}
                disabled={refreshing}
                className="flex items-center space-x-1 hover:text-gray-900 transition-colors"
              >
                <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
                <span>Refresh</span>
              </button>
            </div>
          </div>

          {/* Main Header */}
          <div className="text-center mb-8">
            <h1 className="text-6xl font-serif font-bold text-gray-900 mb-2 tracking-tight">Global Crisis Monitor</h1>
            <p className="text-lg text-gray-600 font-serif italic">
              Comprehensive Coverage of International Disasters and Emergencies
            </p>
          </div>

          {/* Stats Bar */}
          <div className="border-t border-b border-gray-300 py-4 mb-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-gray-900">{newsData?.totalCount?.toLocaleString()}</div>
                <div className="text-sm text-gray-600 uppercase tracking-wide">Total Incidents</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600">
                  {filteredData.filter((item) => item.fields.status === "ongoing").length}
                </div>
                <div className="text-sm text-gray-600 uppercase tracking-wide">Ongoing</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">
                  {filteredData.filter((item) => item.fields.status === "alert").length}
                </div>
                <div className="text-sm text-gray-600 uppercase tracking-wide">Alerts</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{newsData?.took}s</div>
                <div className="text-sm text-gray-600 uppercase tracking-wide">Response Time</div>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search incidents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-none focus:outline-none focus:border-gray-900 font-serif"
              />
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 hover:bg-gray-50 transition-colors font-serif"
              >
                <Filter className="h-4 w-4" />
                <span>Filters</span>
              </button>
              {showFilters && (
                <div className="flex space-x-2">
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="px-3 py-2 border border-gray-300 focus:outline-none focus:border-gray-900 font-serif"
                  >
                    <option value="all">All Status</option>
                    <option value="ongoing">Ongoing</option>
                    <option value="alert">Alert</option>
                  </select>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="px-3 py-2 border border-gray-300 focus:outline-none focus:border-gray-900 font-serif"
                  >
                    <option value="all">All Types</option>
                    {getUniqueTypes().map((type) => (
                      <option key={type} value={type.toLowerCase()}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Featured Story */}
          <div className="lg:col-span-2">
            {featuredStory && (
              <article className="border-b border-gray-300 pb-6 mb-6">
                <div className="flex items-center space-x-2 mb-3">
                  <span
                    className={`px-2 py-1 text-xs font-bold uppercase tracking-wide ${
                      featuredStory.fields.status === "ongoing"
                        ? "bg-red-100 text-red-800"
                        : "bg-orange-100 text-orange-800"
                    }`}
                  >
                    {featuredStory.fields.status}
                  </span>
                  <span className="text-xs text-gray-500 uppercase tracking-wide">
                    {featuredStory.fields.type.map((t) => t.name).join(", ")}
                  </span>
                </div>
                <a href={featuredStory.fields.url} target="_blank" rel="noopener noreferrer" className="block">
                  <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4 leading-tight hover:text-blue-600 cursor-pointer transition-colors">
                    {featuredStory.fields.name}
                  </h2>
                </a>
                <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                  <span className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4" />
                    <span>{featuredStory.fields.country[0].name}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(featuredStory.fields.date.created)}</span>
                  </span>
                  <span className="text-gray-400">ID: {featuredStory.fields.glide}</span>
                </div>
                <p className="text-gray-700 font-serif leading-relaxed">
                  Emergency response teams are coordinating relief efforts as the situation continues to develop.
                  International aid organizations have been mobilized to provide immediate assistance to affected
                  populations.
                </p>
              </article>
            )}

            {/* Main Stories */}
            <div className="space-y-6">
              {mainStories.map((item) => (
                <article key={item.id} className="border-b border-gray-200 pb-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <span
                      className={`px-2 py-1 text-xs font-bold uppercase tracking-wide ${
                        item.fields.status === "ongoing" ? "bg-red-100 text-red-800" : "bg-orange-100 text-orange-800"
                      }`}
                    >
                      {item.fields.status}
                    </span>
                  </div>
                  <a href={item.fields.url} target="_blank" rel="noopener noreferrer" className="block">
                    <h3 className="text-xl font-serif font-bold text-gray-900 mb-2 hover:text-blue-600 cursor-pointer transition-colors">
                      {item.fields.name}
                    </h3>
                  </a>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>{item.fields.country[0].name}</span>
                    <span>•</span>
                    <span>{formatDate(item.fields.date.created)}</span>
                    <span>•</span>
                    <span>{item.fields.type.map((t) => t.name).join(", ")}</span>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-2 space-y-8">
            {/* Breaking News */}
            <section className="border-l-4 border-red-600 pl-4">
              <h3 className="text-lg font-serif font-bold text-gray-900 mb-4 uppercase tracking-wide">Breaking</h3>
              <div className="space-y-4">
                {sideStories.slice(0, 3).map((item) => (
                  <article key={item.id} className="pb-3 border-b border-gray-200 last:border-b-0">
                    <a href={item.fields.url} target="_blank" rel="noopener noreferrer">
                      <h4 className="font-serif font-semibold text-gray-900 mb-1 hover:text-blue-600 cursor-pointer transition-colors">
                        {item.fields.name}
                      </h4>
                    </a>
                    <div className="text-sm text-gray-600">
                      <span>{item.fields.country[0].name}</span>
                      <span className="mx-2">•</span>
                      <span>{formatTime(item.fields.date.created)}</span>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            {/* World Watch */}
            <section className="border border-gray-300 p-4">
              <h3 className="text-lg font-serif font-bold text-gray-900 mb-4 uppercase tracking-wide border-b border-gray-300 pb-2">
                World Watch
              </h3>
              <div className="space-y-3">
                {sideStories.slice(3).map((item) => (
                  <article key={item.id} className="text-sm">
                    <a href={item.fields.url} target="_blank" rel="noopener noreferrer">
                      <h4 className="font-serif font-semibold text-gray-900 mb-1 hover:text-blue-600 cursor-pointer transition-colors">
                        {item.fields.name}
                      </h4>
                    </a>
                    <div className="text-gray-600">
                      {item.fields.country[0].name} • {formatDate(item.fields.date.created)}
                    </div>
                  </article>
                ))}
              </div>
            </section>

            {/* Market Data Style Box */}
            <section className="border border-gray-300 p-4 bg-gray-50">
              <h3 className="text-lg font-serif font-bold text-gray-900 mb-4 uppercase tracking-wide">
                Crisis Metrics
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Active Incidents</span>
                  <span className="font-mono">{filteredData.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Countries Affected</span>
                  <span className="font-mono">
                    {new Set(filteredData.map((item) => item.fields.country[0].name)).size}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Response Time</span>
                  <span className="font-mono">{newsData?.took}s</span>
                </div>
                <div className="flex justify-between">
                  <span>Last Update</span>
                  <span className="font-mono">{formatTime(new Date().toISOString())}</span>
                </div>
              </div>
            </section>
          </div>
        </div>

        {filteredData.length === 0 && (
          <div className="text-center py-12 border-t border-gray-300 mt-8">
            <h3 className="text-xl font-serif font-semibold text-gray-900 mb-2">No incidents match your criteria</h3>
            <p className="text-gray-600">Please adjust your search terms or filters</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t-2 border-gray-900 bg-gray-50 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="text-center text-sm text-gray-600">
            <p className="mb-2">
              Displaying {filteredData.length} of {newsData?.count} incidents from{" "}
              {newsData?.totalCount?.toLocaleString()} total records
            </p>
            <p>
              Data refreshed every {newsData?.time} minutes • Response time: {newsData?.took}s • Last updated:{" "}
              {new Date().toLocaleString()}
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default News
