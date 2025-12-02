"use client";

import { useEffect, useState, useContext } from "react";
import { Bell, GraduationCap, Sun, Moon } from "lucide-react";
import { Link } from "react-router-dom";
import "./LogoCarousel.css";
import Image1 from "./Images/Image1.png";
import { ThemeContext } from "../../Context/ThemeContext";


function Navbar() {
  const [activeItem, setActiveItem] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [visibleCompanies, setVisibleCompanies] = useState([]);

  // ✅ Use global theme context
  const { theme, toggleTheme } = useContext(ThemeContext);

  const navItems = [
    { id: "student", label: "Student", to: "/SLogin" },
    { id: "organization", label: "Organization", to: "/Org" },
    { id: "admin", label: "Admin", to: "/Admin" },
  ];

  const companies = [
    { id: 1, name: "Google", logo: "https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png" },
    { id: 2, name: "Microsoft", logo: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg" },
    { id: 3, name: "Amazon", logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" },
    { id: 4, name: "Apple", logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" },
    { id: 6, name: "IBM", logo: "https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg" },
    { id: 8, name: "Salesforce", logo: "https://upload.wikimedia.org/wikipedia/commons/f/f9/Salesforce.com_logo.svg" },
    { id: 10, name: "Cisco", logo: "https://upload.wikimedia.org/wikipedia/commons/6/64/Cisco_logo.svg" },
  ];

  useEffect(() => {
    setVisibleCompanies(companies);
  }, []);

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  const handleThemeChange = (mode) => {
    toggleTheme(mode);
    setMenuOpen(false);
  };

  return (
    <div className={`w-full min-h-screen transition-colors duration-300 ${theme === "dark" ? "dark bg-gray-900 text-gray-100" : "bg-white text-gray-900"}`}>
      {/* ===== Navbar ===== */}
      <nav
        style={{ borderBottom: "1px solid #e5e7eb" }}
        className={`w-full transition-colors ${theme === "dark" ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"}`}
      >
        <div className="flex items-center justify-between px-8 py-3">
          {/* ===== Left Section (Logo + Title) ===== */}
          <div className="flex items-center gap-3">
            <div className="inline-block p-1 bg-purple-700 rounded-full border border-purple-400/30">
              <GraduationCap className="w-8 h-8 text-white" strokeWidth={1.5} />
            </div>
            <h1 className={`text-lg font-semibold whitespace-nowrap ${theme === "dark" ? "text-purple-300" : "text-purple-800"}`}>
              Smart Internship Allotment
            </h1>
          </div>

          {/* ===== Right Section ===== */}
          <div className="flex items-center gap-8">
            {/* Nav Links */}
            <div className="hidden md:flex items-center gap-6">
              {navItems.map((item) => (
                <Link
                  key={item.id}
                  to={item.to}
                  onClick={() => setActiveItem(item.id)}
                  className={`text-sm font-medium pb-2 transition-colors relative ${
                    activeItem === item.id
                      ? theme === "dark" ? "text-white" : "text-black"
                      : theme === "dark"
                      ? "text-gray-300 hover:text-white"
                      : "text-gray-500 hover:text-black"
                  }`}
                >
                  {item.label}
                  {activeItem === item.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600" />
                  )}
                </Link>
              ))}
            </div>

            {/* Bell Icon */}
            <button
              className={`transition p-2 ${
                theme === "dark"
                  ? "text-gray-300 hover:text-white"
                  : "text-gray-500 hover:text-black"
              }`}
            >
              <Bell size={20} />
            </button>

            {/* Avatar with Theme Menu */}
            <div className="relative">
              <button
                onClick={toggleMenu}
                className={`w-8 h-8 rounded-full border border-purple-900 flex items-center justify-center ${
                  theme === "dark"
                    ? "bg-gray-700 hover:bg-gray-600"
                    : "bg-gray-100 hover:bg-gray-200"
                } transition`}
              >
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-t2JCrJ3MMYtjD9GCpYab7dJqHhMVSX.png"
                  alt="User avatar"
                  className="w-full h-full object-cover rounded-full"
                />
              </button>

              {/* Dropdown Theme Menu */}
              {menuOpen && (
                <div
                  className={`absolute right-0 mt-2 w-40 border rounded-lg shadow-lg z-50 ${
                    theme === "dark"
                      ? "bg-gray-800 border-gray-700 text-gray-200"
                      : "bg-white border-gray-200 text-gray-700"
                  }`}
                >
                  <p className="px-4 py-2 text-sm font-semibold border-b dark:border-gray-700">
                    Theme
                  </p>
                  <button
                    onClick={() => handleThemeChange("light")}
                    className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 ${
                      theme === "light"
                        ? "bg-purple-100 text-purple-700"
                        : "hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    <Sun size={16} /> Light
                  </button>
                  <button
                    onClick={() => handleThemeChange("dark")}
                    className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 ${
                      theme === "dark"
                        ? "bg-purple-800 text-purple-200"
                        : "hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    <Moon size={16} /> Dark
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* ===== Hero Image ===== */}
      <div className="w-full h-[75vh]">
        <img src={Image1} alt="Loading..." className="w-full h-full object-cover" />
      </div>

      {/* ===== About Section ===== */}
      <div className={`px-12 py-10 text-center transition-colors ${
        theme === "dark"
          ? "bg-gray-900 text-gray-300"
          : "bg-gradient-to-b from-purple-50 via-white to-purple-50 text-gray-700"
      }`}>
        <h2 className={`text-2xl font-semibold mb-4 ${theme === "dark" ? "text-purple-300" : "text-purple-800"}`}>
          Welcome to Smart Internship Allotment Portal
        </h2>
        <p className="leading-relaxed text-justify max-w-5xl mx-auto">
          Welcome to our innovative internship platform, where we revolutionize how students and organizations connect.
          Our mission is to empower students to discover and secure top internships that match their skills and interests,
          while providing organizations with a streamlined process to find and hire the best talent.
          <br /><br />
          Our platform simplifies the internship process, making it easier for students to find opportunities aligned
          with their goals and for organizations to find the perfect fit.
          <br /><br />
          Join our community today and experience the future of internship placement – bridging opportunity with talent
          smartly and seamlessly.
        </p>
      </div>

      {/* ===== Logo Carousel Section ===== */}
      <div className={`w-full py-16 transition-colors duration-300 ${
        theme === "dark"
          ? "bg-gray-900 text-gray-300"
          : "bg-gradient-to-r from-purple-50 via-white to-purple-50"
      }`}>
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className={`text-3xl font-bold mb-2 ${theme === "dark" ? "text-purple-300" : "text-purple-900"}`}>
              Partner Companies
            </h2>
            <p className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>
              Internships at leading IT companies worldwide
            </p>
          </div>

          {/* Animated Carousel Container */}
          <div className="overflow-hidden">
            <div className="logo-carousel">
              {[...visibleCompanies, ...visibleCompanies].map((company, index) => (
                <div key={`${company.id}-${index}`} className="logo-item flex items-center justify-center">
                  <div
                    className={`p-6 rounded-lg shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center h-24 w-40 ${
                      theme === "dark" ? "bg-gray-800" : "bg-white"
                    }`}
                  >
                    <img
                      src={company.logo}
                      alt={company.name}
                      className="max-h-16 max-w-32 object-contain filter hover:brightness-110 transition-all"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-3 gap-8 mt-16 text-center">
            {[
              ["50+", "Partner Companies"],
              ["1000+", "Internship Positions"],
              ["5000+", "Students Placed"],
            ].map(([num, label], i) => (
              <div
                key={i}
                className={`p-6 rounded-lg shadow-sm ${
                  theme === "dark" ? "bg-gray-800" : "bg-white"
                }`}
              >
                <div className={`text-3xl font-bold mb-2 ${theme === "dark" ? "text-purple-300" : "text-purple-700"}`}>
                  {num}
                </div>
                <p className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===== Footer ===== */}
      <footer className={`py-4 text-center transition-colors duration-300 ${
        theme === "dark" ? "bg-gray-950 text-white" : "bg-purple-900 text-white"
      }`}>
        <p className="text-sm font-medium">
          © {new Date().getFullYear()} Smart Internship Allotment | Mayank Kumar
        </p>
      </footer>
    </div>
  );
}

export default Navbar;
