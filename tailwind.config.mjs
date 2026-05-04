/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        neon: '#E1FF00',
        neonDim: '#C8E500',
        black: '#000000',
        asphalt: '#0A0A0A',
        coal: '#0F0F0F',
        char: '#141414',
        concrete: '#1A1A1A',
        steel: '#262626',
        rule: '#1F1F1F',
        mist: '#777777',
        bone: '#CCCCCC',
        white: '#F2F2F2',
      },
      fontFamily: {
        display: ['"Barlow Condensed"', 'sans-serif'],
        sans: ['Barlow', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      fontSize: {
        'display-xl': ['clamp(48px, 10vw, 88px)', { lineHeight: '0.95', letterSpacing: '-0.01em' }],
        'display-lg': ['clamp(44px, 9vw, 88px)', { lineHeight: '0.95', letterSpacing: '-0.01em' }],
        'display-md': ['clamp(34px, 6vw, 56px)', { lineHeight: '1.05' }],
        'display-sm': ['clamp(32px, 6vw, 56px)', { lineHeight: '1.1' }],
      },
      screens: {
        xs: '480px',
        sm: '640px',
        md: '768px',
        lg: '900px',
        xl: '1024px',
        '2xl': '1200px',
      },
      borderRadius: {
        DEFAULT: '0',
        none: '0',
        btn: '2px',
      },
      transitionTimingFunction: {
        brand: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      letterSpacing: {
        widest: '0.18em',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.4' },
        },
      },
      animation: {
        'fade-up': 'fadeUp 0.9s ease forwards',
        marquee: 'marquee 40s linear infinite',
        blink: 'blink 1.6s ease infinite',
      },
    },
  },
};
