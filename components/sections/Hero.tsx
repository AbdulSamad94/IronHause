'use client'

export function Hero() {
  const stats = [
    { value: '40 hrs', label: 'saved / month' },
    { value: '40%',    label: 'more bookings' },
    { value: '24/7',   label: 'lead coverage' },
  ]

  const activityLog = [
    { user: 'Sarah M.', action: 'Booked Intro Session', time: '2m ago' },
    { user: 'John D.',  action: 'Lead captured',        time: '5m ago' },
    { user: 'Emma S.',  action: 'Booked Intro Session', time: '11m ago' },
    { user: 'Mike R.',  action: 'Asked about pricing',  time: '14m ago' },
  ]

  return (
    <section className="min-h-screen flex flex-col justify-center px-4 sm:px-6 lg:px-8 pt-28 pb-16 relative z-10">
      <div className="max-w-7xl mx-auto w-full">

        {/* Two-column layout */}
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* ── Left: copy + CTAs ── */}
          <div>
            {/* Eyebrow */}
            <div className="flex items-center gap-2 mb-8">
              <div className="w-1.5 h-1.5 rounded-full bg-[#00F0FF]" />
              <span className="text-[12px] font-medium tracking-widest uppercase text-white/40">
                AI Automation for Gyms
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl sm:text-6xl lg:text-[72px] font-bold tracking-tighter leading-[1.02] mb-6">
              Automate your<br />
              <span className="text-[#00F0FF]">Fitness Facility.</span>
            </h1>

            {/* Subheadline */}
            <p className="text-[17px] text-white/45 mb-10 leading-relaxed font-normal max-w-md">
              Deploy AI agents that handle lead capture, session booking,
              and member support — so you don't have to.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 mb-14">
              <a href="#pricing" className="btn-primary">
                Start Free Trial
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                </svg>
              </a>
              <button
                className="btn-secondary"
                onClick={() => window.dispatchEvent(new CustomEvent('open-ironhaus-chat', {
                  detail: { message: "I'd like to book a free trial session." }
                }))}
              >
                Book a Free Trial
              </button>
              <button className="btn-secondary" onClick={() => window.dispatchEvent(new Event('open-ironhaus-chat'))}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
                Watch Demo
              </button>
            </div>

            {/* Stats row */}
            <div className="flex flex-wrap gap-x-8 gap-y-4">
              {stats.map((s, i) => (
                <div key={i} className="flex items-baseline gap-2">
                  <span className="text-[22px] font-bold tracking-tight text-white">{s.value}</span>
                  <span className="text-[13px] text-white/35 font-normal">{s.label}</span>
                  {i < stats.length - 1 && (
                    <span className="hidden sm:block ml-6 text-white/10 select-none">|</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ── Right: dashboard mock ── */}
          <div className="w-full surface overflow-hidden" style={{ borderRadius: '16px' }}>
            {/* Window chrome */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.06]">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
              </div>
              <span className="text-[11px] text-white/25 font-mono tracking-wide">
                Agent Performance · Live
              </span>
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00F0FF] opacity-60" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#00F0FF]" />
                </span>
                <span className="text-[11px] text-white/25">live</span>
              </div>
            </div>

            {/* Dashboard body */}
            <div className="grid grid-cols-3 gap-0 divide-x divide-white/[0.06]">

              {/* Chart + metrics */}
              <div className="col-span-2 p-5 space-y-4">
                {/* Bar chart */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-white/30 uppercase tracking-wider">Leads this week</span>
                    <span className="text-[10px] text-[#00F0FF]">+12%</span>
                  </div>
                  <div className="h-20 flex items-end gap-1">
                    {[38, 52, 41, 68, 55, 82, 70, 100].map((h, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-sm"
                        style={{
                          height: `${h}%`,
                          background: i === 7
                            ? 'rgba(0,240,255,0.65)'
                            : 'rgba(255,255,255,0.07)',
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Metric cards */}
                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    { label: 'Leads Captured', value: '1,204', delta: '+12%' },
                    { label: 'Sessions Booked', value: '482',  delta: '+8%'  },
                  ].map((m, i) => (
                    <div key={i} className="surface p-3.5" style={{ borderRadius: '10px' }}>
                      <p className="text-[10px] text-white/30 mb-1.5 uppercase tracking-wider">{m.label}</p>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-xl font-bold tracking-tight text-white">{m.value}</span>
                        <span className="text-[10px] text-[#00F0FF]">{m.delta}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Activity feed */}
              <div className="p-5">
                <p className="text-[10px] text-white/30 uppercase tracking-wider mb-4">Live Activity</p>
                <div className="space-y-4">
                  {activityLog.map((log, i) => (
                    <div key={i} className="flex gap-2.5">
                      <div className="mt-1 w-1.5 h-1.5 rounded-full bg-[#00F0FF] shrink-0 opacity-60" />
                      <div className="min-w-0 flex-1">
                        <p className="text-[12px] text-white/75 font-medium truncate">{log.user}</p>
                        <p className="text-[10px] text-white/35 font-mono truncate">{log.action}</p>
                      </div>
                      <span className="text-[9px] text-white/20 shrink-0">{log.time}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
