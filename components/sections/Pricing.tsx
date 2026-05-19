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
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  const tiers = [
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
  ]

  return (
    <section
      ref={sectionRef}
      id="pricing"
      className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 transition-all duration-700 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      {/* Section header */}
      <div className="mb-16">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-1.5 h-1.5 rounded-full bg-[#00F0FF]" />
          <span className="text-[12px] font-medium tracking-widest uppercase text-white/40">Pricing</span>
        </div>
        <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
          Simple, transparent <span className="text-[#00F0FF]">pricing.</span>
        </h2>
        <p className="text-white/45 max-w-xl text-[17px] font-normal leading-relaxed">
          Choose the deployment tier that fits your facility's scale.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-5 items-start max-w-5xl mx-auto">
        {tiers.map((tier, i) => (
          <div
            key={i}
            className={`surface p-7 relative flex flex-col ${
              tier.popular ? 'border-white/20 md:-translate-y-3' : ''
            }`}
          >
            {tier.popular && (
              <div className="absolute -top-px left-6 right-6 h-px bg-[#00F0FF]/60" />
            )}
            {tier.popular && (
              <span className="inline-flex self-start mb-5 text-[10px] font-semibold tracking-widest uppercase text-[#00F0FF] border border-[#00F0FF]/30 rounded-full px-3 py-1">
                Most Popular
              </span>
            )}

            <h3 className="text-[16px] font-semibold mb-1.5 tracking-tight">{tier.name}</h3>
            <p className="text-white/35 text-[12px] mb-7 leading-relaxed">{tier.desc}</p>

            <div className="mb-7 pb-7 border-b border-white/[0.06]">
              <span className="text-[44px] font-bold tracking-tighter leading-none">
                {tier.price === 'Custom' ? tier.price : `£${tier.price}`}
              </span>
              <span className="text-white/35 text-[13px] ml-1">{tier.cycle}</span>
            </div>

            <ul className="space-y-3.5 mb-8 flex-1">
              {tier.features.map((feature, j) => (
                <li key={j} className="flex items-center gap-3 text-[13px] text-white/65 font-light">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00F0FF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 opacity-70">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>

            <button
              onClick={() => window.dispatchEvent(new CustomEvent('open-ironhaus-chat', {
                detail: { message: `I'm interested in the ${tier.name} plan. Can you tell me more?` }
              }))}
              className={`w-full py-2.5 rounded-lg text-[13px] font-medium transition-all ${
                tier.popular
                  ? 'btn-primary justify-center'
                  : 'bg-white/[0.04] text-white/70 hover:bg-white/[0.08] hover:text-white border border-white/[0.08]'
              }`}
            >
              Get Started
            </button>
          </div>
        ))}
      </div>
    </section>
  )
}
