/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f8fbff',
          100: '#eaf4ff',
          200: '#cfe4ff',
          300: '#a9ccff',
          400: '#7da6ff',
          500: '#5c7dff',
          600: '#435aea',
          700: '#373fb9',
          800: '#2f358b',
          900: '#2d316d'
        }
      }
    }
  },
  plugins: []
};
