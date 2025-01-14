/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors')

export default {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  content: [],
  theme: {
    extend: {},
    colors: {
      black: colors.black,
      white: colors.white,
      gray: colors.gray,
      emerald: colors.emerald,
      indigo: colors.indigo,
      yellow: colors.yellow,
      blue: colors.blue,
      red: colors.red,
      green: colors.green,
      orange: colors.orange,
      starblue :'#053774',
      stargreen :'#02b1ae',
      staryellow :'#f2b70b',
    },
  },
  plugins: [],
}

