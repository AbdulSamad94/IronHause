'use client'

function openChat() {
  window.dispatchEvent(new Event('open-ironhaus-chat'))
}

export function CTA() {
  return (
    <section id="cta" className="py-32 relative overflow-hidden">
      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6">

        {/* Inner bordered box */}
        <div className="surface p-12 sm:p-16 text-center" style={{ borderRadius: '20px' }}>
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="w-1.5 h-1.5 rounded-full bg-[#00F0FF]" />
            <span className="text-[12px] font-medium tracking-widest uppercase text-white/40">Get Started</span>
          </div>

          <h2 className="text-4xl sm:text-6xl font-bold tracking-tighter mb-5">
            Ready to <span className="text-[#00F0FF]">automate?</span>
          </h2>
          <p className="text-[17px] text-white/45 mb-10 max-w-lg mx-auto font-normal leading-relaxed">
            Stop letting leads slip through the cracks. Deploy IronHause today and give your facility the digital upgrade it deserves.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="#pricing" className="btn-primary">
              Deploy Your Agent
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
              </svg>
            </a>
            <button className="btn-secondary" onClick={openChat}>
              Talk to Sales
            </button>
          </div>
        </div>

      </div>
    </section>
  )
}
