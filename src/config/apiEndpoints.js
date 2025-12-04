// src/config/apiEndpoints.js
// Use environment variable for backend URL (supports both Vite and Next.js conventions)
// Vite uses VITE_API_BASE_URL, Next.js uses NEXT_PUBLIC_BASE_URL
export const BASE_URL = 
  import.meta.env?.VITE_API_BASE_URL || 
  import.meta.env?.NEXT_PUBLIC_BASE_URL || 
  "http://localhost:5050";

/**
 * Get authentication token from localStorage
 * @returns {string|null} The token or null if not found
 */
export const getAuthToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("orgToken") || localStorage.getItem("token");
  }
  return null;
};

/**
 * Get authorization headers with token
 * @param {boolean} includeContentType - Whether to include Content-Type header
 * @returns {Object} Headers object
 */
export const getAuthHeaders = (includeContentType = false) => {
  const token = getAuthToken();
  const headers = {};
  
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  
  if (includeContentType) {
    headers["Content-Type"] = "application/json";
  }
  
  return headers;
};

/**
 * API Endpoints for the application
 */
export const ENDPOINTS = {
  auth: {
    forgot: `${BASE_URL}/api/auth/forgot-password`,
    resetStatus: `${BASE_URL}/api/auth/reset-status`,
    reset: `${BASE_URL}/api/auth/reset-password`,
  },
  organization: {
    // Profile/Settings endpoints
    profile: `${BASE_URL}/api/organization/profile`,
    updateProfile: `${BASE_URL}/api/organization/profile`,
    
    // Project endpoints
    getProjects: (orgId) => `${BASE_URL}/api/organization/projects/${orgId}`,
    createProject: `${BASE_URL}/api/organization/projects`,
    updateProject: (projectId) => `${BASE_URL}/api/organization/projects/${projectId}`,
    deleteProject: (projectId) => `${BASE_URL}/api/organization/projects/${projectId}`,
  },
};
