import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        display: ["var(--font-outfit)", "sans-serif"],
      },
      colors: {
        brand: {
          pink: "#e11d48", // Hot pink buttons & active states
          "pink-light": "#fef2f6", // Sidebar active background
        },
        neutral: {
          dark: "#1a1a2e", // Primary headings
          muted: "#9a99b0", // Text label descriptions
          border: "#e8e6f0", // Soft border grids
        },
      },
    },
  },
  plugins: [],
};
export default config;
