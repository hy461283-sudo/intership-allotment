"use client";

import { useState, useEffect } from "react";
import { Eye, EyeOff, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../../config/apiEndpoints";

export default function OrganizationRegistration() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);
  const [previousPasswords, setPreviousPasswords] = useState([]);

  const [formData, setFormData] = useState({
    orgName: "",
    regNumber: "",
    country: "",
    state: "",
    address: "",
    coordName: "",
    coordDesg: "",
    coordEmail: "",
    coordAltEmail: "",
    coordPhone: "",
    portalLink: "",
    password: "",
    confirmPassword: "",
    profileDoc: null,
  });

  const [errors, setErrors] = useState({});
  const [states, setStates] = useState([]);
  const [generatedUser, setGeneratedUser] = useState("");

  const countryStateData = {
    India: ["Delhi", "Maharashtra", "Karnataka", "Gujarat", "Tamil Nadu"],
    USA: ["California", "Texas", "Florida", "New York"],
    UK: ["London", "Manchester", "Birmingham"],
    Canada: ["Ontario", "Quebec", "Alberta"],
  };

  // Update states when country changes
  useEffect(() => {
    if (formData.country) {
      setStates(countryStateData[formData.country] || []);
    } else {
      setStates([]);
    }
  }, [formData.country]);

  // File Upload Sub‑component
  const FileUploadField = ({ label, name, fileName, handleFileChange }) => (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-3">{label}</label>
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

  // ========== Step 1 Validation
  const validateRegistration = () => {
    let temp = {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^[0-9]{10}$/;

    if (!formData.orgName.trim()) temp.orgName = "Organization name is required.";
    if (!formData.regNumber.trim()) temp.regNumber = "Registration number is required.";
    if (!formData.country) temp.country = "Select country.";
    if (!formData.state) temp.state = "Select state.";
    if (!formData.address.trim()) temp.address = "Address required.";
    if (!formData.coordName.trim()) temp.coordName = "Coordinator name is required.";
    if (!formData.coordDesg.trim()) temp.coordDesg = "Coordinator designation required.";
    if (!emailPattern.test(formData.coordEmail)) temp.coordEmail = "Invalid email format.";
    if (formData.coordAltEmail && !emailPattern.test(formData.coordAltEmail))
      temp.coordAltEmail = "Invalid alternate email.";
    if (!phonePattern.test(formData.coordPhone))
      temp.coordPhone = "Enter 10-digit phone number.";
    if (!formData.profileDoc) temp.profileDoc = "Please upload organization document/proof.";

    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  // ========== Step 2 Validation
  const validatePassword = () => {
    let temp = {};
    const passwordPattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^])[A-Za-z\d@$!%*?&#^]{8,}$/;

    if (!passwordPattern.test(formData.password)) {
      temp.password =
        "Password must be at least 8 chars, have upper, lower, number, and symbol.";
    }
    if (formData.password !== formData.confirmPassword)
      temp.confirmPassword = "Passwords do not match.";
    if (previousPasswords.includes(formData.password))
      temp.password = "You cannot reuse a previous password.";

    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  // ========== Step 1 Submit
  const handleNext = (e) => {
    e.preventDefault();
    setErrors({});
    if (validateRegistration()) {
      const username = `${formData.orgName.replace(/\s+/g, "").toLowerCase()}@sia.com`;
      setGeneratedUser(username);
      setStep(2);
      window.scrollTo(0, 0);
    }
  };

  // ========== Step 2 Submit (POST to Backend, no pop‑ups)
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    if (validatePassword()) {
      const form = new FormData();
      form.append("orgName", formData.orgName);
      form.append("regNumber", formData.regNumber);
      form.append("country", formData.country);
      form.append("state", formData.state);
      form.append("address", formData.address);
      form.append("coordName", formData.coordName);
      form.append("coordDesg", formData.coordDesg);
      form.append("coordEmail", formData.coordEmail);
      form.append("coordAltEmail", formData.coordAltEmail);
      form.append("coordPhone", formData.coordPhone);
      form.append("password", formData.password);
      if (formData.profileDoc) form.append("org_document", formData.profileDoc);

      try {
        const res = await fetch(`${BASE_URL}/api/organization/register`, {
          method: "POST",
          body: form,
        });

        const data = await res.json();
        if (res.ok) {
          setGeneratedUser(data.username);
          setPreviousPasswords([...previousPasswords, formData.password]);
          setSuccess(true);

          // ✅ smooth redirect after short delay, no alert pop‑up
          setTimeout(() => navigate("/Org"), 1500);
        } else {
          console.error("Registration Error:", data.error);
          setErrors({ general: data.error || "Registration failed." });
        }
      } catch (err) {
        console.error("Server Error:", err);
        setErrors({ general: "Server not reachable. Try later." });
      }
    }
  };

  // =============================================================
  return (
    <div className="min-h-screen flex items-center justify-center bg-purple-50 py-10 px-4">
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-lg border p-8">
        {/* Steps */}
        <div className="flex justify-between mb-8">
          <div className="flex-1 text-center">
            <h4
              className={`font-semibold ${
                step === 1 ? "text-purple-700" : "text-gray-500"
              }`}
            >
              Step 1: Registration
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
              Step 2: Create Password
            </h4>
            {step === 2 && (
              <div className="h-1 bg-purple-700 mt-1 rounded-full"></div>
            )}
          </div>
        </div>

        {/* Step 1 Form */}
        {step === 1 && (
          <form onSubmit={handleNext} className="space-y-6">
            {/* Basic Info */}
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Organization Name
                </label>
                <input
                  type="text"
                  value={formData.orgName}
                  onChange={(e) =>
                    setFormData({ ...formData, orgName: e.target.value })
                  }
                  className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-purple-500"
                />
                {errors.orgName && (
                  <p className="text-red-600 text-sm">{errors.orgName}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company CIN / Registration Number
                </label>
                <input
                  type="text"
                  value={formData.regNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, regNumber: e.target.value })
                  }
                  className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-purple-500"
                />
                {errors.regNumber && (
                  <p className="text-red-600 text-sm">{errors.regNumber}</p>
                )}
              </div>
            </div>

            {/* Address and country/state */}
            <div className="grid sm:grid-cols-3 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country
                </label>
                <select
                  value={formData.country}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      country: e.target.value,
                      state: "",
                    })
                  }
                  className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Select Country</option>
                  {Object.keys(countryStateData).map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
                {errors.country && (
                  <p className="text-red-600 text-sm">{errors.country}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State
                </label>
                <select
                  value={formData.state}
                  onChange={(e) =>
                    setFormData({ ...formData, state: e.target.value })
                  }
                  disabled={!formData.country}
                  className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Select State</option>
                  {states.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
                {errors.state && (
                  <p className="text-red-600 text-sm">{errors.state}</p>
                )}
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Detailed Address
              </label>
              <textarea
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                rows="2"
                className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-purple-500 resize-none"
              ></textarea>
              {errors.address && (
                <p className="text-red-600 text-sm">{errors.address}</p>
              )}
            </div>

            {/* Coordinator Info */}
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Coordinator Name
                </label>
                <input
                  type="text"
                  value={formData.coordName}
                  onChange={(e) =>
                    setFormData({ ...formData, coordName: e.target.value })
                  }
                  className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-purple-500"
                />
                {errors.coordName && (
                  <p className="text-red-600 text-sm">{errors.coordName}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Coordinator Designation
                </label>
                <input
                  type="text"
                  value={formData.coordDesg}
                  onChange={(e) =>
                    setFormData({ ...formData, coordDesg: e.target.value })
                  }
                  className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-purple-500"
                />
                {errors.coordDesg && (
                  <p className="text-red-600 text-sm">{errors.coordDesg}</p>
                )}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Coordinator Email
                </label>
                <input
                  type="email"
                  value={formData.coordEmail}
                  onChange={(e) =>
                    setFormData({ ...formData, coordEmail: e.target.value })
                  }
                  className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-purple-500"
                />
                {errors.coordEmail && (
                  <p className="text-red-600 text-sm">{errors.coordEmail}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Alternate Email
                </label>
                <input
                  type="email"
                  value={formData.coordAltEmail}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      coordAltEmail: e.target.value,
                    })
                  }
                  className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-purple-500"
                />
                {errors.coordAltEmail && (
                  <p className="text-red-600 text-sm">{errors.coordAltEmail}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Coordinator Phone
              </label>
              <input
                type="text"
                value={formData.coordPhone}
                onChange={(e) =>
                  setFormData({ ...formData, coordPhone: e.target.value })
                }
                className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-purple-500"
              />
              {errors.coordPhone && (
                <p className="text-red-600 text-sm">{errors.coordPhone}</p>
              )}
            </div>

            {/* Upload Doc */}
            <div className="mt-6">
              <FileUploadField
                label="Upload Organization Proof / Logo / Supporting Doc"
                name="profileDoc"
                fileName={formData.profileDoc ? formData.profileDoc.name : ""}
                handleFileChange={(e) =>
                  setFormData({
                    ...formData,
                    profileDoc: e.target.files[0],
                  })
                }
              />
            </div>

            <div className="text-center pt-4">
              <button
                type="submit"
                className="bg-purple-700 text-white px-6 py-2 rounded-md hover:bg-purple-800 transition"
              >
                Next: Create Password →
              </button>
            </div>
          </form>
        )}

        {/* Step 2 – Password */}
        {step === 2 && (
          <form onSubmit={handlePasswordSubmit} className="space-y-6">
            <h3 className="text-xl font-semibold text-purple-800 mb-4 text-center">
              Create Organization Account Password
            </h3>

            {/* Auto Username Display */}
            <div className="bg-indigo-50 border border-indigo-200 rounded-md p-4 text-center text-indigo-700 font-medium mb-6">
              Your organization username will be: 
              <strong>{generatedUser || "organization@sia.com"}</strong>
            </div>

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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
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
              />
              {errors.confirmPassword && (
                <p className="text-red-600 text-sm">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {errors.general && (
              <p className="text-red-600 text-center text-sm">
                {errors.general}
              </p>
            )}

            <div className="text-center pt-4">
              <button
                type="submit"
                className="bg-purple-700 text-white px-6 py-2 rounded-md hover:bg-purple-800 transition"
              >
                Complete Registration ✅
              </button>
            </div>

            {success && (
              <div className="mt-8 bg-green-50 border border-green-200 rounded-md p-4 text-center">
                <p className="text-green-700 font-medium">
                  🎉 Registration Completed! Welcome, <strong>
                    {generatedUser}
                  </strong>
                </p>
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
}