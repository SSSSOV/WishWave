"use client";

import { useTheme } from "@/context/ThemeContext";
import Button from "./Button";
// import { MoonIcon, SunIcon } from '@heroicons/react/24/outline'; // Или любые другие иконки

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="filled"
      onClick={toggleTheme}
      icon={theme === "light" ? "dark_mode" : "light_mode"}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}></Button>
  );
}
