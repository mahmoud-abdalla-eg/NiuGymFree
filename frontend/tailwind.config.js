/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        nutrition: {
          primary: '#10b981',
          protein: '#0ea5e9',
          carbs: '#f59e0b',
          fat: '#f43f5e',
        },
        gym: {
          primary: '#8b5cf6',
          volume: '#06b6d4',
          rest: '#f59e0b',
          failure: '#f43f5e',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
