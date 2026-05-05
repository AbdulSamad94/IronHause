export function CTA() {
  return (
    <section id="cta" className="py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-b from-transparent to-cyan-900/20"></div>
      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-5xl sm:text-7xl font-bold tracking-tighter mb-6">
          Ready to <span className="text-linear">automate?</span>
        </h2>
        <p className="text-xl text-white/50 mb-10 max-w-2xl mx-auto font-light">
          Stop letting leads slip through the cracks. Deploy IronHause today and give your facility the digital upgrade it deserves.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="btn-glow">
            Deploy Your Agent
          </button>
          <button className="px-8 py-3 rounded-full glass-surface text-white hover:bg-white/10 transition-colors">
            Talk to Sales
          </button>
        </div>
      </div>
    </section>
  )
}
