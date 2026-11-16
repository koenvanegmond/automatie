import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/sections/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: { sm: "375px", md: "768px", lg: "1200px" },
    extend: {
      colors: {
        brand: { DEFAULT: "#25855A", dark: "#1D6B48", light: "#DCEFE5" },
        ink: "#1C1917",
        cream: "#FAF9F6",
        sand: "#F0EFEA",
        body: "#44403C",
      },
      fontFamily: {
        sans: ["var(--font-zt)", "system-ui", "sans-serif"],
        display: ["var(--font-zt)", "system-ui", "sans-serif"],
      },
      container: { center: true, padding: { DEFAULT: "20px", lg: "80px" } },
      boxShadow: {
        card: "0 1px 2px rgba(28,25,23,.04), 0 8px 24px -8px rgba(28,25,23,.12)",
      },
    },
  },
  plugins: [],
};

export default config;
