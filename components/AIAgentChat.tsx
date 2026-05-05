'use client'

import { useState, useRef, useEffect } from 'react'
import { sendChatMessage } from '@/lib/api-client'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export function AIAgentChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [sessionId, setSessionId] = useState<string>('')
  const [messages, setMessages] = useState<{ role: 'agent' | 'user'; text: string }[]>([
    { role: 'agent', text: 'Hi there! I am the IronHause AI assistant. I can help answer questions about our pricing, class schedules, or book you an intro session. How can I help?' }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Initialize or retrieve session ID
  useEffect(() => {
    const storedSessionId = localStorage.getItem('ironhaus_session_id')
    if (storedSessionId) {
      setSessionId(storedSessionId)
    } else {
      const newSessionId = crypto.randomUUID()
      localStorage.setItem('ironhaus_session_id', newSessionId)
      setSessionId(newSessionId)
    }
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }])
    setInput('')
    setIsTyping(true)

    try {
      const data = await sendChatMessage(userMsg, sessionId);
      if (data.response) {
        setMessages(prev => [...prev, { role: 'agent', text: data.response! }])
      }
    } catch (error: any) {
      console.error("Chat error:", error)
      const errorMsg = error instanceof Error ? error.message : 'Sorry, I am having trouble connecting to my servers right now.';
      setMessages(prev => [...prev, { role: 'agent', text: errorMsg }])
    } finally {
      setIsTyping(false)
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans">
      {isOpen && (
        <div className="w-[calc(100vw-3rem)] sm:w-[400px] h-[600px] max-h-[calc(100vh-8rem)] mb-6 bg-aura-bg/60 backdrop-blur-3xl border border-white/10 rounded-4xl flex flex-col relative shadow-2xl shadow-cyan-900/20 animate-in slide-in-from-bottom-8 duration-300 ease-out overflow-hidden">
          
          {/* Header */}
          <div className="px-6 py-5 border-b border-white/5 flex justify-between items-center bg-linear-to-b from-white/4 to-transparent">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-linear-to-tr from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                  <div className="w-4 h-4 bg-white rounded-full"></div>
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-aura-bg"></div>
              </div>
              <div>
                <h3 className="font-medium text-white text-base tracking-tight">IronHause Agent</h3>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  <p className="text-[11px] text-white/50 uppercase tracking-widest font-medium">Online</p>
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
            {messages.map((msg, i) => (
              <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} group`}>
                <div className={`text-[10px] text-white/30 mb-1.5 px-2 uppercase tracking-wider font-medium opacity-0 group-hover:opacity-100 transition-opacity`}>
                  {msg.role === 'agent' ? 'IronHause Agent' : 'You'}
                </div>
                <div 
                  className={`max-w-[85%] px-5 py-3.5 text-sm font-light leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-linear-to-tr from-cyan-600 to-blue-600 text-white rounded-2xl rounded-tr-sm shadow-lg shadow-cyan-900/20' 
                      : 'bg-white/5 text-white/90 border border-white/5 rounded-2xl rounded-tl-sm'
                  }`}
                >
                  {msg.role === 'agent' ? (
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        p: ({...props}) => <p className="mb-2 last:mb-0" {...props} />,
                        ul: ({...props}) => <ul className="list-disc pl-4 mb-2 space-y-1" {...props} />,
                        ol: ({...props}) => <ol className="list-decimal pl-4 mb-2 space-y-1" {...props} />,
                        li: ({...props}) => <li className="marker:text-cyan-400" {...props} />,
                        strong: ({...props}) => <strong className="font-semibold text-cyan-400" {...props} />,
                        a: ({...props}) => <a className="text-cyan-400 hover:underline underline-offset-4" target="_blank" rel="noopener noreferrer" {...props} />,
                      }}
                    >
                      {msg.text}
                    </ReactMarkdown>
                  ) : (
                    msg.text
                  )}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex flex-col items-start">
                <div className="bg-white/5 border border-white/5 rounded-2xl rounded-tl-sm px-5 py-4 w-48 space-y-2.5">
                  <div className="h-2 bg-white/10 rounded-full w-3/4 animate-pulse" />
                  <div className="h-2 bg-white/10 rounded-full w-full animate-pulse [animation-delay:150ms]" />
                  <div className="h-2 bg-white/10 rounded-full w-1/2 animate-pulse [animation-delay:300ms]" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-linear-to-t from-aura-bg to-transparent pt-8">
            <form onSubmit={handleSubmit} className="relative flex items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Message Agent..."
                aria-label="Chat message input"
                className="w-full bg-white/5 border border-white/10 rounded-full text-white text-sm pl-5 pr-14 py-4 focus:outline-none focus:border-cyan-500/50 focus:bg-white/10 transition-all placeholder:text-white/30 font-light shadow-inner"
              />
              <button 
                type="submit"
                disabled={!input.trim()}
                className="absolute right-2 w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-all disabled:opacity-30 disabled:hover:scale-100"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>
              </button>
            </form>
            <div className="text-center mt-3 text-[10px] text-white/30 uppercase tracking-widest">
              Powered by IronHause AI
            </div>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close AI Chat" : "Open AI Chat"}
        className={`relative group flex items-center justify-center transition-all duration-300 ${isOpen ? 'w-12 h-12 rounded-full bg-white/10 border border-white/20 hover:bg-white/20' : 'w-16 h-16 rounded-full btn-glow'}`}
      >
        {!isOpen && (
          <div className="absolute inset-0 rounded-full bg-cyan-400/20 animate-ping" style={{ animationDuration: '3s' }}></div>
        )}
        
        <div className={`relative z-10 flex items-center justify-center transition-transform duration-300 ${isOpen ? 'rotate-90' : 'rotate-0'}`}>
          {isOpen ? (
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          ) : (
             <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-black"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
          )}
        </div>
      </button>
    </div>
  )
}
