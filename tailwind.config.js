/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}", "./index.html"],
  theme: {
    extend: {
      fontFamily: {
        'serif': ['Playfair Display', 'serif'],
        'sans': ['Inter', 'sans-serif'],
      },
      colors: {
        cosmic: {
          purple: '#8e44ad',
          pink: '#ff69b4',
          gold: '#f1c40f',
          midnight: '#0c0a1a',
        }
      },
    },
  },
  plugins: [],
}