/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: "#0f172a",
        accent: "#1e293b",
        soft: "#f8fafc",
        line: "#e2e8f0",
        gold: "#b45309",
        "brand-light": "#334155",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        headline: ["Newsreader", "Georgia", "serif"],
      },
      boxShadow: {
        soft: "0 10px 40px rgba(15, 23, 42, 0.08)",
        card: "0 2px 16px rgba(15, 23, 42, 0.06)",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.25rem",
        "4xl": "1.5rem",
      },
    },
  },
  plugins: [],
};