/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        aws: {
          orange: '#FF9900',
          'orange-hover': '#EC7211',
          'squid-ink': '#232F3E',
          'smile-blue': '#0073BB',
          dark: '#0B0F19',
          card: '#111827',
          surface: '#1E293B',
          border: '#334155',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['"Lora"', '"Newsreader"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
      },
      boxShadow: {
        'glow-orange': '0 0 20px -5px rgba(255, 153, 0, 0.3)',
        'glow-blue': '0 0 20px -5px rgba(56, 189, 248, 0.3)',
        'subtle-card': '0 4px 20px -2px rgba(0, 0, 0, 0.5)',
      },
    },
  },
  plugins: [],
};
