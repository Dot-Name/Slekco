/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: { DEFAULT: '#14161A', soft: '#3A3F47', mute: '#6E747E' },
        canvas: '#F1F2F6',
        surface: '#FFFFFF',
        line: { DEFAULT: '#E4E6EB', strong: '#CFD3DB' },
        brand: {
          50: '#EEF1FE', 100: '#DCE2FE', 200: '#BAC5FC',
          300: '#8E9EF9', 400: '#5F73F5', 500: '#2F4BF0',
          600: '#1F35C9', 700: '#1929A0', 800: '#16227C', 900: '#131D5F',
        },
        // Category accents — the marketplace is plural, so the palette is too.
        cat: {
          electronics: '#2F4BF0',
          fashion: '#D6246E',
          home: '#12876F',
          beauty: '#7A46E0',
          fitness: '#E08700',
          accessories: '#0E8FA8',
        },
        success: '#12876F',
        danger: '#D63A2E',
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['"Instrument Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.6875rem', { lineHeight: '1rem', letterSpacing: '0.08em' }],
      },
      borderRadius: { xl: '0.875rem', '2xl': '1.125rem', '3xl': '1.5rem' },
      boxShadow: {
        card: '0 1px 2px rgba(20,22,26,.04), 0 8px 24px -12px rgba(20,22,26,.12)',
        lift: '0 2px 6px rgba(20,22,26,.06), 0 24px 48px -24px rgba(20,22,26,.28)',
        pop: '0 12px 40px -12px rgba(20,22,26,.30)',
      },
      maxWidth: { shell: '1280px' },
      spacing: { 4.5: '1.125rem', 13: '3.25rem', 18: '4.5rem' },
      transitionTimingFunction: { swift: 'cubic-bezier(.22,.61,.36,1)' },
      keyframes: {
        'fade-up': { '0%': { opacity: 0, transform: 'translateY(10px)' }, '100%': { opacity: 1, transform: 'none' } },
        'slide-up': { '0%': { transform: 'translateY(100%)' }, '100%': { transform: 'none' } },
        'slide-in-left': { '0%': { transform: 'translateX(-100%)' }, '100%': { transform: 'none' } },
        'slide-in-right': { '0%': { transform: 'translateX(100%)' }, '100%': { transform: 'none' } },
        'spectrum-in': { '0%': { transform: 'scaleX(0)' }, '100%': { transform: 'scaleX(1)' } },
        pop: { '0%': { transform: 'scale(.6)' }, '60%': { transform: 'scale(1.15)' }, '100%': { transform: 'scale(1)' } },
        shimmer: { '100%': { transform: 'translateX(100%)' } },
      },
      animation: {
        'fade-up': 'fade-up .5s cubic-bezier(.22,.61,.36,1) both',
        'slide-up': 'slide-up .28s cubic-bezier(.22,.61,.36,1) both',
        'slide-in-left': 'slide-in-left .28s cubic-bezier(.22,.61,.36,1) both',
        'slide-in-right': 'slide-in-right .28s cubic-bezier(.22,.61,.36,1) both',
        'spectrum-in': 'spectrum-in .7s cubic-bezier(.22,.61,.36,1) both',
        pop: 'pop .3s cubic-bezier(.22,.61,.36,1)',
      },
    },
  },
  plugins: [],
};
