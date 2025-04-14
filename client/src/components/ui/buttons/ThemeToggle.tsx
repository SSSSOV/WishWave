"use client";

import { useTheme } from "@/context/ThemeContext";
// import { MoonIcon, SunIcon } from '@heroicons/react/24/outline'; // Или любые другие иконки

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      className="filed_button">
      {theme === "light" ? (
        <span className="material-symbols-rounded w-5 h-5">dark_mode</span>
      ) : (
        <span className="material-symbols-rounded w-5 h-5">light_mode</span>
      )}
    </button>
  );
}
