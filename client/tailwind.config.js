/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
    "./public/**/*.{html,js}",
  ],
  theme: {
    extend: {
      fontFamily: {
        slab: ['var(--font-josefin)', 'serif'],
      },
    },
  },
  plugins: [],
};
