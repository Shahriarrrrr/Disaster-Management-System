"use client";

import { useState, useEffect, useContext } from "react";
import {
  AlertTriangle,
  MapPin,
  Phone,
  Clock,
  Shield,
  Zap,
  Navigation,
  Radio,
  AlertCircle,
} from "lucide-react";
import api from "../../api";
import { AuthContext } from "../../context/AuthContext";

function useIntersectionObserver(ref, options = {}) {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, options);

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [ref, options]);

  return isIntersecting;
}

function EmergencyStrobe() {
  return (
    <div className="fixed top-0 left-0 right-0 h-2 bg-gradient-to-r from-red-600 via-yellow-500 to-red-600 animate-emergency-strobe z-50"></div>
  );
}

function EmergencyAlertSlider({ alerts }) {
  return (
    <div className="bg-yellow-500 text-black overflow-hidden relative">
      <div className="animate-marquee whitespace-nowrap py-2 flex items-center">
        {alerts.map((alert, index) => (
          <div key={index} className="inline-flex items-center mx-8">
            <AlertCircle className="w-5 h-5 mr-2" />
            <span className="font-bold">{alert}</span>
          </div>
        ))}
        {/* Duplicate alerts to ensure continuous flow */}
        {alerts.map((alert, index) => (
          <div key={`dup-${index}`} className="inline-flex items-center mx-8">
            <AlertCircle className="w-5 h-5 mr-2" />
            <span className="font-bold">{alert}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-black">
      <EmergencyStrobe />
      <div className="h-screen bg-red-900/20 animate-pulse relative overflow-hidden flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="h-20 bg-red-600/50 rounded-lg w-96 mx-auto animate-pulse"></div>
          <div className="h-8 bg-red-500/30 rounded-lg w-80 mx-auto animate-pulse"></div>
          <div className="text-red-400 text-xl font-bold animate-pulse">
            LOADING EMERGENCY SYSTEM...
          </div>
        </div>
      </div>
    </div>
  );
}

const SOSPage = () => {
  const [formData, setFormData] = useState({
    location_address: "",
    latitude: "",
    longitude: "",
    emergency_type: "Flood",
    additional_details: "",
    contact_number: "",
    emergency_contact: "",
  });

  const [loading, setLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [locationLoading, setLocationLoading] = useState(false);
  const { user } = useContext(AuthContext);
  const user_id = user[0].id;

  // These would normally come from your backend API
  const emergencyAlerts = [
    "ALERT: Severe flooding reported in downtown area. Avoid low-lying areas.",
    "NOTICE: Emergency shelters open at Central High School and Community Center.",
    "WARNING: Heavy rainfall expected to continue for next 24 hours.",
    "UPDATE: Road closures on Highway 101 and Main Street due to flooding.",
    "ALERT: Medical teams dispatched to affected areas. Call 911 for emergencies.",
  ];

  const emergencyTypes = [
    "Flood",
    "Fire",
    "Earthquake",
    "Medical Emergency",
    "Accident",
    "Natural Disaster",
    "Security Threat",
    "Other",
  ];

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const getCurrentLocation = () => {
    setLocationLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setFormData((prev) => ({
            ...prev,
            latitude: latitude.toFixed(2),
            longitude: longitude.toFixed(2),
          }));

          // Reverse geocoding to get address (you would use a real geocoding service)
          setFormData((prev) => ({
            ...prev,
            location_address: `Lat: ${latitude.toFixed(
              6
            )}, Lng: ${longitude.toFixed(6)}`,
          }));
          setLocationLoading(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Unable to get your location. Please enter manually.");
          setLocationLoading(false);
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
      setLocationLoading(false);
    }
  };

  const handleSubmitEmergency = async () => {
    setLoading(true);

    // Validate required fields
    if (
      !formData.location_address ||
      !formData.contact_number ||
      !formData.emergency_contact
    ) {
      alert("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    try {
      const payload = {
        location_address: formData.location_address,
        latitude: formData.latitude || "",
        longitude: formData.longitude || "",
        emergency_type: formData.emergency_type,
        additional_details: formData.additional_details,
        contact_number: formData.contact_number,
        user: user_id,
        emergency_contact: formData.emergency_contact,
      };

      const response = await api.post(
        "/emergency/api/EmergencyRequest/",
        payload
      );

      alert("Emergency request submitted successfully! Help is on the way.");

      // Reset form
      setFormData({
        location_address: "",
        latitude: "",
        longitude: "",
        emergency_type: "Flood",
        additional_details: "",
        contact_number: "",
        emergency_contact: "",
      });
    } catch (error) {
      console.error(
        "Emergency request error:",
        error.response?.data || error.message
      );
      alert(
        "Failed to submit emergency request. Please try again or call emergency services directly."
      );
    } finally {
      setLoading(false);
    }
  };

  if (isPageLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="min-h-screen bg-black text-white relative">
      <EmergencyStrobe />

      {/* Professional Emergency Header */}
      <div className="relative bg-gradient-to-b from-red-800 to-red-900 border-b-2 border-red-600">
        {/* Status Indicators */}
        <div className="absolute top-4 right-4 flex items-center gap-4">
          <div className="flex items-center gap-2 bg-black/30 px-3 py-1 rounded-full">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-green-400 text-sm font-semibold">
              SYSTEM ACTIVE
            </span>
          </div>
        </div>

        <div className="relative max-w-6xl mx-auto px-4 py-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Left Side - Emergency Info */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-yellow-400 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-7 h-7 text-black" />
                </div>
                <div>
                  <h1 className="text-white text-3xl">Hell</h1>
                  <div className="text-yellow-400 font-bold text-sm tracking-wider">
                    EMERGENCY RESPONSE SYSTEM
                  </div>
                  <div className="text-white font-bold text-lg">
                    Disaster Relief Coordination
                  </div>
                </div>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
                Emergency Request
                <span className="block text-yellow-400 text-3xl md:text-4xl mt-2">
                  Submission Portal
                </span>
              </h1>

              <p className="text-red-100 text-lg mb-6 leading-relaxed">
                Submit critical emergency information for immediate response
                coordination. Our dispatch system will alert appropriate
                emergency services and relief teams.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-center gap-2 bg-red-700/50 px-4 py-2 rounded-lg border border-red-600">
                  <Phone className="w-4 h-4 text-yellow-400" />
                  <span className="text-red-100 font-semibold">
                    24/7 Response Available
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-red-700/50 px-4 py-2 rounded-lg border border-red-600">
                  <Clock className="w-4 h-4 text-yellow-400" />
                  <span className="text-red-100 font-semibold">
                    Avg. Response: 8 minutes
                  </span>
                </div>
              </div>
            </div>

            {/* Right Side - Emergency Stats */}
            <div className="bg-black/30 border border-red-600 rounded-lg p-6">
              <h3 className="text-yellow-400 font-bold text-lg mb-4 flex items-center gap-2">
                <Radio className="w-5 h-5" />
                Current Emergency Status
              </h3>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-red-100">Active Response Teams:</span>
                  <span className="text-green-400 font-bold">12 DEPLOYED</span>
                </div>

                <div className="w-full bg-red-900 rounded-full h-3">
                  <div
                    className="bg-green-500 h-3 rounded-full animate-pulse"
                    style={{ width: "85%" }}
                  ></div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-red-100">System Capacity:</span>
                  <span className="text-green-400 font-bold">
                    85% OPERATIONAL
                  </span>
                </div>

                <div className="border-t border-red-700 pt-4 mt-4">
                  <div className="text-red-100 text-sm">Emergency Hotline</div>
                  <div className="text-yellow-400 font-bold text-2xl">911</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Alert Slider */}
      <EmergencyAlertSlider alerts={emergencyAlerts} />

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Emergency Form */}
          <div className="lg:col-span-3">
            <div className="bg-red-900/30 border-2 border-red-500 rounded-lg p-6 mb-6">
              <div className="flex items-center gap-3 mb-6">
                <AlertTriangle className="w-8 h-8 text-yellow-400" />
                <h2 className="text-3xl font-black text-white">
                  EMERGENCY REQUEST FORM
                </h2>
              </div>

              {/* Critical Notice */}
              <div className="bg-yellow-400 text-black p-4 rounded-lg mb-8 border-l-8 border-red-600">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">🚨</span>
                  <div>
                    <h3 className="font-black text-lg">CRITICAL NOTICE</h3>
                    <p className="font-bold">
                      For life-threatening emergencies, call 911 IMMEDIATELY.
                      This form provides additional coordination support.
                    </p>
                  </div>
                </div>
              </div>

              {/* Emergency Type */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-yellow-400 mb-4 flex items-center gap-2">
                  <Zap className="w-6 h-6" />
                  EMERGENCY TYPE *
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {emergencyTypes.map((type) => (
                    <button
                      key={type}
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          emergency_type: type,
                        }))
                      }
                      className={`p-4 rounded-lg border-3 font-bold transition-all duration-200 transform hover:scale-105 ${
                        formData.emergency_type === type
                          ? "border-yellow-400 bg-yellow-400 text-black shadow-lg shadow-yellow-400/50"
                          : "border-red-500 bg-red-900/50 hover:border-yellow-400 text-white hover:bg-red-800/50"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Location Information */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-yellow-400 mb-4 flex items-center gap-2">
                  <MapPin className="w-6 h-6" />
                  LOCATION INFORMATION *
                </h3>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <label className="block text-lg font-bold text-white mb-2">
                        CURRENT LOCATION/ADDRESS
                      </label>
                      <input
                        type="text"
                        name="location_address"
                        value={formData.location_address}
                        onChange={handleInputChange}
                        className="w-full px-4 py-4 bg-black border-2 border-red-500 rounded-lg text-white text-lg font-medium placeholder-red-300 focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/20 outline-none transition-all"
                        placeholder="Enter your exact location or address"
                        required
                      />
                    </div>
                    <button
                      type="button"
                      onClick={getCurrentLocation}
                      disabled={locationLoading}
                      className="px-6 py-4 bg-yellow-400 text-black font-black rounded-lg hover:bg-yellow-300 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mt-9"
                    >
                      {locationLoading ? (
                        <div className="w-5 h-5 border-3 border-black/30 border-t-black rounded-full animate-spin"></div>
                      ) : (
                        <Navigation className="w-5 h-5" />
                      )}
                      {locationLoading ? "LOCATING..." : "GET GPS"}
                    </button>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-lg font-bold text-white mb-2">
                        LATITUDE
                      </label>
                      <input
                        type="number"
                        name="latitude"
                        value={formData.latitude}
                        onChange={handleInputChange}
                        step="any"
                        className="w-full px-4 py-4 bg-black border-2 border-red-500 rounded-lg text-white text-lg font-medium placeholder-red-300 focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/20 outline-none transition-all"
                        placeholder="Auto-filled"
                      />
                    </div>
                    <div>
                      <label className="block text-lg font-bold text-white mb-2">
                        LONGITUDE
                      </label>
                      <input
                        type="number"
                        name="longitude"
                        value={formData.longitude}
                        onChange={handleInputChange}
                        step="any"
                        className="w-full px-4 py-4 bg-black border-2 border-red-500 rounded-lg text-white text-lg font-medium placeholder-red-300 focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/20 outline-none transition-all"
                        placeholder="Auto-filled"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-yellow-400 mb-4 flex items-center gap-2">
                  <Phone className="w-6 h-6" />
                  CONTACT INFORMATION *
                </h3>
                <div>
                  <label className="block text-lg font-bold text-white mb-2">
                    PHONE NUMBER
                  </label>
                  <input
                    type="tel"
                    name="contact_number"
                    value={formData.contact_number}
                    onChange={handleInputChange}
                    className="w-full px-4 py-4 bg-black border-2 border-red-500 rounded-lg text-white text-lg font-medium placeholder-red-300 focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/20 outline-none transition-all"
                    placeholder="Enter your phone number"
                    required
                  />
                </div>
              </div>
              <div className="mb-8">
                <h3 className="text-xl font-bold text-yellow-400 mb-4 flex items-center gap-2">
                  <Phone className="w-6 h-6" />
                  EMERGENCY CONTACT INFORMATION *
                </h3>
                <div>
                  <label className="block text-lg font-bold text-white mb-2">
                    PHONE NUMBER
                  </label>
                  <input
                    type="tel"
                    name="emergency_contact"
                    value={formData.emergency_contact}
                    onChange={handleInputChange}
                    className="w-full px-4 py-4 bg-black border-2 border-red-500 rounded-lg text-white text-lg font-medium placeholder-red-300 focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/20 outline-none transition-all"
                    placeholder="Enter your emergency phone number"
                    required
                  />
                </div>
              </div>

              {/* Additional Details */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-yellow-400 mb-4">
                  EMERGENCY DETAILS
                </h3>
                <textarea
                  name="additional_details"
                  value={formData.additional_details}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-4 bg-black border-2 border-red-500 rounded-lg text-white text-lg font-medium placeholder-red-300 focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/20 outline-none transition-all resize-none"
                  placeholder="Describe the emergency: injuries, number of people affected, immediate dangers, etc."
                />
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmitEmergency}
                disabled={
                  loading ||
                  !formData.location_address ||
                  !formData.contact_number
                }
                className="w-full group relative py-6 bg-gradient-to-r from-red-600 to-red-700 text-white font-black text-2xl rounded-lg border-4 border-yellow-400 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                <span className="relative flex items-center justify-center gap-3">
                  {loading ? (
                    <>
                      <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                      SENDING EMERGENCY REQUEST...
                    </>
                  ) : (
                    <>🚨 SEND EMERGENCY REQUEST 🚨</>
                  )}
                </span>
              </button>
            </div>
          </div>

          {/* Emergency Sidebar */}
          <div className="space-y-6">
            {/* Emergency Contacts */}
            <div className="bg-black border-2 border-yellow-400 rounded-lg p-6">
              <h3 className="text-xl font-black text-yellow-400 mb-4 flex items-center gap-2">
                <Phone className="w-6 h-6" />
                EMERGENCY CONTACTS
              </h3>
              <div className="space-y-4">
                <div className="bg-red-900/50 border border-red-500 rounded-lg p-4">
                  <div className="font-black text-white text-lg">
                    EMERGENCY HOTLINE
                  </div>
                  <div className="text-yellow-400 font-black text-2xl">911</div>
                  <div className="text-red-300 text-sm">
                    Life-threatening emergencies
                  </div>
                </div>
                <div className="bg-red-900/50 border border-red-500 rounded-lg p-4">
                  <div className="font-black text-white text-lg">
                    DISASTER RESPONSE
                  </div>
                  <div className="text-yellow-400 font-black text-xl">
                    +1-800-HELP
                  </div>
                  <div className="text-red-300 text-sm">
                    Specialized emergency teams
                  </div>
                </div>
                <div className="bg-red-900/50 border border-red-500 rounded-lg p-4">
                  <div className="font-black text-white text-lg">
                    COMMUNITY SUPPORT
                  </div>
                  <div className="text-yellow-400 font-black text-xl">
                    +1-800-SUPPORT
                  </div>
                  <div className="text-red-300 text-sm">
                    Local volunteer coordination
                  </div>
                </div>
              </div>
            </div>

            {/* Response Status */}
            <div className="bg-black border-2 border-green-400 rounded-lg p-6">
              <h3 className="text-xl font-black text-green-400 mb-4 flex items-center gap-2">
                <Shield className="w-6 h-6" />
                RESPONSE STATUS
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse ml-auto"></div>
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-white font-bold">Teams Available:</span>
                  <span className="text-green-400 font-black">12 ACTIVE</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-4">
                  <div
                    className="bg-gradient-to-r from-green-400 to-green-500 h-4 rounded-full animate-pulse"
                    style={{ width: "85%" }}
                  ></div>
                </div>
                <div className="flex justify-between">
                  <span className="text-white font-bold">
                    Response Capacity:
                  </span>
                  <span className="text-green-400 font-black">85% READY</span>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-black border-2 border-blue-400 rounded-lg p-6">
              <h3 className="text-xl font-black text-blue-400 mb-4 flex items-center gap-2">
                <Clock className="w-6 h-6" />
                RECENT RESPONSES
              </h3>
              <div className="space-y-3">
                {[
                  { type: "FLOOD", time: "5 min ago", status: "RESPONDING" },
                  { type: "FIRE", time: "12 min ago", status: "RESOLVED" },
                  { type: "MEDICAL", time: "18 min ago", status: "RESOLVED" },
                  { type: "ACCIDENT", time: "25 min ago", status: "RESOLVED" },
                ].map((emergency, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-gray-900 rounded p-3"
                  >
                    <div>
                      <div className="font-bold text-white">
                        {emergency.type}
                      </div>
                      <div className="text-gray-400 text-sm">
                        {emergency.time}
                      </div>
                    </div>
                    <div
                      className={`text-xs px-3 py-1 rounded-full font-bold ${
                        emergency.status === "RESPONDING"
                          ? "bg-red-500 text-white animate-pulse"
                          : "bg-green-500 text-white"
                      }`}
                    >
                      {emergency.status}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes emergency-strobe {
          0%,
          50% {
            opacity: 1;
          }
          25%,
          75% {
            opacity: 0.3;
          }
        }
        .animate-emergency-strobe {
          animation: emergency-strobe 1s infinite;
        }
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default SOSPage;
