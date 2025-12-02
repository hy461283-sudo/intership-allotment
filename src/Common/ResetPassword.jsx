import React, { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Lock, ArrowLeft, CheckCircle, GraduationCap } from "lucide-react";
import { ENDPOINTS } from "../config/apiEndpoints";

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    if (password !== confirm)
      return setMessage("⚠️ Passwords do not match!");
    if (password.length < 6)
      return setMessage("⚠️ Password must be at least 6 characters.");
    setLoading(true);

    try {
      const res = await fetch(ENDPOINTS.auth.reset, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Reset failed.");

      setMessage(data.message || "✅ Password reset successful!");
      setTimeout(() => (window.location.href = "/"), 3000);
    } catch (err) {
      setMessage("❌ " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-purple-50">
      {/* LEFT */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-purple-600 via-purple-700 to-purple-900 items-center justify-center">
        <div className="text-center">
          <div className="inline-block p-8 bg-purple-500/30 rounded-full border border-purple-400/30">
            <GraduationCap className="w-24 h-24 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white">Reset Password</h1>
        </div>
      </div>

      {/* RIGHT */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-8">
        <form
          onSubmit={handleReset}
          className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8 space-y-6"
        >
          <h2 className="text-2xl font-bold text-center text-gray-900">
            Create New Password
          </h2>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-purple-600"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Confirm new password"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-purple-600"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold py-3 rounded-full hover:scale-105 transition-all flex justify-center items-center gap-2"
          >
            <CheckCircle className="w-5 h-5" />
            {loading ? "Updating..." : "Reset Password"}
          </button>

          {message && (
            <p className="text-center text-sm mt-4 text-purple-600">
              {message}
            </p>
          )}

          <div className="text-center mt-6">
            <Link
              to="/"
              className="flex justify-center items-center gap-2 text-purple-600 hover:text-purple-700 font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}