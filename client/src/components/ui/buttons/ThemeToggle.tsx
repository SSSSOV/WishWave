"use client";

import { useTheme } from "@/context/ThemeContext";
import Button from "./Button";
import style from "./ThemeToggle.module.css";

export function ThemeToggle({
  isAbsolute,
  ...props
}: { isAbsolute?: boolean } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { theme, toggleTheme } = useTheme();

  return isAbsolute ? (
    <>
      <div className={style.absolute}>
        <Button
          variant="filled"
          onClick={toggleTheme}
          icon={theme === "light" ? "dark_mode" : "light_mode"}
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          {...props}></Button>
      </div>
    </>
  ) : (
    <>
      <Button
        variant="filled"
        onClick={toggleTheme}
        icon={theme === "light" ? "dark_mode" : "light_mode"}
        aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        {...props}></Button>
    </>
  );
}
