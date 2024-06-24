/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        yes: 'var(--green)',
        no: 'var(--red)',
        info: '#00b2ff',
        main: 'var(--text-main)',
        secondary: 'var(--gray-3)',
        active: 'var(--white-10)',
      }
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        light: {
          ...require('daisyui/src/theming/themes')['[data-theme=light]'],
          primary: '#E75B1F',
        },
      },
      {
        dark: {
          ...require('daisyui/src/theming/themes')['[data-theme=dark]'],
          primary: '#E75B1F',
          'base-100': '#2a334c',
          'base-200': '#252d37'
        },
      },
    ],
  },
};
