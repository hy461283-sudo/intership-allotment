import { createContext, useState, useEffect, useMemo, useContext } from "react";

// ✅ Create ThemeContext
export const ThemeContext = createContext({
  theme: "light",
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = (mode) => {
    if (mode === "light" || mode === "dark") setTheme(mode);
    else setTheme((t) => (t === "dark" ? "light" : "dark"));
  };

  const value = useMemo(() => ({ theme, toggleTheme }), [theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

// ✅ Optional hook for easier access
export const useTheme = () => useContext(ThemeContext);