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

        'bg-var-dk': '#000000',
        'bg-dk': '#1f1f1f',
        'deco-dk': '#3d3d3d',
        'border-dk': '#6b6b6b',
        'txt-low-dk': '#878787',
        'txt-mid-dk': '#ababab',
        'txt-main-dk': '#ffffff',


        'txt-main': '#000000',
        'txt-mid': '#474747',
        'txt-low': '#636363',
        'border': '#8c8c8c',
        'deco': '#e0e0e0',
        'bg-var': '#f7f7f7',
        'bg': '#ffffff',
        

      },
      boxShadow: {
        bottom: '1px 3px 0px -2px rgba(0, 0, 0, 1)',
      },
    },
  },
  plugins: [],
};
