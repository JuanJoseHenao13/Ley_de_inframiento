/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // enable dark mode via class
  theme: {
    extend: {
      colors: {
        background: {
          light: '#F0F4F8', // Ice Blue / Ice Gray
          dark: '#0F172A',  // Slate 900
        },
        primary: '#3B82F6', // Electric Blue
        textMain: {
          light: '#0F172A', // Navy
          dark: '#F8FAFC',  // Slate 50
        },
      },
    },
  },
  plugins: [],
}
