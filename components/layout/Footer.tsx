export function Footer() {
  return (
    <footer className="border-t border-white/5 py-12 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-linear-to-tr from-cyan-400 to-blue-600 flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
          <span className="font-semibold tracking-tight">IronHause</span>
        </div>
        <div className="flex gap-8 text-sm text-white/40 font-light">
          <a href="#" className="hover:text-white transition-colors">Privacy</a>
          <a href="#" className="hover:text-white transition-colors">Terms</a>
          <a href="#" className="hover:text-white transition-colors">System Status</a>
        </div>
      </div>
    </footer>
  )
}
