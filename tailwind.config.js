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
          50: "#e8e6e1",
          100: "#a0a0a0",
          200: "#888888",
          300: "#666666",
          400: "#333333",
          500: "#1a1a2e",
          600: "#14141f",
          700: "#0f0f18",
          800: "#0a0a0f",
          900: "#050508",
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
