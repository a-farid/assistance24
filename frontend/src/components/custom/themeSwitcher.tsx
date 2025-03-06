"use client";
import { BiMoon, BiSun } from "react-icons/bi";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

export const ThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // Prevent hydration error

  return (
    <div className="hover:bg-blue cursor-pointer">
      {theme === "light" ? (
        <BiSun size={24} onClick={() => setTheme("dark")} fill="black" />
      ) : (
        <BiMoon size={24} onClick={() => setTheme("light")} />
      )}
    </div>
  );
};
