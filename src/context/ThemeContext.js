import React, { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext(null);
const STORAGE_KEY = "rota90:theme";

function loadTheme() {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === "light" || saved === "dark") return saved;
  } catch {
    // ignore
  }
  const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  return prefersDark ? "dark" : "light";
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(loadTheme);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    try {
      window.localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // ignore
    }
  }, [theme]);

  function toggleTheme() {
    setTheme((t) => (t === "dark" ? "light" : "dark"));
  }

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme precisa estar dentro de um ThemeProvider");
  return ctx;
}
