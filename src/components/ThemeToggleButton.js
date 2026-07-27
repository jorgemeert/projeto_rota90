import React from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export default function ThemeToggleButton({ className = "" }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label={theme === "dark" ? "Ativar modo claro" : "Ativar modo escuro"}
      className={`p-2 rounded-lg text-muted hover:text-ink hover:bg-surface transition-colors ${className}`}
    >
      {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
