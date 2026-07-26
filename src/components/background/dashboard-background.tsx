"use client";

import Image from "next/image";
import { useTheme } from "next-themes";

import LightBackgroundImage from "./Light_Background_image.png";
import DarkBackgroundImage from "./dark_background_image.png";

export function DashboardBackground() {
  const { theme } = useTheme();

  // Only explicit "dark" uses the dark background.
  // "light" and "system" both use the light background.
  const isDark = theme === "dark";

  return (
    <div className="fixed inset-0 -z-10 flex items-center justify-center overflow-hidden pointer-events-none">
      {/* Light Background */}
      <Image
        src={LightBackgroundImage}
        alt=""
        priority
        quality={100}
        className={`absolute w-[1250px] h-auto select-none translate-x-8 translate-y-4 transition-opacity duration-300 ${
          isDark ? "opacity-0" : "opacity-40"
        }`}
      />

      {/* Dark Background */}
      <Image
        src={DarkBackgroundImage}
        alt=""
        priority
        quality={100}
        className={`absolute w-[1250px] h-auto select-none translate-x-8 translate-y-4 transition-opacity duration-300 ${
          isDark ? "opacity-90" : "opacity-0"
        }`}
      />
    </div>
  );
}
