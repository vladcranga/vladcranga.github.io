/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.html"],
  theme: {
    extend: {
        animation: {
            fadeIn: "fadeIn 2s ease-in-out",
        },
        keyframes: {
            fadeIn: {
                from: { opacity: "0" },
                to: { opacity: "1" },
            },
        },
    },
},
  plugins: [],
}
