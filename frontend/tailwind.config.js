/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        copper: {
          50: '#FAF4EF',
          100: '#F4E5D8',
          200: '#EAC8AB',
          300: '#DFAB7F',
          400: '#D38C53',
          500: '#C87941', // Base Copper
          600: '#A75D2B',
          700: '#82441D',
          800: '#623418',
          900: '#4F2B15',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Outfit', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
      }
    },
  },
  plugins: [],
}
