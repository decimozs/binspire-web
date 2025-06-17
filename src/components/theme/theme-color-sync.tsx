import { useEffect } from "react";
import { useTheme } from "../provider/theme-provider";

export function ThemeColorSync() {
  const { theme } = useTheme();

  useEffect(() => {
    const metaTag = document.querySelector('meta[name="theme-color"]');
    if (!metaTag) return;

    const updateThemeColor = (color: string) => {
      metaTag.setAttribute("content", color);
    };

    if (theme === "light") {
      updateThemeColor("#fafafa");
    } else if (theme === "dark") {
      updateThemeColor("#09090b");
    } else if (theme === "system") {
      const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      updateThemeColor(isDark ? "##09090b" : "#fafafa");
    }
  }, [theme]);

  return null;
}
