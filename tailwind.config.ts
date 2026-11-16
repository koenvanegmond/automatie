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
        ink: "#0E1110",
        cream: "#FFFFFF",
        sand: "#F3F4F3",
        body: "#4B504E",
      },
      fontFamily: {
        sans: ["var(--font-zt)", "system-ui", "sans-serif"],
        display: ["var(--font-zt)", "system-ui", "sans-serif"],
      },
      container: { center: true, padding: { DEFAULT: "20px", lg: "80px" } },
      boxShadow: {
        card: "0 1px 0 rgba(14,17,16,.04)",
      },
    },
  },
  plugins: [],
};

export default config;
