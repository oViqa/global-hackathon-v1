/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'pudding': {
          50: '#fef8f0',
          100: '#fdeee0',
          200: '#fad9b8',
          300: '#f7c490',
          400: '#f1a040',
          500: '#e87d0f',
          600: '#d06009',
          700: '#ad4509',
          800: '#8c350e',
          900: '#722d0f',
        },
      },
    },
  },
  plugins: [],
}
