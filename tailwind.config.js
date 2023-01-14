const plugin = require("tailwindcss/plugin");
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./pages/**/*.{js,ts,jsx,tsx}", "./views/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    screens: {
      xs: "380px",
      xsm: "450px",
      xmd: "520px",
      ...defaultTheme.screens,
    },
    fontSize: {
      xxs: "8px",
    },
    extend: {
      colors: {
        dark: "#0F2131",
        brand: "#FFDE0D",
        eth: "#5D78DE",
        bsc: "#E4B00A",
        primary: "#EEBB19",
        yellow: "#ffde00",
        portfolio: "#efbb19",
        grey: "#CFCFCF",
        success: "#2FD35D",
        danger: "#D9563A",
        warning: "#D9563A",
        green: "#2FD35D"
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
