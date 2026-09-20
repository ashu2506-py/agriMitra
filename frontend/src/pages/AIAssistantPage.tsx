import React, { useState } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  Loader2,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
interface ChatMessage {
  sender: 'user' | 'assistant';
  text: string;
}

export const AIAssistantPage: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: 'assistant',
      text: 'Namaste! Main AGRI MITRA AI Assistant hoon. Aap crop pricing, disease diagnosis, market buyer demand, ya logistics transport ke baare me pooch sakte hain.',
    },
  ]);

  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();

    const newMessage = input.trim();

    if (!newMessage || isSending) {
      return;
    }

    const userMessage: ChatMessage = {
      sender: 'user',
      text: newMessage,
    };

    // Add user's message immediately
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsSending(true);

    try {
      // Convert frontend messages into Gemini conversation format
      const history = messages.map((message) => ({
        role: message.sender === 'user' ? 'user' : 'model',
        text: message.text,
      }));

      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          message: newMessage,
          history,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || 'Failed to get AI response'
        );
      }

      const reply = data?.data?.reply;

      if (!reply) {
        throw new Error('AI returned an empty response');
      }

      setMessages((prev) => [
        ...prev,
        {
          sender: 'assistant',
          text: reply,
        },
      ]);
    } catch (error) {
      console.error('AI chat error:', error);

      setMessages((prev) => [
        ...prev,
        {
          sender: 'assistant',
          text: 'Sorry, I could not connect to the AI assistant right now. Please try again.',
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-sm">
          <Bot className="w-6 h-6" />
        </div>

        <div>
          <h1 className="text-xl font-bold text-slate-900">
            AGRI MITRA AI Assistant
          </h1>

          <p className="text-xs text-slate-500">
            Gemini-powered agricultural assistant
          </p>
        </div>
      </div>

      {/* Chat Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm h-[500px] flex flex-col overflow-hidden">
        {/* Messages */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex gap-3 ${
                message.sender === 'user'
                  ? 'justify-end'
                  : 'justify-start'
              }`}
            >
              {/* Assistant Icon */}
              {message.sender === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
              )}

              {/* Message */}
              <div
                className={`max-w-[75%] p-3.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                  message.sender === 'user'
                    ? 'bg-emerald-600 text-white rounded-br-none'
                    : 'bg-slate-100 text-slate-800 rounded-bl-none'
                }`}
              >
                <ReactMarkdown>{message.text}</ReactMarkdown>
              </div>
            </div>
          ))}

          {/* AI Loading */}
          {isSending && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>

              <div className="bg-slate-100 text-slate-600 rounded-2xl rounded-bl-none px-4 py-3 flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">
                  AGRI MITRA is thinking...
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <form
          onSubmit={handleSend}
          className="p-4 border-t border-slate-200 bg-slate-50 flex gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isSending}
            placeholder="Ask AGRI MITRA anything..."
            className="flex-1 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600 disabled:bg-slate-100"
          />

          <button
            type="submit"
            disabled={!input.trim() || isSending}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition shadow-sm flex items-center justify-center"
          >
            {isSending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
};