import React, { useState, useRef, useEffect } from 'react';
import { FiX, FiSend, FiZap, FiTrash2, FiActivity } from 'react-icons/fi';
import api from '../services/api';

const SportsBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: "⚡ **Hello! I'm ScorePulse AI Assistant.**\n\nAsk me anything about current live matches, football scores, cricket updates, or league standings!",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const quickPrompts = [
    "🔥 Live Matches",
    "⚽ Football Scores",
    "🏏 Cricket Live",
    "🏆 Standings Overview"
  ];

  const handleSend = async (textToSend) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || loading) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputMessage('');
    setLoading(true);

    try {
      const response = await api.post('/bot/chat', {
        message: text
      });

      const botMsg = {
        id: Date.now() + 1,
        sender: 'bot',
        text: response.data.reply || "I've updated the sports feeds! What else would you like to know?",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      const errorMsg = {
        id: Date.now() + 1,
        sender: 'bot',
        text: "⚡ **ScorePulse Bot**: I couldn't reach the live sports engine. Make sure backend is running!",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: Date.now(),
        sender: 'bot',
        text: "⚡ Chat cleared! Ask me anything about live sports matches, scores, or team rankings.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const renderFormattedText = (text) => {
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      // Basic bold formatting **text**
      const parts = line.split(/(\*\*.*?\*\*)/g);
      const formattedLine = parts.map((part, pIdx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={pIdx} className="font-extrabold text-cyan-300">{part.slice(2, -2)}</strong>;
        }
        return part;
      });

      return (
        <span key={idx} className="block mb-1">
          {formattedLine}
        </span>
      );
    });
  };

  return (
    <div className="fixed bottom-6 right-6 sm:right-8 lg:right-12 z-50 flex flex-col items-end">
      {/* Expanded Chat Drawer */}
      {isOpen && (
        <div className="w-[340px] sm:w-[380px] h-[480px] bg-gray-950/95 backdrop-blur-2xl border border-cyan-500/30 rounded-3xl shadow-2xl shadow-cyan-500/10 flex flex-col overflow-hidden mb-4 animate-in fade-in slide-in-from-bottom-6 duration-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-gray-900 via-gray-900 to-slate-900 border-b border-gray-800 px-5 py-3.5 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center shadow-md shadow-cyan-500/20">
                <FiZap className="w-4 h-4 text-white animate-pulse" />
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-white tracking-wide flex items-center space-x-1.5">
                  <span>ScorePulse AI</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                </h4>
                <p className="text-[10px] text-cyan-400 font-semibold">Real-Time Sports Assistant</p>
              </div>
            </div>

            <div className="flex items-center space-x-1">
              <button
                onClick={clearChat}
                title="Clear Chat"
                className="p-1.5 rounded-lg text-gray-400 hover:text-rose-400 hover:bg-gray-800 transition"
              >
                <FiTrash2 size={15} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition"
              >
                <FiX size={18} />
              </button>
            </div>
          </div>

          {/* Quick Prompts Bar */}
          <div className="px-3 py-2 bg-gray-900/60 border-b border-gray-800/80 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(prompt)}
                className="whitespace-nowrap text-[10px] font-bold text-gray-300 bg-gray-800/80 hover:bg-cyan-500/20 hover:text-cyan-400 hover:border-cyan-500/40 border border-gray-700/60 px-2.5 py-1 rounded-full transition duration-150 flex items-center space-x-1"
              >
                <span>{prompt}</span>
              </button>
            ))}
          </div>

          {/* Message List */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 scrollbar-thin scrollbar-thumb-gray-800">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-cyan-500 to-sky-500 text-white font-medium shadow-md shadow-cyan-500/20 rounded-br-none'
                      : 'bg-gray-900/90 border border-gray-800 text-gray-200 rounded-bl-none shadow-sm'
                  }`}
                >
                  {renderFormattedText(msg.text)}
                </div>
                <span className="text-[9px] text-gray-500 mt-1 px-1">{msg.time}</span>
              </div>
            ))}

            {loading && (
              <div className="flex items-center space-x-2 bg-gray-900/80 border border-gray-800 rounded-2xl px-3.5 py-2.5 text-xs text-cyan-400 w-max">
                <FiActivity className="w-3.5 h-3.5 animate-spin" />
                <span className="font-semibold text-[11px]">ScorePulse AI is analyzing live scores...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <div className="p-3 bg-gray-900/90 border-t border-gray-800">
            <div className="flex items-center space-x-2 bg-gray-950 border border-gray-800 focus-within:border-cyan-500/50 rounded-full px-3 py-1.5 transition">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about live scores, matches..."
                className="flex-1 bg-transparent text-xs text-white placeholder-gray-500 focus:outline-none"
              />
              <button
                onClick={() => handleSend()}
                disabled={!inputMessage.trim() || loading}
                className="w-7 h-7 rounded-full bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 disabled:hover:bg-cyan-500 flex items-center justify-center text-white transition shadow-sm"
              >
                <FiSend size={13} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center space-x-2.5 bg-gradient-to-r from-cyan-500 via-sky-500 to-indigo-600 text-white px-4 py-3 rounded-full shadow-xl shadow-cyan-500/30 hover:scale-105 transition-all duration-300 border border-cyan-400/30"
      >
        <div className="relative">
          <FiZap className="w-5 h-5 animate-pulse text-white" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
        </div>
        <span className="text-xs font-extrabold tracking-wide hidden sm:inline-block">ScorePulse AI</span>
      </button>
    </div>
  );
};

export default SportsBot;
