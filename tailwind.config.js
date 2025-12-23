/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        saffron: {
          50: '#fff8ed',
          100: '#ffefcf',
          200: '#ffdba0',
          300: '#ffc266',
          400: '#ff9f29',
          500: '#ff8400',
          600: '#e66a00',
          700: '#bf4f02',
          800: '#983e0b',
          900: '#7a340e',
        },
        temple: {
          50: '#fdf6f3',
          100: '#fceae4',
          200: '#fad8cd',
          300: '#f5bda9',
          400: '#ee9678',
          500: '#e4724e',
          600: '#d05833',
          700: '#ae4628',
          800: '#903c25',
          900: '#783624',
        },
        maroon: {
          50: '#fdf2f4',
          100: '#fce7ea',
          200: '#f9d0d9',
          300: '#f4aabb',
          400: '#ed7a96',
          500: '#e04e74',
          600: '#cb2d5d',
          700: '#ab204c',
          800: '#8f1e44',
          900: '#6b1a35',
        },
        gold: {
          50: '#fefdf7',
          100: '#fefae8',
          200: '#fcf3c5',
          300: '#f9e78e',
          400: '#f5d54e',
          500: '#efc01f',
          600: '#d39c12',
          700: '#af7511',
          800: '#905c14',
          900: '#764b17',
        }
      },
      fontFamily: {
        display: ['Cormorant Garamond', 'serif'],
        body: ['Outfit', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

