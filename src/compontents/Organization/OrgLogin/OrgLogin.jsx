"use client";

import React, { useState } from "react";
import {
  Eye,
  EyeOff,
  GraduationCap,
  Mail,
  Lock,
  CheckCircle,
  ArrowLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../../config/apiEndpoints";

export default function OrgLogin() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("password");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ✅ Clean Sign-in Handler without alert popups
  const handleSignIn = async (e) => {
    e.preventDefault();

    if (!formData.email.trim() || !formData.password.trim()) {
      // you can also show inline error text instead of alert here
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/api/organization/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();
      console.log("Login Response:", data);

      if (res.ok) {
        // Optionally save organization info for later
        // localStorage.setItem("organization", JSON.stringify(data.organization));

        // ✅ Directly redirect without popup
        navigate("/OrgPortal");
      } else {
        console.error("Login Error:", data.error);
      }
    } catch (err) {
      console.error("🔥 Login Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="min-h-screen flex bg-gray-50 overflow-hidden">
      {/* LEFT PANEL */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-purple-600 via-purple-700 to-purple-900 flex-col items-center justify-center p-8 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center opacity-20">
          <div className="w-96 h-96 bg-purple-900 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 text-center space-y-6">
          <div className="inline-block p-8 bg-purple-500/30 rounded-full border border-purple-400/30">
            <GraduationCap className="w-24 h-24 text-white" strokeWidth={1.5} />
          </div>
          <h1 className="text-4xl md:text-4xl font-bold text-white">
            Welcome to Organization Portal!
          </h1>
          <p className="text-purple-100 text-lg md:text-xl">
            Connect with talent, Empower Futures, just a Click...
          </p>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="w-full lg:w-1/2 flex bg-purple-50 items-center justify-center p-6 sm:p-8">
        <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">
          {/* Logo for Mobile */}
          <div className="lg:hidden mb-8 text-center">
            <div className="inline-block p-4 bg-purple-100 rounded-full mb-4">
              <GraduationCap className="w-10 h-10 text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              Organization Portal
            </h2>
          </div>

          {/* Single Tab */}
          <div className="flex gap-8 mb-8 border-b border-gray-200 justify-center">
            <button
              onClick={() => handleTabChange("password")}
              className={`pb-4 font-semibold transition-colors relative text-2xl  ${
                activeTab === "password"
                  ? "text-gray-900"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Sign In
            </button>
          </div>

          {/* Sign In Form */}
          <form
            onSubmit={activeTab === "password" ? handleSignIn : (e) => e.preventDefault()}
            className="space-y-5"
          >
            {/* USERNAME */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Username
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                <input
                  id="email"
                  type="text"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter organization username (e.g. digicorp@sia.com)"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-purple-600"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3.5 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* REMEMBER ME */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-purple-600 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">Remember me</span>
              </label>
              <a
                href="/Forget"
                className="text-sm text-purple-600 hover:text-purple-700 font-medium"
              >
                Forgot password?
              </a>
            </div>

            {/* SIGN IN BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold py-3 rounded-full shadow-lg transition-all duration-200 transform flex items-center justify-center gap-2 ${
                loading ? "opacity-70 cursor-not-allowed" : "hover:scale-105"
              }`}
            >
              {loading ? (
                <span>Signing In...</span>
              ) : (
                <>
                  <span>Sign In</span>
                  <CheckCircle className="w-5 h-5" />
                </>
              )}
            </button>

            {/* NEW ACCOUNT LINK */}
            <div className="text-center mt-4">
              <p className="text-sm text-gray-600">
                New here?{" "}
                <a
                  href="/OrganizationRegistration"
                  className="text-purple-600 hover:text-purple-700 font-medium"
                >
                  Create an Account
                </a>
              </p>
            </div>

            {/* BACK BUTTON */}
            <div className="flex justify-end mt-6">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold py-2 px-6 rounded-full shadow-md hover:shadow-lg transform hover:scale-105 transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}