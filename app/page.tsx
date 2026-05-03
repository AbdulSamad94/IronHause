'use client'

import { useEffect, useState } from 'react'
import { AIAgentChat } from '@/components/AIAgentChat'

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
    <div className="bg-black text-white relative overflow-hidden">
      <div className="noise-overlay"></div>
      
      {/* AI Chatbot Component */}
      <AIAgentChat />

      {/* TOP BANNER FOR GYM OWNERS */}
      <div className="bg-iron-purple text-white py-2 text-center font-jetbrains text-xs uppercase tracking-widest relative z-50 brutal-border-b">
        [ DEMO MODE ] THIS IS AN AI-POWERED FACILITY TEMPLATE. INTERACT WITH THE AGENT IN THE BOTTOM RIGHT.
      </div>

      {/* NAVBAR */}
      <nav
        className={`fixed top-8 left-0 right-0 z-40 transition-all duration-200 border-b-2 border-transparent ${
          scrolled ? 'bg-black/90 backdrop-blur-md border-white/10' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="text-4xl font-anton text-white tracking-widest uppercase hover-glitch cursor-pointer relative">
            <span className="relative z-10">IRONHAUS</span>
            <span className="glitch-text-layer">IRONHAUS</span>
          </div>
          
          <div className="hidden md:flex gap-8 items-center">
            {['AI Integration', 'Features', 'Results', 'Hire Agent'].map((item) => (
              <a key={item} href="#" className="text-sm font-jetbrains uppercase tracking-wider hover:text-iron-neon transition-colors relative group">
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-iron-neon transition-all duration-300 group-hover:w-full"></span>
              </a>
            ))}
          </div>

          <button className="bg-white text-black px-8 py-3 rounded-full font-jetbrains font-bold text-sm uppercase brutal-border hidden md:block">
            DEPLOY AI AGENT
          </button>

          <div className="md:hidden text-white text-2xl font-jetbrains">MENU]</div>
        </div>
      </nav>

      {/* HERO */}
      <section className="min-h-screen flex flex-col justify-center px-4 sm:px-6 lg:px-8 pt-32 relative z-10">
        <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-iron-purple/20 blur-[120px] rounded-full pointer-events-none -z-10"></div>
        <div className="absolute bottom-0 left-10 w-[400px] h-[400px] bg-iron-neon/20 blur-[100px] rounded-full pointer-events-none -z-10"></div>

        <div className="max-w-7xl mx-auto w-full mt-12">
          <div className="grid lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8">
              <div className="font-jetbrains text-iron-neon font-bold text-sm uppercase tracking-widest mb-6 inline-block border border-iron-neon px-3 py-1">
                NEXT-GEN GYM AUTOMATION
              </div>
              <h1 className="font-anton text-[11vw] leading-[0.8] uppercase tracking-tighter mix-blend-difference mb-4 hover-glitch relative">
                <span className="relative z-10">BUILT TO</span><br/>
                <span className="text-iron-neon relative z-10">AUTOMATE</span><br/>
                <span className="relative z-10">&amp; DESTROY</span>
                <span className="glitch-text-layer text-iron-purple">BUILT TO<br/>AUTOMATE<br/>&amp; DESTROY</span>
              </h1>
              
              <div className="flex flex-col sm:flex-row gap-6 mt-12">
                <button className="bg-iron-neon text-black px-10 py-4 rounded-full font-jetbrains font-bold uppercase tracking-widest text-lg group overflow-hidden relative shadow-[0_0_30px_rgba(200,244,0,0.3)] hover:shadow-[0_0_50px_rgba(200,244,0,0.6)] transition-all">
                  <span className="relative z-10">TEST AI AGENT //</span>
                  <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out z-0"></div>
                </button>
                <button className="bg-black/50 backdrop-blur-md text-white border border-white/20 px-10 py-4 rounded-full font-jetbrains font-bold uppercase tracking-widest text-lg group hover:border-iron-purple hover:bg-iron-purple/10 transition-all">
                  <span className="group-hover:text-iron-purple transition-colors">HOW IT WORKS</span>
                </button>
              </div>
            </div>

            <div className="lg:col-span-4 mt-16 lg:mt-0 flex flex-col gap-8">
              <div className="border-l-4 border-iron-neon pl-6">
                <div className="font-jetbrains text-sm text-gray-400 mb-2 uppercase tracking-widest">Agent_Status</div>
                <p className="font-jetbrains text-lg uppercase text-white leading-relaxed">
                  IronHaus AI Agent is online. Capturing leads, booking sessions, and handling customer support 24/7 so you can focus on training.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#111] p-4 border border-white/10 brutal-border-purple relative overflow-hidden">
                  <div className="absolute top-2 right-2 w-2 h-2 bg-iron-neon rounded-full animate-pulse"></div>
                  <div className="font-anton text-4xl text-white mb-1">24/7</div>
                  <div className="text-iron-purple font-jetbrains text-[10px] uppercase tracking-wider">Client Support</div>
                </div>
                <div className="bg-[#111] p-4 border border-white/10 brutal-border">
                  <div className="font-anton text-4xl text-white mb-1">{retention}<span className="text-iron-neon">%</span></div>
                  <div className="text-white font-jetbrains text-[10px] uppercase tracking-wider">Lead Conversion</div>
                </div>
                <div className="bg-[#111] p-4 border border-white/10 col-span-2 brutal-border">
                  <div className="font-anton text-4xl text-white mb-1">{members.toLocaleString()}<span className="text-iron-neon">+</span></div>
                  <div className="text-white font-jetbrains text-xs uppercase tracking-wider">Hours Saved Monthly</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <section className="bg-iron-neon text-black py-4 my-24 skewed-section border-y-4 border-black overflow-hidden relative z-20">
        <div className="flex animate-[marquee-fast_20s_linear_infinite] whitespace-nowrap gap-8 w-max">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="font-anton text-4xl tracking-widest uppercase flex items-center">
              LEAD CAPTURE <span className="mx-4 text-iron-purple">✦</span> 
              24/7 SUPPORT <span className="mx-4 text-white">✦</span> 
              BOOKING AUTOMATION <span className="mx-4 text-iron-purple">✦</span> 
              MEMBER ONBOARDING <span className="mx-4 text-white">✦</span> 
              NUTRITION AI <span className="mx-4 text-iron-purple">✦</span> 
            </div>
          ))}
        </div>
      </section>

      {/* PROGRAMS */}
      <section
        id="programs"
        data-animate="true"
        className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 transition-all duration-700 ease-in-out ${
          visibleSections.has('programs')
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-24'
        }`}
      >
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <h2 className="font-anton text-6xl sm:text-8xl leading-none uppercase mix-blend-difference">
            AI-DRIVEN<br/>
            <span className="text-iron-purple">OPERATIONS</span>
          </h2>
          <div className="font-jetbrains text-sm text-gray-400 uppercase tracking-widest max-w-xs text-right hidden md:block">
            See how the IronHaus AI agent handles routine tasks directly from your website.
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              id: '01',
              title: 'AUTO_BOOKING',
              description: 'AI Agent schedules personal training sessions, manages class capacity, and syncs directly with your calendar.',
              color: 'neon'
            },
            {
              id: '02',
              title: 'LEAD_GEN',
              description: 'Never miss a prospect. AI engages visitors instantly, qualifies leads, and collects contact info 24/7.',
              color: 'purple'
            },
            {
              id: '03',
              title: 'MEMBER_SUPP',
              description: 'Instant answers to pricing, hours, facility queries, and membership cancelations/pauses without human intervention.',
              color: 'white'
            },
          ].map((program, i) => (
            <div
              key={i}
              className={`p-8 rounded-2xl relative group overflow-hidden ${program.color === 'neon' ? 'brutal-border' : program.color === 'purple' ? 'brutal-border-purple' : 'bg-[#111] border border-white/10'}`}
            >
              <div className="absolute top-0 right-0 p-4 font-jetbrains text-2xl font-bold text-white/20">{program.id}</div>
              <h3 className="font-anton text-4xl mb-4 mt-8 uppercase relative z-10">{program.title}</h3>
              <p className="font-jetbrains text-sm text-gray-400 mb-8 uppercase leading-relaxed relative z-10">
                {program.description}
              </p>
              <a href="#" className={`font-jetbrains font-bold text-sm uppercase tracking-widest relative z-10 ${program.color === 'neon' ? 'text-iron-neon' : program.color === 'purple' ? 'text-iron-purple' : 'text-white'} group-hover:underline underline-offset-4`}>
                [ TEST FEATURE ]
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-iron-purple text-white py-24 mt-24 border-t-8 border-iron-neon text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMSI+PC9yZWN0Pgo8cGF0aCBkPSJNMCAwbDhfOG0wLThsLThfOCIgc3Ryb2tlPSIjMDAwIiBzdHJva2Utd2lkdGg9IjEiIHN0cm9rZS1vcGFjaXR5PSIwLjEiPjwvcGF0aD4KPC9zdmc+')] opacity-20"></div>
        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <h2 className="font-anton text-6xl sm:text-8xl mb-6 uppercase">
            UPGRADE YOUR <span className="text-iron-neon text-stroke-black">FACILITY</span>
          </h2>
          <p className="font-jetbrains text-lg uppercase tracking-widest mb-12 text-white/90 leading-relaxed">
            Ready to stop doing admin work and start scaling your gym? Hire an AI Agent for your existing site, or let us build you a high-converting digital facility from scratch.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button className="bg-iron-neon text-black px-12 py-5 rounded-full font-jetbrains font-bold uppercase tracking-widest text-xl shadow-[0_0_30px_rgba(200,244,0,0.3)] hover:shadow-[0_0_50px_rgba(200,244,0,0.6)] hover:bg-white transition-all">
              HIRE AI AGENT
            </button>
            <button className="bg-black/50 backdrop-blur-md text-white border border-white/20 px-12 py-5 rounded-full font-jetbrains font-bold uppercase tracking-widest text-xl hover:border-white hover:bg-white/10 transition-all">
              GET A NEW WEBSITE
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-black border-t-2 border-white/20 py-16 relative z-10 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-8">
            <div>
              <div className="font-anton text-4xl text-white tracking-widest mb-2">IRONHAUS_AI</div>
              <div className="font-jetbrains text-xs text-iron-neon uppercase tracking-widest">Gym Automation Solutions</div>
            </div>

            <div className="grid grid-cols-2 md:flex gap-x-12 gap-y-4 font-jetbrains text-xs uppercase tracking-widest">
              <a href="#" className="text-gray-500 hover:text-iron-neon transition-colors">[ ABOUT AGENCY ]</a>
              <a href="#" className="text-gray-500 hover:text-iron-neon transition-colors">[ PORTFOLIO ]</a>
              <a href="#" className="text-gray-500 hover:text-iron-neon transition-colors">[ AI FEATURES ]</a>
              <a href="#" className="text-gray-500 hover:text-iron-neon transition-colors">[ CONTACT US ]</a>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-gray-600 font-jetbrains text-[10px] uppercase tracking-widest">
              SYS_REV_2025 // BUILT BY YOUR_AGENCY
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
