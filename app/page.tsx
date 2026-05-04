import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Hero } from '@/components/sections/Hero'
import { Programs } from '@/components/sections/Programs'
import { Testimonials } from '@/components/sections/Testimonials'
import { Pricing } from '@/components/sections/Pricing'
import { CTA } from '@/components/sections/CTA'
import { AIAgentChat } from '@/components/AIAgentChat'

export default function Home() {
  return (
    <div className="bg-aura-bg text-white relative overflow-hidden min-h-screen">
      {/* Background Orbs */}
      <div className="orb bg-cyan-500/20 w-[600px] h-[600px] top-[-20%] left-[-10%]"></div>
      <div className="orb bg-blue-600/20 w-[500px] h-[500px] bottom-[20%] right-[-10%] animation-delay-2000"></div>

      {/* Interactive Agent */}
      <AIAgentChat />

      <Navbar />
      
      <main>
        <Hero />
        <Programs />
        <Testimonials />
        <Pricing />
        <CTA />
      </main>

      <Footer />
    </div>
  )
}
