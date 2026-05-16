import { Navbar }       from '@/components/layout/Navbar'
import { Footer }       from '@/components/layout/Footer'
import { Hero }         from '@/components/sections/Hero'
import { Programs }     from '@/components/sections/Programs'
import { Testimonials } from '@/components/sections/Testimonials'
import { Pricing }      from '@/components/sections/Pricing'
import { CTA }          from '@/components/sections/CTA'
import { AIAgentChat }  from '@/components/AIAgentChat'

export default function Home() {
  return (
    <div className="bg-aura-bg text-white relative overflow-hidden min-h-screen">

      {/* Subtle grid — barely visible, gives depth without looking "AI startup" */}
      <div className="pointer-events-none fixed inset-0 z-0"
           style={{
             backgroundImage:
               'linear-gradient(to right,rgba(255,255,255,0.025) 1px,transparent 1px),' +
               'linear-gradient(to bottom,rgba(255,255,255,0.025) 1px,transparent 1px)',
             backgroundSize: '64px 64px',
           }}
      />

      <AIAgentChat />
      <Navbar />

      <main className="relative z-10">
        <Hero />
        <div className="section-divider max-w-7xl mx-auto" />
        <Programs />
        <div className="section-divider max-w-7xl mx-auto" />
        <Testimonials />
        <div className="section-divider max-w-7xl mx-auto" />
        <Pricing />
        <CTA />
      </main>

      <Footer />
    </div>
  )
}
