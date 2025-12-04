"use client";
import { createContext, useState, useContext } from "react";

const OrgContext = createContext();

export function OrgProvider({ children }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [theme, setTheme] = useState("light");
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [org] = useState({
    name: "SIA Innovations Pvt Ltd",
    email: "contact@sia.com",
    logo: "/logo.svg",
    orgId: 1,
  });

  const getPageTitle = () => {
    const titles = {
      overview: "Dashboard Overview",
      jobListings: "Job Listings",
      drafts: "Drafts & Scheduled",
      analytics: "Analytics",
      settings: "Settings",
      addProject: "Add Project",
    };
    return titles[activeTab] || "Dashboard";
  };

  return (
    <OrgContext.Provider
      value={{
        activeTab,
        setActiveTab,
        theme,
        setTheme,
        showProfileMenu,
        setShowProfileMenu,
        org,
        getPageTitle,
      }}
    >
      {children}
    </OrgContext.Provider>
  );
}

export const useOrg = () => {
  const context = useContext(OrgContext);
  if (!context) {
    throw new Error("useOrg must be used within OrgProvider");
  }
  return context;
};
