"use client";
import React, { useState, useEffect } from "react";
import {
  Eye, EyeOff, GraduationCap, Mail, Lock, CheckCircle, ArrowLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../../config/apiEndpoints";

export default function StudentLogin() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("password");
  const [otpSent, setOtpSent] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const [message, setMessage] = useState({ type: "", text: "" });

  const [formData, setFormData] = useState({
    studentId: "",
    password: "",
    rememberMe: false,
    phone: "",
    otp: "",
  });

  // --------------------------------
  // Countdown Timer
  // --------------------------------
  useEffect(() => {
    let timer;
    if (otpTimer > 0) {
      timer = setTimeout(() => setOtpTimer((t) => t - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [otpTimer]);

  const handleInputChange = (e) => {
    const { name, type, checked, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // --------------------------------
  // ✅ Handle Password Login
  // --------------------------------
  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    if (!formData.studentId)
      return setMessage({ type: "error", text: "Student ID is required." });
    if (!formData.password)
      return setMessage({ type: "error", text: "Password is required." });

    try {
      const res = await fetch(`${BASE_URL}/api/student/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: formData.studentId,
          password: formData.password,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("studentId", data.student.studentId); // Always save ID to localStorage
        setMessage({ type: "success", text: "Login successful ✅" });
        setTimeout(() => navigate("/SP"), 1500);
      } else {
        setMessage({ type: "error", text: data.error || "Login failed." });
      }
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    }
  };

  // --------------------------------
  // ✅ Handle Send OTP
  // --------------------------------
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    if (!formData.phone)
      return setMessage({ type: "error", text: "Please enter phone number." });

    try {
      setSendingOtp(true);
      const res = await fetch(`${BASE_URL}/api/student/send-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: formData.phone }),
    });

      const data = await res.json();
      if (res.ok) {
        setOtpSent(true);
        setOtpTimer(60);
        setMessage({ type: "success", text: "OTP sent successfully ✅" });
      } else {
        setMessage({ type: "error", text: data.error || "Failed to send OTP." });
      }
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setSendingOtp(false);
    }
  };

  // --------------------------------
  // ✅ Handle Verify OTP
  // --------------------------------
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    if (!formData.otp)
      return setMessage({ type: "error", text: "Please enter OTP." });

    try {
      const res = await fetch(`${BASE_URL}/api/student/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: formData.phone,
          otp: formData.otp,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage({ type: "success", text: "OTP verified ✅" });
        setTimeout(() => navigate("/SP"), 1500);
      } else {
        setMessage({ type: "error", text: data.error || "Invalid OTP." });
      }
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setOtpSent(false);
    setOtpTimer(0);
    setMessage({ type: "", text: "" });
    setFormData({
      studentId: "",
      password: "",
      rememberMe: false,
      phone: "",
      otp: "",
    });
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
          <h1 className="text-4xl font-bold text-white">
            Welcome to Student Portal!
          </h1>
          <p className="text-purple-100 text-lg">
            Your Dream Internship, just a Click away...
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
            <h2 className="text-2xl font-bold text-gray-900">Student Portal</h2>
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

          {/* PASSWORD LOGIN */}
          {activeTab === "password" && (
            <form onSubmit={handlePasswordLogin} className="space-y-5">
              {/* Student ID */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Student ID
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="studentId"
                    value={formData.studentId}
                    onChange={handleInputChange}
                    placeholder="Enter your Student ID"
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
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Remember Me + Forgot */}
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
            </form>
          )}

          {/* OTP LOGIN */}
          {activeTab === "otp" && (
            <form
              onSubmit={otpSent ? handleVerifyOtp : handleSendOtp}
              className="space-y-5"
            >
              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Registered Phone Number
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter your phone number"
                    disabled={otpSent}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-purple-600 disabled:bg-gray-100"
                  />
                </div>
              </div>

              {!otpSent ? (
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
              ) : (
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
                        {otpTimer > 0 ? `Resend in ${otpTimer}s` : "Resend OTP"}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold py-3 rounded-full hover:scale-105 flex items-center justify-center gap-2 mt-4 shadow-md transition-all"
                  >
                    <span>Verify & Login</span>
                    <CheckCircle className="w-5 h-5" />
                  </button>
                </>
              )}
            </form>
          )}

          {/* Feedback Message */}
          {message.text && (
            <div
              className={`text-sm text-center mt-4 ${
                message.type === "error" ? "text-red-600" : "text-green-600"
              }`}
            >
              {message.text}
            </div>
          )}

          {/* Footer */}
          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              New here?{" "}
              <a
                href="/StudentRegistration"
                className="text-purple-600 hover:text-purple-700 font-medium"
              >
                Create an Account
              </a>
            </p>
          </div>

          <div className="flex justify-end mt-6">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold py-2 px-6 rounded-full shadow-md hover:shadow-lg transform hover:scale-105 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}