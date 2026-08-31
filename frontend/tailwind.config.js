/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        command: {
          bg: '#0B0F19',
          card: '#111827',
          header: '#1E293B',
          accent: '#06B6D4',
          glow: '#00F0FF',
          border: '#1F293D'
        }
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s infinite',
        'radar-sweep': 'radarSweep 4s linear infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 15px rgba(6, 182, 212, 0.6)' },
          '50%': { boxShadow: '0 0 30px rgba(6, 182, 212, 1)' },
        }
      }
    },
  },
  plugins: [],
}
