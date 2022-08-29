module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: "#0F2131",
        brand: "#FFDE0D",
      },
    },
    fontFamily: {
      brand: ['"Questrial"'],
    },
  },
  plugins: [require("@tailwindcss/forms")],
  darkMode: "class",
};
