/** @type {import('tailwindcss').Config} */
export default {

  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", 
  ],
  theme: {
    extend: {
      colors: {
        jh7_red: '#E11D48',
        jh7_dark: '#0F172A',
      },
    },
  },
  plugins: [],
}