import { useEffect, useState } from "react";
import clsx from "clsx";
import { useTheme } from "next-themes";
import { Switch } from "@headlessui/react";
import { MoonIcon, SunIcon } from "@heroicons/react/outline";

const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();
  const [isDark, setDark] = useState(theme === "dark");
  const [mounted, setMounted] = useState(false);

  // When mounted on client, now we can show the UI
  useEffect(() => setMounted(true), []);

  const toggleTheme = () => {
    if (theme === "dark") {
      setTheme("light");
      setDark(false);
    }
    if (theme === "light") {
      setTheme("dark");
      setDark(true);
    }
  };

  if (!mounted) return null;

  return (
    <div className="inline-flex py-3 px-4">
      <Switch
        checked={isDark}
        onChange={toggleTheme}
        className={clsx(
          isDark ? "bg-slate-600" : "bg-gray-400",
          "relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand"
        )}
      >
        <span className="sr-only">Change theme</span>
        <span
          className={clsx(
            isDark ? "translate-x-5" : "translate-x-0",
            "pointer-events-none relative inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"
          )}
        >
          <span
            className={clsx(
              isDark
                ? "opacity-0 ease-out duration-100"
                : "opacity-100 ease-in duration-200",
              "absolute inset-0 h-full w-full flex items-center justify-center transition-opacity"
            )}
            aria-hidden="true"
          >
            <SunIcon className="w-4 h-4 text-dark" />
          </span>
          <span
            className={clsx(
              isDark
                ? "opacity-100 ease-in duration-200"
                : "opacity-0 ease-out duration-100",
              "absolute inset-0 h-full w-full flex items-center justify-center transition-opacity"
            )}
            aria-hidden="true"
          >
            <MoonIcon className="w-4 h-4 text-dark" />
          </span>
        </span>
      </Switch>

      <span className="ml-4 text-sm text-gray-500">Current theme: {theme}</span>
    </div>
  );
};

export default ThemeSwitcher;
