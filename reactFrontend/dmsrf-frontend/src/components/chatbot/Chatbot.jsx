"use client"

import { useState } from "react"

const Chatbot = () => {
  const [messages, setMessages] = useState([])
  const [userInput, setUserInput] = useState("")
  const [loading, setLoading] = useState(false)

  // Replace with your actual API key
  const API_KEY = "GEMINI"

  const disasterPrompts = [
    {
      icon: "🚨",
      title: "Emergency Response",
      prompt: "What should I do during an earthquake emergency?",
      color: "from-red-500 to-red-600",
    },
    {
      icon: "🛡️",
      title: "Disaster Preparedness",
      prompt: "Help me create a comprehensive disaster preparedness plan for my family",
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: "⚡",
      title: "Power Outage Guide",
      prompt: "How do I prepare for and manage extended power outages?",
      color: "from-yellow-500 to-yellow-600",
    },
    {
      icon: "📞",
      title: "Emergency Contacts",
      prompt: "What emergency contacts and communication plans should I have ready?",
      color: "from-green-500 to-green-600",
    },
    {
      icon: "🗺️",
      title: "Evacuation Planning",
      prompt: "Guide me through creating an evacuation plan and route",
      color: "from-purple-500 to-purple-600",
    },
    {
      icon: "🎒",
      title: "72-Hour Kit",
      prompt: "What should I include in a 72-hour emergency survival kit?",
      color: "from-orange-500 to-orange-600",
    },
  ]

  const handleSend = async () => {
    if (!userInput.trim()) return

    const newMessages = [...messages, { role: "user", content: userInput }]
    setMessages(newMessages)
    const currentInput = userInput
    setUserInput("")
    setLoading(true)

    try {
      console.log(typeof currentInput)
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `You are DisasterAI, an expert emergency response and disaster management assistant. Provide helpful, clear, and actionable advice about: emergency response, disaster preparedness, safety protocols, risk assessment, recovery coordination. Always prioritize safety. For life-threatening situations, recommend contacting emergency services immediately.

User question: ${currentInput}`,
                  },
                ],
              },
            ],
          }),
        },
      )

      if (!response.ok) {
        console.log(response)
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response from AI."
      setMessages((prev) => [...prev, { role: "ai", content: reply }])
    } catch (error) {
      console.error("Error details:", error)
      let errorMessage = "Error getting response."

      if (error.message.includes("401")) {
        errorMessage = "Invalid API key. Please check your API key."
      } else if (error.message.includes("403")) {
        errorMessage = "API access forbidden. Check your API key permissions."
      } else if (error.message.includes("429")) {
        errorMessage = "Rate limit exceeded. Please try again later."
      }

      setMessages((prev) => [...prev, { role: "ai", content: errorMessage }])
    } finally {
      setLoading(false)
    }
  }

  const handlePromptClick = (prompt) => {
    setUserInput(prompt.prompt)
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const clearChat = () => {
    setMessages([])
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Premium Header */}
      <div className="bg-gradient-to-r from-red-600 to-orange-600 shadow-2xl">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 p-3 rounded-full backdrop-blur-sm">
                <span className="text-2xl">🚨</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">DisasterAI</h1>
                <p className="text-red-100">Emergency Response & Disaster Management Assistant</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-white font-medium">Online</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        {/* Quick Action Prompts */}
        {messages.length === 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-6 text-center">
              How can I help you prepare or respond to emergencies?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {disasterPrompts.map((prompt, index) => (
                <div
                  key={index}
                  className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:bg-slate-700/50 transition-all duration-300 cursor-pointer group backdrop-blur-sm hover:scale-105"
                  onClick={() => handlePromptClick(prompt)}
                >
                  <div className="flex items-start space-x-4">
                    <div
                      className={`bg-gradient-to-r ${prompt.color} p-3 rounded-lg group-hover:scale-110 transition-transform duration-300`}
                    >
                      <span className="text-xl">{prompt.icon}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-white mb-2">{prompt.title}</h3>
                      <p className="text-slate-300 text-sm leading-relaxed">{prompt.prompt}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Premium Chat Container */}
        <div className="bg-slate-800/30 border border-slate-700 rounded-2xl backdrop-blur-xl shadow-2xl overflow-hidden">
          {/* Chat Header */}
          <div className="border-b border-slate-700 p-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-white font-medium">DisasterAI Chat</span>
              </div>
              <button
                onClick={clearChat}
                className="bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 hover:text-white px-4 py-2 rounded-lg transition-all duration-300 border border-slate-600"
              >
                Clear Chat
              </button>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="h-[500px] overflow-y-auto p-6 space-y-6">
            {messages.length === 0 && (
              <div className="text-center py-12">
                <div className="bg-slate-700/50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🛡️</span>
                </div>
                <p className="text-slate-400 text-lg">
                  Select a topic above or ask me anything about emergency preparedness
                </p>
              </div>
            )}

            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] ${
                    msg.role === "user"
                      ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white"
                      : "bg-slate-700/50 text-slate-100 border border-slate-600"
                  } rounded-2xl px-6 py-4 shadow-lg backdrop-blur-sm`}
                >
                  {msg.role === "ai" && (
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-orange-400">🚨</span>
                      <span className="text-xs font-medium text-orange-400 uppercase tracking-wide">DisasterAI</span>
                    </div>
                  )}
                  <div className="whitespace-pre-wrap break-words leading-relaxed">{msg.content}</div>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-slate-700/50 border border-slate-600 rounded-2xl px-6 py-4 backdrop-blur-sm">
                  <div className="flex items-center space-x-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-orange-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-orange-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                    <span className="text-slate-300 text-sm">DisasterAI is analyzing...</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Premium Input Area */}
          <div className="border-t border-slate-700 p-6">
            <div className="flex space-x-4">
              <div className="flex-1 relative">
                <textarea
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full bg-slate-700/50 border border-slate-600 text-white placeholder-slate-400 px-4 py-3 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm transition-all duration-300"
                  placeholder="Ask about emergency preparedness, disaster response, safety protocols..."
                  rows="1"
                  style={{ minHeight: "48px", maxHeight: "120px" }}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <span className="text-slate-400">🚨</span>
                </div>
              </div>
              <button
                onClick={handleSend}
                className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white px-8 py-3 rounded-xl font-medium shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading || !userInput.trim()}
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Sending</span>
                  </div>
                ) : (
                  "Send"
                )}
              </button>
            </div>

            <div className="mt-4 text-center">
              <p className="text-xs text-slate-500">
                🚨 For immediate life-threatening emergencies, call 911 or your local emergency services
              </p>
              <p className="text-xs text-slate-600 mt-1">Press Enter to send • Shift+Enter for new line</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Chatbot
