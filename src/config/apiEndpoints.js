// src/config/apiEndpoints.js
// Use Vite env var in production, fallback to localhost for local dev
export const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5050";

export const ENDPOINTS = {
  auth: {
    forgot: `${BASE_URL}/api/auth/forgot-password`,
    resetStatus: `${BASE_URL}/api/auth/reset-status`,
    reset: `${BASE_URL}/api/auth/reset-password`,
  },
};
