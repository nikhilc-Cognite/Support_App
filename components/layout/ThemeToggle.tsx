"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export const THEME_STORAGE_KEY = "cognite-theme";
export const THEME_CHANGE_EVENT = "cognite-theme-change";

export function ThemeToggle({ className }: { className?: string }) {
  // Bootstrap script (see app/layout.tsx) already set the attribute before
  // paint; read it back rather than guessing, so this never flashes.
  const [theme, setTheme] = useState<"light" | "dark">("light");

  // Reading the DOM attribute the bootstrap script set; doing this during
  // render would mismatch the server-rendered (theme-less) markup.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const current = document.documentElement.getAttribute("data-theme");
    setTheme(current === "dark" ? "dark" : "light");
  }, []);

  function toggle() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // localStorage unavailable (private browsing, etc.) — theme still
      // applies for this session, just won't persist across reloads.
    }
    window.dispatchEvent(new CustomEvent(THEME_CHANGE_EVENT, { detail: next }));
  }

  return (
    <button
      onClick={toggle}
      aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
      title={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
      className={className ?? "flex h-9 w-9 items-center justify-center rounded-lg text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800"}
    >
      {theme === "dark" ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
    </button>
  );
}
