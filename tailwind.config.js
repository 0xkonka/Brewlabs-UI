const plugin = require("tailwindcss/plugin");
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./src/pages/**/*.{js,ts,jsx,tsx}", "./src/views/**/*.{js,ts,jsx,tsx}", "./src/components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    screens: {
      xs: "380px",
      xsm: "450px",
      xmd: "610px",
      ...defaultTheme.screens,
    },
    fontSize: {
      ...defaultTheme.fontSize,
    },
    extend: {
      colors: {
        dark: "#0F2131",
        brand: "#FFDE0D",
        eth: "#5D78DE",
        bsc: "#E4B00A",
        primary: "#EEBB19",
        green: "#2FD35D",
        yellow: "#ffde00",
        grey: "#CFCFCF",
        danger: "#D9563A",
      },
      boxShadow: {
        'inner': 'inset 0px 0px 6px #000000'
      }
    },
    fontFamily: {
      script: ['"Caveat"'],
      brand: ['"Questrial"'],
      roboto: ['"Roboto"'],
      dash: ['"Roboto"'],
    }
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
