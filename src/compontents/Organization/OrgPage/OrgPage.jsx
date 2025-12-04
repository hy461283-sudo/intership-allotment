"use client";
import { useState, useEffect } from "react";
import { Bar, Line, Pie } from "react-chartjs-2";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import {
  Chart as ChartJS,
  CategoryScale,   //test
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

import { useOrg } from "../../../Context/OrgContext";
import { OrgProvider } from "../../../Context/OrgContext";
import OrgNavbar from "../../Common/OrgNavbar";
import OrgSidebar from "../../Common/OrgSidebar";
import { BASE_URL } from "../../../config/apiEndpoints";

function OrganizationDashboardContent() {
  const { activeTab, setActiveTab, theme, org } = useOrg();
  const [projects, setProjects] = useState([]);
  const [drafts, setDrafts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [scheduleDate, setScheduleDate] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchUrl = `${BASE_URL}/api/organization`;

  const [formData, setFormData] = useState({
    projectCode: "",
    projectName: "",
    projectLocation: "",
    interns: "",
    coordinatorName: "",
    coordinatorEmail: "",
    coordinatorAltEmail: "",
    coordinatorPhone: "",
    coordinatorDesignation: "",
    cgpa: "",
    discipline: "",
    skills: "",
    stipend: "",
    guidelines: null,
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const safeFetch = async (url) => {
    try {
      const res = await fetch(url);
      return res.ok ? res.json() : [];
    } catch (err) {
      console.error("Fetch error:", err);
      return [];
    }
  };

  const fetchProjects = async () => {
    const data = await safeFetch(`${fetchUrl}/projects/${org.orgId}`);
    setProjects(Array.isArray(data) ? data : []);
    const draftsList = (Array.isArray(data) ? data : []).filter(
      (d) => d.status === "draft" || d.status === "scheduled"
    );
    setDrafts(draftsList);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleAddProject = async (status = "draft") => {
    if (!formData.projectCode || !formData.projectName || !formData.coordinatorName) {
      alert("Please fill all required fields (marked with *)");
      return;
    }

    if (formData.coordinatorPhone && formData.coordinatorPhone.length !== 10) {
      alert("Contact number must be exactly 10 digits");
      return;
    }

    const data = new FormData();
    Object.entries(formData).forEach(([k, v]) => {
      if (v) {
        data.append(k === "cgpa" ? "cgpaRequirement" : k, v);
      }
    });
    data.append("organizationId", org.orgId);
    data.append("status", status);
    if (scheduleDate && status === "scheduled") {
      data.append("scheduled_time", scheduleDate.toISOString());
    }

    try {
      const res = await fetch(`${fetchUrl}/projects`, {
        method: "POST",
        body: data,
      });
      const result = await res.json();
      alert(result.message || "Project added successfully!");
      setActiveTab("jobListings");
      resetForm();
      fetchProjects();
    } catch (err) {
      alert("Error adding project: " + err.message);
    }
  };

  const handleEditProject = (p) => {
    setEditingId(p.project_id);
    setFormData({
      projectCode: p.project_code || "",
      projectName: p.project_name || "",
      projectLocation: p.project_location || "",
      interns: p.interns_required || "",
      coordinatorName: p.coordinator_name || "",
      coordinatorEmail: p.coordinator_email || "",
      coordinatorAltEmail: p.alternate_email || "",
      coordinatorPhone: p.coordinator_phone || "",
      coordinatorDesignation: p.coordinator_designation || "",
      cgpa: p.cgpa_requirement || "",
      discipline: p.discipline || "",
      skills: p.skills || "",
      stipend: p.stipend || "",
      guidelines: null,
    });
    setActiveTab("addProject");
    window.scrollTo(0, 0);
  };

  const handleUpdateProject = async () => {
    if (!editingId) return;

    if (!formData.projectCode || !formData.projectName) {
      alert("Please fill all required fields");
      return;
    }

    const body = {
      ...formData,
      cgpaRequirement: formData.cgpa,
      status: "active",
    };

    try {
      const res = await fetch(`${fetchUrl}/projects/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const result = await res.json();
      alert(result.message || "Project updated successfully!");
      setEditingId(null);
      setActiveTab("jobListings");
      fetchProjects();
    } catch (err) {
      alert("Error updating project: " + err.message);
    }
  };

  const handleDeleteProject = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this project? This action cannot be undone."
      )
    )
      return;

    try {
      const res = await fetch(`${fetchUrl}/projects/${id}`, {
        method: "DELETE",
      });
      const result = await res.json();
      alert(result.message || "Project deleted successfully!");
      fetchProjects();
    } catch (err) {
      alert("Error deleting project: " + err.message);
    }
  };

  const handleScheduleProject = async (projectId) => {
    if (!scheduleDate) {
      alert("Please select a date and time");
      return;
    }

    try {
      const res = await fetch(`${fetchUrl}/projects/${projectId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "scheduled",
          scheduled_time: scheduleDate.toISOString(),
        }),
      });
      const result = await res.json();
      alert(result.message || "Project scheduled successfully!");
      setScheduleDate(null);
      fetchProjects();
    } catch (err) {
      alert("Error scheduling project: " + err.message);
    }
  };

  const resetForm = () => {
    setFormData({
      projectCode: "",
      projectName: "",
      projectLocation: "",
      interns: "",
      coordinatorName: "",
      coordinatorEmail: "",
      coordinatorAltEmail: "",
      coordinatorPhone: "",
      coordinatorDesignation: "",
      cgpa: "",
      discipline: "",
      skills: "",
      stipend: "",
      guidelines: null,
    });
    setScheduleDate(null);
  };

  // Filter projects based on search
  const filteredProjects = projects.filter(
    (p) =>
      p.project_code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.project_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate statistics
  const stats = {
    totalProjects: projects.length,
    active: projects.filter((p) => p.status === "active").length,
    drafts: projects.filter((p) => p.status === "draft").length,
    applications: projects.reduce((acc, p) => acc + (p.applications || 0), 0),
  };

  // ==================== RENDER UI ====================

  return (
    <div className={`min-h-screen flex ${theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-800"}`}>
      {/* Sidebar */}
      <OrgSidebar />

      {/* Main Content */}
      <main className="flex-1 ml-64 flex flex-col">
        {/* Navbar */}
        <OrgNavbar />

        {/* Page Content */}
        <div className={`flex-1 overflow-y-auto mt-20 ${theme === "dark" ? "bg-gray-900" : "bg-gray-50"}`}>
          {/* Dashboard Overview */}
          {activeTab === "overview" && (
            <section className="p-8 space-y-8">
              {/* Search Bar */}
              <div className="flex justify-center">
                <input
                  type="text"
                  placeholder="🔍 Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full max-w-md px-4 py-2 rounded-lg border transition-colors ${
                    theme === "dark"
                      ? "bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-500"
                      : "bg-white border-gray-300 text-gray-800 placeholder-gray-400"
                  }`}
                />
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-4 gap-4">
                {[
                  { label: "Total Projects", value: stats.totalProjects, color: "purple" },
                  { label: "Active", value: stats.active, color: "green" },
                  { label: "Drafts", value: stats.drafts, color: "yellow" },
                  { label: "Applications", value: stats.applications, color: "blue" },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className={`p-6 rounded-lg shadow transition-transform hover:scale-105 ${
                      theme === "dark"
                        ? "bg-gray-800 hover:bg-gray-750"
                        : "bg-white hover:shadow-md"
                    }`}
                  >
                    <p
                      className={`text-sm font-medium ${
                        theme === "dark" ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {stat.label}
                    </p>
                    <p
                      className={`text-3xl font-bold mt-2 ${
                        stat.color === "purple"
                          ? "text-purple-600"
                          : stat.color === "green"
                          ? "text-green-600"
                          : stat.color === "yellow"
                          ? "text-yellow-600"
                          : "text-blue-600"
                      }`}
                    >
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>

              {/* Applications Chart */}
              <div
                className={`p-6 rounded-lg shadow ${
                  theme === "dark" ? "bg-gray-800" : "bg-white"
                }`}
              >
                <h3 className="font-semibold mb-4 text-lg">
                  Applications Over Time
                </h3>
                <Line
                  key="overviewChart"
                  data={{
                    labels: [
                      "Jan",
                      "Feb",
                      "Mar",
                      "Apr",
                      "May",
                      "Jun",
                    ],
                    datasets: [
                      {
                        label: "Applications",
                        borderColor: "#7c3aed",
                        backgroundColor: "rgba(124, 58, 237, 0.1)",
                        data: [10, 40, 55, 80, 65, 90],
                        tension: 0.4,
                        fill: true,
                      },
                    ],
                  }}
                  options={{
                    maintainAspectRatio: true,
                    responsive: true,
                  }}
                />
              </div>
            </section>
          )}

          {/* Job Listings */}
          {activeTab === "jobListings" && (
            <section className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-semibold text-purple-700">
                  Job Listings
                </h3>
                <button
                  onClick={() => {
                    setEditingId(null);
                    resetForm();
                    setActiveTab("addProject");
                  }}
                  className="bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-purple-800 transition-colors font-medium"
                >
                  + Add Project
                </button>
              </div>

              {/* Search Bar */}
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full px-4 py-2 rounded-lg border transition-colors ${
                    theme === "dark"
                      ? "bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-500"
                      : "bg-white border-gray-300 text-gray-800 placeholder-gray-400"
                  }`}
                />
              </div>

              {/* Projects Table */}
              <div
                className={`rounded-lg shadow overflow-hidden mb-8 ${
                  theme === "dark" ? "bg-gray-800" : "bg-white"
                }`}
              >
                {filteredProjects.length === 0 ? (
                  <div
                    className={`p-8 text-center ${
                      theme === "dark"
                        ? "text-gray-400"
                        : "text-gray-500"
                    }`}
                  >
                    <p className="text-lg">No projects found</p>
                    <p className="text-sm mt-2">
                      Start by creating a new project using the "+ Add
                      Project" button
                    </p>
                  </div>
                ) : (
                  <table className="w-full text-left text-sm">
                    <thead
                      className={`${
                        theme === "dark"
                          ? "bg-gray-700"
                          : "bg-gray-100"
                      }`}
                    >
                      <tr>
                        <th className="px-6 py-3 font-semibold">Code</th>
                        <th className="px-6 py-3 font-semibold">Name</th>
                        <th className="px-6 py-3 font-semibold">Status</th>
                        <th className="px-6 py-3 font-semibold">
                          Applications
                        </th>
                        <th className="px-6 py-3 font-semibold">Date</th>
                        <th className="px-6 py-3 font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProjects.map((p) => (
                        <tr
                          key={p.project_id}
                          className={`border-t transition-colors ${
                            theme === "dark"
                              ? "border-gray-700 hover:bg-gray-700"
                              : "border-gray-200 hover:bg-gray-50"
                          }`}
                        >
                          <td className="px-6 py-3 font-medium">
                            {p.project_code}
                          </td>
                          <td className="px-6 py-3">
                            {p.project_name}
                          </td>
                          <td className="px-6 py-3">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                p.status === "active"
                                  ? "bg-green-100 text-green-800"
                                  : p.status === "draft"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-blue-100 text-blue-800"
                              }`}
                            >
                              {p.status.charAt(0).toUpperCase() +
                                p.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-3">
                            <span className="font-semibold">
                              {p.applications || 0}
                            </span>
                          </td>
                          <td className="px-6 py-3 text-xs text-gray-500">
                            {new Date(
                              p.created_at
                            ).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-3 space-x-2">
                            <button
                              onClick={() =>
                                handleEditProject(p)
                              }
                              className="text-blue-600 hover:text-blue-800 hover:underline text-xs font-medium transition-colors"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() =>
                                handleDeleteProject(
                                  p.project_id
                                )
                              }
                              className="text-red-600 hover:text-red-800 hover:underline text-xs font-medium transition-colors"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              {/* Applications Chart */}
              {filteredProjects.length > 0 && (
                <div
                  className={`p-6 rounded-lg shadow ${
                    theme === "dark" ? "bg-gray-800" : "bg-white"
                  }`}
                >
                  <h3 className="font-semibold mb-4 text-lg">
                    Applications by Project
                  </h3>
                  <Bar
                    key="listingBar"
                    data={{
                      labels: filteredProjects.map((p) =>
                        p.project_name.substring(0, 15)
                      ),
                      datasets: [
                        {
                          label: "Applications",
                          data: filteredProjects.map(
                            (p) => p.applications || 0
                          ),
                          backgroundColor: "#7c3aed",
                          borderColor: "#6d28d9",
                          borderWidth: 1,
                        },
                      ],
                    }}
                    options={{
                      maintainAspectRatio: true,
                      responsive: true,
                    }}
                  />
                </div>
              )}
            </section>
          )}

          {/* Add / Edit Project */}
          {activeTab === "addProject" && (
            <section
              className={`p-8 rounded-lg shadow m-8 ${
                theme === "dark" ? "bg-gray-800" : "bg-white"
              }`}
            >
              <h3 className="text-2xl font-semibold mb-6">
                {editingId ? "Edit Project" : "Add New Project"}
              </h3>

              <div className="space-y-6">
                {/* Project Details */}
                <div>
                  <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
                    <span className="w-6 h-6 bg-purple-700 text-white rounded-full flex items-center justify-center text-sm">
                      1
                    </span>
                    Project Details
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold mb-1">
                        Project Code *
                      </label>
                      <input
                        className={`border p-3 rounded-lg w-full ${
                          theme === "dark"
                            ? "bg-gray-700 border-gray-600"
                            : "bg-white border-gray-300"
                        }`}
                        name="projectCode"
                        placeholder="e.g., PRJ001"
                        value={formData.projectCode}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1">
                        Project Name *
                      </label>
                      <input
                        className={`border p-3 rounded-lg w-full ${
                          theme === "dark"
                            ? "bg-gray-700 border-gray-600"
                            : "bg-white border-gray-300"
                        }`}
                        name="projectName"
                        placeholder="e.g., AI Assistant"
                        value={formData.projectName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1">
                        Project Location
                      </label>
                      <input
                        className={`border p-3 rounded-lg w-full ${
                          theme === "dark"
                            ? "bg-gray-700 border-gray-600"
                            : "bg-white border-gray-300"
                        }`}
                        name="projectLocation"
                        placeholder="e.g., Remote / On-site"
                        value={formData.projectLocation}
                        onChange={handleChange}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1">
                        Number of Interns
                      </label>
                      <select
                        name="interns"
                        className={`border p-3 rounded-lg w-full ${
                          theme === "dark"
                            ? "bg-gray-700 border-gray-600"
                            : "bg-white border-gray-300"
                        }`}
                        value={formData.interns}
                        onChange={handleChange}
                      >
                        <option value="">Select number (1-20)</option>
                        {[...Array(20)].map((_, i) => (
                          <option key={i} value={i + 1}>
                            {i + 1}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1">
                        Discipline
                      </label>
                      <input
                        className={`border p-3 rounded-lg w-full ${
                          theme === "dark"
                            ? "bg-gray-700 border-gray-600"
                            : "bg-white border-gray-300"
                        }`}
                        name="discipline"
                        placeholder="e.g., CSE, ECE, ME"
                        value={formData.discipline}
                        onChange={handleChange}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1">
                        CGPA Requirement
                      </label>
                      <input
                        className={`border p-3 rounded-lg w-full ${
                          theme === "dark"
                            ? "bg-gray-700 border-gray-600"
                            : "bg-white border-gray-300"
                        }`}
                        name="cgpa"
                        placeholder="1.00 - 10.00"
                        value={formData.cgpa}
                        onChange={handleChange}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1">
                        Stipend (Monthly)
                      </label>
                      <input
                        className={`border p-3 rounded-lg w-full ${
                          theme === "dark"
                            ? "bg-gray-700 border-gray-600"
                            : "bg-white border-gray-300"
                        }`}
                        name="stipend"
                        placeholder="e.g., ₹10,000"
                        value={formData.stipend}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs font-semibold mb-1">
                        Required Skills
                      </label>
                      <textarea
                        className={`border p-3 rounded-lg w-full ${
                          theme === "dark"
                            ? "bg-gray-700 border-gray-600"
                            : "bg-white border-gray-300"
                        }`}
                        name="skills"
                        placeholder="Behavioural / Technical / Soft skills required"
                        value={formData.skills}
                        onChange={handleChange}
                        rows="3"
                      />
                    </div>
                  </div>
                </div>

                {/* Coordinator Details */}
                <div
                  className={`border rounded-lg p-4 ${
                    theme === "dark"
                      ? "bg-gray-700 border-gray-600"
                      : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
                    <span className="w-6 h-6 bg-purple-700 text-white rounded-full flex items-center justify-center text-sm">
                      2
                    </span>
                    Coordinator Details
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold mb-1">
                        Coordinator Name *
                      </label>
                      <input
                        className={`border p-3 rounded-lg w-full ${
                          theme === "dark"
                            ? "bg-gray-800 border-gray-600"
                            : "bg-white border-gray-300"
                        }`}
                        name="coordinatorName"
                        placeholder="Full name"
                        value={formData.coordinatorName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1">
                        Company Email *
                      </label>
                      <input
                        type="email"
                        className={`border p-3 rounded-lg w-full ${
                          theme === "dark"
                            ? "bg-gray-800 border-gray-600"
                            : "bg-white border-gray-300"
                        }`}
                        name="coordinatorEmail"
                        placeholder="coordinator@company.com"
                        value={formData.coordinatorEmail}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1">
                        Alternate Email *
                      </label>
                      <input
                        type="email"
                        className={`border p-3 rounded-lg w-full ${
                          theme === "dark"
                            ? "bg-gray-800 border-gray-600"
                            : "bg-white border-gray-300"
                        }`}
                        name="coordinatorAltEmail"
                        placeholder="alternate@email.com"
                        value={formData.coordinatorAltEmail}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1">
                        Contact Number (10 digits)
                      </label>
                      <input
                        type="tel"
                        className={`border p-3 rounded-lg w-full ${
                          theme === "dark"
                            ? "bg-gray-800 border-gray-600"
                            : "bg-white border-gray-300"
                        }`}
                        name="coordinatorPhone"
                        placeholder="9876543210"
                        maxLength="10"
                        value={formData.coordinatorPhone}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs font-semibold mb-1">
                        Coordinator Designation
                      </label>
                      <input
                        className={`border p-3 rounded-lg w-full ${
                          theme === "dark"
                            ? "bg-gray-800 border-gray-600"
                            : "bg-white border-gray-300"
                        }`}
                        name="coordinatorDesignation"
                        placeholder="e.g., HR Manager"
                        value={formData.coordinatorDesignation}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>

                {/* Document Upload */}
                <div>
                  <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
                    <span className="w-6 h-6 bg-purple-700 text-white rounded-full flex items-center justify-center text-sm">
                      3
                    </span>
                    Additional Information
                  </h4>
                  <div>
                    <label className="block text-xs font-semibold mb-2">
                      Upload Guidelines (Optional)
                    </label>
                    <input
                      type="file"
                      className={`border p-3 rounded-lg w-full ${
                        theme === "dark"
                          ? "bg-gray-700 border-gray-600"
                          : "bg-white border-gray-300"
                      }`}
                      name="guidelines"
                      accept=".pdf,.doc,.docx"
                      onChange={handleChange}
                    />
                    <p
                      className={`text-xs mt-1 ${
                        theme === "dark"
                          ? "text-gray-400"
                          : "text-gray-500"
                      }`}
                    >
                      Supported formats: PDF, DOC, DOCX
                    </p>
                  </div>
                </div>

                {/* Schedule (for editing) */}
                {editingId && (
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Schedule Publication
                    </label>
                    <DatePicker
                      selected={scheduleDate}
                      onChange={(date) => setScheduleDate(date)}
                      showTimeSelect
                      dateFormat="Pp"
                      className={`border p-3 rounded-lg w-full ${
                        theme === "dark"
                          ? "bg-gray-700 border-gray-600"
                          : "bg-white border-gray-300"
                      }`}
                      placeholderText="Select date and time to publish..."
                    />
                  </div>
                )}

                {/* Buttons */}
                <div className="flex justify-end gap-4 pt-4 border-t border-gray-300">
                  <button
                    onClick={() => {
                      setActiveTab("jobListings");
                      setEditingId(null);
                      resetForm();
                    }}
                    className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                      theme === "dark"
                        ? "bg-gray-700 hover:bg-gray-600"
                        : "bg-gray-300 hover:bg-gray-400"
                    }`}
                  >
                    Cancel
                  </button>
                  {!editingId && (
                    <>
                      <button
                        onClick={() =>
                          handleAddProject("draft")
                        }
                        className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                          theme === "dark"
                            ? "bg-gray-700 hover:bg-gray-600"
                            : "bg-gray-300 hover:bg-gray-400"
                        }`}
                      >
                        Save Draft
                      </button>
                      <button
                        onClick={() =>
                          handleAddProject("active")
                        }
                        className="px-6 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition-colors font-medium"
                      >
                        Post Project
                      </button>
                    </>
                  )}
                  {editingId && (
                    <>
                      <button
                        onClick={handleUpdateProject}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                      >
                        Update Project
                      </button>
                      <button
                        onClick={() =>
                          handleScheduleProject(editingId)
                        }
                        className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                      >
                        Schedule & Post
                      </button>
                    </>
                  )}
                </div>
              </div>
            </section>
          )}

          {/* Drafts & Scheduled */}
          {activeTab === "drafts" && (
            <section className="p-8">
              <h3 className="text-2xl font-semibold mb-6">
                Drafts & Scheduled Posts
              </h3>
              {drafts.length === 0 ? (
                <div
                  className={`p-8 text-center rounded-lg ${
                    theme === "dark"
                      ? "bg-gray-800 text-gray-400"
                      : "bg-white text-gray-500"
                  }`}
                >
                  <p className="text-lg font-semibold">
                    No drafts or scheduled posts
                  </p>
                  <p className="text-sm mt-2">
                    Your saved drafts will appear here
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {drafts.map((d) => (
                    <div
                      key={d.project_id}
                      className={`border rounded-lg p-5 transition-transform hover:shadow-md ${
                        theme === "dark"
                          ? "bg-gray-800 border-gray-700"
                          : "bg-white border-gray-200 shadow"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <p className="font-semibold text-lg">
                            {d.project_name}
                          </p>
                          <p
                            className={`text-sm mt-1 ${
                              theme === "dark"
                                ? "text-gray-400"
                                : "text-gray-600"
                            }`}
                          >
                            Code: <span className="font-mono">{d.project_code}</span>
                          </p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            d.status === "scheduled"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {d.status.charAt(0).toUpperCase() +
                            d.status.slice(1)}
                        </span>
                      </div>
                      <div className="flex gap-3 items-end flex-wrap">
                        <button
                          onClick={() =>
                            handleEditProject(d)
                          }
                          className="px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() =>
                            handleDeleteProject(
                              d.project_id
                            )
                          }
                          className="px-3 py-2 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors font-medium"
                        >
                          Delete
                        </button>
                        <div className="flex-1 min-w-[200px] flex gap-2">
                          <DatePicker
                            selected={scheduleDate}
                            onChange={(date) =>
                              setScheduleDate(date)
                            }
                            showTimeSelect
                            dateFormat="Pp"
                            className={`border p-2 rounded flex-1 text-sm ${
                              theme === "dark"
                                ? "bg-gray-700 border-gray-600"
                                : "bg-white border-gray-300"
                            }`}
                            placeholderText="Select date & time..."
                          />
                          <button
                            onClick={() =>
                              handleScheduleProject(
                                d.project_id
                              )
                            }
                            className="px-3 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors font-medium"
                          >
                            Schedule
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {/* Analytics */}
          {activeTab === "analytics" && (
            <section className="p-8 grid grid-cols-2 gap-6">
              {/* Line Chart */}
              <div
                className={`p-6 rounded-lg shadow ${
                  theme === "dark" ? "bg-gray-800" : "bg-white"
                }`}
              >
                <h3 className="font-semibold text-lg mb-4">
                  Applications per Week
                </h3>
                <Line
                  key="analyticLine"
                  data={{
                    labels: ["W1", "W2", "W3", "W4"],
                    datasets: [
                      {
                        label: "Applications",
                        borderColor: "#7c3aed",
                        backgroundColor:
                          "rgba(124, 58, 237, 0.1)",
                        data: [5, 20, 35, 50],
                        tension: 0.4,
                        fill: true,
                      },
                    ],
                  }}
                  options={{
                    maintainAspectRatio: true,
                    responsive: true,
                  }}
                />
              </div>

              {/* Pie Chart */}
              <div
                className={`p-6 rounded-lg shadow ${
                  theme === "dark" ? "bg-gray-800" : "bg-white"
                }`}
              >
                <h3 className="font-semibold text-lg mb-4">
                  Applicants by Discipline
                </h3>
                <Pie
                  key="analyticPie"
                  data={{
                    labels: ["CSE", "ECE", "ME"],
                    datasets: [
                      {
                        data: [45, 30, 25],
                        backgroundColor: [
                          "#7c3aed",
                          "#a78bfa",
                          "#c4b5fd",
                        ],
                        borderColor: [
                          "#6d28d9",
                          "#9333ea",
                          "#a855f7",
                        ],
                        borderWidth: 2,
                      },
                    ],
                  }}
                  options={{
                    maintainAspectRatio: true,
                    responsive: true,
                  }}
                />
              </div>
            </section>
          )}

          {/* Settings */}
          {activeTab === "settings" && (
            <section
              className={`p-8 rounded-lg shadow m-8 ${
                theme === "dark" ? "bg-gray-800" : "bg-white"
              }`}
            >
              <h3 className="text-2xl font-semibold mb-6">
                Organization Settings
              </h3>
              <div className="space-y-6 max-w-md">
                {/* Organization Name */}
                <div>
                  <label
                    className={`block text-sm font-semibold mb-2 ${
                      theme === "dark"
                        ? "text-gray-300"
                        : "text-gray-700"
                    }`}
                  >
                    Organization Name
                  </label>
                  <input
                    className={`border p-3 rounded-lg w-full font-medium ${
                      theme === "dark"
                        ? "bg-gray-700 border-gray-600"
                        : "bg-white border-gray-300"
                    }`}
                    defaultValue={org.name}
                  />
                </div>

                {/* Email (Read-Only) */}
                <div>
                  <label
                    className={`block text-sm font-semibold mb-2 ${
                      theme === "dark"
                        ? "text-gray-300"
                        : "text-gray-700"
                    }`}
                  >
                    Organization Email
                  </label>
                  <div className="flex items-center">
                    <input
                      className={`border p-3 rounded-lg flex-1 ${
                        theme === "dark"
                          ? "bg-gray-700 border-gray-600 text-gray-400"
                          : "bg-gray-100 border-gray-300 text-gray-600"
                      }`}
                      readOnly
                      value={org.email}
                    />
                    <span
                      className={`ml-2 text-xs font-semibold ${
                        theme === "dark"
                          ? "text-gray-400"
                          : "text-gray-500"
                      }`}
                    >
                      🔒 Protected
                    </span>
                  </div>
                </div>

                {/* Change Password */}
                <div>
                  <label
                    className={`block text-sm font-semibold mb-3 ${
                      theme === "dark"
                        ? "text-gray-300"
                        : "text-gray-700"
                    }`}
                  >
                    Change Password
                  </label>
                  <div className="space-y-2">
                    <input
                      type="password"
                      placeholder="Current Password"
                      className={`border p-3 rounded-lg w-full ${
                        theme === "dark"
                          ? "bg-gray-700 border-gray-600"
                          : "bg-white border-gray-300"
                      }`}
                    />
                    <input
                      type="password"
                      placeholder="New Password"
                      className={`border p-3 rounded-lg w-full ${
                        theme === "dark"
                          ? "bg-gray-700 border-gray-600"
                          : "bg-white border-gray-300"
                      }`}
                    />
                    <input
                      type="password"
                      placeholder="Confirm Password"
                      className={`border p-3 rounded-lg w-full ${
                        theme === "dark"
                          ? "bg-gray-700 border-gray-600"
                          : "bg-white border-gray-300"
                      }`}
                    />
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-4">
                  <button className="px-6 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition-colors font-medium">
                    Save Changes
                  </button>
                  <button
                    className={`px-6 py-2 border rounded-lg font-medium transition-colors ${
                      theme === "dark"
                        ? "border-gray-600 hover:bg-gray-700"
                        : "border-gray-300 hover:bg-gray-100"
                    }`}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}

export default function OrganizationDashboard() {
  return (
    <OrgProvider>
      <OrganizationDashboardContent />
    </OrgProvider>
  );
}
