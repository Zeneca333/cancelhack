/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: '#10b981',
          hover: '#059669',
          subtle: 'rgba(16, 185, 129, 0.1)',
        },
        cream: '#faf7f2',
        surface: '#ffffff',
        ink: {
          DEFAULT: '#2d2a26',
          muted: '#8a857d',
          faint: '#b5b0a8',
        },
      },
      fontFamily: {
        mono: ['"Space Mono"', 'monospace'],
        sans: ['"Inter"', 'sans-serif'],
      },
      maxWidth: {
        content: '56rem',
      },
      animation: {
        blink: 'blink 1s step-end infinite',
        'fade-in': 'fadeInUp 0.4s ease-out both',
      },
      keyframes: {
        blink: { '50%': { opacity: '0' } },
        fadeInUp: {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
