
import React, { useState, useEffect, useRef } from 'react';
import { Message, DesignState } from '../types';
import { chatWithAssistant } from '../services/geminiService';
import { getContrastColor } from '../utils/colorUtils';

interface ChatInterfaceProps {
  designContext: DesignState;
  onReadyToGenerate: (fullPrompt: string) => void;
  onReset: () => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ designContext, onReadyToGenerate, onReset }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const startChat = async () => {
      setIsLoading(true);
      const initialPrompt = `I'm starting a ${designContext.type} project. Purpose: ${designContext.purpose}`;
      const response = await chatWithAssistant([], initialPrompt, designContext);
      setMessages([{ role: 'model', content: response }]);
      setIsLoading(false);
    };
    startChat();
  }, [designContext]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMsg = inputValue;
    setInputValue('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      const response = await chatWithAssistant(messages, userMsg, designContext);
      setMessages(prev => [...prev, { role: 'model', content: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', content: "Something went wrong. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const lastMessage = messages[messages.length - 1];
  const isReady = lastMessage?.role === 'model' && lastMessage.content.includes("I have all the details I need");
  const userContrast = getContrastColor(designContext.themeColor);

  return (
    <div className="flex flex-col h-[650px] bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100">
      <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 rounded-full shadow-inner" style={{ backgroundColor: designContext.themeColor }}></div>
          <div>
            <h3 className="font-bold text-slate-900 leading-none">Design Consultant</h3>
            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mt-1">Refining your {designContext.type}</p>
          </div>
        </div>
        <button 
          onClick={onReset} 
          className="text-xs font-bold text-slate-400 hover:text-red-600 transition-colors uppercase tracking-tight"
        >
          Reset Session
        </button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-5 bg-slate-50/20">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div 
              className={`max-w-[85%] rounded-2xl px-5 py-3.5 shadow-sm leading-relaxed ${
                msg.role === 'user' ? 'rounded-br-none' : 'bg-white text-slate-900 border border-slate-200 rounded-bl-none shadow-slate-100'
              }`}
              style={msg.role === 'user' ? { 
                backgroundColor: designContext.themeColor,
                color: userContrast === 'white' ? '#fff' : '#000',
                fontWeight: 500
              } : {}}
            >
              <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-200 rounded-2xl px-5 py-3.5 shadow-sm">
              <div className="flex gap-1.5 py-1">
                <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce [animation-duration:0.6s]"></div>
                <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce [animation-duration:0.6s] [animation-delay:0.15s]"></div>
                <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce [animation-duration:0.6s] [animation-delay:0.3s]"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-6 border-t border-slate-200 bg-white">
        {isReady ? (
          <button
            onClick={() => onReadyToGenerate(messages.map(m => m.content).join(" "))}
            className="w-full py-4 bg-green-600 text-white rounded-xl font-bold text-lg hover:bg-green-700 transition-all transform active:scale-[0.98] shadow-lg shadow-green-100"
          >
            ✨ Generate Final Design
          </button>
        ) : (
          <div className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Describe adjustments or styles..."
              className="flex-1 px-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-950 font-medium placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all shadow-inner"
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !inputValue.trim()}
              style={{ backgroundColor: designContext.themeColor }}
              className="px-5 rounded-xl hover:brightness-110 active:scale-95 disabled:opacity-50 transition-all shadow-lg"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke={userContrast === 'white' ? '#fff' : '#000'}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
