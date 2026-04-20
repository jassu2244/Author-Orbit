/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        canvas: '#F5F3ED',
        accent: '#D95B54',
        ink: '#1C1C1C',
        muted: '#6B6B6B',
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Merriweather', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
