import React, { useState } from "react";
import { Mail, ArrowLeft, GraduationCap, RefreshCcw } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { ENDPOINTS } from "../config/apiEndpoints";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetStatus, setResetStatus] = useState("");
  const [checking, setChecking] = useState(false);

  const handleSendResetEmail = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setResetStatus("");

    try {
      const res = await fetch(ENDPOINTS.auth.forgot, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send reset email.");

      setMessage(data.message);
      startPollingStatus(email);
    } catch (err) {
      setMessage("❌ " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const startPollingStatus = (userEmail) => {
    if (!userEmail) return;
    setChecking(true);
    const poll = setInterval(async () => {
      try {
        const res = await fetch(
          `${ENDPOINTS.auth.resetStatus}/${userEmail}`
        );
        const data = await res.json();
        if (data.status && data.status !== "pending") {
          setResetStatus(data.status);
          clearInterval(poll);
          setChecking(false);
          if (data.status === "approved") {
            navigate(`/reset-password?token=${data.token}`);
          }
        }
      } catch (err) {
        console.error("Polling error:", err);
      }
    }, 5000);

    setTimeout(() => {
      clearInterval(poll);
      setChecking(false);
    }, 120000); // stop after 2 minutes
  };

  const renderStatus = () => {
    if (resetStatus === "approved")
      return (
        <p className="text-center mt-4 text-green-600 font-medium">
          ✅ Reset request approved! Redirecting...
        </p>
      );
    if (resetStatus === "denied")
      return (
        <p className="text-center mt-4 text-red-600 font-medium">
          🚫 Password reset denied by user.
        </p>
      );
    if (checking)
      return (
        <p className="text-center mt-4 text-yellow-600 font-medium flex justify-center items-center gap-2">
          <RefreshCcw className="w-4 h-4 animate-spin" />
          Waiting for confirmation...
        </p>
      );
    return null;
  };

  return (
    <div className="min-h-screen flex bg-purple-50">
      {/* LEFT SIDE */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-purple-600 via-purple-700 to-purple-900 flex-col items-center justify-center p-8">
        <div className="text-center text-white space-y-6 relative z-10">
          <div className="inline-block p-8 bg-purple-500/30 rounded-full border border-purple-400/30">
            <GraduationCap className="w-24 h-24 text-white" />
          </div>
          <h1 className="text-4xl font-bold">Forgot Your Password?</h1>
          <p className="text-purple-200 mx-10">
            You’ll receive a confirmation email to verify this request.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white shadow-lg rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-center mb-6 text-purple-700">
            Reset Your Password
          </h2>

          <form onSubmit={handleSendResetEmail} className="space-y-5">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Enter registered email"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-purple-600"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold py-3 rounded-full hover:scale-105 transition-all"
            >
              {loading ? "Sending..." : "Send Confirmation Email"}
            </button>
          </form>

          {message && (
            <p className="text-center text-sm mt-4 text-purple-600">
              {message}
            </p>
          )}
          {renderStatus()}

          <div className="text-center mt-6">
            <Link
              to="/"
              className="flex justify-center items-center gap-2 text-purple-600 hover:text-purple-700 font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}