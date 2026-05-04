'use client'

import { useEffect, useState, useRef } from 'react'

export function Pricing() {
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
      id="pricing"
      className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 transition-all duration-1000 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
      }`}
    >
      <div className="text-center mb-20">
        <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
          Simple, transparent <span className="text-linear">pricing.</span>
        </h2>
        <p className="text-white/50 max-w-2xl mx-auto text-lg">
          Choose the deployment tier that fits your facility's scale.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 items-center max-w-5xl mx-auto">
        {[
          {
            name: 'Agent Plugin',
            price: '99',
            cycle: '/mo',
            desc: 'For gyms with an existing modern website.',
            features: ['AI Chatbot Integration', 'Lead Capture Protocol', 'Calendar Sync', 'Basic FAQ Training'],
            popular: false,
          },
          {
            name: 'Full Platform',
            price: '1.5k',
            cycle: ' flat',
            desc: 'Complete digital overhaul for your facility.',
            features: ['Premium Website Design', 'Pre-installed AI Agent', 'Custom Domain & SEO', 'Advanced SOP Training'],
            popular: true,
          },
          {
            name: 'Enterprise',
            price: 'Custom',
            cycle: '',
            desc: 'For multi-location franchise operations.',
            features: ['Multi-Location Support', 'Custom LLM Fine-tuning', 'CRM & Zapier Webhooks', 'Dedicated Account Manager'],
            popular: false,
          },
        ].map((tier, i) => (
          <div
            key={i}
            className={`glass-surface p-8 relative ${tier.popular ? 'border-cyan-500/30 shadow-[0_0_40px_rgba(0,240,255,0.1)] transform md:-translate-y-4' : ''}`}
          >
            {tier.popular && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-linear-to-r from-cyan-400 to-blue-500 text-black text-[10px] font-bold px-3 py-1 rounded-full tracking-wider uppercase">
                Most Popular
              </div>
            )}
            
            <h3 className="text-lg font-semibold mb-2">{tier.name}</h3>
            <p className="text-white/40 text-xs mb-6 h-8">{tier.desc}</p>
            
            <div className="mb-8 border-b border-white/5 pb-8">
              <span className="text-5xl font-bold tracking-tighter">{tier.price === 'Custom' ? tier.price : `£${tier.price}`}</span>
              <span className="text-white/40 text-sm ml-1">{tier.cycle}</span>
            </div>

            <ul className="space-y-4 mb-8 min-h-[160px]">
              {tier.features.map((feature, j) => (
                <li key={j} className="flex items-start text-sm text-white/70 font-light">
                  <svg className="w-5 h-5 text-cyan-400 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  {feature}
                </li>
              ))}
            </ul>

            <button className={`w-full py-3 rounded-xl font-medium text-sm transition-all ${
              tier.popular 
                ? 'btn-glow' 
                : 'bg-white/5 text-white hover:bg-white/10 border border-white/10'
            }`}>
              Get Started
            </button>
          </div>
        ))}
      </div>
    </section>
  )
}
