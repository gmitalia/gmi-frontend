module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3b3c5c',
          light: '#6366f1',
          dark: '#23233a',
        },
        secondary: {
          DEFAULT: '#38bdf8',
          light: '#7dd3fc',
          dark: '#0e7490',
        },
      },
    },
  },
  plugins: [],
}
