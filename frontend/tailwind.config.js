/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors:{
        customBlue: '#0B60D9',
        textBlue:'#0B1263'
      },
      keyframes:{
        slide:{
          '0%':{top: '-0.5rem'},
          '100%':{top: '100%'}
        },
      },
      animation:{
        slide: 'slide 1.5s linear infinite'
      }
    },
  },
  plugins: [],
};
