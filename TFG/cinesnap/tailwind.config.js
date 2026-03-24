/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        // Al definir 'sans', sobreescribimos la fuente por defecto de Tailwind
        sans: ['"PT Sans"', "sans-serif"],
      },
      backgroundImage: {
        "cinema-pattern": "url('/patterns/cinema-dark.webp')",
      },
    },
  },
  
  plugins: [],
};

