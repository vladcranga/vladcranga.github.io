/** @type {import('tailwindcss').Config} */
export const content = ['./*.html'];
export const theme = {
  extend: {
    animation: {
      fadeIn: 'fadeIn 2s ease-in-out',
    },
    keyframes: {
      fadeIn: {
        from: { opacity: '0' },
        to: { opacity: '1' },
      },
    },
  },
};
export const plugins = [];
