import type { Metadata } from 'next'
import { Geist, Geist_Mono, Anton, JetBrains_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });
const _anton = Anton({ weight: ['400'], subsets: ["latin"], variable: '--font-anton' });
const _jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: '--font-jetbrains' });

export const metadata: Metadata = {
  title: 'IRONHAUS - Built to Destroy Limits',
  description: 'Elite training. Zero excuses. Real results.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${_anton.variable} ${_jetbrainsMono.variable} dark`}>
      <body className="font-jetbrains antialiased bg-black text-white selection:bg-iron-neon selection:text-black">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
