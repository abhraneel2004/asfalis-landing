/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        crimson: {
          DEFAULT: '#C0392B',
          dark: '#A93226',
          light: '#E74C3C',
        },
        ivory: '#FAF9F6',
        charcoal: '#2C2C2C',
        blush: {
          DEFAULT: '#F1948A',
          light: '#FDEAEB',
        },
        teal: {
          DEFAULT: '#1A6B6B',
          light: '#1E8585',
        },
        'light-grey': '#EFEFEF',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'fade-up': 'fade-up 0.7s ease-out forwards',
        'count-ring': 'sos-countdown 10s linear infinite',
      },
    },
  },
  plugins: [],
}
