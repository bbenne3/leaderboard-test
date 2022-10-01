/** @type {import('tailwindcss').Config} */

const templateStartEnd = Array.from({length: 13}).reduce((x, _, idx) => ({...x, [idx + 12]: `${idx + 12}`}), {});

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
        gridTemplateColumns: {
          // Simple 16 column grid
          '12': 'repeat(12, minmax(0, 1fr))',
          '16': 'repeat(16, minmax(0, 1fr))',
          '24': 'repeat(24, minmax(0, 1fr))',
        },
        gridColumnStart: templateStartEnd,
        gridColumnEnd: templateStartEnd,
    },
  },
  plugins: [],
}
