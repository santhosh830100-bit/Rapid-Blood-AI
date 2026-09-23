/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          950: '#06090E',
          900: '#0B0F17',
          850: '#0F1523',
          800: '#141C2E',
          700: '#1E293B',
          600: '#334155',
        },
        crimson: {
          500: '#FF2E63',
          600: '#E11D48',
          700: '#BE123C',
          glow: 'rgba(255, 46, 99, 0.4)',
        },
        cyan: {
          400: '#00F2FE',
          500: '#00ADB5',
          600: '#0284C7',
          glow: 'rgba(0, 173, 181, 0.4)',
        },
        emerald: {
          400: '#34D399',
          500: '#10B981',
          glow: 'rgba(16, 185, 129, 0.4)',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s infinite ease-in-out',
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scanline': 'scanline 4s linear infinite',
        'radar-sweep': 'radarSweep 4s linear infinite',
        'float': 'float 3s ease-in-out infinite'
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 15px rgba(255, 46, 99, 0.4), inset 0 0 15px rgba(255, 46, 99, 0.2)' },
          '50%': { boxShadow: '0 0 30px rgba(255, 46, 99, 0.8), inset 0 0 25px rgba(255, 46, 99, 0.4)' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' }
        },
        radarSweep: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' }
        }
      }
    },
  },
  plugins: [],
}
