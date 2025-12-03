"use client";

import { useState } from "react";
import { Eye, EyeOff, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../../config/apiEndpoints";

export default function AdminRegistration() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    adminId: "",
    fullName: "",
    email: "",
    phone: "",
    designation: "",
    profilePhoto: null,
    govtId: null,
    collegeId: null,
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  const FileUploadField = ({ label, name, fileName, handleFileChange }) => (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-3">
        {label}
      </label>
      <div className="relative">
        <input
          type="file"
          name={name}
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          accept="image/*,.pdf"
        />
        <div className="flex items-center justify-center gap-2 w-full px-4 py-4 border-2 border-dashed border-indigo-300 rounded-lg bg-indigo-50 hover:bg-indigo-100 transition cursor-pointer group">
          <Upload className="w-5 h-5 text-indigo-600 group-hover:scale-110 transition" />
          <span className="text-sm font-medium text-indigo-600">
            {fileName ? "Change File" : "Click to Upload"}
          </span>
        </div>
      </div>
      {fileName && (
        <p className="mt-2 text-sm text-gray-600">
          <strong>Uploaded:</strong> {fileName}
        </p>
      )}
    </div>
  );

  // Updated: generic email pattern instead of @pilani.bits...
  const validateRegistration = () => {
    let temp = {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^[0-9]{10}$/;

    if (!formData.adminId.trim()) temp.adminId = "Admin ID is required.";
    if (!formData.fullName.trim()) temp.fullName = "Full name is required.";
    if (!emailPattern.test(formData.email))
      temp.email = "Please enter a valid email address.";
    if (!phonePattern.test(formData.phone))
      temp.phone = "Phone must be 10 digits.";
    if (!formData.designation.trim())
      temp.designation = "Designation is required.";
    if (!formData.profilePhoto)
      temp.profilePhoto = "Profile photo is required.";
    if (!formData.govtId) temp.govtId = "Government ID is required.";
    if (!formData.collegeId) temp.collegeId = "College ID proof is required.";

    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  const validatePassword = () => {
    let temp = {};
    const passwordPattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^])[A-Za-z\d@$!%*?&#^]{8,}$/;

    if (!passwordPattern.test(formData.password)) {
      temp.password =
        "Password must be at least 8 characters long, include uppercase, lowercase, number, and symbol.";
    }
    if (formData.password !== formData.confirmPassword) {
      temp.confirmPassword = "Passwords do not match.";
    }

    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  const handleRegistrationNext = (e) => {
    e.preventDefault();
    if (validateRegistration()) {
      setStep(2);
      window.scrollTo(0, 0);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (validatePassword()) {
      try {
        const formDataToSend = new FormData();
        formDataToSend.append("adminId", formData.adminId);
        formDataToSend.append("fullName", formData.fullName);
        formDataToSend.append("email", formData.email);
        formDataToSend.append("phone", formData.phone);
        formDataToSend.append("designation", formData.designation);
        formDataToSend.append("password", formData.password);
        formDataToSend.append("profilePhoto", formData.profilePhoto);
        formDataToSend.append("govtId", formData.govtId);
        formDataToSend.append("collegeId", formData.collegeId);

        const response = await fetch(`${BASE_URL}/api/admin/register`, {
          method: "POST",
          body: formDataToSend,
        });

        const data = await response.json();

        if (!response.ok) throw new Error(data.error || "Registration failed");

        setSuccess(true);
        console.log("✅ Admin Registered:", data);
        setTimeout(() => navigate("/Admin"), 2000);
      } catch (error) {
        console.error("Error submitting form:", error);
        alert("An error occurred while registering.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-purple-50 flex justify-center items-center py-10 px-4">
      <div className="bg-white shadow-xl border rounded-xl w-full max-w-3xl p-8">
        {/* ===== Step Indicators ===== */}
        <div className="flex justify-between mb-6">
          <div className="flex-1 text-center">
            <h4
              className={`font-semibold ${
                step === 1 ? "text-purple-700" : "text-gray-500"
              }`}
            >
              Step 1: Registration
            </h4>
            {step === 1 && (
              <div className="h-1 bg-purple-700 mt-1 rounded-full"></div>
            )}
          </div>
          <div className="flex-1 text-center">
            <h4
              className={`font-semibold ${
                step === 2 ? "text-purple-700" : "text-gray-500"
              }`}
            >
              Step 2: Create Password
            </h4>
            {step === 2 && (
              <div className="h-1 bg-purple-700 mt-1 rounded-full"></div>
            )}
          </div>
        </div>

        {/* ===== Step 1: Admin Registration ===== */}
        {step === 1 && (
          <form onSubmit={handleRegistrationNext} className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Admin ID
                </label>
                <input
                  type="text"
                  className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-purple-500"
                  value={formData.adminId}
                  onChange={(e) =>
                    setFormData({ ...formData, adminId: e.target.value })
                  }
                />
                {errors.adminId && (
                  <p className="text-red-600 text-sm">{errors.adminId}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-purple-500"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                />
                {errors.fullName && (
                  <p className="text-red-600 text-sm">{errors.fullName}</p>
                )}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-purple-500"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
                {errors.email && (
                  <p className="text-red-600 text-sm">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-purple-500"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
                {errors.phone && (
                  <p className="text-red-600 text-sm">{errors.phone}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Admin Designation
              </label>
              <input
                type="text"
                className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-purple-500"
                value={formData.designation}
                onChange={(e) =>
                  setFormData({ ...formData, designation: e.target.value })
                }
              />
              {errors.designation && (
                <p className="text-red-600 text-sm">{errors.designation}</p>
              )}
            </div>

            {/* ===== File Uploads ===== */}
            <div className="grid sm:grid-cols-2 gap-6 mt-6">
              <FileUploadField
                label="Upload Profile Photo"
                name="profilePhoto"
                fileName={
                  formData.profilePhoto ? formData.profilePhoto.name : ""
                }
                handleFileChange={(e) =>
                  setFormData({
                    ...formData,
                    profilePhoto: e.target.files[0],
                  })
                }
              />
              <FileUploadField
                label="Upload Government ID"
                name="govtId"
                fileName={formData.govtId ? formData.govtId.name : ""}
                handleFileChange={(e) =>
                  setFormData({ ...formData, govtId: e.target.files[0] })
                }
              />
            </div>

            <div className="mt-5">
              <FileUploadField
                label="Upload College ID Proof"
                name="collegeId"
                fileName={formData.collegeId ? formData.collegeId.name : ""}
                handleFileChange={(e) =>
                  setFormData({
                    ...formData,
                    collegeId: e.target.files[0],
                  })
                }
              />
            </div>

            {errors.profilePhoto && (
              <p className="text-red-600 text-sm mt-2">{errors.profilePhoto}</p>
            )}
            {errors.govtId && (
              <p className="text-red-600 text-sm">{errors.govtId}</p>
            )}
            {errors.collegeId && (
              <p className="text-red-600 text-sm">{errors.collegeId}</p>
            )}

            <div className="text-center pt-4">
              <button
                type="submit"
                className="bg-purple-700 text-white px-6 py-2 rounded-md hover:bg-purple-800 transition"
              >
                Next: Create Password →
              </button>
            </div>
          </form>
        )}

        {/* ===== Step 2: Create Password ===== */}
        {step === 2 && (
          <form onSubmit={handlePasswordSubmit} className="space-y-6">
            <h3 className="text-xl font-semibold text-purple-800 mb-5 text-center">
              Create Your Admin Account Password
            </h3>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full border rounded-md px-3 py-2 pr-10 focus:ring-2 focus:ring-purple-600"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-gray-500 hover:text-purple-700"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-600 text-sm">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    confirmPassword: e.target.value,
                  })
                }
                className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-purple-600"
                required
              />
              {errors.confirmPassword && (
                <p className="text-red-600 text-sm">{errors.confirmPassword}</p>
              )}
            </div>

            <div className="text-center pt-4">
              <button
                type="submit"
                className="bg-purple-700 text-white px-6 py-2 rounded-md hover:bg-purple-800 transition"
              >
                Complete Registration ✅
              </button>
            </div>

            {success && (
              <div className="mt-6 bg-green-50 border border-green-200 rounded-md p-4 text-center">
                <p className="text-green-700 font-medium">
                  🎉 Registration Successful! Redirecting to login...
                </p>
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
