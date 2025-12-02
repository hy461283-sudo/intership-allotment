"use client";

import React, { useState, useEffect } from "react";
import {
  Eye,
  EyeOff,
  GraduationCap,
  Mail,
  Lock,
  CheckCircle,
  ArrowLeft,
} from "lucide-react";
import { BASE_URL } from "../../../config/apiEndpoints";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("password");
  const [otpSent, setOtpSent] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const [message, setMessage] = useState({ type: "", text: "" });

  const [formData, setFormData] = useState({
    admin_id: "",
    password: "",
    rememberMe: false,
    phoneOrEmail: "",
    otp: "",
  });

  // ✅ Admin ID validator (alphanumeric, underscores, etc.)
  const validateAdminId = (admin_id) => /^[A-Za-z0-9_-]+$/.test(admin_id);
  const validatePhone = (phone) => /^[0-9]{10,}$/.test(phone);

  useEffect(() => {
    let timer;
    if (otpTimer > 0) timer = setTimeout(() => setOtpTimer((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [otpTimer]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ===== OTP Send / Verify =====
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    if (!formData.phoneOrEmail || !validatePhone(formData.phoneOrEmail))
      return setMessage({ type: "error", text: "Enter valid 10-digit phone." });

    try {
      setSendingOtp(true);
      const response = await fetch(`${BASE_URL}/api/admin/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: formData.phoneOrEmail }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      setOtpSent(true);
      setOtpTimer(60);
      setMessage({ type: "success", text: "OTP sent successfully" });
    } catch (error) {
      console.error("OTP send error:", error);
      setMessage({ type: "error", text: error.message });
    } finally {
      setSendingOtp(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${BASE_URL}/api/admin/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: formData.phoneOrEmail, otp: formData.otp }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setMessage({ type: "success", text: "OTP verified successfully" });
      setTimeout(() => (window.location.href = "/AdminPortal"), 1000);
    } catch (error) {
      console.error("OTP verify error:", error);
      setMessage({ type: "error", text: "Invalid OTP" });
    }
  };

  // ===== Password Login =====
  const handleSignIn = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    if (!formData.admin_id || !formData.admin_id.trim())
      return setMessage({ type: "error", text: "Please enter your Admin ID." });
    if (!validateAdminId(formData.admin_id.trim()))
      return setMessage({ type: "error", text: "Enter a valid Admin ID." });
    if (!formData.password || !formData.password.trim())
      return setMessage({ type: "error", text: "Please enter your password." });

    try {
      const response = await fetch(`${BASE_URL}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          admin_id: formData.admin_id,
          password: formData.password,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Invalid credentials.");

      setMessage({ type: "success", text: "Login successful! Redirecting..." });
      localStorage.setItem("adminInfo", JSON.stringify(data.admin));
      setTimeout(() => (window.location.href = "/AdminPortal"), 1000);
    } catch (error) {
      console.error("Login error:", error);
      setMessage({ type: "error", text: error.message });
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setOtpSent(false);
    setOtpTimer(0);
    setMessage({ type: "", text: "" });
    setFormData({
      admin_id: "",
      password: "",
      rememberMe: false,
      phoneOrEmail: "",
      otp: "",
    });
  };

  // =================== UI ===================
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
          <h1 className="text-4xl font-bold text-white">
            Welcome to Admin Portal!
          </h1>
          <p className="text-purple-100 text-lg">
            Where Oversight meets Insight...
          </p>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="w-full lg:w-1/2 flex bg-purple-50 items-center justify-center p-6 sm:p-8">
        <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">
          <div className="lg:hidden mb-8 text-center">
            <div className="inline-block p-4 bg-purple-100 rounded-full mb-4">
              <GraduationCap className="w-10 h-10 text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Admin Portal</h2>
          </div>

          {/* Tabs */}
          <div className="flex gap-8 mb-8 border-b border-gray-200 justify-center">
            <button
              onClick={() => handleTabChange("password")}
              className={`pb-4 font-semibold transition-colors relative ${
                activeTab === "password"
                  ? "text-gray-900"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Password Login
              {activeTab === "password" && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-purple-600 rounded-t"></div>
              )}
            </button>
            <button
              onClick={() => handleTabChange("otp")}
              className={`pb-4 font-semibold transition-colors relative ${
                activeTab === "otp"
                  ? "text-gray-900"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              OTP Login
              {activeTab === "otp" && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-purple-600 rounded-t"></div>
              )}
            </button>
          </div>

          {/* FORM */}
          <form
            onSubmit={activeTab === "password" ? handleSignIn : handleSendOtp}
            className="space-y-5"
          >
            {/* ====== PASSWORD LOGIN ====== */}
            {activeTab === "password" && (
              <>
                {/* Admin ID */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Admin ID
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="admin_id"
                      value={formData.admin_id}
                      onChange={handleInputChange}
                      placeholder="Enter your Admin ID"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-purple-600"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                    <input
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
                      className="absolute right-4 top-3.5 text-gray-400"
                    >
                      {showPassword ? <EyeOff /> : <Eye />}
                    </button>
                  </div>
                </div>

                {/* Remember me + Forgot password */}
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

                                {/* Sign In */}
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold py-3 rounded-full hover:scale-105 shadow-md flex items-center justify-center gap-2 transition-all"
                >
                  <span>Sign In</span>
                  <CheckCircle className="w-5 h-5" />
                </button>
              </>
            )}

            {/* ====== OTP LOGIN ====== */}
            {activeTab === "otp" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mobile Number
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="phoneOrEmail"
                      value={formData.phoneOrEmail}
                      onChange={handleInputChange}
                      placeholder="Enter your phone number"
                      disabled={otpSent}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-purple-600 disabled:bg-gray-100"
                    />
                  </div>
                </div>

                {!otpSent && (
                  <button
                    type="submit"
                    disabled={sendingOtp}
                    className={`w-full text-white font-semibold py-3 rounded-full transition ${
                      sendingOtp
                        ? "bg-purple-300 cursor-not-allowed"
                        : "bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
                    }`}
                  >
                    {sendingOtp ? "Sending OTP..." : "Send OTP"}
                  </button>
                )}

                {otpSent && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Enter OTP
                      </label>
                      <div className="flex gap-3">
                        <input
                          type="text"
                          name="otp"
                          value={formData.otp}
                          onChange={handleInputChange}
                          placeholder="Enter 6-digit OTP"
                          maxLength={6}
                          className="w-full px-4 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-purple-600"
                        />
                        <button
                          type="button"
                          onClick={handleSendOtp}
                          disabled={otpTimer > 0}
                          className={`px-4 py-3 border border-purple-600 rounded-full font-medium ${
                            otpTimer > 0
                              ? "text-purple-400 border-purple-300 cursor-not-allowed"
                              : "text-purple-600 hover:bg-purple-50"
                          }`}
                        >
                          {otpTimer > 0
                            ? `Resend in ${otpTimer}s`
                            : "Resend OTP"}
                        </button>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleVerifyOtp}
                      className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold py-3 rounded-full hover:scale-105 flex items-center justify-center gap-2 mt-4 shadow-md transition-all"
                    >
                      <span>Sign In</span>
                      <CheckCircle className="w-5 h-5" />
                    </button>
                  </>
                )}
              </>
            )}

            {/* ==== Message Display ==== */}
            {message.text && (
              <div
                className={`text-sm text-center mt-3 ${
                  message.type === "error"
                    ? "text-red-600"
                    : "text-green-600"
                }`}
              >
                {message.text}
              </div>
            )}

            {/* Extra Links */}
            <div className="text-center mt-4">
              <p className="text-sm text-gray-600">
                New here?{" "}
                <a
                  href="/AdminRegistration"
                  className="text-purple-600 hover:text-purple-700 font-medium"
                >
                  Create an Account
                </a>
              </p>
            </div>

            {/* Back Button */}
            <div className="flex justify-end mt-6">
              <button
                type="button"
                onClick={() => window.history.back()}
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