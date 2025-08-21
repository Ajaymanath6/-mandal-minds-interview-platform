import colors from 'tailwindcss/colors'

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['IBM Plex Sans', 'sans-serif'],
      },
      colors: {
        // Custom order: purple, gray, then Tailwind's yellow, orange, and the rest
        purple: {
          50: '#F5EDFC',
          100: '#EAD8FC',
          200: '#DFC2FE',
          300: '#D4A6FE',
          400: '#B867F0',
          500: '#9C2CE0',
          600: '#7C00FF',
          700: '#6603CF',
          800: '#4D0B92',
          900: '#320D5A',
        },
        gray: {
          50: '#F4F6F9',
          100: '#E5EBF2',
          200: '#D5DEE9',
          300: '#C6D2E0',
          400: '#B6C5D7',
          500: '#A6B8CD',
          600: '#96ABC4',
          700: '#ABBDD1',
          800: '#7E97B0',
          900: '#5B748E',
        },
        yellow: colors.yellow,
        orange: colors.orange,
        // Rest of Tailwind's modern palettes (exclude deprecated aliases)
        amber: colors.amber,
        slate: colors.slate,
        zinc: colors.zinc,
        neutral: colors.neutral,
        stone: colors.stone,
        red: colors.red,
        lime: colors.lime,
        green: colors.green,
        emerald: colors.emerald,
        teal: colors.teal,
        cyan: colors.cyan,
        sky: colors.sky,
        blue: colors.blue,
        indigo: colors.indigo,
        violet: colors.violet,
        fuchsia: colors.fuchsia,
        pink: colors.pink,
        rose: colors.rose,
        white: colors.white,
        black: colors.black,
        transparent: 'transparent',
        current: 'currentColor',
        inherit: 'inherit',
      },
    },
  },
  plugins: [],
}

