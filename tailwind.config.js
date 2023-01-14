const plugin = require("tailwindcss/plugin");

module.exports = {
  content: ["./pages/**/*.{js,ts,jsx,tsx}", "./views/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    screens: {
      'xsm': '450px',
      // => @media (min-width: 640px) { ... }
      'sm': '640px',
      // => @media (min-width: 640px) { ... }
      'md': '768px',
      // => @media (min-width: 768px) { ... }
      'lg': '1024px',
      // => @media (min-width: 1024px) { ... }
      'xl': '1280px',
      // => @media (min-width: 1280px) { ... }
      '2xl': '1536px',
      // => @media (min-width: 1536px) { ... }
    },
    extend: {
      colors: {
        dark: "#0F2131",
        brand: "#FFDE0D",
        eth: "#5D78DE",
        bsc: "#E4B00A",
        primary: "#EEBB19",
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
