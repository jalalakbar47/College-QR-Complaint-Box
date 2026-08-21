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
        'ink-navy-card': '#16234A',
        'registrar-blue': '#2455A4',
        'seal-gold': '#B8873B',
        'ledger-green': '#1D7A5F',
        'case-red': '#B3261E',

        // 3-Level Surface Elevation Scale
        'paper': '#EAEDF3',           // Surface-0: Page canvas (#EAEDF3)
        'surface-0': '#EAEDF3',        // Surface-0: Page canvas (#EAEDF3)
        'paper-card': '#FFFFFF',      // Surface-1: Card / Container (#FFFFFF)
        'surface-1': '#FFFFFF',       // Surface-1: Card / Container (#FFFFFF)
        'paper-recessed': '#F3F5F9',  // Surface-2: Recessed items inside cards (#F3F5F9)
        'surface-2': '#F3F5F9',       // Surface-2: Recessed items inside cards (#F3F5F9)

        'ink-muted': '#5B6472',
        'hairline': '#D7DEE8',        // Distinct hairline border (#D7DEE8)

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
        'sm': '0 1px 2px 0 rgba(16, 27, 54, 0.06)',
        'md': '0 4px 6px -1px rgba(16, 27, 54, 0.08), 0 2px 4px -1px rgba(16, 27, 54, 0.04)',
        'lg': '0 10px 15px -3px rgba(16, 27, 54, 0.1), 0 4px 6px -2px rgba(16, 27, 54, 0.05)',
        'subtle': '0 1px 2px 0 rgba(16, 27, 54, 0.05)',
        'card': '0 1px 3px 0 rgba(16, 27, 54, 0.08), 0 1px 2px 0 rgba(16, 27, 54, 0.04)',
        'elevated': '0 10px 25px -3px rgba(16, 27, 54, 0.08), 0 4px 10px -2px rgba(16, 27, 54, 0.04)',
        'glow': '0 0 25px -5px rgba(36, 85, 164, 0.25)',
      },
      letterSpacing: {
        'display': '-0.01em',
      }
    },
  },
  plugins: [],
}
