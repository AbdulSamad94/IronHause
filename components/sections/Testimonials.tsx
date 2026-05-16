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
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  const testimonials = [
    {
      quote: 'The AI Agent handles 90% of our DMs and site chats. We\'ve seen a 40% increase in booked intro sessions while doing less work.',
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
  ]

  return (
    <section
      ref={sectionRef}
      id="testimonials"
      className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 transition-all duration-700 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      {/* Section header */}
      <div className="mb-16">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-1.5 h-1.5 rounded-full bg-[#00F0FF]" />
          <span className="text-[12px] font-medium tracking-widest uppercase text-white/40">Case Studies</span>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-start gap-6">
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight max-w-sm">
            Trusted by <span className="text-[#00F0FF]">owners.</span>
          </h2>
          <p className="text-white/45 max-w-sm text-[15px] font-normal leading-relaxed md:text-right">
            Facilities using IronHause save an average of 40 hours per month on admin tasks.
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {testimonials.map((item, i) => (
          <div key={i} className="surface p-7 flex flex-col justify-between">
            <div className="mb-7">
              {/* Stars */}
              <div className="flex gap-0.5 mb-5">
                {[...Array(5)].map((_, j) => (
                  <svg key={j} width="13" height="13" viewBox="0 0 24 24" fill="#00F0FF" className="opacity-80">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                ))}
              </div>
              <p className="text-white/75 text-[14px] leading-relaxed font-light">"{item.quote}"</p>
            </div>
            <div className="flex items-center gap-3 pt-5 border-t border-white/[0.06]">
              <img
                src={item.image}
                alt={item.name}
                width={36}
                height={36}
                className="w-9 h-9 rounded-full object-cover border border-white/10"
              />
              <div>
                <div className="text-[13px] font-semibold text-white">{item.name}</div>
                <div className="text-[11px] text-white/35 mt-0.5">{item.role}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
