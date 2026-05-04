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

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="programs"
      className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 transition-all duration-1000 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
      }`}
    >
      <div className="text-center mb-20">
        <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
          A fully autonomous <span className="text-linear-cyan">frontend.</span>
        </h2>
        <p className="text-white/50 max-w-2xl mx-auto text-lg">
          Our AI agents embed seamlessly into your website to handle the repetitive tasks that drain your team's energy.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {[
          {
            icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>,
            title: 'Smart Scheduling',
            description: 'Agents sync directly with your facility calendar, negotiating times and booking sessions entirely autonomously.',
          },
          {
            icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>,
            title: 'Lead Capture',
            description: 'Engage every visitor instantly. The agent qualifies leads and collects contact info 24/7 without being pushy.',
          },
          {
            icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>,
            title: '24/7 Member Support',
            description: 'Trained on your specific FAQs, pricing, and facility rules to answer member queries instantly at 2 AM.',
          },
        ].map((feature, i) => (
          <div key={i} className="glass-surface p-8 text-left">
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-cyan-400 mb-6">
              {feature.icon}
            </div>
            <h3 className="text-xl font-semibold mb-3 tracking-tight">{feature.title}</h3>
            <p className="text-white/50 text-sm leading-relaxed font-light">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
