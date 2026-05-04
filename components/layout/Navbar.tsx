'use client'

import { useEffect, useState } from 'react'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 border-b ${
        scrolled ? 'bg-aura-bg/80 backdrop-blur-xl border-white/5 py-4' : 'bg-transparent border-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <div className="text-2xl font-semibold tracking-tight text-white flex items-center gap-2 cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-linear-to-tr from-cyan-400 to-blue-600 flex items-center justify-center">
            <div className="w-3 h-3 bg-white rounded-full"></div>
          </div>
          IronHause
        </div>
        
        <div className="hidden md:flex gap-8 items-center">
          {[
            { name: 'Platform', href: '#programs' },
            { name: 'Case Studies', href: '#testimonials' },
            { name: 'Pricing', href: '#pricing' }
          ].map((item) => (
            <a key={item.name} href={item.href} className="text-sm font-medium text-white/60 hover:text-white transition-colors">
              {item.name}
            </a>
          ))}
        </div>

        <a href="#cta" className="hidden md:block btn-glow text-sm">
          Deploy Agent
        </a>

        <div className="md:hidden text-white/60 hover:text-white">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
        </div>
      </div>
    </nav>
  )
}
