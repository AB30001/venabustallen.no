const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        mist: "#CBDFE0",
        paper: "#FAF8F5",
        charcoal: "#3D3630",
        accent: {
          DEFAULT: "#C06A45",
          soft: "#D4896A"
        },
        ink: "#2C2824",
        muted: "#6B6560",
        line: "#D9D2CB",
        brand: {
          primary: "#3D3630"
        }
      },
      fontFamily: {
        sans: ["var(--font-source-sans)", ...defaultTheme.fontFamily.sans],
        display: ["var(--font-montserrat)", ...defaultTheme.fontFamily.sans],
        serif: ["var(--font-playfair)", ...defaultTheme.fontFamily.serif],
        stock: [defaultTheme.fontFamily.sans]
      },
      letterSpacing: {
        brand: "0.18em"
      },
      maxWidth: {
        prose: "42rem"
      },
      aspectRatio: {
        "4/3": "4 / 3",
        "3/2": "3 / 2",
        "2/3": "2 / 3",
        "9/16": "9 / 16"
      }
    }
  },
  plugins: [require("@tailwindcss/typography")]
};
