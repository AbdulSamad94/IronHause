'use client'

import { useState, useRef, useEffect } from 'react'

export function AIAgentChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<{ role: 'agent' | 'user'; text: string }[]>([
    { role: 'agent', text: 'SYSTEM ONLINE. I am the IronHaus AI protocol. I can handle bookings, membership inquiries, and automate facility operations. How can I assist you?' }
  ])
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    setMessages(prev => [...prev, { role: 'user', text: input }])
    setInput('')

    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        { role: 'agent', text: 'Processing request... I have logged your input into the facility management system. As an AI agent, I automate these interactions 24/7 for gym owners.' }
      ])
    }, 1000)
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="bg-black/95 w-80 sm:w-96 h-[500px] mb-4 brutal-border flex flex-col relative overflow-hidden animate-in slide-in-from-bottom-5">
          <div className="noise-overlay opacity-30"></div>
          
          {/* Header */}
          <div className="bg-iron-neon/90 backdrop-blur-md text-black p-4 flex justify-between items-center relative z-10 border-b border-black/20">
            <div>
              <h3 className="font-anton uppercase tracking-widest text-xl m-0 leading-none">AUTO_AGENT</h3>
              <p className="font-jetbrains text-[10px] uppercase font-bold">Status: Active // 24/7</p>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-black hover:text-white transition-colors font-jetbrains font-bold"
            >
              [X]
            </button>
          </div>

          {/* Chat Body */}
          <div className="flex-1 p-4 overflow-y-auto brutal-scrollbar flex flex-col gap-4 relative z-10 font-jetbrains text-sm">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div 
                  className={`max-w-[85%] p-3 rounded-2xl ${
                    msg.role === 'user' 
                      ? 'bg-iron-purple/80 text-white rounded-br-sm backdrop-blur-sm' 
                      : 'bg-white/5 border border-white/10 text-white rounded-bl-sm backdrop-blur-sm'
                  }`}
                >
                  <div className="text-[10px] opacity-70 mb-1 uppercase tracking-widest">
                    {msg.role === 'user' ? 'USER_INPUT' : 'SYS_RESPONSE'}
                  </div>
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSubmit} className="p-3 border-t border-white/10 bg-black/50 backdrop-blur-md relative z-10 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="ENTER COMMAND..."
              className="flex-1 bg-white/5 rounded-full border border-white/10 text-white font-jetbrains text-sm px-4 py-2 focus:outline-none focus:border-iron-neon placeholder:text-gray-500 uppercase"
            />
            <button 
              type="submit"
              className="bg-iron-neon text-black px-4 py-2 rounded-full font-jetbrains font-bold uppercase text-xs hover:bg-white transition-colors"
            >
              SEND
            </button>
          </form>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-iron-neon text-black w-16 h-16 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(200,244,0,0.3)] hover:shadow-[0_0_50px_rgba(200,244,0,0.6)] hover:scale-105 transition-all relative group"
      >
        <span className="absolute -top-2 -right-2 bg-iron-purple text-white text-[10px] font-jetbrains font-bold px-2 py-1 rounded-full rotate-12 shadow-lg">
          AI
        </span>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
      </button>
    </div>
  )
}
