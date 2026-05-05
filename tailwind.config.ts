import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'iron-neon': '#C8F400',
        'iron-purple': '#B200FF',
        'iron-dark': '#0A0A0A',
      },
      fontFamily: {
        bebas: ['var(--font-bebas)'],
        dm: ['var(--font-dm)'],
        anton: ['var(--font-anton)'],
        jetbrains: ['var(--font-jetbrains)'],
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        marquee: 'marquee 30s linear infinite',
      },
    },
  },
}
export default config
