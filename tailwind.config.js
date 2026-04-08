/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50: "#FFF8E7",
          100: "#FFEFC2",
          200: "#FFE08A",
          300: "#F0D060",
          400: "#D4AF37",
          500: "#B8860B",
          600: "#8B6914",
          700: "#6B5210",
          800: "#4A3A0D",
          900: "#2A210A",
        },
        dark: {
          50:  "rgb(var(--dark-50)  / <alpha-value>)",
          100: "rgb(var(--dark-100) / <alpha-value>)",
          200: "rgb(var(--dark-200) / <alpha-value>)",
          300: "rgb(var(--dark-300) / <alpha-value>)",
          400: "rgb(var(--dark-400) / <alpha-value>)",
          500: "rgb(var(--dark-500) / <alpha-value>)",
          600: "rgb(var(--dark-600) / <alpha-value>)",
          700: "rgb(var(--dark-700) / <alpha-value>)",
          800: "rgb(var(--dark-800) / <alpha-value>)",
          900: "rgb(var(--dark-900) / <alpha-value>)",
        },
      },
      fontFamily: {
        sans: ["DM Sans", "Segoe UI", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [],
};
