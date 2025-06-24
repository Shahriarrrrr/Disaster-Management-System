"use client"
import { Link, useLoaderData } from "react-router"
import { useState, useEffect, useRef } from "react"
import {
  MapPin,
  AlertTriangle,
  Calendar,
  Thermometer,
  Filter,
  Cloud,
  Sun,
  Navigation,
  Wind,
  Droplets,
  Gauge,
} from "lucide-react"

// Mock API function - replace with your actual API call
// async function fetchDisasterData() {
//   // Simulate API call
//   await new Promise((resolve) => setTimeout(resolve, 1000))

//   // Mock disaster data with real coordinates
//   return {
//     disasters: [
//       {
//         id: 1,
//         type: "Earthquake",
//         severity: "High",
//         magnitude: 3,
//         latitude: 23.8041,
//         longitude: 90.4152,
//         location: "Dhaka",
//         date: "2024-01-15",
//         affected_people: 15000,
//         status: "Active",
//         description: "Major earthquake causing significant infrastructure damage",
//         casualties: 45,
//         damage_cost: 2500000000,
//       },
//       {
//         id: 2,
//         type: "Flood",
//         severity: "Medium",
//         magnitude: 5.8,
//         latitude: 29.7604,
//         longitude: -95.3698,
//         location: "Houston, TX",
//         date: "2024-01-20",
//         affected_people: 8500,
//         status: "Recovering",
//         description: "Severe flooding due to heavy rainfall",
//         casualties: 12,
//         damage_cost: 850000000,
//       },
//       {
//         id: 3,
//         type: "Wildfire",
//         severity: "High",
//         magnitude: 8.1,
//         latitude: 34.0522,
//         longitude: -118.2437,
//         location: "Los Angeles, CA",
//         date: "2024-01-25",
//         affected_people: 25000,
//         status: "Active",
//         description: "Large wildfire spreading rapidly through residential areas",
//         casualties: 23,
//         damage_cost: 1200000000,
//       },
//       {
//         id: 4,
//         type: "Hurricane",
//         severity: "High",
//         magnitude: 7.9,
//         latitude: 25.7617,
//         longitude: -80.1918,
//         location: "Miami, FL",
//         date: "2024-02-01",
//         affected_people: 45000,
//         status: "Active",
//         description: "Category 4 hurricane with devastating winds and storm surge",
//         casualties: 67,
//         damage_cost: 3200000000,
//       },
//       {
//         id: 5,
//         type: "Tornado",
//         severity: "Medium",
//         magnitude: 6.2,
//         latitude: 35.2271,
//         longitude: -101.8313,
//         location: "Amarillo, TX",
//         date: "2024-02-05",
//         affected_people: 3200,
//         status: "Resolved",
//         description: "EF3 tornado causing significant property damage",
//         casualties: 8,
//         damage_cost: 180000000,
//       },
//       {
//         id: 6,
//         type: "Earthquake",
//         severity: "Low",
//         magnitude: 4.5,
//         latitude: 40.7128,
//         longitude: -74.006,
//         location: "New York, NY",
//         date: "2024-02-10",
//         affected_people: 1200,
//         status: "Resolved",
//         description: "Minor earthquake with minimal damage",
//         casualties: 0,
//         damage_cost: 25000000,
//       },
//       {
//         id: 7,
//         type: "Flood",
//         severity: "High",
//         magnitude: 7.8,
//         latitude: 39.7392,
//         longitude: -104.9903,
//         location: "Denver, CO",
//         date: "2024-02-12",
//         affected_people: 18000,
//         status: "Recovering",
//         description: "Flash flooding from rapid snowmelt and heavy rain",
//         casualties: 15,
//         damage_cost: 950000000,
//       },
//       {
//         id: 8,
//         type: "Wildfire",
//         severity: "Medium",
//         magnitude: 6.8,
//         latitude: 47.6062,
//         longitude: -122.3321,
//         location: "Seattle, WA",
//         date: "2024-02-15",
//         affected_people: 7800,
//         status: "Contained",
//         description: "Forest fire threatening suburban communities",
//         casualties: 3,
//         damage_cost: 420000000,
//       },
//     ],
//   }
// }

// Open-Meteo API integration (Free, no API key required)
async function fetchWeatherData(location) {
  try {
    // First, get coordinates from location name using Nominatim (OpenStreetMap)
    const geoResponse = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}&limit=1`,
    )

    if (!geoResponse.ok) {
      throw new Error("Failed to fetch location data")
    }

    const geoData = await geoResponse.json()
    if (geoData.length === 0) {
      throw new Error("Location not found")
    }

    const { lat, lon, display_name } = geoData[0]

    // Get current weather and forecast from Open-Meteo
    const weatherResponse = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,daylight_duration,sunshine_duration,uv_index_max,precipitation_sum,rain_sum,showers_sum,snowfall_sum,precipitation_hours,precipitation_probability_max,wind_speed_10m_max,wind_gusts_10m_max,wind_direction_10m_dominant&timezone=auto&forecast_days=7`,
    )

    if (!weatherResponse.ok) {
      throw new Error("Failed to fetch weather data")
    }

    const weatherData = await weatherResponse.json()

    return {
      location: {
        name: display_name.split(",")[0],
        full_name: display_name,
        lat: Number.parseFloat(lat),
        lon: Number.parseFloat(lon),
      },
      current: weatherData.current,
      daily: weatherData.daily,
      units: weatherData.current_units,
      timezone: weatherData.timezone,
    }
  } catch (error) {
    console.error("Weather API Error:", error)
    throw error
  }
}

// Weather code to description mapping for Open-Meteo
function getWeatherDescription(code) {
  const weatherCodes = {
    0: { description: "Clear sky", icon: "☀️" },
    1: { description: "Mainly clear", icon: "🌤️" },
    2: { description: "Partly cloudy", icon: "⛅" },
    3: { description: "Overcast", icon: "☁️" },
    45: { description: "Fog", icon: "🌫️" },
    48: { description: "Depositing rime fog", icon: "🌫️" },
    51: { description: "Light drizzle", icon: "🌦️" },
    53: { description: "Moderate drizzle", icon: "🌦️" },
    55: { description: "Dense drizzle", icon: "🌧️" },
    56: { description: "Light freezing drizzle", icon: "🌨️" },
    57: { description: "Dense freezing drizzle", icon: "🌨️" },
    61: { description: "Slight rain", icon: "🌧️" },
    63: { description: "Moderate rain", icon: "🌧️" },
    65: { description: "Heavy rain", icon: "🌧️" },
    66: { description: "Light freezing rain", icon: "🌨️" },
    67: { description: "Heavy freezing rain", icon: "🌨️" },
    71: { description: "Slight snow fall", icon: "❄️" },
    73: { description: "Moderate snow fall", icon: "❄️" },
    75: { description: "Heavy snow fall", icon: "❄️" },
    77: { description: "Snow grains", icon: "❄️" },
    80: { description: "Slight rain showers", icon: "🌦️" },
    81: { description: "Moderate rain showers", icon: "🌧️" },
    82: { description: "Violent rain showers", icon: "🌧️" },
    85: { description: "Slight snow showers", icon: "🌨️" },
    86: { description: "Heavy snow showers", icon: "🌨️" },
    95: { description: "Thunderstorm", icon: "⛈️" },
    96: { description: "Thunderstorm with slight hail", icon: "⛈️" },
    99: { description: "Thunderstorm with heavy hail", icon: "⛈️" },
  }

  return weatherCodes[code] || { description: "Unknown", icon: "🌤️" }
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header Skeleton */}
        <div className="text-center mb-8 animate-pulse">
          <div className="h-12 bg-slate-700/50 rounded-lg w-96 mx-auto mb-4"></div>
          <div className="h-6 bg-slate-700/30 rounded w-64 mx-auto"></div>
        </div>

        {/* Controls Skeleton */}
        <div className="mb-8 flex justify-center">
          <div className="bg-slate-800/50 rounded-xl p-4 animate-pulse">
            <div className="flex gap-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-10 bg-slate-700/50 rounded w-24"></div>
              ))}
            </div>
          </div>
        </div>

        {/* Map Skeleton */}
        <div className="bg-slate-800/50 rounded-2xl h-96 animate-pulse border border-slate-700"></div>

        {/* Stats Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-slate-800/50 rounded-xl p-6 animate-pulse border border-slate-700">
              <div className="h-6 bg-slate-700/50 rounded w-20 mb-2"></div>
              <div className="h-8 bg-slate-700/40 rounded w-16 mb-2"></div>
              <div className="h-4 bg-slate-700/30 rounded w-24"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function WeatherPanel({ weatherData, isVisible, onLocationChange, loadingWeather }) {
  const [showSettings, setShowSettings] = useState(false)
  const [tempLocation, setTempLocation] = useState("")

  const handleLocationSubmit = (e) => {
    e.preventDefault()
    if (tempLocation.trim()) {
      onLocationChange(tempLocation.trim())
      setTempLocation("")
      setShowSettings(false)
    }
  }

  const formatTime = (timeString) => {
    return new Date(timeString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    })
  }

  if (!isVisible) return null

  return (
    <div className="space-y-6">
      {/* Weather Header */}
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl blur opacity-25 group-hover:opacity-40 transition duration-500"></div>
        <div className="relative bg-slate-900/95 backdrop-blur-xl rounded-xl border border-slate-700/50 p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Cloud className="w-6 h-6 text-blue-400" />
              <h2 className="text-xl font-bold text-white">Weather Forecast</h2>
            </div>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg transition-all duration-200"
            >
              <Navigation className="w-5 h-5" />
            </button>
          </div>

          {/* Location Settings */}
          {showSettings && (
            <div className="mb-6 p-4 bg-slate-800/50 rounded-lg">
              <form onSubmit={handleLocationSubmit} className="space-y-3">
                <label className="block text-sm font-medium text-slate-300">Set Weather Location</label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="Enter city name (e.g., Dhaka, London, New York)"
                    value={tempLocation}
                    onChange={(e) => setTempLocation(e.target.value)}
                    className="flex-1 px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                  />
                  <button
                    type="submit"
                    disabled={loadingWeather}
                    className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loadingWeather ? "..." : "Update"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {loadingWeather ? (
            <div className="text-center py-8">
              <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-slate-400">Loading weather data...</p>
            </div>
          ) : weatherData ? (
            <div className="space-y-6">
              {/* Current Weather */}
              <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-lg p-6 border border-blue-400/30">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white">{weatherData.location?.name}</h3>
                    <p className="text-sm text-blue-200">{weatherData.location?.full_name}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-4xl mb-2">{getWeatherDescription(weatherData.current?.weather_code).icon}</div>
                    <div className="text-2xl font-bold text-white">
                      {Math.round(weatherData.current?.temperature_2m || 0)}°C
                    </div>
                  </div>
                </div>

                <div className="text-blue-200 mb-4 capitalize">
                  {getWeatherDescription(weatherData.current?.weather_code).description}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-slate-800/30 rounded-lg p-3 text-center">
                    <Thermometer className="w-5 h-5 text-orange-400 mx-auto mb-1" />
                    <div className="text-xs text-slate-400">Feels like</div>
                    <div className="text-sm font-bold text-white">
                      {Math.round(weatherData.current?.apparent_temperature || 0)}°C
                    </div>
                  </div>
                  <div className="bg-slate-800/30 rounded-lg p-3 text-center">
                    <Droplets className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                    <div className="text-xs text-slate-400">Humidity</div>
                    <div className="text-sm font-bold text-white">
                      {weatherData.current?.relative_humidity_2m || 0}%
                    </div>
                  </div>
                  <div className="bg-slate-800/30 rounded-lg p-3 text-center">
                    <Wind className="w-5 h-5 text-green-400 mx-auto mb-1" />
                    <div className="text-xs text-slate-400">Wind</div>
                    <div className="text-sm font-bold text-white">
                      {Math.round(weatherData.current?.wind_speed_10m || 0)} km/h
                    </div>
                  </div>
                  <div className="bg-slate-800/30 rounded-lg p-3 text-center">
                    <Gauge className="w-5 h-5 text-purple-400 mx-auto mb-1" />
                    <div className="text-xs text-slate-400">Pressure</div>
                    <div className="text-sm font-bold text-white">
                      {Math.round(weatherData.current?.pressure_msl || 0)} hPa
                    </div>
                  </div>
                </div>
              </div>

              {/* 7-Day Forecast */}
              <div className="bg-slate-800/50 rounded-lg p-6">
                <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Sun className="w-5 h-5 text-yellow-400" />
                  7-Day Forecast
                </h4>
                <div className="space-y-3">
                  {weatherData.daily?.time?.slice(0, 7).map((date, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">
                          {getWeatherDescription(weatherData.daily.weather_code[index]).icon}
                        </span>
                        <div>
                          <div className="text-white font-medium">{index === 0 ? "Today" : formatDate(date)}</div>
                          <div className="text-xs text-slate-400 capitalize">
                            {getWeatherDescription(weatherData.daily.weather_code[index]).description}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-white font-bold">
                          {Math.round(weatherData.daily.temperature_2m_max[index])}° /{" "}
                          {Math.round(weatherData.daily.temperature_2m_min[index])}°
                        </div>
                        <div className="text-xs text-blue-400">
                          {weatherData.daily.precipitation_probability_max[index]}% rain
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Additional Weather Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <h5 className="text-white font-medium mb-3 flex items-center gap-2">
                    <Sun className="w-4 h-4 text-yellow-400" />
                    Sun & Moon
                  </h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Sunrise</span>
                      <span className="text-white">{formatTime(weatherData.daily?.sunrise?.[0])}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Sunset</span>
                      <span className="text-white">{formatTime(weatherData.daily?.sunset?.[0])}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Daylight</span>
                      <span className="text-white">
                        {Math.round((weatherData.daily?.daylight_duration?.[0] || 0) / 3600)}h
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-800/50 rounded-lg p-4">
                  <h5 className="text-white font-medium mb-3 flex items-center gap-2">
                    <Droplets className="w-4 h-4 text-blue-400" />
                    Precipitation
                  </h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Today</span>
                      <span className="text-white">{weatherData.daily?.precipitation_sum?.[0] || 0} mm</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Probability</span>
                      <span className="text-white">{weatherData.daily?.precipitation_probability_max?.[0] || 0}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">UV Index</span>
                      <span className="text-white">{Math.round(weatherData.daily?.uv_index_max?.[0] || 0)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <Cloud className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <div className="text-slate-400 text-lg mb-2">No weather data available</div>
              <button
                onClick={() => setShowSettings(true)}
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                Set location to view forecast
              </button>
            </div>
          )}

          <div className="mt-4 pt-4 border-t border-slate-700/50 text-center">
            <p className="text-xs text-slate-400">
              Powered by{" "}
              <a
                href="https://open-meteo.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300"
              >
                Open-Meteo
              </a>{" "}
              • Free & Open Source Weather API
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function DisasterMap({ disasters, selectedTypes, heatmapEnabled }) {
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const markersRef = useRef([])
  const heatLayerRef = useRef(null)
  const [selectedDisaster, setSelectedDisaster] = useState(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [leafletLoaded, setLeafletLoaded] = useState(false)

  // Filter disasters based on selected types
  const filteredDisasters = disasters.filter(
    (disaster) => selectedTypes.length === 0 || selectedTypes.includes(disaster.type),
  )

  // Load Leaflet CSS and JS
  useEffect(() => {
    if (typeof window === "undefined") return

    // Check if Leaflet is already loaded
    if (window.L) {
      setLeafletLoaded(true)
      return
    }

    // Load Leaflet CSS
    const link = document.createElement("link")
    link.rel = "stylesheet"
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
    link.integrity = "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
    link.crossOrigin = ""
    document.head.appendChild(link)

    // Load Leaflet JS
    const script = document.createElement("script")
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
    script.integrity = "sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
    script.crossOrigin = ""
    script.onload = () => {
      setLeafletLoaded(true)
    }
    document.head.appendChild(script)

    return () => {
      if (link.parentNode) link.parentNode.removeChild(link)
      if (script.parentNode) script.parentNode.removeChild(script)
    }
  }, [])

  // Initialize map
  useEffect(() => {
    if (!leafletLoaded || !mapRef.current || mapInstanceRef.current) return

    try {
      // Initialize the map
      const map = window.L.map(mapRef.current, {
        center: [39.8283, -98.5795], // Center of USA
        zoom: 4,
        zoomControl: true,
        scrollWheelZoom: true,
      })

      // Add tile layer (OpenStreetMap with dark theme)
      window.L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: "abcd",
        maxZoom: 19,
      }).addTo(map)

      mapInstanceRef.current = map
      setMapLoaded(true)
    } catch (error) {
      console.error("Error initializing map:", error)
    }
  }, [leafletLoaded])

  // Update markers when disasters or filters change
  useEffect(() => {
    if (!mapInstanceRef.current || !mapLoaded || !window.L) return

    // Clear existing markers
    markersRef.current.forEach((marker) => {
      mapInstanceRef.current.removeLayer(marker)
    })
    markersRef.current = []

    // Clear existing heat layer
    if (heatLayerRef.current) {
      mapInstanceRef.current.removeLayer(heatLayerRef.current)
      heatLayerRef.current = null
    }

    try {
      // Add markers for each disaster
      filteredDisasters.forEach((disaster) => {
        const color = getSeverityColor(disaster.severity)
        const size = getSeveritySize(disaster.severity)

        // Create custom icon
        const icon = window.L.divIcon({
          className: "custom-disaster-marker",
          html: `
            <div style="
              width: ${size}px;
              height: ${size}px;
              background-color: ${color};
              border: 3px solid white;
              border-radius: 50%;
              box-shadow: 0 0 10px rgba(0,0,0,0.5);
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: ${size / 3}px;
              color: white;
              font-weight: bold;
            ">
              ${getDisasterEmoji(disaster.type)}
            </div>
          `,
          iconSize: [size, size],
          iconAnchor: [size / 2, size / 2],
        })

        const marker = window.L.marker([disaster.latitude, disaster.longitude], { icon })
          .addTo(mapInstanceRef.current)
          .on("click", () => {
            setSelectedDisaster(disaster)
          })

        markersRef.current.push(marker)
      })

      // Add heat layer if enabled and we have data
      if (heatmapEnabled && filteredDisasters.length > 0) {
        const heatLayer = window.L.layerGroup()

        filteredDisasters.forEach((disaster) => {
          const intensity = disaster.magnitude / 10
          const radius = 5000 + intensity * 3

          const circle = window.L.circle([disaster.latitude, disaster.longitude], {
            color: getHeatColor(intensity),
            fillColor: getHeatColor(intensity),
            fillOpacity: 0.3,
            radius: radius,
            stroke: false,
          })

          heatLayer.addLayer(circle)
        })

        heatLayer.addTo(mapInstanceRef.current)
        heatLayerRef.current = heatLayer
      }
    } catch (error) {
      console.error("Error updating markers:", error)
    }
  }, [filteredDisasters, heatmapEnabled, mapLoaded])

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "High":
        return "#ef4444"
      case "Medium":
        return "#f59e0b"
      case "Low":
        return "#10b981"
      default:
        return "#6b7280"
    }
  }

  const getSeveritySize = (severity) => {
    switch (severity) {
      case "High":
        return 30
      case "Medium":
        return 24
      case "Low":
        return 18
      default:
        return 20
    }
  }

  const getDisasterEmoji = (type) => {
    switch (type) {
      case "Earthquake":
        return "🌍"
      case "Flood":
        return "🌊"
      case "Wildfire":
        return "🔥"
      case "Hurricane":
        return "🌀"
      case "Tornado":
        return "🌪️"
      default:
        return "⚠️"
    }
  }

  const getHeatColor = (intensity) => {
    if (intensity > 0.8) return "#ef4444"
    if (intensity > 0.6) return "#f59e0b"
    if (intensity > 0.4) return "#eab308"
    if (intensity > 0.2) return "#84cc16"
    return "#10b981"
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="relative">
      {/* Map Container */}
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
        <div className="relative bg-slate-900/90 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-2xl overflow-hidden">
          <div
            ref={mapRef}
            className="w-full h-96 md:h-[500px] lg:h-[600px] rounded-2xl"
            style={{ minHeight: "400px" }}
          >
            {!mapLoaded && (
              <div className="flex items-center justify-center h-full bg-slate-800/50">
                <div className="text-center">
                  <div className="w-8 h-8 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-slate-400">Loading disaster map...</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Disaster Detail Modal */}
      {selectedDisaster && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="relative bg-slate-900/95 backdrop-blur-xl rounded-2xl max-w-md w-full border border-slate-700/50 shadow-2xl">
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl blur opacity-30"></div>

            <div className="relative p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-4 h-4 rounded-full ${
                      selectedDisaster.severity === "High"
                        ? "bg-red-500"
                        : selectedDisaster.severity === "Medium"
                          ? "bg-yellow-500"
                          : "bg-green-500"
                    }`}
                  ></div>
                  <h3 className="text-xl font-bold text-white">{selectedDisaster.type}</h3>
                  <span className="text-2xl">{getDisasterEmoji(selectedDisaster.type)}</span>
                </div>
                <button
                  onClick={() => setSelectedDisaster(null)}
                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg transition-all duration-200"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 text-slate-300">
                  <MapPin className="w-4 h-4 text-emerald-400" />
                  <span>{selectedDisaster.location}</span>
                </div>

                <div className="flex items-center gap-2 text-slate-300">
                  <Calendar className="w-4 h-4 text-emerald-400" />
                  <span>{new Date(selectedDisaster.date).toLocaleDateString()}</span>
                </div>

                <p className="text-slate-300 leading-relaxed">{selectedDisaster.description}</p>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <div className="text-sm text-slate-400">Magnitude</div>
                    <div className="text-lg font-bold text-white">{selectedDisaster.magnitude}</div>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <div className="text-sm text-slate-400">Status</div>
                    <div
                      className={`text-lg font-bold ${
                        selectedDisaster.status === "Active"
                          ? "text-red-400"
                          : selectedDisaster.status === "Recovering"
                            ? "text-yellow-400"
                            : "text-green-400"
                      }`}
                    >
                      {selectedDisaster.status}
                    </div>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <div className="text-sm text-slate-400">Affected People</div>
                    <div className="text-lg font-bold text-white">
                      {selectedDisaster.affected_people.toLocaleString()}
                    </div>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <div className="text-sm text-slate-400">Casualties</div>
                    <div className="text-lg font-bold text-red-400">{selectedDisaster.casualties}</div>
                  </div>
                </div>

                <div className="bg-slate-800/50 rounded-lg p-3">
                  <div className="text-sm text-slate-400">Estimated Damage</div>
                  <div className="text-lg font-bold text-white">{formatCurrency(selectedDisaster.damage_cost)}</div>
                </div>

                <button className="w-full px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  Donate to Relief Efforts
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
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
      <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
      <div className="relative bg-slate-900/90 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 shadow-xl group-hover:shadow-2xl transition-all duration-500 group-hover:scale-105">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <div className="text-slate-300 text-sm font-medium tracking-wide">{title}</div>
            <div className={`text-3xl font-bold bg-gradient-to-r ${color} bg-clip-text text-transparent`}>{value}</div>
            <div className="text-xs text-slate-400">{subtitle}</div>
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

export default function DisasterMapPage() {
  const [disasters, setDisasters] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedTypes, setSelectedTypes] = useState([])
  const [heatmapEnabled, setHeatmapEnabled] = useState(true)
  const [weatherEnabled, setWeatherEnabled] = useState(true)
  const [weatherData, setWeatherData] = useState(null)
  const [weatherLocation, setWeatherLocation] = useState("Dhaka")
  const [loadingWeather, setLoadingWeather] = useState(false)

  const headerRef = useRef(null)
  const mapRef = useRef(null)
  const statsRef = useRef(null)

  const isHeaderVisible = useIntersectionObserver(headerRef, { threshold: 0.1 })
  const isMapVisible = useIntersectionObserver(mapRef, { threshold: 0.1 })
  const isStatsVisible = useIntersectionObserver(statsRef, { threshold: 0.1 })

  const disasterTypes = ["Earthquake", "Flood", "Wildfire", "Hurricane", "Tornado"]
  const data = useLoaderData()
  //console.log('HeatmapData :', datas.data)
  useEffect(() => {
    const loadDisasters = async () => {
      
      
      try {
        //const data = await fetchDisasterData()
        //console.log('Dummy' , data)
        setDisasters(data.data)
      } catch (error) {
        console.error("Error loading disaster data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadDisasters()
  }, [])

  // Load weather data when enabled or location changes
  useEffect(() => {
    if (weatherEnabled && weatherLocation) {
      loadWeatherData(weatherLocation)
    }
  }, [weatherEnabled, weatherLocation])

  const loadWeatherData = async (location) => {
    setLoadingWeather(true)
    try {
      const data = await fetchWeatherData(location)
      setWeatherData(data)
    } catch (error) {
      console.error("Error loading weather data:", error)
      setWeatherData(null)
    } finally {
      setLoadingWeather(false)
    }
  }

  const handleLocationChange = (newLocation) => {
    setWeatherLocation(newLocation)
  }

  const toggleDisasterType = (type) => {
    setSelectedTypes((prev) => (prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]))
  }

  const getDisasterStats = () => {
    const filteredDisasters =
      selectedTypes.length === 0 ? disasters : disasters.filter((d) => selectedTypes.includes(d.type))

    return {
      total: filteredDisasters.length,
      active: filteredDisasters.filter((d) => d.status === "Active").length,
      affected: filteredDisasters.reduce((sum, d) => sum + d.affected_people, 0),
      damage: filteredDisasters.reduce((sum, d) => sum + d.damage_cost, 0),
    }
  }

  const stats = getDisasterStats()

  if (loading) {
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

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div
          ref={headerRef}
          className={`text-center mb-12 transition-all duration-1000 ${
            isHeaderVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`}
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <AlertTriangle className="w-8 h-8 text-red-400 animate-pulse" />
            <span className="bg-red-500/20 border border-red-400/30 text-red-300 px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider backdrop-blur-sm">
              Live Disaster & Weather Tracking
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-white via-emerald-200 to-teal-200 bg-clip-text text-transparent tracking-tight mb-4">
            Global Disaster Map
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Real-time tracking of natural disasters worldwide with comprehensive weather forecasts. Monitor active
            emergencies and weather conditions.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Map and Controls */}
          <div className="lg:col-span-2 space-y-8">
            {/* Controls */}
            <div className="flex flex-col lg:flex-row gap-4 justify-center items-center">
              {/* Disaster Type Filters */}
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl blur opacity-20 group-hover:opacity-30 transition duration-500"></div>
                <div className="relative bg-slate-900/90 backdrop-blur-xl rounded-xl border border-slate-700/50 p-4">
                  <div className="flex flex-wrap gap-2">
                    {disasterTypes.map((type) => (
                      <button
                        key={type}
                        onClick={() => toggleDisasterType(type)}
                        className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                          selectedTypes.includes(type)
                            ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg"
                            : "bg-slate-800/50 text-slate-300 hover:bg-slate-700/50 border border-slate-600"
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Map Controls */}
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl blur opacity-20 group-hover:opacity-30 transition duration-500"></div>
                <div className="relative bg-slate-900/90 backdrop-blur-xl rounded-xl border border-slate-700/50 p-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setHeatmapEnabled(!heatmapEnabled)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                        heatmapEnabled
                          ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg"
                          : "bg-slate-800/50 text-slate-300 hover:bg-slate-700/50 border border-slate-600"
                      }`}
                    >
                      <Thermometer className="w-4 h-4" />
                      Heatmap
                    </button>
                    <button
                      onClick={() => setWeatherEnabled(!weatherEnabled)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                        weatherEnabled
                          ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg"
                          : "bg-slate-800/50 text-slate-300 hover:bg-slate-700/50 border border-slate-600"
                      }`}
                    >
                      <Cloud className="w-4 h-4" />
                      Weather
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 text-slate-300 hover:bg-slate-700/50 border border-slate-600 rounded-lg font-medium transition-all duration-300">
                      <Filter className="w-4 h-4" />
                      Filters
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Map */}
            <div
              ref={mapRef}
              className={`transition-all duration-1000 ${
                isMapVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              <DisasterMap disasters={disasters} selectedTypes={selectedTypes} heatmapEnabled={heatmapEnabled} />
            </div>
          </div>

          {/* Right Column - Weather Panel */}
          <div className="lg:col-span-1">
            <WeatherPanel
              weatherData={weatherData}
              isVisible={weatherEnabled}
              onLocationChange={handleLocationChange}
              loadingWeather={loadingWeather}
            />
          </div>
        </div>

        {/* Statistics */}
        <div
          ref={statsRef}
          className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12 transition-all duration-1000 ${
            isStatsVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          <StatsCard
            title="Total Disasters"
            value={stats.total.toString()}
            subtitle="Currently tracked"
            icon="🌍"
            color="from-red-400 to-red-600"
            delay={0}
          />
          <StatsCard
            title="Active Emergencies"
            value={stats.active.toString()}
            subtitle="Requiring immediate attention"
            icon="🚨"
            color="from-yellow-400 to-orange-600"
            delay={200}
          />
          <StatsCard
            title="People Affected"
            value={stats.affected.toLocaleString()}
            subtitle="Across all disasters"
            icon="👥"
            color="from-blue-400 to-blue-600"
            delay={400}
          />
          <StatsCard
            title="Estimated Damage"
            value={`$${(stats.damage / 1000000000).toFixed(1)}B`}
            subtitle="Total economic impact"
            icon="💰"
            color="from-emerald-400 to-teal-600"
            delay={600}
          />
        </div>

        {/* Legend */}
        <div className="mt-12 flex justify-center">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl blur opacity-20 group-hover:opacity-30 transition duration-500"></div>
            <div className="relative bg-slate-900/90 backdrop-blur-xl rounded-xl border border-slate-700/50 p-6">
              <h3 className="text-lg font-bold text-white mb-4 text-center">Map Legend</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-slate-300 mb-2">Severity Levels</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                      <span className="text-slate-300 text-sm">High Severity</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                      <span className="text-slate-300 text-sm">Medium Severity</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                      <span className="text-slate-300 text-sm">Low Severity</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-slate-300 mb-2">Disaster Types</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🌍</span>
                      <span className="text-slate-300 text-sm">Earthquake</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🌊</span>
                      <span className="text-slate-300 text-sm">Flood</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🔥</span>
                      <span className="text-slate-300 text-sm">Wildfire</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🌀</span>
                      <span className="text-slate-300 text-sm">Hurricane</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🌪️</span>
                      <span className="text-slate-300 text-sm">Tornado</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-slate-300 mb-2">Weather Features</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Cloud className="w-4 h-4 text-blue-400" />
                      <span className="text-slate-300 text-sm">Current Weather</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Sun className="w-4 h-4 text-yellow-400" />
                      <span className="text-slate-300 text-sm">7-Day Forecast</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Navigation className="w-4 h-4 text-emerald-400" />
                      <span className="text-slate-300 text-sm">Custom Location</span>
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
