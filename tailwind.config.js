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
        display: ['"Familjen Grotesk"', 'Helvetica Neue', 'Arial', 'sans-serif'],
        body: ['Manrope', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace']
      },
      colors: {
        void: {
          DEFAULT: '#030305',
          card: 'rgba(255, 255, 255, 0.03)',
          border: 'rgba(255, 255, 255, 0.08)',
          hover: 'rgba(255, 255, 255, 0.06)',
        },
        cyanGlow: '#5EE7FF',
        pinkGlow: '#FF4D9D',
        amberGlow: '#FFB454',
        purpleGlow: '#8B7CFF',
        emeraldGlow: '#4FFFC4',
      },
      animation: {
        'drift': 'drift 78s ease-in-out infinite alternate',
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
      },
      keyframes: {
        drift: {
          '0%': { transform: 'translate3d(-2.5%, 1.5%, 0) scale(1.04)' },
          '50%': { transform: 'translate3d(2%, -2.5%, 0) scale(1.12)' },
          '100%': { transform: 'translate3d(-1%, 2.5%, 0) scale(1.02)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '0.85', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.02)' },
        }
      }
    },
  },
  plugins: [],
}
