import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#f7f3ea',
        ink: '#181714',
        graphite: '#3c3a34',
        moss: '#53624b',
        clay: '#b65d3c',
        mist: '#d8dfdd'
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'Arial', 'sans-serif'],
        serif: ['Georgia', 'Cambria', 'serif']
      },
      boxShadow: {
        editorial: '0 24px 70px rgba(24, 23, 20, 0.12)'
      }
    }
  },
  plugins: []
};

export default config;
