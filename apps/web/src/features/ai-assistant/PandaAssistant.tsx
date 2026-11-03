import React, { useState, useRef, useEffect } from 'react';
import { ApiClient } from '../../services/api';
import { useCart } from '../cart/CartContext';
import { BRAND, formatINR } from '@kahvi-panda/shared';
import { MessageSquare, X, Send, Sparkles, ExternalLink, RefreshCw, ShoppingCart, Check } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'panda';
  text: string;
  timestamp: string;
  products?: any[];
  whatsappUrl?: string;
}

export const PandaAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'init-1',
      sender: 'panda',
      text: "Hej! I'm **Panda AI** 🐼, your personal coffee buddy from Kahvi Panda.\n\nWhether you're looking for bold Moka pot beans, crisp Nordic light roasts, or quick freeze-dried instant under ₹500, I'm here to help you find your ritual. What are you brewing today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => `panda_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`);
  const [addedItemMap, setAddedItemMap] = useState<Record<string, boolean>>({});

  const { addItem } = useCart();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || input;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await ApiClient.chatWithPanda(sessionId, textToSend);

      const pandaMsg: ChatMessage = {
        id: `panda-${Date.now()}`,
        sender: 'panda',
        text: response.message,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        products: response.recommendedProducts,
        whatsappUrl: response.whatsappFallbackUrl
      };

      setMessages((prev) => [...prev, pandaMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'panda',
          text: "Oops, my espresso machine hissed! 🐼 Please check your connection or reach out directly to our roasting team via WhatsApp (+91 9874199454).",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          whatsappUrl: BRAND.whatsappUrl
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = (product: any) => {
    const defaultVariant = product.variants?.[0];
    if (!defaultVariant) return;

    addItem({
      productId: product.id,
      variantId: defaultVariant.id,
      name: product.name,
      slug: product.slug,
      image: product.images?.[0]?.url || BRAND.logoUrl,
      price: defaultVariant.price,
      weight: defaultVariant.weight || '250g',
      grindType: defaultVariant.grindType || 'Whole Beans',
      quantity: 1
    }, true);

    setAddedItemMap((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedItemMap((prev) => ({ ...prev, [product.id]: false }));
    }, 2500);
  };

  const quickChips = [
    'Recommend coffee under ₹500',
    'Best coffee for Moka Pot with milk',
    'What is Nordic Roast?',
    'বাংলায় কফি খোঁজা',
    'Talk to human on WhatsApp'
  ];

  return (
    <>
      {/* Floating Trigger Button */}
      <div className="fixed bottom-6 right-6 z-40">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="group relative flex items-center gap-3 p-3.5 pr-5 rounded-pill bg-[#30231C] text-[#F8F5EE] shadow-elevated hover:bg-[#4B3428] hover:scale-105 active:scale-95 transition-all duration-300"
            aria-label="Open Panda AI sales assistant"
          >
            <div className="w-10 h-10 rounded-full bg-[#E9DCC9] flex items-center justify-center text-xl shadow-inner animate-float-slow">
              🐼
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold tracking-wider uppercase text-[#E9DCC9]">PANDA AI</span>
                <span className="w-2 h-2 rounded-full bg-[#9CA88E] animate-pulse" />
              </div>
              <p className="text-[11px] text-[#F8F5EE]/80 font-medium">Coffee Buddy</p>
            </div>
          </button>
        )}
      </div>

      {/* Slide-in / Popover Chat Window */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 z-50 w-[95vw] sm:w-[420px] h-[580px] max-h-[85vh] bg-[#F8F5EE] rounded-2xl shadow-modal border border-[#30231C]/15 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          
          {/* Header */}
          <div className="p-4 bg-[#30231C] text-[#F8F5EE] flex items-center justify-between border-b border-[#E9DCC9]/10">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#E9DCC9] flex items-center justify-center text-lg shadow-sm">
                🐼
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-serif text-base text-[#F8F5EE]">PANDA AI</h3>
                  <span className="px-1.5 py-0.5 rounded-full text-[9px] font-semibold bg-[#9CA88E]/20 text-[#9CA88E] border border-[#9CA88E]/30 uppercase tracking-widest">
                    Live
                  </span>
                </div>
                <p className="text-[11px] text-[#E9DCC9]/80">Your Personal Coffee Buddy • Kolkata</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  setMessages([
                    {
                      id: `reset-${Date.now()}`,
                      sender: 'panda',
                      text: "New chat started! 🐼 What can I brew up for you?",
                      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    }
                  ]);
                }}
                className="p-1.5 rounded-full hover:bg-white/10 text-[#F8F5EE]/70 hover:text-[#F8F5EE] transition-colors"
                title="Restart chat"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-full hover:bg-white/10 text-[#F8F5EE]/70 hover:text-[#F8F5EE] transition-colors"
                aria-label="Close chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed shadow-sm ${
                    msg.sender === 'user'
                      ? 'bg-[#30231C] text-[#F8F5EE] rounded-br-none'
                      : 'bg-white/90 text-[#30231C] border border-[#30231C]/10 rounded-bl-none'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>

                  {/* Recommendation Product Cards in Chat */}
                  {msg.products && msg.products.length > 0 && (
                    <div className="mt-3 space-y-2 pt-2 border-t border-[#30231C]/10">
                      <span className="text-[10px] font-bold text-[#624637] uppercase tracking-wider block">
                        Recommended for You:
                      </span>
                      {msg.products.map((prod) => {
                        const price = prod.variants?.[0]?.price;
                        const isAdded = addedItemMap[prod.id];
                        return (
                          <div
                            key={prod.id}
                            className="flex items-center gap-3 p-2 rounded-xl bg-[#FAF7F2] border border-[#30231C]/10"
                          >
                            <img
                              src={prod.images?.[0]?.url || BRAND.logoUrl}
                              alt={prod.name}
                              className="w-12 h-12 rounded-lg object-cover bg-white"
                            />
                            <div className="flex-1 min-w-0">
                              <h5 className="font-semibold text-xs text-[#30231C] truncate">
                                {prod.name}
                              </h5>
                              <p className="text-[11px] text-[#4B3428]/80 font-medium">
                                {formatINR(price || 0)} • {prod.roastLevel}
                              </p>
                            </div>
                            <button
                              onClick={() => handleAddToCart(prod)}
                              className={`px-3 py-1.5 rounded-full text-[11px] font-bold flex items-center gap-1 transition-all ${
                                isAdded
                                  ? 'bg-[#9CA88E] text-[#F8F5EE]'
                                  : 'bg-[#30231C] text-[#F8F5EE] hover:bg-[#4B3428]'
                              }`}
                            >
                              {isAdded ? <Check className="w-3 h-3" /> : <ShoppingCart className="w-3 h-3" />}
                              <span>{isAdded ? 'Added' : 'Add'}</span>
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* WhatsApp Escalation Action */}
                  {msg.whatsappUrl && (
                    <a
                      href={msg.whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center gap-1.5 px-3 py-2 rounded-pill bg-[#25D366] text-white text-[11px] font-semibold hover:bg-[#20ba59] transition-colors"
                    >
                      <span>Chat with Roaster on WhatsApp</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
                <span className="text-[10px] text-[#4B3428]/60 mt-1 px-1">
                  {msg.timestamp}
                </span>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 p-3 bg-white/90 rounded-2xl rounded-bl-none text-xs text-[#4B3428] w-fit border border-[#30231C]/10">
                <span className="w-2 h-2 rounded-full bg-[#30231C] animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-[#30231C] animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-[#30231C] animate-bounce [animation-delay:0.4s]" />
                <span className="text-[11px] font-medium ml-1">Panda is sniffing the beans...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions Chips */}
          <div className="px-4 py-2 bg-[#FAF7F2] border-t border-[#30231C]/5 flex gap-1.5 overflow-x-auto no-scrollbar">
            {quickChips.map((chip) => (
              <button
                key={chip}
                onClick={() => handleSend(chip)}
                className="whitespace-nowrap px-2.5 py-1 rounded-pill bg-white border border-[#30231C]/15 text-[10px] font-semibold text-[#4B3428] hover:bg-[#E9DCC9]/40 hover:text-[#30231C] transition-colors"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-[#FAF7F2] border-t border-[#30231C]/10 flex gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about roasts, brew gear, or budget..."
              className="flex-1 px-3.5 py-2.5 rounded-full text-xs bg-white border border-[#30231C]/20 focus:outline-none focus:border-[#30231C] text-[#252525]"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="p-2.5 rounded-full bg-[#30231C] text-[#F8F5EE] hover:bg-[#4B3428] disabled:opacity-40 transition-colors"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
