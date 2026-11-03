/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        espresso: {
          DEFAULT: '#30231C',
          dark: '#1F1612',
          light: '#453329'
        },
        roasted: {
          DEFAULT: '#4B3428',
          light: '#624637'
        },
        ivory: {
          DEFAULT: '#F8F5EE',
          warm: '#F5EFE6',
          light: '#FAF7F2'
        },
        oat: {
          DEFAULT: '#E9DCC9',
          light: '#F2E9DD',
          dark: '#D8C6AD'
        },
        sage: {
          DEFAULT: '#9CA88E',
          light: '#B5BEAA',
          dark: '#7E8C6F'
        },
        terracotta: {
          DEFAULT: '#BC785C',
          light: '#CE937B',
          dark: '#9E5F46'
        },
        charcoal: {
          DEFAULT: '#252525',
          muted: '#575757'
        }
      },
      fontFamily: {
        serif: ['"DM Serif Display"', 'Georgia', 'serif'],
        sans: ['Manrope', 'Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'brand': '14px',
        'pill': '9999px',
      },
      boxShadow: {
        'soft': '0 8px 30px rgba(48, 35, 28, 0.06)',
        'elevated': '0 18px 45px rgba(48, 35, 28, 0.12)',
        'modal': '0 25px 60px rgba(48, 35, 28, 0.22)'
      }
    },
  },
  plugins: [],
}
