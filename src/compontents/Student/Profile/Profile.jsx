"use client";
import React, { useState, useEffect } from "react";
import {
  Upload,
  Edit2,
  Save,
  FileText,
  User,
  GraduationCap,
  Award,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../../config/apiEndpoints";

export default function StudentProfilePage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({});
  const [formData, setFormData] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");
  const [loading, setLoading] = useState(false);

  // ----- Fetch profile -----
  useEffect(() => {
    const studentId = localStorage.getItem("studentId");
    if (!studentId) {
      navigate("/SLogin");
      return;
    }
    fetch(`${BASE_URL}/api/student/profile?studentId=${studentId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) console.error(data.error);
        else {
          setProfile(data);
          setFormData(data);
        }
      })
      .catch((e) => console.error(e));
  }, [navigate]);

  // ----- handle text / file change -----
  const handleChange = (e) => {
    const { name, type, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : value,
    }));
  };

  // ----- save updated data -----
  const handleSave = async (e) => {
    e.preventDefault();
    if (!editMode) return;

    const studentId = localStorage.getItem("studentId");
    if (!studentId) {
      alert("⚠️ Please log in again.");
      return;
    }

    setLoading(true);
    const payload = new FormData();
    payload.append("studentId", studentId);
    for (const [key, val] of Object.entries(formData)) {
      if (val !== null && val !== undefined) payload.append(key, val);
    }

    try {
      const res = await fetch(`${BASE_URL}/api/student/update-profile`, {
        method: "POST",
        body: payload,
      });
      const data = await res.json();
      if (res.ok) {
        alert("✅ Profile updated successfully!");
        setProfile(data.profile || formData);
        setEditMode(false);
      } else alert(`❌ ${data.error}`);
    } catch (err) {
      alert("🔥 Server error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData(profile);
    setEditMode(false);
  };

  return (
    <div className="flex min-h-screen bg-gray-50 font-inter">
      <main className="flex-1 p-10 overflow-y-auto">
        {/* ---- Header ---- */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8 text-center">
          <div className="flex flex-col items-center">
            <div className="relative">
              <img
                src={
                  editMode
                    ? formData.photo
                      ? typeof formData.photo === "string"
                        ? formData.photo
                        : URL.createObjectURL(formData.photo)
                      : "https://cdn-icons-png.flaticon.com/512/1946/1946429.png"
                    : profile.photo ||
                      "https://cdn-icons-png.flaticon.com/512/1946/1946429.png"
                }
                alt="profile"
                className="w-32 h-32 rounded-full object-cover"
              />
              {editMode && (
                <label className="absolute bottom-3 right-3 bg-purple-600 p-2 rounded-full cursor-pointer hover:bg-purple-700">
                  <Upload className="w-4 h-4 text-white" />
                  <input
                    type="file"
                    name="photo"
                    onChange={handleChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
            <h2 className="text-2xl font-semibold mt-4 text-gray-800">
              {profile.fullName || "Student Name"}
            </h2>
            <p className="text-sm text-gray-500">
              {profile.programme || "Programme"}, Semester{" "}
              {profile.semester || "-"}
            </p>
          </div>
        </div>

        {/* ---- Tabs ---- */}
        <div className="flex justify-center mb-6 bg-purple-50 py-2 rounded-md space-x-2">
          {[
            { id: "personal", icon: <User className="w-4 h-4" />, label: "Personal Info" },
            { id: "education", icon: <GraduationCap className="w-4 h-4" />, label: "Education" },
            { id: "skills", icon: <Award className="w-4 h-4" />, label: "Skills" },
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-md transition ${
                activeTab === t.id
                  ? "bg-white text-purple-700 shadow-sm"
                  : "text-gray-600 hover:text-purple-700"
              }`}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>

        {/* ---- Form ---- */}
        <div className="bg-white shadow-md rounded-xl p-8">
          <form onSubmit={handleSave}>
            {/* Personal Tab */}
            {activeTab === "personal" && (
              <div className="grid grid-cols-2 gap-6">
                <Input label="Full Name" name="fullName" value={formData.fullName || ""} onChange={handleChange} disabled={!editMode} />
                <Input label="Email" name="email" value={formData.email || ""} onChange={handleChange} disabled={!editMode} />
                <Input label="Alternate Email" name="alternateEmail" value={formData.alternateEmail || ""} onChange={handleChange} disabled={!editMode} />
                <Input label="Contact Number" name="contact" value={formData.contact || ""} onChange={handleChange} disabled={!editMode} />
                <TextArea label="Current Address" name="currentAddress" value={formData.currentAddress || ""} onChange={handleChange} disabled={!editMode} />
                <TextArea label="Permanent Address" name="permanentAddress" value={formData.permanentAddress || ""} onChange={handleChange} disabled={!editMode} />
              </div>
            )}

            {/* Education Tab */}
            {activeTab === "education" && (
              <div className="grid grid-cols-2 gap-6">
                <Input label="Programme" name="programme" value={formData.programme || ""} onChange={handleChange} disabled={!editMode} />
                <Input label="Semester" name="semester" value={formData.semester || ""} onChange={handleChange} disabled={!editMode} />
                <Input label="Discipline" name="discipline" value={formData.discipline || ""} onChange={handleChange} disabled={!editMode} />
                <Input label="CGPA" name="cgpa" value={formData.cgpa || ""} onChange={handleChange} disabled={!editMode} />
              </div>
            )}

            {/* Skills Tab */}
            {activeTab === "skills" && (
              <div>
                <TextArea label="Skills (comma-separated)" name="skills" value={formData.skills || ""} onChange={handleChange} disabled={!editMode} />
                {profile.resume && (
                  <div className="mt-6">
                    <a
                      href={profile.resume}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-purple-700 hover:underline"
                    >
                      <FileText className="w-5 h-5" /> View Uploaded Resume
                    </a>
                  </div>
                )}
                <FileUpload label="Upload New Resume" name="resume" fileName={formData.resume?.name} onChange={handleChange} disabled={!editMode} />
              </div>
            )}

            {/* Buttons */}
            <div className="flex justify-end mt-8 space-x-3">
              {!editMode ? (
                <button
                  type="button"
                  onClick={() => setEditMode(true)}
                  className="flex items-center gap-2 px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition"
                >
                  <Edit2 className="w-4 h-4" /> Edit Profile
                </button>
              ) : (
                <>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                  >
                    <Save className="w-4 h-4" /> {loading ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="flex items-center gap-2 px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition"
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

/* ---------- Components ---------- */
function Input({ label, name, value, onChange, disabled }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`w-full border rounded-md px-3 py-2 ${
          disabled
            ? "bg-gray-100 cursor-not-allowed"
            : "focus:ring-2 focus:ring-purple-600 border-gray-300"
        }`}
      />
    </div>
  );
}

function TextArea({ label, name, value, onChange, disabled }) {
  return (
    <div className="col-span-2">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <textarea
        name={name}
        value={value}
        rows="3"
        onChange={onChange}
        disabled={disabled}
        className={`w-full border rounded-md px-3 py-2 ${
          disabled
            ? "bg-gray-100 cursor-not-allowed"
            : "focus:ring-2 focus:ring-purple-600 border-gray-300"
        }`}
      />
    </div>
  );
}

function FileUpload({ label, name, fileName, onChange, disabled }) {
  return (
    <div className="mt-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="relative">
        <input
          type="file"
          name={name}
          onChange={onChange}
          disabled={disabled}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />
        <div
          className={`flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed rounded-lg ${
            disabled
              ? "text-gray-400 bg-gray-100 cursor-not-allowed"
              : "border-purple-300 bg-purple-50 text-purple-700 hover:bg-purple-100 cursor-pointer"
          }`}
        >
          <Upload className="w-4 h-4" />
          <span>{fileName ? "Change File" : "Upload File"}</span>
        </div>
      </div>
      {fileName && (
        <p className="mt-2 text-sm text-gray-600">
          <strong>Uploaded:</strong> {fileName}
        </p>
      )}
    </div>
  );
}