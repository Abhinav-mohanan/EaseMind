/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors:{
        customBlue: '#0B60D9'
      }
    },
  },
  plugins: [],
};
