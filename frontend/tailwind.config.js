/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'dusk-blue': '#3d5a80',
        'powder-blue': '#98c1d9',
        'light-cyan': '#e0fbfc',
        'burnt-peach': '#ee6c4d',
        'jet-black': '#293241',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 2px 12px rgba(41, 50, 65, 0.08)',
        'card-hover': '0 8px 24px rgba(41, 50, 65, 0.12)',
      },
    },
  },
  plugins: [],
};
