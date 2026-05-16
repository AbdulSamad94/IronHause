'use client'

import { useEffect, useState, useRef } from 'react'

export function Programs() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.1 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  const features = [
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      ),
      title: 'Smart Scheduling',
      description: 'Agents sync directly with your facility calendar, negotiating times and booking sessions entirely autonomously.',
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
      title: 'Lead Capture',
      description: 'Engage every visitor instantly. The agent qualifies leads and collects contact info 24/7 without being pushy.',
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      ),
      title: '24/7 Member Support',
      description: 'Trained on your specific FAQs, pricing, and facility rules to answer member queries instantly at 2 AM.',
    },
  ]

  return (
    <section
      ref={sectionRef}
      id="programs"
      className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 transition-all duration-700 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      {/* Section header */}
      <div className="mb-16">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-1.5 h-1.5 rounded-full bg-[#00F0FF]" />
          <span className="text-[12px] font-medium tracking-widest uppercase text-white/40">Platform</span>
        </div>
        <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4 max-w-2xl">
          A fully autonomous <span className="text-[#00F0FF]">frontend.</span>
        </h2>
        <p className="text-white/45 max-w-xl text-[17px] font-normal leading-relaxed">
          AI agents embed seamlessly into your website to handle the repetitive tasks that drain your team's energy.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-5">
        {features.map((feature, i) => (
          <div key={i} className="surface p-7">
            <div className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-[#00F0FF] mb-6">
              {feature.icon}
            </div>
            <h3 className="text-[17px] font-semibold mb-2.5 tracking-tight">{feature.title}</h3>
            <p className="text-white/45 text-[14px] leading-relaxed font-light">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
