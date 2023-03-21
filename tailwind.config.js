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
        accentDark: 'rgb(96, 165, 250)',
        accentLight: 'rgb(30, 64, 175)',
        textLight: '#232323',
        textDark: '#e5e7eb',
        borderDark: '#777',
        borderLight: 'rgb(82, 82, 91)',
        backgroundDark: '#1B1B1B',
        backgroundLight: '#343434',
        'bg-dk': '#0a0a0a',
        'bg-var-dk': '#2b2b2b',
        'bg-deco-dk': '#474747',
        'bg-outline-dk': '#757575',
        'brand-dk': '#2e69ff',
        'bg-txt-dk': '#f7f7f7',
        'brand-txt-dk': '#ffffff',
        'bg-txt-lt': '#080808',
        'bg-outline-lt': '#757575',
        'brand-lt': '#2e69ff',
        'bg-deco-lt': '#9e9e9e',
        'bg-var-lt': '#d1d1d1',
        'bg-lt': '#fafafa',
        'brand-txt-lt': '#ffffff',
      },
      boxShadow: {
        bottom: '1px 3px 0px -2px rgba(0, 0, 0, 1)',
      },
    },
  },
  plugins: [],
};
