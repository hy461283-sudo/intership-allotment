"use client";
import { useState } from "react";
import { Bell, LogOut, Sun, Moon, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useOrg } from "../../Context/OrgContext";

export default function OrgNavbar() {
  const navigate = useNavigate();
  const { org, theme, setTheme, showProfileMenu, setShowProfileMenu, getPageTitle } = useOrg();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [editFormData, setEditFormData] = useState({
    coordinatorName: "",
    coordinatorEmail: "",
    alternateEmail: "",
    coordinatorPhone: "",
    coordinatorDesignation: "",
  });

  const handleLogout = () => {
    navigate("/Org");
  };

  const handleEditProfile = () => {
    setShowEditProfile(true);
    setShowProfileMenu(false);
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveProfile = () => {
    // Add API call here to save profile changes
    alert("Profile updated! Check your email for password reset instructions.");
    setShowEditProfile(false);
    // Here you would send an email notification to the organization
  };

  return (
    <>
      <header
        className={`flex justify-between items-center px-8 py-4 shadow-sm border-b fixed top-0 right-0 left-64 z-40 ${
          theme === "dark"
            ? "bg-gray-800 border-gray-700"
            : "bg-white border-gray-200"
        }`}
      >
        {/* Left: Portal Name */}
        <div className="flex items-center gap-3">
          <h1
            className={`text-lg font-bold ${
              theme === "dark" ? "text-white" : "text-purple-700"
            }`}
          >
            SIA Portal
          </h1>
        </div>

        {/* Center: Page Title */}
        <h2
          className={`text-lg font-semibold ${
            theme === "dark" ? "text-gray-100" : "text-gray-800"
          }`}
        >
          {getPageTitle()}
        </h2>

        {/* Right: Notification, Org Logo, Org Menu */}
        <div className="flex items-center gap-5">
          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className={`relative p-2 rounded-lg transition-colors ${
                theme === "dark"
                  ? "hover:bg-gray-700"
                  : "hover:bg-gray-100"
              }`}
            >
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <div
                className={`absolute right-0 top-12 w-64 border rounded-lg shadow-lg z-50 ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-200"
                }`}
              >
                <div
                  className={`px-4 py-3 border-b font-semibold text-sm ${
                    theme === "dark"
                      ? "border-gray-700"
                      : "border-gray-200"
                  }`}
                >
                  Notifications
                </div>
                <div className="max-h-64 overflow-y-auto">
                  <div className={`px-4 py-3 text-sm ${
                    theme === "dark"
                      ? "text-gray-400"
                      : "text-gray-500"
                  }`}>
                    No new notifications
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Organization Logo & Name with Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className={`flex items-center gap-2 p-2 rounded-lg transition-colors ${
                theme === "dark"
                  ? "hover:bg-gray-700"
                  : "hover:bg-gray-100"
              }`}
            >
              <img
                src={org.logo}
                alt={org.name}
                className="w-8 h-8 rounded-full border border-purple-700 object-contain"
              />
              <span
                className={`text-sm font-medium ${
                  theme === "dark" ? "text-gray-100" : "text-gray-800"
                }`}
              >
                {org.name.split(" ")[0]}
              </span>
            </button>

            {/* Profile Menu Dropdown */}
            {showProfileMenu && (
              <div
                className={`absolute right-0 top-12 w-56 border rounded-lg shadow-lg z-50 ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-200"
                }`}
              >
                {/* Organization Info */}
                <div
                  className={`px-4 py-3 border-b ${
                    theme === "dark"
                      ? "border-gray-700"
                      : "border-gray-200"
                  }`}
                >
                  <p className="font-semibold text-sm">{org.name}</p>
                  <p
                    className={`text-xs ${
                      theme === "dark"
                        ? "text-gray-400"
                        : "text-gray-500"
                    }`}
                  >
                    {org.email}
                  </p>
                </div>

                {/* Edit Profile */}
                <button
                  onClick={handleEditProfile}
                  className={`w-full px-4 py-2 text-left text-sm flex items-center gap-2 transition-colors ${
                    theme === "dark"
                      ? "hover:bg-gray-700"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <User size={16} />
                  Edit Profile
                </button>

                {/* Theme Toggle */}
                <div
                  className={`px-4 py-2 border-t border-b ${
                    theme === "dark"
                      ? "border-gray-700"
                      : "border-gray-200"
                  }`}
                >
                  <p className="text-xs font-semibold mb-2 text-gray-500">
                    Theme
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setTheme("light")}
                      className={`flex-1 flex items-center justify-center gap-1 px-2 py-1 text-xs rounded transition-colors ${
                        theme === "light"
                          ? "bg-purple-700 text-white"
                          : theme === "dark"
                          ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      <Sun size={14} />
                      Light
                    </button>
                    <button
                      onClick={() => setTheme("dark")}
                      className={`flex-1 flex items-center justify-center gap-1 px-2 py-1 text-xs rounded transition-colors ${
                        theme === "dark"
                          ? "bg-purple-700 text-white"
                          : theme === "light"
                          ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                          : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      }`}
                    >
                      <Moon size={14} />
                      Dark
                    </button>
                  </div>
                </div>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className={`w-full px-4 py-2 text-left text-sm flex items-center gap-2 text-red-600 transition-colors ${
                    theme === "dark"
                      ? "hover:bg-gray-700"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Edit Profile Modal */}
      {showEditProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            className={`${
              theme === "dark" ? "bg-gray-800" : "bg-white"
            } rounded-lg p-6 w-96 shadow-lg`}
          >
            <h3 className="text-lg font-semibold mb-4">
              Edit Coordinator Profile
            </h3>
            <p
              className={`text-sm mb-4 ${
                theme === "dark"
                  ? "text-gray-400"
                  : "text-gray-600"
              }`}
            >
              Update your coordinator details. An email will be sent to
              confirm changes.
            </p>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold mb-1">
                  Coordinator Name
                </label>
                <input
                  type="text"
                  name="coordinatorName"
                  placeholder="Enter coordinator name"
                  value={editFormData.coordinatorName}
                  onChange={handleEditFormChange}
                  className={`w-full border p-2 rounded text-sm ${
                    theme === "dark"
                      ? "bg-gray-700 border-gray-600"
                      : "bg-white border-gray-300"
                  }`}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">
                  Company Email
                </label>
                <input
                  type="email"
                  name="coordinatorEmail"
                  placeholder="coordinator@company.com"
                  value={editFormData.coordinatorEmail}
                  onChange={handleEditFormChange}
                  className={`w-full border p-2 rounded text-sm ${
                    theme === "dark"
                      ? "bg-gray-700 border-gray-600"
                      : "bg-white border-gray-300"
                  }`}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">
                  Alternate Email
                </label>
                <input
                  type="email"
                  name="alternateEmail"
                  placeholder="alternate@email.com"
                  value={editFormData.alternateEmail}
                  onChange={handleEditFormChange}
                  className={`w-full border p-2 rounded text-sm ${
                    theme === "dark"
                      ? "bg-gray-700 border-gray-600"
                      : "bg-white border-gray-300"
                  }`}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">
                  Contact Number (10 digits)
                </label>
                <input
                  type="tel"
                  name="coordinatorPhone"
                  placeholder="9876543210"
                  value={editFormData.coordinatorPhone}
                  onChange={handleEditFormChange}
                  maxLength="10"
                  className={`w-full border p-2 rounded text-sm ${
                    theme === "dark"
                      ? "bg-gray-700 border-gray-600"
                      : "bg-white border-gray-300"
                  }`}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">
                  Designation
                </label>
                <input
                  type="text"
                  name="coordinatorDesignation"
                  placeholder="e.g., HR Manager"
                  value={editFormData.coordinatorDesignation}
                  onChange={handleEditFormChange}
                  className={`w-full border p-2 rounded text-sm ${
                    theme === "dark"
                      ? "bg-gray-700 border-gray-600"
                      : "bg-white border-gray-300"
                  }`}
                />
              </div>
            </div>
            <div className="flex gap-2 mt-6 justify-end">
              <button
                onClick={() => setShowEditProfile(false)}
                className={`px-4 py-2 border rounded text-sm font-medium transition-colors ${
                  theme === "dark"
                    ? "border-gray-600 hover:bg-gray-700"
                    : "border-gray-300 hover:bg-gray-100"
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProfile}
                className="px-4 py-2 bg-purple-700 text-white rounded text-sm font-medium hover:bg-purple-800 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
