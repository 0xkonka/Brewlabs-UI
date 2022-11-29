const plugin = require("tailwindcss/plugin");

module.exports = {
  content: ["./pages/**/*.{js,ts,jsx,tsx}", "./views/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        dark: "#0F2131",
        brand: "#FFDE0D",
        eth: "#5D78DE",
        bsc: "#E4B00A",
      },
    },
    fontFamily: {
      script: ['"Caveat"'],
      brand: ['"Questrial"'],
    },
  },
  plugins: [
    require("daisyui"),
    require("@tailwindcss/forms"),
    plugin(function ({ addVariant }) {
      addVariant("home", ".home &");
    }),
  ],
  darkMode: "class",
};
