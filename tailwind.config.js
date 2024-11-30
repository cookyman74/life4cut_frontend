/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Tailwind 적용 경로
  ],
  theme: {
    extend: {
      filter: {
        'none': 'none',
        'grayscale': 'grayscale(100%)',
        'brightness-150': 'brightness(1.5)',
        'contrast-200': 'contrast(2)',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
