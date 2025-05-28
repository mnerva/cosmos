/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'hero-pattern': "url('/assets/images/bg.png')",
      },
      fontFamily: {
        josefin: ['"Josefin Slab"', 'serif'],
      },
    },
  },
  plugins: [],
};
