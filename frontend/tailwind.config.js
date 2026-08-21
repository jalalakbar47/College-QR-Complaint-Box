/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Shared Design System Tokens
        'ink-navy': '#101B36',
        'registrar-blue': '#2455A4',
        'seal-gold': '#B8873B',
        'ledger-green': '#1D7A5F',
        'case-red': '#B3261E',
        'paper': '#F4F6F9',
        'paper-card': '#FFFFFF',
        'ink-muted': '#5B6472',
        'hairline': '#E2E6ED',

        // Legacy palette support
        brand: {
          50: '#f0f7ff',
          100: '#e0effe',
          200: '#bae0fd',
          300: '#7cc7fb',
          400: '#36abf7',
          500: '#2455A4',
          600: '#2455A4',
          700: '#1a4182',
          800: '#101B36',
          900: '#0c152a',
          950: '#060a14',
        },
        navy: {
          800: '#101B36',
          900: '#0c152a',
          950: '#060a14',
        }
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'sans-serif',
        ],
        serif: [
          'Fraunces',
          'Georgia',
          'serif',
        ],
        display: [
          'Fraunces',
          'Georgia',
          'serif',
        ],
        mono: [
          '"IBM Plex Mono"',
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'Monaco',
          'Consolas',
          'monospace',
        ],
      },
      boxShadow: {
        subtle: '0 1px 3px 0 rgba(16, 27, 54, 0.04), 0 1px 2px 0 rgba(16, 27, 54, 0.02)',
        card: '0 4px 6px -1px rgba(16, 27, 54, 0.05), 0 2px 4px -1px rgba(16, 27, 54, 0.03)',
        elevated: '0 10px 25px -3px rgba(16, 27, 54, 0.08), 0 4px 10px -2px rgba(16, 27, 54, 0.04)',
        glow: '0 0 25px -5px rgba(36, 85, 164, 0.25)',
      },
      letterSpacing: {
        'display': '-0.01em',
      }
    },
  },
  plugins: [],
}

