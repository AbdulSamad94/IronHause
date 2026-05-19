'use client'

import { useEffect, useState } from 'react'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
      scrolled
        ? 'bg-[#080808]/90 backdrop-blur-xl border-b border-white/[0.06] py-3'
        : 'bg-transparent border-b border-transparent py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">

        {/* Wordmark */}
        <div className="flex items-center gap-2.5 cursor-pointer">
          <div className="w-2 h-2 rounded-full bg-[#00F0FF]" />
          <span className="text-[15px] font-semibold tracking-tight text-white">
            IronHause
          </span>
        </div>

        {/* Nav links */}
        <div className="hidden md:flex gap-7 items-center">
          {[
            { name: 'Platform',     href: '#programs' },
            { name: 'Case Studies', href: '#testimonials' },
            { name: 'Pricing',      href: '#pricing' },
          ].map(item => (
            <a
              key={item.name}
              href={item.href}
              className="text-[13px] text-white/50 hover:text-white transition-colors duration-150 font-medium"
            >
              {item.name}
            </a>
          ))}
        </div>

        {/* CTA */}
        <a href="#cta" className="hidden md:block btn-primary text-[13px]">
          Deploy Agent
        </a>

        {/* Mobile menu icon */}
        <button className="md:hidden text-white/50 hover:text-white transition-colors" aria-label="Open menu">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="3" y1="8"  x2="21" y2="8"  />
            <line x1="3" y1="16" x2="21" y2="16" />
          </svg>
        </button>

      </div>
    </nav>
  )
}
