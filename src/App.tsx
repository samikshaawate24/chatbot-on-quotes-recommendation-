import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Quote, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export default function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your Quotes Chatbot. Ask me for motivation, success, love, humor, or life quotes!",
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/get', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.quote,
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Error fetching quote:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I'm having trouble connecting to my wisdom database right now.",
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F0] flex flex-col items-center justify-center p-4 font-serif">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl text-center mb-8"
      >
        <h1 className="text-4xl md:text-5xl font-light text-[#5A5A40] mb-2 tracking-tight">
          Wisdom <span className="italic">Whisperer</span>
        </h1>
        <p className="text-[#8E8E70] text-sm uppercase tracking-widest font-sans">
          NLP-Powered Quote Recommendation
        </p>
      </motion.div>

      {/* Chat Container */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl bg-white rounded-[32px] shadow-xl shadow-[#5A5A40]/5 overflow-hidden flex flex-col h-[600px] border border-[#5A5A40]/10"
      >
        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex max-w-[80%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'} items-end gap-3`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    msg.sender === 'user' ? 'bg-[#5A5A40] text-white' : 'bg-[#F5F5F0] text-[#5A5A40]'
                  }`}>
                    {msg.sender === 'user' ? <User size={16} /> : <Bot size={16} />}
                  </div>
                  
                  <div className={`p-4 rounded-2xl ${
                    msg.sender === 'user' 
                      ? 'bg-[#5A5A40] text-white rounded-br-none' 
                      : 'bg-[#F5F5F0] text-[#1A1A1A] rounded-bl-none border border-[#5A5A40]/5'
                  }`}>
                    {msg.sender === 'bot' && msg.id !== '1' && (
                      <Quote size={14} className="mb-2 opacity-30" />
                    )}
                    <p className="text-lg leading-relaxed italic">
                      {msg.text}
                    </p>
                    <span className={`text-[10px] mt-2 block opacity-50 font-sans uppercase tracking-tighter ${
                      msg.sender === 'user' ? 'text-right' : 'text-left'
                    }`}>
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {isLoading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="bg-[#F5F5F0] p-4 rounded-2xl rounded-bl-none flex items-center gap-2">
                <Sparkles size={16} className="text-[#5A5A40] animate-pulse" />
                <span className="text-sm text-[#5A5A40] font-sans italic">Finding wisdom...</span>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <form 
          onSubmit={handleSend}
          className="p-6 bg-white border-t border-[#5A5A40]/10 flex gap-3"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Try 'I need some motivation'..."
            className="flex-1 bg-[#F5F5F0] border-none rounded-full px-6 py-3 text-[#1A1A1A] placeholder-[#8E8E70] focus:ring-2 focus:ring-[#5A5A40]/20 outline-none font-sans"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="w-12 h-12 bg-[#5A5A40] text-white rounded-full flex items-center justify-center hover:bg-[#4A4A30] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#5A5A40]/20"
          >
            <Send size={20} />
          </button>
        </form>
      </motion.div>

      {/* Footer / Info */}
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        {['Motivation', 'Success', 'Love', 'Humor', 'Life'].map((cat) => (
          <button
            key={cat}
            onClick={() => setInput(`Tell me a ${cat.toLowerCase()} quote`)}
            className="px-4 py-2 rounded-full border border-[#5A5A40]/20 text-[#5A5A40] text-xs font-sans uppercase tracking-widest hover:bg-[#5A5A40] hover:text-white transition-all"
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
}
