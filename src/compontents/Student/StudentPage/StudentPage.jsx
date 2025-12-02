"use client"

import { useState } from "react"
import { useNavigate } from 'react-router-dom'; 
import { LogOut, Home, Briefcase, FileText, Bell, Sun, Moon } from "lucide-react"

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [showDropdown, setShowDropdown] = useState(false)
  const [theme, setTheme] = useState("light") 
  const navigate = useNavigate();

  const user = {
    name: "Student Name",
    branch: "Branch Name",
    year: "3rd Year",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-t2JCrJ3MMYtjD9GCpYab7dJqHhMVSX.png",
  }

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: <Home size={18} /> },
    { id: "internships", label: "My Internships", icon: <Briefcase size={18} /> },
    { id: "applications", label: "Applications", icon: <FileText size={18} /> },
    { id: "notifications", label: "Notifications", icon: <Bell size={18} /> },
  ]

  const handleLogout = () => {
    navigate('/SLogin');
  }

  

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme)
    setShowDropdown(false);
  }

  const toggleMenu = () => {
    setShowDropdown(!showDropdown);
  }

  return (
    <div className={`min-h-screen flex ${theme === "dark" ? "bg-gray-900 text-gray-200" : "bg-gray-100 text-gray-800"}`}>
      <aside className={`w-64 flex flex-col ${theme === "dark" ? "bg-gray-800 text-gray-200" : "bg-white"}`}>
        <div className="px-6 py-5 border-b border-gray-200">
          <h1 className={`text-xl font-semibold ${theme === "dark" ? "text-white" : "text-purple-700"}`}>Student Panel</h1>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center w-full text-left gap-3 px-4 py-2 rounded-md transition-all ${
                activeTab === item.id
                  ? `${theme === "dark" ? "bg-purple-700 text-white" : "bg-purple-100 text-purple-700"}`
                  : `hover:${theme === "dark" ? "bg-gray-700" : "bg-gray-100"} ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        <div className="mt-auto border-t border-gray-200 px-6 py-4">
          <button 
            className={`flex items-center gap-2 transition font-medium ${theme === "dark" ? "text-red-400 hover:text-red-500" : "text-red-600 hover:text-red-700"}`}
            onClick={handleLogout}
          >       
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <header className={`shadow-sm flex items-center justify-between px-8 py-4 ${theme === "dark" ? "bg-gray-800 text-gray-200" : "bg-white"}`}>
          <div>
            <h2 className="text-2xl font-semibold capitalize">
              {activeTab.replace("-", " ")}
            </h2>
          </div>

          <div className="flex items-center gap-5 relative">
            <button className="relative text-gray-600 hover:text-purple-700 transition">
              <Bell size={20} />
              <span className="absolute top-[-5px] right-[-5px] w-2.5 h-2.5 bg-red-500 rounded-full" />
            </button>

            <div className="relative">
              <button
                onClick={toggleMenu}
                className={`w-8 h-8 rounded-full border border-purple-900 flex items-center justify-center ${
                  theme === "dark"
                    ? "bg-gray-700 hover:bg-gray-600"
                    : "bg-gray-100 hover:bg-gray-200"
                } transition`}
              >
                <img
                  src={user.image}
                  alt="User avatar"
                  className="w-full h-full object-cover rounded-full"
                />
              </button>

              {showDropdown && (
                <div
                  className={`absolute right-0 mt-2 w-40 border rounded-lg shadow-lg z-50 ${
                    theme === "dark"
                      ? "bg-gray-800 border-gray-700 text-gray-200"
                      : "bg-white border-gray-200 text-gray-700"
                  }`}
                >
                  <button 
                   onClick={() => navigate("/Profile")}
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    Profile
                  </button>
                  <button className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100">
                    Settings
                  </button>
                  <button 
                    onClick={() => handleThemeChange("light")}
                    className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 ${
                      theme === "light"
                        ? "bg-purple-100 text-purple-700"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    <Sun size={16} /> Light
                  </button>
                  <button 
                    onClick={() => handleThemeChange("dark")}
                    className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 ${
                      theme === "dark"
                        ? "bg-purple-800 text-purple-200"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    <Moon size={16} /> Dark
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <section className="p-8">
          {activeTab === "dashboard" && (
            <div>
              <h3 className={`text-xl font-semibold mb-4 ${theme === "dark" ? "text-purple-200" : "text-purple-800"}`}>
                Welcome back, {user.name || "Guest"} 👋
              </h3>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className={`p-6 rounded-xl shadow hover:shadow-lg transition ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
                  <h4 className="text-gray-500 text-sm">Internship Matches</h4>
                  <p className={`text-3xl font-semibold mt-2 ${theme === "dark" ? "text-purple-400" : "text-purple-700"}`}>0</p>
                </div>
                <div className={`p-6 rounded-xl shadow hover:shadow-lg transition ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
                  <h4 className="text-gray-500 text-sm">Active Applications</h4>
                  <p className={`text-3xl font-semibold mt-2 ${theme === "dark" ? "text-purple-400" : "text-purple-700"}`}>0</p>
                </div>
                <div className={`p-6 rounded-xl shadow hover:shadow-lg transition ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
                  <h4 className="text-gray-500 text-sm">Offers Received</h4>
                  <p className={`text-3xl font-semibold mt-2 ${theme === "dark" ? "text-purple-400" : "text-purple-700"}`}>0</p>
                </div>
              </div>

              <div className="mt-10">
                <h4 className={`text-lg font-semibold mb-3 ${theme === "dark" ? "text-gray-200" : "text-gray-800"}`}>Recommended Internships</h4>
                {/* Add any content related to recommended internships here */}
              </div>
            </div>
          )}

          {activeTab === "internships" && (
            <div className={`text-center mt-8 p-10 rounded-lg shadow ${theme === "dark" ? "bg-gray-800 text-gray-200" : "bg-white text-gray-700"}`}>
              <h3 className={`text-xl font-semibold mb-2 ${theme === "dark" ? "text-purple-200" : "text-purple-700"}`}>My Current Internship</h3>
              {/* Add any content related to internships here */}
            </div>
          )}

          {activeTab === "applications" && (
            <div className={`mt-8 p-10 rounded-lg shadow ${theme === "dark" ? "bg-gray-800 text-gray-200" : "bg-white text-gray-600"}`}>
              <h3 className={`text-xl font-semibold mb-3 ${theme === "dark" ? "text-purple-200" : "text-purple-700"}`}>My Applications</h3>
              <ul className="space-y-3">
                {/* Add applications content here */}
              </ul>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className={`rounded-lg shadow p-8 mt-8 ${theme === "dark" ? "bg-gray-800 text-gray-200" : "bg-white text-gray-700"}`}>
              <h3 className={`text-xl font-semibold mb-4 ${theme === "dark" ? "text-purple-200" : "text-purple-700"}`}>Recent Notifications 🔔</h3>
              <ul className="space-y-3">
                {/* Add notifications content here */}
              </ul>
            </div>
          )}
        </section>

        <footer className={`text-center py-4 border-t text-sm ${theme === "dark" ? "bg-gray-800 border-gray-700 text-gray-500" : "bg-white border-gray-200 text-gray-500"}`}>
          © 2025 Smart Internship Allotment • Student Dashboard
        </footer>
      </main>
    </div>
  )
}