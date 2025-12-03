// "use client";

import { useState } from "react";
import { Eye, EyeOff, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../../config/apiEndpoints";

export default function StudentRegistration() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    // Step 1: Personal Info
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    profilePhoto: null,

    // Step 2: Family Info
    guardianName: "",
    relation: "",
    guardianEmail: "",
    guardianPhone: "",
    guardianAddress: "",
    guardianIdProof: null,

    // Step 3: Academic Info
    enrollmentNumber: "",
    branch: "",
    semester: "",
    cgpa: "",

    // Step 4: Password
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  // ===== Reusable File Upload Component =====
  const FileUploadField = ({ label, name, fileName, handleFileChange }) => (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-3">
        {label} <span className="text-red-500">*</span>
      </label>
      <div className="relative">
        <input
          type="file"
          name={name}
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          accept="image/*,.pdf"
        />
        <div className="flex items-center justify-center gap-2 w-full px-4 py-4 border-2 border-dashed border-purple-300 rounded-lg bg-purple-50 hover:bg-purple-100 transition cursor-pointer group">
          <Upload className="w-5 h-5 text-purple-600 group-hover:scale-110 transition" />
          <span className="text-sm font-medium text-purple-600">
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

  // ===== Step 1 Validation: Personal Info =====
  const validateStep1 = () => {
    let temp = {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^[0-9]{10}$/;

    if (!formData.firstName.trim()) temp.firstName = "First name is required.";
    if (!formData.lastName.trim()) temp.lastName = "Last name is required.";
    if (!emailPattern.test(formData.email))
      temp.email = "Please enter a valid email address.";
    if (!phonePattern.test(formData.phone))
      temp.phone = "Phone must be 10 digits.";
    if (!formData.dateOfBirth) temp.dateOfBirth = "Date of birth is required.";
    if (!formData.gender) temp.gender = "Gender is required.";
    if (!formData.profilePhoto) temp.profilePhoto = "Profile photo is required.";

    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  // ===== Step 2 Validation: Family Info =====
  const validateStep2 = () => {
    let temp = {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^[0-9]{10}$/;

    if (!formData.guardianName.trim()) temp.guardianName = "Guardian name is required.";
    if (!formData.relation) temp.relation = "Relation is required.";
    if (!emailPattern.test(formData.guardianEmail))
      temp.guardianEmail = "Please enter a valid guardian email.";
    if (!phonePattern.test(formData.guardianPhone))
      temp.guardianPhone = "Guardian phone must be 10 digits.";
    if (!formData.guardianAddress.trim())
      temp.guardianAddress = "Guardian address is required.";
    if (!formData.guardianIdProof) temp.guardianIdProof = "Guardian ID proof is required.";

    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  // ===== Step 3 Validation: Academic Info =====
  const validateStep3 = () => {
    let temp = {};

    if (!formData.enrollmentNumber.trim())
      temp.enrollmentNumber = "Enrollment number is required.";
    if (!formData.branch) temp.branch = "Branch is required.";
    if (!formData.semester) temp.semester = "Semester is required.";
    if (!formData.cgpa || isNaN(formData.cgpa) || formData.cgpa < 0 || formData.cgpa > 10)
      temp.cgpa = "CGPA must be a number between 0 and 10.";

    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  // ===== Step 4 Validation: Password =====
  const validateStep4 = () => {
    let temp = {};
    const passwordPattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^])[A-Za-z\d@$!%*?&#^]{8,}$/;

    if (!passwordPattern.test(formData.password)) {
      temp.password =
        "Password must be at least 8 characters long with uppercase, lowercase, number, and symbol.";
    }
    if (formData.password !== formData.confirmPassword) {
      temp.confirmPassword = "Passwords do not match.";
    }

    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  // ===== Handle Step Navigation =====
  const handleNextStep = (e) => {
    e.preventDefault();
    
    if (step === 1 && validateStep1()) {
      setStep(2);
      window.scrollTo(0, 0);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
      window.scrollTo(0, 0);
    } else if (step === 3 && validateStep3()) {
      setStep(4);
      window.scrollTo(0, 0);
    }
  };

  const handleBackStep = () => {
    setStep(step - 1);
    window.scrollTo(0, 0);
  };

  // ===== Submit Registration =====
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep4()) return;

    try {
      const formDataToSend = new FormData();
      
      // Personal Info
      formDataToSend.append("firstName", formData.firstName);
      formDataToSend.append("lastName", formData.lastName);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("phone", formData.phone);
      formDataToSend.append("dateOfBirth", formData.dateOfBirth);
      formDataToSend.append("gender", formData.gender);
      formDataToSend.append("profilePhoto", formData.profilePhoto);
      
      // Family Info
      formDataToSend.append("guardianName", formData.guardianName);
      formDataToSend.append("relation", formData.relation);
      formDataToSend.append("guardianEmail", formData.guardianEmail);
      formDataToSend.append("guardianPhone", formData.guardianPhone);
      formDataToSend.append("guardianAddress", formData.guardianAddress);
      formDataToSend.append("guardianIdProof", formData.guardianIdProof);
      
      // Academic Info
      formDataToSend.append("enrollmentNumber", formData.enrollmentNumber);
      formDataToSend.append("branch", formData.branch);
      formDataToSend.append("semester", formData.semester);
      formDataToSend.append("cgpa", formData.cgpa);
      
      // Password
      formDataToSend.append("password", formData.password);

      const response = await fetch(`${BASE_URL}/api/student/register`, {
        method: "POST",
        body: formDataToSend,
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Registration failed");

      setSuccess(true);
      console.log("✅ Student Registered:", data);
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("An error occurred while registering: " + error.message);
      setErrors({ submit: error.message });
    }
  };

  return (
    <div className="min-h-screen bg-purple-50 flex justify-center items-center py-10 px-4">
      <div className="bg-white shadow-xl border rounded-xl w-full max-w-3xl p-8">
        
        {/* ===== Step Indicators ===== */}
        <div className="flex justify-between mb-8">
          {["Personal Info", "Family Info", "Academic Info", "Password"].map(
            (label, idx) => (
              <div key={idx} className="flex-1 text-center">
                <h4
                  className={`font-semibold text-sm ${
                    step === idx + 1 ? "text-purple-700" : "text-gray-500"
                  }`}
                >
                  Step {idx + 1}: {label}
                </h4>
                {step === idx + 1 && (
                  <div className="h-1 bg-purple-700 mt-2 rounded-full"></div>
                )}
              </div>
            )
          )}
        </div>

        {/* ===== STEP 1: Personal Info ===== */}
        {step === 1 && (
          <form onSubmit={handleNextStep} className="space-y-5">
            <h3 className="text-lg font-semibold text-purple-800 mb-4">
              Step 1: Personal Information
            </h3>

            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                />
                {errors.firstName && (
                  <p className="text-red-600 text-sm mt-1">{errors.firstName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                />
                {errors.lastName && (
                  <p className="text-red-600 text-sm mt-1">{errors.lastName}</p>
                )}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
                {errors.email && (
                  <p className="text-red-600 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
                {errors.phone && (
                  <p className="text-red-600 text-sm mt-1">{errors.phone}</p>
                )}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Birth <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
                  value={formData.dateOfBirth}
                  onChange={(e) =>
                    setFormData({ ...formData, dateOfBirth: e.target.value })
                  }
                />
                {errors.dateOfBirth && (
                  <p className="text-red-600 text-sm mt-1">{errors.dateOfBirth}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gender <span className="text-red-500">*</span>
                </label>
                <select
                  className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
                  value={formData.gender}
                  onChange={(e) =>
                    setFormData({ ...formData, gender: e.target.value })
                  }
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                {errors.gender && (
                  <p className="text-red-600 text-sm mt-1">{errors.gender}</p>
                )}
              </div>
            </div>

            <div>
              <FileUploadField
                label="Profile Photo"
                name="profilePhoto"
                fileName={formData.profilePhoto ? formData.profilePhoto.name : ""}
                handleFileChange={(e) =>
                  setFormData({
                    ...formData,
                    profilePhoto: e.target.files[0],
                  })
                }
              />
              {errors.profilePhoto && (
                <p className="text-red-600 text-sm mt-2">{errors.profilePhoto}</p>
              )}
            </div>

            <div className="text-center pt-4">
              <button
                type="submit"
                className="bg-purple-700 text-white px-8 py-2 rounded-md hover:bg-purple-800 transition font-medium"
              >
                Next: Family Info →
              </button>
            </div>
          </form>
        )}

        {/* ===== STEP 2: Family Info ===== */}
        {step === 2 && (
          <form onSubmit={handleNextStep} className="space-y-5">
            <h3 className="text-lg font-semibold text-purple-800 mb-4">
              Step 2: Family Information
            </h3>

            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Guardian Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
                  value={formData.guardianName}
                  onChange={(e) =>
                    setFormData({ ...formData, guardianName: e.target.value })
                  }
                />
                {errors.guardianName && (
                  <p className="text-red-600 text-sm mt-1">{errors.guardianName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Relation <span className="text-red-500">*</span>
                </label>
                <select
                  className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
                  value={formData.relation}
                  onChange={(e) =>
                    setFormData({ ...formData, relation: e.target.value })
                  }
                >
                  <option value="">Select Relation</option>
                  <option value="Father">Father</option>
                  <option value="Mother">Mother</option>
                  <option value="Brother">Brother</option>
                  <option value="Sister">Sister</option>
                  <option value="Other">Other</option>
                </select>
                {errors.relation && (
                  <p className="text-red-600 text-sm mt-1">{errors.relation}</p>
                )}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Guardian Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
                  value={formData.guardianEmail}
                  onChange={(e) =>
                    setFormData({ ...formData, guardianEmail: e.target.value })
                  }
                />
                {errors.guardianEmail && (
                  <p className="text-red-600 text-sm mt-1">{errors.guardianEmail}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Guardian Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
                  value={formData.guardianPhone}
                  onChange={(e) =>
                    setFormData({ ...formData, guardianPhone: e.target.value })
                  }
                />
                {errors.guardianPhone && (
                  <p className="text-red-600 text-sm mt-1">{errors.guardianPhone}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Guardian Address <span className="text-red-500">*</span>
              </label>
              <textarea
                className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
                rows="3"
                value={formData.guardianAddress}
                onChange={(e) =>
                  setFormData({ ...formData, guardianAddress: e.target.value })
                }
              />
              {errors.guardianAddress && (
                <p className="text-red-600 text-sm mt-1">{errors.guardianAddress}</p>
              )}
            </div>

            <div>
              <FileUploadField
                label="Guardian ID Proof"
                name="guardianIdProof"
                fileName={formData.guardianIdProof ? formData.guardianIdProof.name : ""}
                handleFileChange={(e) =>
                  setFormData({
                    ...formData,
                    guardianIdProof: e.target.files[0],
                  })
                }
              />
              {errors.guardianIdProof && (
                <p className="text-red-600 text-sm mt-2">{errors.guardianIdProof}</p>
              )}
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={handleBackStep}
                className="flex-1 border border-purple-700 text-purple-700 px-6 py-2 rounded-md hover:bg-purple-50 transition font-medium"
              >
                ← Back
              </button>
              <button
                type="submit"
                className="flex-1 bg-purple-700 text-white px-6 py-2 rounded-md hover:bg-purple-800 transition font-medium"
              >
                Next: Academic Info →
              </button>
            </div>
          </form>
        )}

        {/* ===== STEP 3: Academic Info ===== */}
        {step === 3 && (
          <form onSubmit={handleNextStep} className="space-y-5">
            <h3 className="text-lg font-semibold text-purple-800 mb-4">
              Step 3: Academic Information
            </h3>

            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Enrollment Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
                  value={formData.enrollmentNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, enrollmentNumber: e.target.value })
                  }
                />
                {errors.enrollmentNumber && (
                  <p className="text-red-600 text-sm mt-1">{errors.enrollmentNumber}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Branch <span className="text-red-500">*</span>
                </label>
                <select
                  className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
                  value={formData.branch}
                  onChange={(e) =>
                    setFormData({ ...formData, branch: e.target.value })
                  }
                >
                  <option value="">Select Branch</option>
                  <option value="CSE">Computer Science & Engineering</option>
                  <option value="ECE">Electronics & Communication</option>
                  <option value="MECH">Mechanical Engineering</option>
                  <option value="CIVIL">Civil Engineering</option>
                  <option value="EEE">Electrical & Electronics</option>
                </select>
                {errors.branch && (
                  <p className="text-red-600 text-sm mt-1">{errors.branch}</p>
                )}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Semester <span className="text-red-500">*</span>
                </label>
                <select
                  className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
                  value={formData.semester}
                  onChange={(e) =>
                    setFormData({ ...formData, semester: e.target.value })
                  }
                >
                  <option value="">Select Semester</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                    <option key={sem} value={sem}>
                      Semester {sem}
                    </option>
                  ))}
                </select>
                {errors.semester && (
                  <p className="text-red-600 text-sm mt-1">{errors.semester}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CGPA <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="10"
                  className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
                  value={formData.cgpa}
                  onChange={(e) =>
                    setFormData({ ...formData, cgpa: e.target.value })
                  }
                />
                {errors.cgpa && (
                  <p className="text-red-600 text-sm mt-1">{errors.cgpa}</p>
                )}
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={handleBackStep}
                className="flex-1 border border-purple-700 text-purple-700 px-6 py-2 rounded-md hover:bg-purple-50 transition font-medium"
              >
                ← Back
              </button>
              <button
                type="submit"
                className="flex-1 bg-purple-700 text-white px-6 py-2 rounded-md hover:bg-purple-800 transition font-medium"
              >
                Next: Set Password →
              </button>
            </div>
          </form>
        )}

        {/* ===== STEP 4: Password ===== */}
        {step === 4 && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <h3 className="text-lg font-semibold text-purple-800 mb-4 text-center">
              Step 4: Create Your Account Password
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full border rounded-md px-3 py-2 pr-10 focus:ring-2 focus:ring-purple-600 outline-none"
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
              <p className="text-xs text-gray-600 mt-2">
                Min 8 chars, uppercase, lowercase, number, and symbol (@$!%*?&#^)
              </p>
              {errors.password && (
                <p className="text-red-600 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password <span className="text-red-500">*</span>
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
                className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-purple-600 outline-none"
                required
              />
              {errors.confirmPassword && (
                <p className="text-red-600 text-sm mt-1">{errors.confirmPassword}</p>
              )}
            </div>

            {errors.submit && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-red-700 text-sm">{errors.submit}</p>
              </div>
            )}

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={handleBackStep}
                className="flex-1 border border-purple-700 text-purple-700 px-6 py-2 rounded-md hover:bg-purple-50 transition font-medium"
              >
                ← Back
              </button>
              <button
                type="submit"
                className="flex-1 bg-purple-700 text-white px-6 py-2 rounded-md hover:bg-purple-800 transition font-medium"
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
