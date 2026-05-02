"use client";

import React, { useState } from 'react';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';
import { AssistantResponse } from '@/ai/vertex';
import { useSession } from 'next-auth/react';

interface ChatbotProps {
  contextData?: AssistantResponse | null;
}

export default function Chatbot({ contextData }: ChatbotProps) {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'ai', text: string}[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Do not render the chatbot if the user is not logged in
  if (!session) return null;

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage, context: contextData || {} }),
      });
      const data = await res.json();
      
      if (res.ok) {
        setMessages(prev => [...prev, { role: 'ai', text: data.reply }]);
      } else {
        setMessages(prev => [...prev, { role: 'ai', text: "Sorry, I had trouble processing that." }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', text: "Connection error." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="bg-white rounded-2xl shadow-2xl w-80 sm:w-96 overflow-hidden border border-gray-200 flex flex-col h-[500px] animate-in slide-in-from-bottom-5">
          <div className="bg-indigo-600 p-4 flex justify-between items-center text-white">
            <div className="font-bold flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              ElectionIQ Guide
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-indigo-700 p-1 rounded-full transition">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50 flex flex-col gap-3">
            {messages.length === 0 && (
              <div className="text-center text-gray-500 text-sm mt-4">
                Hi! Have any questions about your election journey?
              </div>
            )}
            {messages.map((msg, idx) => (
              <div key={idx} className={`max-w-[85%] rounded-2xl p-3 text-sm ${msg.role === 'user' ? 'bg-indigo-600 text-white self-end rounded-tr-none' : 'bg-white border border-gray-200 text-gray-800 self-start rounded-tl-none shadow-sm'}`}>
                {msg.text}
              </div>
            ))}
            {isLoading && (
              <div className="bg-white border border-gray-200 text-gray-800 self-start rounded-2xl rounded-tl-none p-3 shadow-sm flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
                <span className="text-xs text-gray-500">Thinking...</span>
              </div>
            )}
          </div>

          <form onSubmit={sendMessage} className="p-3 bg-white border-t border-gray-200 flex gap-2">
            <input 
              type="text" 
              placeholder="Ask a question..." 
              className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button 
              type="submit" 
              disabled={isLoading || !input.trim()}
              className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-full transition disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-full shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 flex items-center justify-center animate-bounce"
        >
          <MessageCircle className="w-7 h-7" />
        </button>
      )}
    </div>
  );
}
