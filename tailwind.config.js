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
        body: '1350px',
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
        'bg-dk': '#000000',
        'bg-var-dk': '#2b2b2b',
        'bg-deco-dk': '#3d3d3d',
        'bg-outline-dk': '#636363',
        'brand-dk': '#2e69ff',
        'bg-txt-lo-dk': '#d9d9d9',
        'bg-txt-dk': '#ffffff',
                                
        'bg-txt-lt': '#000000',
        'bg-txt-lo-lt': '#3d3d3d',
        'brand-lt': '#2e69ff',
        'bg-outline-lt': '#8a8a8a',
        'bg-deco-lt': '#d1d1d1',
        'bg-var-lt': '#f5f5f5',
        'bg-lt': '#ffffff',
                
      },
      boxShadow: {
        bottom: '1px 3px 0px -2px rgba(0, 0, 0, 1)',
      },
    },
  },
  plugins: [],
};
