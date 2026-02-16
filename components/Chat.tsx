
import React, { useState, useRef, useEffect } from 'react';
import { geminiService } from '../services/geminiService';
import { Message } from '../types';

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'أهلاً بك يا غالي في "حصاد الألسنة". هنا بنتعلم إزاي نحافظ على كلامنا ونخليه كله خير. عندك موقف حصل ومحتاج تعرف تتصرف فيه إزاي؟ أو حابب تسأل عن حاجة معينة؟',
      timestamp: new Date()
    }
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

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const history = messages.slice(-6).map(m => ({
      role: m.role,
      parts: [{ text: m.content }]
    }));

    const response = await geminiService.generateResponse(input, history);
    
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: response,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, assistantMessage]);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-180px)]">
      <div className="flex-1 overflow-y-auto space-y-4 pb-4 px-2">
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-4 rounded-2xl shadow-sm ${
              m.role === 'user' 
              ? 'bg-emerald-600 text-white rounded-tr-none' 
              : 'bg-white text-slate-800 rounded-tl-none border border-slate-100'
            }`}>
              <p className="leading-relaxed">{m.content}</p>
              <span className="text-[10px] mt-2 block opacity-60">
                {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex gap-1">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"></span>
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce delay-75"></span>
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce delay-150"></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="mt-auto pt-4 bg-slate-50 sticky bottom-0">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="احكي لي موقف أو اسأل سؤال..."
            className="w-full p-4 pl-12 pr-4 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent shadow-sm outline-none transition-all"
          />
          <button
            onClick={handleSend}
            disabled={isLoading}
            className="absolute left-2 top-2 bottom-2 bg-emerald-600 text-white px-4 rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-50"
          >
            إرسال
          </button>
        </div>
        <div className="flex gap-2 mt-3 overflow-x-auto pb-2 scrollbar-hide">
          {['إيه هي الغيبة؟', 'واحد ضايقني، أرد إيه؟', 'إزاي أبدأ توبة؟'].map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => setInput(suggestion)}
              className="whitespace-nowrap bg-emerald-50 text-emerald-700 text-xs px-3 py-1.5 rounded-full border border-emerald-100 hover:bg-emerald-100 transition-colors"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Chat;
