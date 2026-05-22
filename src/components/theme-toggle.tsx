"use client";

import { Moon, Sun } from "lucide-react";
import { useState } from "react";

export function ThemeToggle() {
  const [dark, setDark] = useState(() => {
    if (typeof window === "undefined") return false;
    const saved = localStorage.getItem("shelfwise-theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const shouldUseDark = saved ? saved === "dark" : prefersDark;
    document.documentElement.classList.toggle("dark", shouldUseDark);
    return shouldUseDark;
  });

  function toggleTheme() {
    const next = !dark;
    setDark(next);
    localStorage.setItem("shelfwise-theme", next ? "dark" : "light");
    document.documentElement.classList.toggle("dark", next);
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      title={dark ? "الوضع النهاري" : "الوضع الليلي"}
      className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-stone-300 bg-white text-stone-800 transition hover:bg-stone-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
    >
      {dark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
