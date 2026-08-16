/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Vurgu skalası. İsim tarihsel ("gold") — değerler artık aktif palete
        // göre turuncu / bakır / altın olabilir (bkz. app/globals.css).
        // Kodda yalnızca 200-300-400-500 stopları kullanılıyor; uç stoplar
        // dangling kalmasın diye en yakın tanımlı değişkene bağlandı.
        gold: {
          50:  "rgb(var(--gold-200) / <alpha-value>)",
          100: "rgb(var(--gold-200) / <alpha-value>)",
          200: "rgb(var(--gold-200) / <alpha-value>)",
          300: "rgb(var(--gold-300) / <alpha-value>)",
          400: "rgb(var(--gold-400) / <alpha-value>)",
          500: "rgb(var(--gold-500) / <alpha-value>)",
          600: "rgb(var(--gold-500) / <alpha-value>)",
          700: "rgb(var(--gold-500) / <alpha-value>)",
          800: "rgb(var(--gold-500) / <alpha-value>)",
          900: "rgb(var(--gold-500) / <alpha-value>)",
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
