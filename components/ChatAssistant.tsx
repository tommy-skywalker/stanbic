
import React, { useState, useRef, useEffect } from 'react';
import { getFinancialAdvice } from '../services/gemini';
import { UserProfile } from '../types';

interface Message {
  text: string;
  sender: 'user' | 'bot';
}

const ChatAssistant: React.FC<{ onClose: () => void; user: UserProfile }> = ({ onClose, user }) => {
  const [messages, setMessages] = useState<Message[]>([
    { text: `Hi ${user.name}! I'm your Stanbic Assistant. How can I help you today?`, sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { text: userMsg, sender: 'user' }]);
    setIsLoading(true);

    const botResponse = await getFinancialAdvice(userMsg, user.balance);
    setMessages(prev => [...prev, { text: botResponse || 'Sorry, I missed that.', sender: 'bot' }]);
    setIsLoading(false);
  };

  return (
    <div className="absolute inset-x-0 bottom-0 top-0 bg-white shadow-2xl z-40 flex flex-col md:rounded-t-3xl md:top-20 md:bottom-24 animate-slide-up">
      <div className="p-6 bg-[#0033a0] text-white flex justify-between items-center md:rounded-t-3xl">
        <div>
          <h3 className="font-bold">Stanbic Smart Assistant</h3>
          <p className="text-[10px] text-blue-100 uppercase tracking-widest font-semibold">Online & ready to help</p>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div ref={scrollRef} className="flex-1 p-6 overflow-y-auto space-y-4 custom-scrollbar">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-4 rounded-2xl text-sm ${m.sender === 'user' ? 'bg-[#0033a0] text-white rounded-br-none' : 'bg-gray-100 text-gray-800 rounded-bl-none'}`}>
              {m.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 p-4 rounded-2xl rounded-bl-none animate-pulse text-xs font-bold text-gray-400">
              Assistant is thinking...
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-gray-100 flex gap-2 bg-white">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask about saving tips..."
          className="flex-1 bg-gray-50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0033a0]"
        />
        <button 
          onClick={handleSend}
          disabled={isLoading}
          className="bg-[#0033a0] text-white p-3 rounded-xl disabled:opacity-50"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ChatAssistant;
