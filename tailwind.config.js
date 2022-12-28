/** @type {import('tailwindcss').Config} */
module.exports = {
   content: ["./src/**/*.{js,jsx,ts,tsx}"],
   theme: {
      extend: {
         transitionProperty: {
            width: "width",
            height: "height",
         },
      },
      fontFamily: {
         mons: ["Montserrat", "sans-serif"],
      },
   },
   plugins: [],
   darkMode: "class",
}
