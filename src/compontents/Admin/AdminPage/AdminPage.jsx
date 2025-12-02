"use client"

import { useState } from "react"
import { useNavigate } from 'react-router-dom';
import { LogOut, Home, Users, Building, FileText, Bell, Settings, Shuffle, Sun, Moon } from "lucide-react"

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [allottedStudents, setAllottedStudents] = useState([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [theme, setTheme] = useState("light") 
  const navigate = useNavigate();

  const admin = {
    name: "Admin User",
    role: "System Administrator",
    avatar: "https://img.icons8.com/fluency/96/admin-settings-male.png",
  }

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: <Home size={18} /> },
    { id: "students", label: "Students", icon: <Users size={18} /> },
    { id: "organizations", label: "Organizations", icon: <Building size={18} /> },
    { id: "allotment", label: "Allotment", icon: <Shuffle size={18} /> },
    { id: "reports", label: "Reports", icon: <FileText size={18} /> },
    { id: "settings", label: "Settings", icon: <Settings size={18} /> },
  ]

  const studentPool = [
    // Add student data here
  ]

  const internshipPool = [
    // Add internship data here
  ]

  function handleAllotment() {
    setIsProcessing(true)
    setTimeout(() => {
      const allotments = studentPool.map((student, index) => ({
        ...student,
        allottedTo: internshipPool[index % internshipPool.length],
      }))
      setAllottedStudents(allotments)
      setIsProcessing(false)
    }, 1500)
  }

  const handleLogout = () => {
    navigate('/Admin');
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
          <h1 className={`text-xl font-semibold ${theme === "dark" ? "text-white" : "text-purple-700"}`}>Admin Panel</h1>
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
            onClick={handleLogout}
            className={`flex items-center gap-2 transition font-medium ${theme === "dark" ? "text-red-400 hover:text-red-500" : "text-red-600 hover:text-red-700"}`}
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <header className={`shadow-sm flex items-center justify-between px-8 py-4 ${theme === "dark" ? "bg-gray-800 text-gray-200" : "bg-white"}`}>
          <h2 className="text-2xl font-semibold capitalize">{activeTab}</h2>

          <div className="flex items-center gap-5 relative">
            <button className="relative text-gray-600 hover:text-purple-700 transition">
              <Bell size={22} />
              <span className="absolute top-[-5px] right-[-5px] w-2.5 h-2.5 bg-red-500 rounded-full" />
            </button>

            <div className="relative">
              <button
                onClick={toggleMenu}
                className={`w-9 h-9 rounded-full border border-purple-900 flex items-center justify-center ${
                  theme === "dark"
                    ? "bg-gray-700 hover:bg-gray-600"
                    : "bg-gray-100 hover:bg-gray-200"
                } transition`}
              >
                <img
                  src={admin.avatar}
                  alt={admin.name}
                  className="w-full h-full object-cover rounded-full"
                />
              </button>

              {showDropdown && (
                <div
                  className={`absolute right-0 mt-2 w-48 border rounded-lg shadow-lg z-50 ${
                    theme === "dark"
                      ? "bg-gray-800 border-gray-700 text-gray-200"
                      : "bg-white border-gray-200 text-gray-700"
                  }`}
                >
                  <button className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100">
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
                Welcome back, Admin 👋
              </h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Add dashboard stats here */}
              </div>
            </div>
          )}

          {activeTab === "allotment" && (
            <div className={`p-8 rounded-lg shadow ${theme === "dark" ? "bg-gray-800 text-gray-200" : "bg-white text-gray-700"}`}>
              <h3 className="text-xl font-semibold text-purple-700 mb-3">
                Internship Allotment System ⚙️
              </h3>
              <p className="text-gray-600 text-sm mb-6">
                Assign internships to students automatically based on availability and eligibility.
              </p>

              <button
                disabled={isProcessing}
                onClick={handleAllotment}
                className={`${
                  isProcessing ? "bg-purple-400" : "bg-purple-700 hover:bg-purple-800"
                } text-white px-5 py-2 rounded-md transition`}
              >
                {isProcessing ? "Processing..." : "Run Smart Allotment"}
              </button>

              {allottedStudents.length > 0 && !isProcessing && (
                <>
                  <div className="mt-8">
                    <h4 className="text-lg font-semibold text-gray-800 mb-3">
                      Allotment Results
                    </h4>
                    <table className="min-w-full border-collapse text-sm">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="p-3 text-left font-medium text-gray-700">
                            Student Name
                          </th>
                          <th className="p-3 text-left font-medium text-gray-700">Department</th>
                          <th className="p-3 text-left font-medium text-gray-700">CGPA</th>
                          <th className="p-3 text-left font-medium text-gray-700">
                            Allotted Company
                          </th>
                          <th className="p-3 text-left font-medium text-gray-700">Role</th>
                        </tr>
                      </thead>
                      <tbody>
                        {allottedStudents.map((s) => (
                          <tr
                            key={s.id}
                            className="border-b hover:bg-gray-50 transition"
                          >
                            <td className="p-3">{s.name}</td>
                            <td className="p-3">{s.dept}</td>
                            <td className="p-3">{s.cgpa}</td>
                            <td className="p-3 text-purple-700">{s.allottedTo.company}</td>
                            <td className="p-3">{s.allottedTo.role}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                    ✅ Allotment completed successfully! Students have been placed into suitable internships.
                  </div>
                </>
              )}
            </div>
          )}
        </section>

        <footer className={`text-center py-4 border-t text-sm ${theme === "dark" ? "bg-gray-800 border-gray-700 text-gray-500" : "bg-white border-gray-200 text-gray-500"}`}>
          © 2025 Smart Internship Allotment • Admin Dashboard
        </footer>
      </main>
    </div>
  )
}