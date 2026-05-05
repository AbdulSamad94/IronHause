export function Hero() {
  return (
    <section className="min-h-screen flex flex-col justify-center px-4 sm:px-6 lg:px-8 pt-32 relative z-10 text-center">
      <div className="max-w-4xl mx-auto flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-surface mb-8">
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
          <span className="text-xs font-medium tracking-wide text-white/80">IronHause v2.0 is now live</span>
        </div>
        
        <h1 className="text-6xl sm:text-8xl font-bold tracking-tighter mb-6 leading-[1.1]">
          <span className="text-linear">Automate your</span><br />
          <span className="text-linear-cyan">Fitness Facility.</span>
        </h1>
        
        <p className="text-lg sm:text-xl text-white/60 max-w-2xl mb-12 font-light leading-relaxed">
          Deploy intelligent AI agents to handle lead capture, session booking, and member support. Reclaim your time and scale your gym effortlessly.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <button className="btn-glow">
            Start Free Trial
          </button>
          <button className="px-8 py-3 rounded-full glass-surface text-white hover:bg-white/10 transition-colors flex items-center justify-center gap-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
            Watch Demo
          </button>
        </div>
      </div>

      {/* Dashboard Preview Image/Mock */}
      <div className="mt-24 max-w-5xl mx-auto w-full glass-surface p-4 aspect-video flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-t from-aura-bg to-transparent z-10"></div>
        <div className="w-full h-full border border-white/5 rounded-xl bg-[#0B101A] p-6 relative">
           <div className="flex justify-between items-center border-b border-white/5 pb-4 mb-4">
             <div className="flex gap-2">
               <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
               <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
               <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
             </div>
             <div className="text-xs text-white/40 font-mono">Agent Performance Dashboard</div>
           </div>
           <div className="grid grid-cols-3 gap-6">
              <div className="col-span-2 space-y-4">
                 <div className="h-32 rounded-lg bg-linear-to-r from-cyan-500/10 to-blue-500/5 border border-white/5 flex items-end p-4">
                    <div className="w-full flex items-end justify-between gap-2 h-full opacity-50">
                      {[40, 60, 45, 80, 55, 90, 75, 100].map((h, i) => (
                        <div key={i} className="w-full bg-cyan-400/20 rounded-t-sm" style={{ height: `${h}%` }}></div>
                      ))}
                    </div>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="h-24 rounded-lg bg-white/5 border border-white/5 p-4 flex flex-col justify-center">
                      <div className="text-sm text-white/40 mb-1">Leads Captured</div>
                      <div className="text-3xl font-light text-white">1,204 <span className="text-sm text-cyan-400 ml-2">+12%</span></div>
                    </div>
                    <div className="h-24 rounded-lg bg-white/5 border border-white/5 p-4 flex flex-col justify-center">
                      <div className="text-sm text-white/40 mb-1">Sessions Booked</div>
                      <div className="text-3xl font-light text-white">482 <span className="text-sm text-cyan-400 ml-2">+8%</span></div>
                    </div>
                 </div>
              </div>
              <div className="h-full rounded-lg bg-white/5 border border-white/5 p-4">
                <div className="text-sm text-white/40 mb-4">Live Agent Activity</div>
                <div className="space-y-3">
                  {[
                    { user: 'Sarah M.', action: 'Booked Intro Session' },
                    { user: 'John D.', action: 'Asked about pricing' },
                    { user: 'Mike R.', action: 'Cancelled membership' },
                    { user: 'Emma S.', action: 'Booked Intro Session' }
                  ].map((log, i) => (
                    <div key={i} className="flex gap-3 items-start border-b border-white/5 pb-2">
                      <div className="w-2 h-2 rounded-full bg-cyan-400 mt-1.5 shadow-[0_0_10px_rgba(0,240,255,0.5)]"></div>
                      <div>
                        <div className="text-sm text-white/80">{log.user}</div>
                        <div className="text-xs text-white/40 font-mono">{log.action}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
           </div>
        </div>
      </div>
    </section>
  )
}
