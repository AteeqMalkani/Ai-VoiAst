/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#09090B",
        surface: "#18181B",
        primary: "#4F46E5",
        accent: "#8B5CF6",
        text: "#F8FAFC",
        muted: "#94A3B8",
      },
    },
  },
  plugins: [],
};
