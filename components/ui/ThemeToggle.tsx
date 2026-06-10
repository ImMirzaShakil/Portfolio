"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" aria-label="Toggle theme">
        <Sun className="size-4" />
      </Button>
    );
  }

  const cycleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
      return;
    }

    if (theme === "dark") {
      setTheme("system");
      return;
    }

    setTheme("light");
  };

  const icon =
    theme === "system" ? (
      <Monitor className="size-4" />
    ) : resolvedTheme === "dark" ? (
      <Moon className="size-4" />
    ) : (
      <Sun className="size-4" />
    );

  const label =
    theme === "system"
      ? "System theme"
      : theme === "dark"
        ? "Dark theme"
        : "Light theme";

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={cycleTheme}
      aria-label={`Toggle theme (current: ${label})`}
      title={label}
    >
      {icon}
    </Button>
  );
}
