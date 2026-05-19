'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { sendChatMessage } from '@/lib/api-client'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

const MAX_CHARS = 1000

export function AIAgentChat() {
  const [isOpen, setIsOpen]       = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [sessionId, setSessionId] = useState<string>('')
  const [messages, setMessages]   = useState<{ role: 'agent' | 'user'; text: string }[]>([
    { role: 'agent', text: 'Hi there! I am the IronHause AI assistant. I can help answer questions about our pricing, class schedules, or book you an intro session. How can I help?' }
  ])
  const [input, setInput]         = useState('')
  const [isTyping, setIsTyping]   = useState(false)
  const messagesEndRef            = useRef<HTMLDivElement>(null)
  const textareaRef               = useRef<HTMLTextAreaElement>(null)
  const sendMessageRef            = useRef<(text: string) => Promise<void>>(async () => {})

  useEffect(() => {
    const stored = localStorage.getItem('ironhaus_session_id')
    if (stored) {
      setSessionId(stored)
    } else {
      const id = crypto.randomUUID()
      localStorage.setItem('ironhaus_session_id', id)
      setSessionId(id)
    }
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  // Auto-grow textarea — shrinks back when text is cleared
  const autoResize = useCallback(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    // Cap at ~5 lines (approx 120px) then scroll
    el.style.height = Math.min(el.scrollHeight, 120) + 'px'
  }, [])

  useEffect(() => {
    autoResize()
  }, [input, autoResize])

  const sendMessage = async (text: string) => {
    if (!text.trim()) return
    setMessages(prev => [...prev, { role: 'user', text }])
    setInput('')
    setIsTyping(true)

    try {
      const data = await sendChatMessage(text, sessionId)
      if (data.response) {
        setMessages(prev => [...prev, { role: 'agent', text: data.response! }])
      }
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Sorry, I\'m having trouble connecting right now.'
      setMessages(prev => [...prev, { role: 'agent', text: msg }])
    } finally {
      setIsTyping(false)
    }
  }

  // Focus textarea when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => textareaRef.current?.focus(), 300)
    }
  }, [isOpen])

  // Keep ref in sync with latest sendMessage (always has current sessionId)
  useEffect(() => { sendMessageRef.current = sendMessage })

  // Allow other components to open the chat via a custom event
  useEffect(() => {
    const handler = (e: Event) => {
      setIsOpen(true)
      const message = (e as CustomEvent<{ message?: string }>).detail?.message
      if (message) {
        setTimeout(() => sendMessageRef.current(message), 350)
      }
    }
    window.addEventListener('open-ironhaus-chat', handler)
    return () => window.removeEventListener('open-ironhaus-chat', handler)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(input)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Enter sends, Shift+Enter inserts newline
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  const charsLeft   = MAX_CHARS - input.length
  const showCounter = input.length > 800

  // Window size classes — normal vs expanded
  const windowW = isExpanded ? 'sm:w-[500px]' : 'sm:w-[400px]'
  const windowH = isExpanded ? 'h-[680px]'    : 'h-[580px]'

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans">
      {isOpen && (
        <div
          className={`
            w-[calc(100vw-3rem)] ${windowW} ${windowH}
            max-h-[calc(100vh-8rem)] mb-6
            bg-aura-bg/60 backdrop-blur-3xl
            border border-white/10 rounded-4xl
            flex flex-col relative
            shadow-2xl shadow-cyan-900/20
            animate-in slide-in-from-bottom-8 duration-300 ease-out
            overflow-hidden transition-[width,height] duration-300 ease-in-out
          `}
        >
          {/* ── Header ── */}
          <div className="px-6 py-5 border-b border-white/5 flex justify-between items-center bg-linear-to-b from-white/4 to-transparent shrink-0">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-linear-to-tr from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                  <div className="w-4 h-4 bg-white rounded-full" />
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-aura-bg" />
              </div>
              <div>
                <h3 className="font-medium text-white text-base tracking-tight">IronHause Agent</h3>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                  </span>
                  <p className="text-[11px] text-white/50 uppercase tracking-widest font-medium">Online</p>
                </div>
              </div>
            </div>

            {/* Header actions */}
            <div className="flex items-center gap-2">
              {/* Expand / compress toggle */}
              <button
                onClick={() => setIsExpanded(prev => !prev)}
                aria-label={isExpanded ? 'Shrink chat window' : 'Expand chat window'}
                className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-colors"
              >
                {isExpanded ? (
                  /* Compress icon */
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="4 14 10 14 10 20" /><polyline points="20 10 14 10 14 4" />
                    <line x1="10" y1="14" x2="3" y2="21" /><line x1="21" y1="3" x2="14" y2="10" />
                  </svg>
                ) : (
                  /* Expand icon */
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 3 21 3 21 9" /><polyline points="9 21 3 21 3 15" />
                    <line x1="21" y1="3" x2="14" y2="10" /><line x1="3" y1="21" x2="10" y2="14" />
                  </svg>
                )}
              </button>

              {/* Close */}
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Close chat"
                className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </div>

          {/* ── Messages ── */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
            {messages.map((msg, i) => (
              <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} group`}>
                <div className="text-[10px] text-white/30 mb-1.5 px-2 uppercase tracking-wider font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  {msg.role === 'agent' ? 'IronHause Agent' : 'You'}
                </div>
                <div className={`max-w-[85%] px-5 py-3.5 text-sm font-light leading-relaxed break-words min-w-0 ${
                  msg.role === 'user'
                    ? 'bg-linear-to-tr from-cyan-600 to-blue-600 text-white rounded-2xl rounded-tr-sm shadow-lg shadow-cyan-900/20'
                    : 'bg-white/5 text-white/90 border border-white/5 rounded-2xl rounded-tl-sm'
                }`}>
                  {msg.role === 'agent' ? (
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        p:      ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                        ul:     ({ node, ...props }) => <ul className="list-disc pl-4 mb-2 space-y-1" {...props} />,
                        ol:     ({ node, ...props }) => <ol className="list-decimal pl-4 mb-2 space-y-1" {...props} />,
                        li:     ({ node, ...props }) => <li className="marker:text-cyan-400" {...props} />,
                        strong: ({ node, ...props }) => <strong className="font-semibold text-cyan-400" {...props} />,
                        a:      ({ node, ...props }) => <a className="text-cyan-400 hover:underline underline-offset-4" target="_blank" rel="noopener noreferrer" {...props} />,
                      }}
                    >
                      {msg.text}
                    </ReactMarkdown>
                  ) : (
                    // Preserve newlines in user messages
                    msg.text.split('\n').map((line, j) => (
                      <span key={j}>{line}{j < msg.text.split('\n').length - 1 && <br />}</span>
                    ))
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

          {/* ── Input area ── */}
          <div className="p-4 bg-linear-to-t from-aura-bg to-transparent pt-8 shrink-0">
            <form onSubmit={handleSubmit} className="relative flex items-end gap-2">
              <div className="flex-1 relative">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={e => {
                    if (e.target.value.length <= MAX_CHARS) setInput(e.target.value)
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder="Message Agent…"
                  aria-label="Chat message input"
                  rows={1}
                  className="chat-input w-full bg-white/5 border border-white/10 rounded-2xl text-white text-sm px-5 py-3.5 pr-4 focus:outline-none focus:border-cyan-500/50 focus:bg-white/8 transition-all placeholder:text-white/30 font-light shadow-inner resize-none overflow-y-auto leading-relaxed break-words overflow-x-hidden"
                  style={{ minHeight: '48px', maxHeight: '120px' }}
                />
                {/* Character counter — only appears near limit */}
                {showCounter && (
                  <span className={`absolute bottom-2 right-3 text-[10px] font-medium transition-colors ${
                    charsLeft < 50 ? 'text-red-400/70' : 'text-white/25'
                  }`}>
                    {charsLeft}
                  </span>
                )}
              </div>

              {/* Send button */}
              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                aria-label="Send message"
                className="shrink-0 w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-all disabled:opacity-30 disabled:hover:scale-100 mb-0.5"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="19" x2="12" y2="5" /><polyline points="5 12 12 5 19 12" />
                </svg>
              </button>
            </form>

            {/* Hints row */}
            <div className="flex items-center justify-between mt-2.5 px-1">
              <span className="text-[10px] text-white/25">
                <kbd className="font-mono">Shift+Enter</kbd> for new line
              </span>
              <span className="text-[10px] text-white/25 uppercase tracking-widest">
                Powered by IronHause AI
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ── Toggle button ── */}
      <button
        onClick={() => setIsOpen(prev => !prev)}
        aria-label={isOpen ? 'Close AI Chat' : 'Open AI Chat'}
        className={`relative group flex items-center justify-center transition-all duration-300 ${
          isOpen
            ? 'w-12 h-12 rounded-full bg-white/10 border border-white/20 hover:bg-white/20'
            : 'w-16 h-16 rounded-full btn-glow'
        }`}
      >
        {!isOpen && (
          <div className="absolute inset-0 rounded-full bg-cyan-400/20 animate-ping" style={{ animationDuration: '3s' }} />
        )}
        <div className={`relative z-10 flex items-center justify-center transition-transform duration-300 ${isOpen ? 'rotate-90' : 'rotate-0'}`}>
          {isOpen ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-black">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          )}
        </div>
      </button>
    </div>
  )
}
