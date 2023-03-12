/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      gridTemplateColumns: {
        frAutoFr: '1fr auto 1fr',
        autoAuto: 'auto auto',
        autoFr: 'auto 1fr',
      },
      gridTemplateRows: {
        autoFr: 'auto 1fr',
      },
      minWidth: {
        body: '360px',
      },
      maxWidth: {
        body: '1400px',
      },
      width: {
        body: 'calc(100vw - 4rem)',
      },
      colors: {
        accentDark: 'rgb(96 165 250)',
        accentLight: 'rgb(30 64 175)',
        textLight: '#232323',
        textDark: '#e5e7eb',
        borderDark: '#777',
        borderLight: 'rgb(82 82 91)',
        backgroundDark: '#1B1B1B',
        backgroundLight: '#343434',
      },
      boxShadow: {
        'bottom': '1px 3px 0px -2px rgba(0, 0, 0, 1)',
      }
    },
  },
  plugins: [],
};
