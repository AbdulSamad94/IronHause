'use client'

import { useEffect, useState, useRef } from 'react'

export default function Home() {
  const [scrolled, setScrolled] = useState(false)
  const [members, setMembers] = useState(0)
  const [retention, setRetention] = useState(0)
  const [locations, setLocations] = useState(0)
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set())

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const counters = [
      { setter: setMembers, target: 12000, duration: 2000 },
      { setter: setRetention, target: 98, duration: 2000 },
      { setter: setLocations, target: 8, duration: 2000 },
    ]

    counters.forEach(({ setter, target, duration }) => {
      let current = 0
      const increment = target / (duration / 16)
      const interval = setInterval(() => {
        current += increment
        if (current >= target) {
          setter(target)
          clearInterval(interval)
        } else {
          setter(Math.floor(current))
        }
      }, 16)
    })
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set([...prev, entry.target.id]))
          }
        })
      },
      { threshold: 0.1 }
    )

    document.querySelectorAll('[data-animate]').forEach((el) => {
      observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <div className="bg-[#0A0A0A] text-white">
      {/* NAVBAR */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
          scrolled ? 'bg-[#0A0A0A] shadow-lg' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="text-3xl font-bebas text-[#C8F400]">IRONHAUS</div>
          
          <div className="hidden md:flex gap-8 items-center">
            <a href="#" className="text-sm hover:text-[#C8F400] transition-colors">
              Training
            </a>
            <a href="#" className="text-sm hover:text-[#C8F400] transition-colors">
              Plans
            </a>
            <a href="#" className="text-sm hover:text-[#C8F400] transition-colors">
              Results
            </a>
            <a href="#" className="text-sm hover:text-[#C8F400] transition-colors">
              Contact
            </a>
          </div>

          <button className="bg-[#C8F400] text-black px-6 py-2 rounded-none font-bold text-sm hover:scale-105 transition-all duration-200 hidden md:block">
            Start Free Trial
          </button>

          <div className="md:hidden text-[#C8F400] text-2xl">☰</div>
        </div>
      </nav>

      {/* HERO */}
      <section className="min-h-screen flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 pt-20">
        <div className="max-w-5xl w-full text-center">
          <h1 className="font-bebas text-6xl sm:text-8xl leading-none mb-2">
            BUILT TO
          </h1>
          <h2 className="font-bebas text-6xl sm:text-8xl leading-none mb-8">
            <span className="text-[#C8F400]">DESTROY</span>{' '}
            <span className="text-white">LIMITS</span>
          </h2>
          <p className="text-gray-400 font-dm text-base sm:text-lg mb-8">
            Elite training. Zero excuses. Real results.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <button className="bg-[#C8F400] text-black px-8 py-3 rounded-none font-bold hover:scale-105 transition-all duration-200">
              Get Started
            </button>
            <button className="border border-[#C8F400] text-[#C8F400] px-8 py-3 rounded-none font-bold hover:scale-105 transition-all duration-200">
              Watch Reel
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4 sm:gap-8">
            <div className="text-center">
              <div className="font-bebas text-4xl sm:text-5xl text-[#C8F400] mb-2">
                {members.toLocaleString()}+
              </div>
              <div className="text-gray-400 font-dm text-sm">Members</div>
            </div>
            <div className="text-center">
              <div className="font-bebas text-4xl sm:text-5xl text-[#C8F400] mb-2">
                {retention}%
              </div>
              <div className="text-gray-400 font-dm text-sm">Retention</div>
            </div>
            <div className="text-center">
              <div className="font-bebas text-4xl sm:text-5xl text-[#C8F400] mb-2">
                {locations}
              </div>
              <div className="text-gray-400 font-dm text-sm">Locations</div>
            </div>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <section className="overflow-hidden bg-[#111111] py-8 my-16">
        <div className="flex animate-marquee whitespace-nowrap gap-12">
          <div className="font-bebas text-xl tracking-widest text-[#C8F400] flex-shrink-0">
            STRENGTH ✦ ENDURANCE ✦ CONDITIONING ✦ HIIT ✦ POWERLIFTING ✦ NUTRITION ✦ RECOVERY ✦
          </div>
          <div className="font-bebas text-xl tracking-widest text-[#C8F400] flex-shrink-0">
            STRENGTH ✦ ENDURANCE ✦ CONDITIONING ✦ HIIT ✦ POWERLIFTING ✦ NUTRITION ✦ RECOVERY ✦
          </div>
        </div>
      </section>

      {/* PROGRAMS */}
      <section
        id="programs"
        data-animate="true"
        className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 transition-all duration-1000 ${
          visibleSections.has('programs')
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-20'
        }`}
      >
        <h2 className="font-bebas text-5xl sm:text-6xl text-center mb-16">
          CHOOSE YOUR WEAPON
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: '💪',
              title: 'Powerlifting',
              description:
                'Master the big three. Build pure strength with competition-level programming.',
            },
            {
              icon: '🔥',
              title: 'HIIT & Conditioning',
              description:
                'Push your limits. High-intensity workouts that deliver results in less time.',
            },
            {
              icon: '⚡',
              title: 'Body Recomposition',
              description:
                'Transform your physique. Strength training meets smart nutrition coaching.',
            },
          ].map((program, i) => (
            <div
              key={i}
              className="bg-[#111111] p-8 rounded-none border-l-4 border-transparent hover:border-l-4 hover:border-[#C8F400] transition-all duration-200"
            >
              <div className="w-10 h-10 bg-[#C8F400] mb-4 rounded-none" />
              <h3 className="font-bebas text-2xl mb-3">{program.title}</h3>
              <p className="text-gray-400 font-dm text-sm mb-4">
                {program.description}
              </p>
              <a href="#" className="text-[#C8F400] font-dm font-bold text-sm hover:text-white transition-colors">
                Learn More →
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section
        id="testimonials"
        data-animate="true"
        className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 my-16 transition-all duration-1000 ${
          visibleSections.has('testimonials')
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-20'
        }`}
      >
        <h2 className="font-bebas text-5xl sm:text-6xl text-center mb-16">
          REAL PEOPLE. REAL RESULTS.
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              quote: "I went from couch to competing in my first powerlifting meet. IRONHAUS changed everything.",
              name: 'Sarah Chen',
              tag: 'Powerlifting Champion',
            },
            {
              quote: 'Lost 35lbs, gained muscle, and actually enjoy working out now. Best decision ever.',
              name: 'Marcus Johnson',
              tag: 'Body Recomposition',
            },
            {
              quote: 'The community here is unmatched. You are not just getting a gym, you are getting a family.',
              name: 'Emma Rodriguez',
              tag: 'HIIT Warrior',
            },
          ].map((testimonial, i) => (
            <div key={i} className="bg-[#111111] p-8 rounded-none">
              <p className="text-white font-dm text-base mb-6 italic">
                "{testimonial.quote}"
              </p>
              <p className="font-bebas text-[#C8F400] mb-1">
                {testimonial.name}
              </p>
              <p className="text-gray-400 font-dm text-sm">
                {testimonial.tag}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section
        id="pricing"
        data-animate="true"
        className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 my-16 transition-all duration-1000 ${
          visibleSections.has('pricing')
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-20'
        }`}
      >
        <h2 className="font-bebas text-5xl sm:text-6xl text-center mb-16">
          NO HIDDEN FEES.
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              name: 'Starter',
              price: '29',
              features: [
                'Unlimited gym access',
                'Standard equipment',
                'Mobile app',
                'Community access',
              ],
              popular: false,
            },
            {
              name: 'Pro',
              price: '59',
              features: [
                'Everything in Starter',
                'Personal training (4x/mo)',
                'Nutrition coaching',
                'Priority support',
              ],
              popular: true,
            },
            {
              name: 'Elite',
              price: '99',
              features: [
                'Everything in Pro',
                'Unlimited personal training',
                'One-on-one nutrition plans',
                'VIP lounge access',
              ],
              popular: false,
            },
          ].map((tier, i) => (
            <div
              key={i}
              className={`bg-[#111111] p-8 rounded-none transition-all duration-200 relative ${
                tier.popular ? 'border-2 border-[#C8F400]' : 'border border-gray-700'
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-8 bg-[#C8F400] text-black text-xs px-3 py-1 font-bold rounded-none">
                  MOST POPULAR
                </div>
              )}
              <h3 className="font-bebas text-2xl mb-2">{tier.name}</h3>
              <div className="mb-6">
                <span className="font-bebas text-4xl text-[#C8F400]">
                  £{tier.price}
                </span>
                <span className="text-gray-400 font-dm text-sm">/mo</span>
              </div>

              <ul className="space-y-3 mb-8">
                {tier.features.map((feature, j) => (
                  <li key={j} className="text-gray-300 font-dm text-sm flex items-start">
                    <span className="text-[#C8F400] mr-3 flex-shrink-0">✦</span>
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-3 rounded-none font-bold transition-all duration-200 hover:scale-105 ${
                  tier.popular
                    ? 'bg-[#C8F400] text-black'
                    : 'bg-transparent border border-[#C8F400] text-[#C8F400]'
                }`}
              >
                Get Started
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="bg-[#C8F400] text-black py-16 my-16 text-center">
        <h2 className="font-bebas text-5xl sm:text-6xl mb-4">
          YOUR FIRST WEEK IS FREE.
        </h2>
        <p className="text-black/80 font-dm text-base sm:text-lg mb-8">
          No contracts. Cancel anytime. Just show up.
        </p>
        <button className="bg-black text-white px-8 py-3 rounded-none font-bold hover:scale-105 transition-all duration-200">
          Start Your Free Week
        </button>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#0A0A0A] border-t border-gray-700 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-8">
            <div className="font-bebas text-2xl text-[#C8F400]">IRONHAUS</div>

            <div className="flex gap-8 font-dm text-sm">
              <a href="#" className="text-gray-400 hover:text-[#C8F400] transition-colors">
                About
              </a>
              <a href="#" className="text-gray-400 hover:text-[#C8F400] transition-colors">
                Blog
              </a>
              <a href="#" className="text-gray-400 hover:text-[#C8F400] transition-colors">
                Careers
              </a>
              <a href="#" className="text-gray-400 hover:text-[#C8F400] transition-colors">
                Contact
              </a>
            </div>

            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-[#C8F400] transition-colors">
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M19 3a9 9 0 01-9 9m0 0a9 9 0 00-9-9m9 9v6m0 0a9 9 0 0-9 9m9-9h6" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-[#C8F400] transition-colors">
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M19 3a9 9 0 01-9 9m0 0a9 9 0 00-9-9m9 9v6m0 0a9 9 0 0-9 9m9-9h6" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-[#C8F400] transition-colors">
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M19 3a9 9 0 01-9 9m0 0a9 9 0 00-9-9m9 9v6m0 0a9 9 0 0-9 9m9-9h6" />
                </svg>
              </a>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-8 text-center text-gray-600 font-dm text-sm">
            © 2025 IRONHAUS. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
