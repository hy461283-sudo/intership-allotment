"use client"

import { useState } from "react"
import { Eye, EyeOff, Upload } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { BASE_URL } from "../../../config/apiEndpoints"

export default function StudentRegistration() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [showPassword, setShowPassword] = useState(false)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    // Personal Info
    fullName: "",
    dob: "",
    email: "",
    altEmail: "",
    contact: "",
    gender: "",
    panNumber: "",
    currentAddress: "",
    permanentAddress: "",
    photo: null,
    govProof: null,

    // Family Info
    fatherName: "",
    motherName: "",
    guardianName: "",
    guardianRelation: "",
    guardianEmail: "",
    guardianPhone: "",
    guardianAddress: "",
    guardianIdProof: null,

    // Academic Info
    studentId: "",
    programme: "",
    otherProgramme: "",
    semester: "",
    discipline: "",
    otherDiscipline: "",
    cgpa: "",
    skills: "",
    resume: null,

    // Password
    password: "",
    confirmPassword: "",
  })

  const [errors, setErrors] = useState({})

  // -------- Validation per step ----------
  const validateStep = (targetStep = step) => {
    let temp = {}
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const phonePattern = /^\d{10}$/

    if (targetStep === 1) {
      if (!formData.fullName.trim()) temp.fullName = "Full Name is required."
      if (!formData.dob) temp.dob = "Date of birth required."
      if (!formData.email) temp.email = "Email is required."
      else if (!emailPattern.test(formData.email)) temp.email = "Invalid email."
      if (!formData.altEmail) temp.altEmail = "Alternate email required."
      else if (!emailPattern.test(formData.altEmail)) temp.altEmail = "Invalid alternate email."
      if (!formData.contact) temp.contact = "Contact number required."
      else if (!phonePattern.test(formData.contact)) temp.contact = "Contact number must be 10 digits."
      if (!formData.gender) temp.gender = "Gender is required."
      if (!formData.panNumber) temp.panNumber = "PAN Number is required."
      if (!formData.currentAddress.trim()) temp.currentAddress = "Current Address is required."
      if (!formData.permanentAddress.trim()) temp.permanentAddress = "Permanent Address is required."
      if (!formData.photo) temp.photo = "Photo upload required."
      if (!formData.govProof) temp.govProof = "Gov ID Proof upload required."
    }

    if (targetStep === 2) {
      if (!formData.fatherName?.trim()) temp.fatherName = "Father's name required."
      if (!formData.motherName?.trim()) temp.motherName = "Mother's name required."
      if (!formData.guardianName.trim()) temp.guardianName = "Guardian name required."
      if (!formData.guardianRelation) temp.guardianRelation = "Relation required."
      if (!formData.guardianEmail) temp.guardianEmail = "Guardian email required."
      else if (!emailPattern.test(formData.guardianEmail)) temp.guardianEmail = "Invalid guardian email."
      if (!formData.guardianPhone) temp.guardianPhone = "Guardian phone required."
      else if (!phonePattern.test(formData.guardianPhone)) temp.guardianPhone = "Contact number must be 10 digits."
      if (!formData.guardianAddress.trim()) temp.guardianAddress = "Guardian address required."
      if (!formData.guardianIdProof) temp.guardianIdProof = "Guardian ID proof upload required."
    }

    if (targetStep === 3) {
      if (!formData.studentId.trim()) temp.studentId = "Student ID is required."
      if (!formData.programme) temp.programme = "Programme is required."
      if (formData.programme === "Other" && !formData.otherProgramme?.trim()) temp.otherProgramme = "Specify your programme."
      if (!formData.semester) temp.semester = "Semester required."
      if (!formData.discipline) temp.discipline = "Discipline required."
      if (formData.discipline === "Other" && !formData.otherDiscipline?.trim()) temp.otherDiscipline = "Specify your discipline."
      if (!formData.cgpa) temp.cgpa = "CGPA required."
      else if (isNaN(parseFloat(formData.cgpa)) || parseFloat(formData.cgpa) <= 0 || parseFloat(formData.cgpa) > 10) 
        temp.cgpa = "CGPA must be 0-10."
      if (!formData.skills.trim()) temp.skills = "Skills are required."
      if (!formData.resume) temp.resume = "Resume upload required."
    }

    if (targetStep === 4) {
      const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^])[A-Za-z\d@$!%*?&#^]{8,}$/
      if (!formData.password.length) temp.password = "Password required."
      else if (!passwordPattern.test(formData.password)) 
        temp.password = "Password must be 8+ chars with uppercase, lowercase, number and symbol (@$!%*?&#^)."
      if (formData.password !== formData.confirmPassword) temp.confirmPassword = "Passwords do not match."
    }

    setErrors(temp)
    return Object.keys(temp).length === 0
  }

  // -------- Step navigation --------
  const handleNext = (e) => {
    e.preventDefault()
    setErrors({})
    if (validateStep()) {
      setStep((s) => s + 1)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const handlePrev = () => {
    setStep((s) => s - 1)
    setErrors({})
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // ---------- Form Submit -----------
  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})
    if (!validateStep()) return

    const form = new FormData()
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== null && formData[key] !== undefined) {
        form.append(key, formData[key])
      }
    })

    try {
      setLoading(true)
      const res = await fetch(`${BASE_URL}/api/student/register`, {
        method: "POST",
        body: form,
      })
      const data = await res.json()
      if (res.ok) {
        setSuccess(true)
        console.log("✅ Registration successful:", data)
        setTimeout(() => navigate("/SLogin"), 2000)
      } else {
        setErrors({ submit: data.error || "Registration failed" })
        alert(`❌ Registration failed: ${data.error}`)
      }
    } catch (err) {
      setErrors({ submit: err.message })
      alert("Server Error: " + err.message)
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // ---------- Handle Input ----------
  const handleChange = (e) => {
    const { name, type, value, files } = e.target
    setFormData({
      ...formData,
      [name]: type === "file" ? files[0] : value,
    })
  }

  // ---------- Step outline ----------
  const stepsMenu = [
    { num: 1, label: "Personal Info" },
    { num: 2, label: "Family Info" },
    { num: 3, label: "Academic Info" },
    { num: 4, label: "Password" },
  ]

  return (
    <div className="min-h-screen flex items-center justify-center bg-purple-50 py-10 px-4">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg border p-8">

        {/* Stepper */}
        <div className="flex justify-between mb-8">
          {stepsMenu.map((s) => (
            <div key={s.num} className="flex-1 text-center">
              <h4 className={`font-semibold text-sm ${step === s.num ? "text-purple-700" : "text-gray-500"}`}>
                Step {s.num}: {s.label}
              </h4>
              {step === s.num && <div className="h-1 bg-purple-700 mt-1 rounded-full"></div>}
            </div>
          ))}
        </div>

        {/* --- Step 1: Personal --- */}
        {step === 1 && (
          <form onSubmit={handleNext} className="space-y-6">
            <h3 className="text-lg font-semibold text-purple-800 mb-4">Step 1: Personal Information</h3>
            
            <div className="grid sm:grid-cols-2 gap-5">
              <InputField label="Full Name" name="fullName" value={formData.fullName} onChange={handleChange} error={errors.fullName} required />
              <InputField label="Date of Birth" name="dob" type="date" value={formData.dob} onChange={handleChange} error={errors.dob} required />
              <InputField label="Email" name="email" type="email" value={formData.email} onChange={handleChange} error={errors.email} required />
              <InputField label="Alternate Email" name="altEmail" type="email" value={formData.altEmail} onChange={handleChange} error={errors.altEmail} required />
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <InputField label="Contact Number" name="contact" value={formData.contact} onChange={handleChange} error={errors.contact} required />
              <SelectField label="Gender" name="gender" value={formData.gender} onChange={handleChange} options={["Male", "Female", "Other"]} error={errors.gender} required />
              <InputField label="PAN Number" name="panNumber" value={formData.panNumber} onChange={handleChange} error={errors.panNumber} required />
            </div>

            <TextAreaField label="Current Address" name="currentAddress" value={formData.currentAddress} onChange={handleChange} error={errors.currentAddress} required />
            <TextAreaField label="Permanent Address" name="permanentAddress" value={formData.permanentAddress} onChange={handleChange} error={errors.permanentAddress} required />

            <div className="grid gap-6 sm:grid-cols-2">
              <FileUploadField label="Photo" name="photo" fileName={formData.photo ? formData.photo.name : ""} onChange={handleChange} error={errors.photo} required />
              <FileUploadField label="Gov ID Proof" name="govProof" fileName={formData.govProof ? formData.govProof.name : ""} onChange={handleChange} error={errors.govProof} required />
            </div>

            <div className="text-center pt-4">
              <button type="submit" className="bg-purple-700 text-white px-8 py-2 rounded-md hover:bg-purple-800 transition font-medium">
                Next: Family Info →
              </button>
            </div>
          </form>
        )}

        {/* --- Step 2: Family --- */}
        {step === 2 && (
          <form onSubmit={handleNext} className="space-y-6">
            <h3 className="text-lg font-semibold text-purple-800 mb-4">Step 2: Family Information</h3>
            
            <div className="grid sm:grid-cols-2 gap-5">
              <InputField label="Father Name" name="fatherName" value={formData.fatherName} onChange={handleChange} error={errors.fatherName} required />
              <InputField label="Mother Name" name="motherName" value={formData.motherName} onChange={handleChange} error={errors.motherName} required />
              <InputField label="Guardian Name" name="guardianName" value={formData.guardianName} onChange={handleChange} error={errors.guardianName} required />
              <SelectField label="Relation" name="guardianRelation" value={formData.guardianRelation} onChange={handleChange} options={["Father", "Mother", "Brother", "Sister", "Other"]} error={errors.guardianRelation} required />
              <InputField label="Guardian Email" name="guardianEmail" type="email" value={formData.guardianEmail} onChange={handleChange} error={errors.guardianEmail} required />
              <InputField label="Guardian Phone" name="guardianPhone" value={formData.guardianPhone} onChange={handleChange} error={errors.guardianPhone} required />
            </div>

            <TextAreaField label="Guardian Address" name="guardianAddress" value={formData.guardianAddress} onChange={handleChange} error={errors.guardianAddress} required />
            <FileUploadField label="Guardian ID Proof" name="guardianIdProof" fileName={formData.guardianIdProof ? formData.guardianIdProof.name : ""} onChange={handleChange} error={errors.guardianIdProof} required />

            <div className="flex justify-between gap-4 pt-4">
              <button type="button" onClick={handlePrev} className="flex-1 bg-gray-200 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-300 transition font-medium">
                ← Back
              </button>
              <button type="submit" className="flex-1 bg-purple-700 text-white px-6 py-2 rounded-md hover:bg-purple-800 transition font-medium">
                Next: Academic Info →
              </button>
            </div>
          </form>
        )}

        {/* --- Step 3: Academic --- */}
        {step === 3 && (
          <form onSubmit={handleNext} className="space-y-6">
            <h3 className="text-lg font-semibold text-purple-800 mb-4">Step 3: Academic Information</h3>
            
            <InputField label="Student ID" name="studentId" value={formData.studentId} onChange={handleChange} error={errors.studentId} required />
            
            <div className="grid sm:grid-cols-2 gap-5">
              <SelectField label="Programme" name="programme" value={formData.programme} onChange={handleChange} options={["B.Tech CSE", "BCA", "B.Tech AI & ML", "Other"]} error={errors.programme} required />
              {formData.programme === "Other" && (
                <InputField label="Specify Programme" name="otherProgramme" value={formData.otherProgramme} onChange={handleChange} error={errors.otherProgramme} required />
              )}
              <SelectField label="Semester" name="semester" value={formData.semester} onChange={handleChange} options={["5", "6", "7", "8"]} error={errors.semester} required />
              <SelectField label="Discipline" name="discipline" value={formData.discipline} onChange={handleChange} options={["Software Dev", "Data Science", "Cybersecurity", "Other"]} error={errors.discipline} required />
            </div>

            {formData.discipline === "Other" && (
              <InputField label="Specify Discipline" name="otherDiscipline" value={formData.otherDiscipline} onChange={handleChange} error={errors.otherDiscipline} required />
            )}

            <InputField label="CGPA" name="cgpa" type="number" step="0.01" min="0" max="10" value={formData.cgpa} onChange={handleChange} error={errors.cgpa} required />
            
            <TextAreaField label="Skills (comma separated)" name="skills" value={formData.skills} onChange={handleChange} error={errors.skills} required />
            <FileUploadField label="Resume / CV" name="resume" fileName={formData.resume ? formData.resume.name : ""} onChange={handleChange} error={errors.resume} required />

            <div className="flex justify-between gap-4 pt-4">
              <button type="button" onClick={handlePrev} className="flex-1 bg-gray-200 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-300 transition font-medium">
                ← Back
              </button>
              <button type="submit" className="flex-1 bg-purple-700 text-white px-6 py-2 rounded-md hover:bg-purple-800 transition font-medium">
                Next: Create Password →
              </button>
            </div>
          </form>
        )}

        {/* --- Step 4: Password --- */}
        {step === 4 && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <h3 className="text-lg font-semibold text-purple-800 mb-4 text-center">
              Step 4: Create Account Password
            </h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password <span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full border-2 border-gray-300 rounded-md px-3 py-2 pr-10 focus:ring-2 focus:ring-purple-600 focus:border-purple-600"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-2.5 text-gray-500 hover:text-purple-700"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <p className="text-xs text-gray-600 mt-1">Min 8 chars: uppercase, lowercase, number, symbol (@$!%*?&#^)</p>
              {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password <span className="text-red-600">*</span>
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="w-full border-2 border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-purple-600 focus:border-purple-600"
              />
              {errors.confirmPassword && <p className="text-red-600 text-sm mt-1">{errors.confirmPassword}</p>}
            </div>

            {errors.submit && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-red-700 text-sm">{errors.submit}</p>
              </div>
            )}

            <div className="flex justify-between gap-4 pt-4">
              <button type="button" onClick={handlePrev} className="flex-1 bg-gray-200 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-300 transition font-medium">
                ← Back
              </button>
              <button type="submit" disabled={loading} className="flex-1 bg-green-600 text-white px-8 py-2 rounded-md hover:bg-green-700 transition font-medium disabled:opacity-50">
                {loading ? "Registering..." : "Complete Registration ✅"}
              </button>
            </div>

            {success && (
              <div className="mt-6 bg-green-50 border border-green-200 rounded-md p-4 text-center">
                <p className="text-green-700 font-medium">
                  🎉 Registration Completed! You can now log in.
                </p>
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  )
}

/* ---------- Reusable Components ---------- */
function InputField({ label, name, value, onChange, type = "text", error, required }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-600">*</span>}
      </label>
      <input
        required={required}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full border-2 rounded-md px-3 py-2 focus:ring-2 focus:ring-purple-500 outline-none transition ${
          error ? "border-red-500" : "border-gray-300"
        }`}
      />
      {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
    </div>
  )
}

function TextAreaField({ label, name, value, onChange, error, required }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-600">*</span>}
      </label>
      <textarea
        required={required}
        name={name}
        value={value}
        onChange={onChange}
        rows={3}
        className={`w-full border-2 rounded-md px-3 py-2 focus:ring-2 focus:ring-purple-500 outline-none transition ${
          error ? "border-red-500" : "border-gray-300"
        }`}
      />
      {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
    </div>
  )
}

function SelectField({ label, name, value, onChange, options, error, required }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-600">*</span>}
      </label>
      <select
        required={required}
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full border-2 rounded-md px-3 py-2 focus:ring-2 focus:ring-purple-500 outline-none transition ${
          error ? "border-red-500" : "border-gray-300"
        }`}
      >
        <option value="">Select {label}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
      {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
    </div>
  )
}

function FileUploadField({ label, name, fileName, onChange, error, required }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label} {required && <span className="text-red-600">*</span>}
      </label>
      <div className="relative">
        <input
          required={required}
          type="file"
          name={name}
          onChange={onChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          accept="image/*,.pdf"
        />
        <div className={`flex items-center justify-center gap-2 w-full px-4 py-4 border-2 border-dashed rounded-lg transition cursor-pointer group ${
          error ? "border-red-500 bg-red-50" : "border-purple-300 bg-purple-50 hover:bg-purple-100"
        }`}>
          <Upload className={`w-5 h-5 group-hover:scale-110 transition ${error ? "text-red-600" : "text-purple-600"}`} />
          <span className={`text-sm font-medium ${error ? "text-red-600" : "text-purple-600"}`}>
            {fileName ? "Change file" : "Click to upload"}
          </span>
        </div>
      </div>
      {fileName && (
        <p className="mt-2 text-sm text-gray-600">
          <strong>Uploaded:</strong> {fileName}
        </p>
      )}
      {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
    </div>
  )
}
