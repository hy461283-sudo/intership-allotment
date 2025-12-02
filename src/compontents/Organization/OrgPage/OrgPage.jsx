"use client";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Home, PlusCircle, FileText, Bell, BarChart2, Settings, Sun, Moon, Lock } from "lucide-react";
import { Line, Bar, Pie } from "react-chartjs-2";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend);
import { BASE_URL } from "../../../config/apiEndpoints";

export default function OrganizationDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [showDropdown, setShowDropdown] = useState(false);
  const [theme, setTheme] = useState("light");
  const [projects, setProjects] = useState([]);
  const [drafts, setDrafts] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [scheduleDate, setScheduleDate] = useState(null);
  const navigate = useNavigate();

  const org = { name: "SIA Innovations Pvt Ltd", logo: "/logo.svg", orgId: 1 };
  const fetchUrl = `${BASE_URL}/api/organization`;

  const [formData, setFormData] = useState({
    projectCode: "",
    projectName: "",
    interns: "",
    coordinatorName: "",
    coordinatorEmail: "",
    coordinatorAltEmail: "",
    coordinatorPhone: "",
    coordinatorDesignation: "",
    cgpa: "",
    discipline: "",
    skills: "",
    guidelines: null,
  });

  useEffect(() => {
    fetchProjects();
    fetchNotifications();
  }, []);

  const safeFetch = async (url) => {
    const res = await fetch(url);
    return res.ok ? res.json() : [];
  };

  const fetchProjects = async () => {
    const data = await safeFetch(`${fetchUrl}/projects/${org.orgId}`);
    setProjects(data);
    setDrafts(data.filter((d) => d.status === "draft" || d.status === "scheduled"));
  };

  const fetchNotifications = async () => {
    const data = await safeFetch(`${fetchUrl}/notifications/${org.orgId}`);
    setNotifications(data);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({ ...prev, [name]: files ? files[0] : value }));
  };

  const handleAddProject = async (status = "draft") => {
    const data = new FormData();
    Object.entries(formData).forEach(([k, v]) => {
      data.append(k === "cgpa" ? "cgpaRequirement" : k, v);
    });
    data.append("organizationId", org.orgId);
    data.append("status", status);
    if (scheduleDate) data.append("scheduled_time", scheduleDate.toISOString());

    const res = await fetch(`${fetchUrl}/projects`, { method: "POST", body: data });
    alert((await res.json()).message);
    setActiveTab("jobListings");
    fetchProjects();
  };

  const handleEditProject = (p) => {
    setEditingId(p.project_id);
    setFormData({
      projectCode: p.project_code || "",
      projectName: p.project_name || "",
      interns: p.interns_required || "",
      coordinatorName: p.coordinator_name || "",
      coordinatorEmail: p.coordinator_email || "",
      coordinatorAltEmail: p.alternate_email || "",
      coordinatorPhone: p.coordinator_phone || "",
      coordinatorDesignation: p.coordinator_designation || "",
      cgpa: p.cgpa_requirement || "",
      discipline: p.discipline || "",
      skills: p.skills || "",
      guidelines: null,
    });
    setActiveTab("addProject");
  };

  const handleUpdateProject = async () => {
    if (!editingId) return;
    const body = {
      ...formData,
      cgpaRequirement: formData.cgpa,
      status: "active",
    };
    const res = await fetch(`${fetchUrl}/projects/${editingId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    alert((await res.json()).message);
    setEditingId(null);
    setActiveTab("jobListings");
    fetchProjects();
  };

  const handleDeleteProject = async (id) => {
    if (!window.confirm("Delete this project?")) return;
    const res = await fetch(`${fetchUrl}/projects/${id}`, { method: "DELETE" });
    alert((await res.json()).message);
    fetchProjects();
  };

  const toggleMenu = () => setShowDropdown(!showDropdown);
  const handleThemeChange = (t) => setTheme(t);
  const handleLogout = () => navigate("/Org");

  // -------------- RENDER UI ----------------
  return (
    <div className={`min-h-screen flex ${theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-800"}`}>
      {/* Sidebar */}
      <aside className={`w-64 flex flex-col ${theme === "dark" ? "bg-gray-800" : "bg-white shadow"}`}>
        <div className="px-6 py-5 border-b border-gray-200">
          <h1 className={`text-xl font-semibold ${theme === "dark" ? "text-white" : "text-purple-700"}`}>SIA Portal</h1>
        </div>
        <nav className="p-4 flex-1 space-y-2">
          {[
            ["overview", <Home size={18} />, "Dashboard Overview"],
            ["jobListings", <PlusCircle size={18} />, "Job Listings"],
            ["drafts", <FileText size={18} />, "Drafts & Scheduled"],
            ["analytics", <BarChart2 size={18} />, "Analytics"],
            ["settings", <Settings size={18} />, "Settings"],
          ].map(([id, icon, label]) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex w-full gap-3 px-4 py-2 rounded-md ${
                activeTab === id ? "bg-purple-100 text-purple-700" : "hover:bg-gray-100"
              }`}
            >
              {icon}
              {label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t">
          <button onClick={handleLogout} className="flex items-center gap-2 text-red-600 hover:text-red-700 transition">
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto">
        <header className={`flex justify-between px-8 py-4 shadow-sm ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
          <h2 className="text-xl font-semibold capitalize">{activeTab}</h2>
          <div className="flex items-center gap-4">
            <Bell size={20} />
            <div className="relative">
              <button onClick={toggleMenu} className="w-9 h-9 rounded-full overflow-hidden border border-purple-700">
                <img src={org.logo} alt="logo" className="w-full h-full object-contain" />
              </button>
              {showDropdown && (
                <div
                  className={`absolute right-0 top-10 w-48 border rounded-lg shadow ${
                    theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
                  }`}
                >
                  <div className="px-4 py-2 text-sm text-gray-500">{org.name}</div>
                  <button onClick={() => handleThemeChange("light")} className="block w-full px-4 py-2 text-sm hover:bg-purple-100">
                    <Sun size={14} className="inline mr-2" />
                    Light
                  </button>
                  <button onClick={() => handleThemeChange("dark")} className="block w-full px-4 py-2 text-sm hover:bg-purple-100">
                    <Moon size={14} className="inline mr-2" />
                    Dark
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dashboard */}
        {activeTab === "overview" && (
          <section className="p-8 space-y-8">
            <div className="grid grid-cols-4 gap-4">
              {["Total Projects", "Active", "Drafts", "Applications"].map((l) => (
                <div key={l} className={`${theme === "dark" ? "bg-gray-800" : "bg-white"} p-5 rounded-lg shadow`}>
                  <p className="text-sm text-gray-500">{l}</p>
                  <p className="text-3xl font-semibold text-purple-700 mt-2">0</p>
                </div>
              ))}
            </div>
            <div className={`${theme === "dark" ? "bg-gray-800" : "bg-white"} p-6 rounded-lg shadow`}>
              <h3 className="font-semibold mb-4">Applications Over Time</h3>
              <Line
                key="overviewChart"
                data={{
                  labels: ["Jan", "Feb", "Mar", "Apr"],
                  datasets: [{ label: "Applications", borderColor: "#7c3aed", data: [10, 40, 55, 80] }],
                }}
              />
            </div>
          </section>
        )}

        {/* Job Listings */}
        {activeTab === "jobListings" && (
          <section className="p-8">
            <div className="flex justify-between mb-4">
              <h3 className="text-xl font-semibold text-purple-700">Job Listings</h3>
              <button className="bg-purple-700 text-white px-4 py-2 rounded" onClick={() => setActiveTab("addProject")}>
                + Add Project
              </button>
            </div>

            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th>Code</th><th>Name</th><th>Status</th><th>Applications</th><th>Date</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((p) => (
                  <tr key={p.project_id} className="border-b">
                    <td>{p.project_code}</td>
                    <td>{p.project_name}</td>
                    <td>{p.status}</td>
                    <td>{p.applications || 0}</td>
                    <td>{p.created_at?.split("T")[0]}</td>
                    <td className="space-x-3">
                                         <button
                        className="text-blue-600 hover:underline"
                        onClick={() => handleEditProject(p)}
                      >
                        Edit
                      </button>
                      <button
                        className="text-red-600 hover:underline"
                        onClick={() => handleDeleteProject(p.project_id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Simple bar chart */}
            <div className="mt-6 p-6 bg-white shadow rounded-lg">
              <Bar
                key="listingBar"
                data={{
                  labels: projects.map((p) => p.project_name),
                  datasets: [
                    {
                      label: "Applications",
                      data: projects.map((p) => p.applications || 0),
                      backgroundColor: "#7c3aed",
                    },
                  ],
                }}
              />
            </div>
          </section>
        )}

        {/* Add / Edit Project Form */}
        {activeTab === "addProject" && (
          <section className="p-8 bg-white shadow space-y-6">
            <h3 className="text-xl font-semibold">Project Details</h3>

            <div className="grid grid-cols-2 gap-4">
              <input
                className="border p-2 rounded"
                name="projectCode"
                placeholder="Project Code"
                value={formData.projectCode}
                onChange={handleChange}
              />
              <input
                className="border p-2 rounded"
                name="projectName"
                placeholder="Project Name"
                value={formData.projectName}
                onChange={handleChange}
              />

              <select
                name="interns"
                className="border p-2 rounded"
                value={formData.interns}
                onChange={handleChange}
              >
                <option value="">Number of Interns</option>
                {[...Array(20)].map((_, i) => (
                  <option key={i} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>

              <input
                className="border p-2 rounded"
                name="cgpa"
                placeholder="CGPA Requirement (1.00 – 10.00)"
                value={formData.cgpa}
                onChange={handleChange}
              />

              <input
                className="border p-2 rounded"
                name="discipline"
                placeholder="Discipline"
                value={formData.discipline}
                onChange={handleChange}
              />

              <textarea
                className="border p-2 rounded col-span-2"
                name="skills"
                placeholder="Skills (Behavioural / Technical / Soft)"
                value={formData.skills}
                onChange={handleChange}
              />

              {/* --- Coordinator Details --- */}
              <div className="col-span-2 border rounded-lg p-4 bg-gray-50">
                <h4 className="font-semibold text mb-3">Coordinator Details</h4>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    className="border p-2 rounded"
                    name="coordinatorName"
                    placeholder="Coordinator Name"
                    value={formData.coordinatorName}
                    onChange={handleChange}
                  />
                  <input
                    type="email"
                    className="border p-2 rounded"
                    name="coordinatorEmail"
                    placeholder="Coordinator Company Email"
                    value={formData.coordinatorEmail}
                    onChange={handleChange}
                  />
                  <input
                    type="email"
                    className="border p-2 rounded"
                    name="coordinatorAltEmail"
                    placeholder="Alternate Email (Mandatory)"
                    value={formData.coordinatorAltEmail}
                    onChange={handleChange}
                  />
                  <input
                    type="tel"
                    className="border p-2 rounded"
                    name="coordinatorPhone"
                    placeholder="Coordinator Phone (10 digits)"
                    value={formData.coordinatorPhone}
                    onChange={handleChange}
                  />
                  <input
                    className="border p-2 rounded col-span-2"
                    name="coordinatorDesignation"
                    placeholder="Coordinator Designation"
                    value={formData.coordinatorDesignation}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <input
                type="file"
                className="border p-2 rounded col-span-2"
                name="guidelines"
                accept=".pdf,.doc,.docx"
                onChange={handleChange}
              />
            </div>

            <div className="flex justify-end gap-4">
              {!editingId && (
                <>
                  <button
                    onClick={() => handleAddProject("draft")}
                    className="bg-gray-300 px-4 py-2 rounded"
                  >
                    Save Draft
                  </button>
                  <button
                    onClick={() => handleAddProject("active")}
                    className="bg-purple-700 text-white px-4 py-2 rounded"
                  >
                    Post
                  </button>
                </>
              )}

              {editingId && (
                <button
                  onClick={handleUpdateProject}
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Update Project
                </button>
              )}
            </div>
          </section>
        )}

        {/* Drafts */}
        {activeTab === "drafts" && (
          <section className="p-8">
            <h3 className="text-xl font-semibold mb-4">Drafts & Scheduled Posts</h3>
            {drafts.map((d) => (
              <div key={d.project_id} className="border p-4 rounded mb-3 bg-white shadow">
                <p className="font-semibold">{d.project_name}</p>
                <p className="text-sm text-gray-500">Status: {d.status}</p>
                <div className="flex gap-2 mt-2 items-center">
                  <button
                    onClick={() => handleEditProject(d)}
                    className="px-3 py-1 bg-gray-200 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteProject(d.project_id)}
                    className="px-3 py-1 bg-red-500 text-white rounded"
                  >
                    Delete
                  </button>
                  <DatePicker
                    selected={scheduleDate}
                    onChange={(date) => setScheduleDate(date)}
                    showTimeSelect
                    dateFormat="Pp"
                    className="border p-2 rounded"
                    placeholderText="Schedule date/time"
                  />
                </div>
              </div>
            ))}
          </section>
        )}

        {/* Analytics */}
        {activeTab === "analytics" && (
          <section className="p-8 grid grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded shadow">
              <h3 className="font-semibold mb-4">Applications per Week</h3>
              <Line
                key="analyticLine"
                data={{
                  labels: ["W1", "W2", "W3"],
                  datasets: [
                    { label: "Applications", borderColor: "#7c3aed", data: [5, 20, 35] },
                  ],
                }}
              />
            </div>
            <div className="bg-white p-6 rounded shadow">
              <h3 className="font-semibold mb-4">Applicants by Discipline</h3>
              <Pie
                key="analyticPie"
                data={{
                  labels: ["CSE", "ECE", "ME"],
                  datasets: [
                    {
                      data: [45, 30, 25],
                      backgroundColor: ["#7c3aed", "#a78bfa", "#c4b5fd"],
                    },
                  ],
                }}
              />
            </div>
          </section>
        )}

        {/* Settings */}
        {activeTab === "settings" && (
          <section className="p-8 bg-white shadow space-y-4">
            <h3 className="text-xl font-semibold mb-4">Organization Settings</h3>
            <div>
              <label className="block">Organization Name</label>
              <input className="border p-2 rounded w-full font-bold" defaultValue={org.name} />
            </div>
            <div>
              <label className="block">Email</label>
              <div className="flex items-center">
                <input
                  className="border p-2 rounded w-full text-gray-400"
                  readOnly
                  value="contact@sia.com"
                />
                <Lock size={14} className="ml-2 text-gray-400" />
              </div>
            </div>
            <div>
              <label className="block mb-2">Theme</label>
              <button
                onClick={() => handleThemeChange(theme === "dark" ? "light" : "dark")}
                className="p-2 border rounded"
              >
                {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
              </button>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}