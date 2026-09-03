/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eefbf5",
          100: "#d5f5e6",
          200: "#aeeacf",
          300: "#78d9b1",
          400: "#3fc08f",
          500: "#1ba573",
          600: "#0f855c",
          700: "#0d6a4b",
          800: "#0d543d",
          900: "#0b4534",
        },
        ink: {
          50: "#f6f7f9",
          100: "#eceef2",
          200: "#d5d9e2",
          300: "#b0b7c6",
          400: "#848fa5",
          500: "#65708a",
          600: "#505a72",
          700: "#42495d",
          800: "#3a3f4f",
          900: "#0b1220",
          950: "#060a14",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Sora", "Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(11,18,32,0.04), 0 4px 20px -8px rgba(11,18,32,0.08)",
        pop: "0 10px 40px -12px rgba(11,18,32,0.25)",
      },
    },
  },
  plugins: [],
};
