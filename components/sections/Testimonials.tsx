'use client'

import { useEffect, useState, useRef } from 'react'

export function Testimonials() {
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
      id="testimonials"
      className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 transition-all duration-1000 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
      }`}
    >
      <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
        <div>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            Trusted by <span className="text-linear">owners.</span>
          </h2>
          <p className="text-white/50 max-w-xl text-lg">
            Facilities using IronHause save an average of 40 hours per month on administrative tasks.
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          {
            quote: "The AI Agent handles 90% of our DMs and site chats. We've seen a 40% increase in booked intro sessions while doing less work.",
            name: 'James Carter',
            role: 'Owner, Apex Athletics',
            image: 'https://randomuser.me/api/portraits/men/32.jpg',
          },
          {
            quote: 'They completely rebuilt our site and plugged in their booking bot. It feels like having a full-time receptionist working 24/7.',
            name: 'Sarah Reynolds',
            role: 'Founder, The Vault',
            image: 'https://randomuser.me/api/portraits/women/44.jpg',
          },
          {
            quote: 'I finally have time to actually coach my clients again instead of answering "what are your hours" emails at 11 PM.',
            name: 'Marcus Chen',
            role: 'Head Coach, Iron Core',
            image: 'https://randomuser.me/api/portraits/men/67.jpg',
          },
        ].map((item, i) => (
           <div key={i} className="glass-surface p-8 flex flex-col justify-between">
            <div className="mb-8">
              <div className="flex gap-1 text-cyan-400 mb-4">
                {[...Array(5)].map((_, j) => (
                  <svg key={j} width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                ))}
              </div>
              <p className="text-white/80 text-sm leading-relaxed font-light">"{item.quote}"</p>
            </div>
            <div className="flex items-center gap-4">
              <img src={item.image} alt={item.name} className="w-10 h-10 rounded-full object-cover border border-white/10" />
              <div>
                <div className="text-sm font-semibold">{item.name}</div>
                <div className="text-xs text-white/40">{item.role}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
