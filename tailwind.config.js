/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        khmer: [
          '"Kantumruy Pro"',
          '"Noto Sans Khmer"',
          '"Khmer OS Battambang"',
          '"Khmer OS"',
          '"Khmer UI"',
          '"Leelawadee UI"',
          'system-ui',
          'sans-serif',
        ],
        mono: [
          '"JetBrains Mono"',
          '"Cascadia Code"',
          '"Consolas"',
          '"Courier New"',
          'monospace',
        ],
      },
      colors: {
        khmer: {
          primary: '#0ea5e9',
          gold: '#eab308',
          success: '#10b981',
          error: '#ef4444',
          subscript: '#8b5cf6',
        }
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 15px rgba(14, 165, 233, 0.6)' },
          '50%': { boxShadow: '0 0 25px rgba(14, 165, 233, 0.95)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%, 60%': { transform: 'translateX(-4px)' },
          '40%, 80%': { transform: 'translateX(4px)' },
        }
      },
      animation: {
        'pulse-glow': 'pulseGlow 1.5s infinite ease-in-out',
        'shake': 'shake 0.3s ease-in-out',
      }
    },
  },
  plugins: [],
}
