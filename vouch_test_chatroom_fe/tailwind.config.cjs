/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{html,ts,tsx}"
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [{
      default: {
        primary: "#5DB075",
        secondary: "#E8E8E8",
        'base-100': "#F6F6F6"
      }
    }]
  }
}

