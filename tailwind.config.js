/** @type {import('tailwindcss').Config} */

const colors = require('tailwindcss/colors');
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: colors.blue,
        secondary: colors.green,
        black: colors.black,
        white: colors.white,
      },
    },
    screens: {
      maxSm: { max: '639px' },
    },
  },
  plugins: [],
}