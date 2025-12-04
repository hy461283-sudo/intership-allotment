"use client";
import { Home, PlusCircle, FileText, BarChart2, Settings, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useOrg } from "../../Context/OrgContext";

const menuItems = [
  { id: "overview", icon: Home, label: "Dashboard Overview" },
  { id: "jobListings", icon: PlusCircle, label: "Job Listings" },
  { id: "drafts", icon: FileText, label: "Drafts & Scheduled" },
  { id: "analytics", icon: BarChart2, label: "Analytics" },
  { id: "settings", icon: Settings, label: "Settings" },
];

export default function OrgSidebar() {
  const navigate = useNavigate();
  const { activeTab, setActiveTab, theme } = useOrg();

  const handleLogout = () => {
    navigate("/Org");
  };

  return (
    <aside
      className={`w-64 flex flex-col h-screen fixed left-0 top-0 ${
        theme === "dark"
          ? "bg-gray-800 border-r border-gray-700"
          : "bg-white border-r border-gray-200 shadow-sm"
      }`}
    >
      {/* Portal Branding */}
      <div
        className={`px-6 py-5 border-b ${
          theme === "dark" ? "border-gray-700" : "border-gray-200"
        }`}
      >
        <h1
          className={`text-xl font-bold ${
            theme === "dark" ? "text-white" : "text-purple-700"
          }`}
        >
          SIA Portal
        </h1>
      </div>

      {/* Navigation Menu */}
      <nav className="p-4 flex-1 space-y-2 overflow-y-auto">
        {menuItems.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex w-full gap-3 px-4 py-3 rounded-lg transition-colors text-sm font-medium ${
              activeTab === id
                ? theme === "dark"
                  ? "bg-purple-900 text-purple-300"
                  : "bg-purple-100 text-purple-700"
                : theme === "dark"
                ? "text-gray-300 hover:bg-gray-700"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <Icon size={18} />
            <span>{label}</span>
          </button>
        ))}
      </nav>

      {/* Logout Button */}
      <div
        className={`p-4 border-t ${
          theme === "dark" ? "border-gray-700" : "border-gray-200"
        }`}
      >
        <button
          onClick={handleLogout}
          className={`flex w-full items-center gap-3 px-4 py-2 rounded-lg font-medium transition-colors ${
            theme === "dark"
              ? "text-red-400 hover:bg-gray-700"
              : "text-red-600 hover:bg-red-50"
          }`}
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
