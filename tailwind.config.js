const plugin = require("tailwindcss/plugin");
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./pages/**/*.{js,ts,jsx,tsx}", "./views/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    screens: {
      xs: "380px",
      xmd: "520px",
      ...defaultTheme.screens,
    },
    extend: {
      colors: {
        dark: "#0F2131",
        brand: "#FFDE0D",
        eth: "#5D78DE",
        bsc: "#E4B00A",
        yellow: "#ffde00",
        portfolio: "#efbb19",
        grey: "#CFCFCF",
        success: "#2FD35D",
        danger: "#D9563A",
      },
    },
    fontFamily: {
      script: ['"Caveat"'],
      brand: ['"Questrial"'],
      dash: ['"Roboto"'],
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
