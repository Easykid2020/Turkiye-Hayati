'use client';

import React, { useState, useEffect, useRef } from 'react';

interface Message {
  id: number;
  sender: 'me' | 'npc';
  text: string;
  isTransfer?: boolean;
  amount?: number;
}

export default function ChatModal({ onClose, updateWallet, updateEnergy }: any) {
  const [npc] = useState(generateRandomNPC());
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, sender: 'npc', text: `Yo, what's up?` }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [interactionDone, setInteractionDone] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  function generateRandomNPC() {
    const names = ["Emre", "Ayşe", "Tariq", "Fatma", "Ozan", "Leyla"];
    const wealthTiers = ["Broke", "Comfortable", "Loaded"];
    return {
      name: names[Math.floor(Math.random() * names.length)],
      wealth: wealthTiers[Math.floor(Math.random() * wealthTiers.length)]
    };
  }

  // Auto-scroll to bottom like a real chat app
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const addMessage = (sender: 'me' | 'npc', text: string, isTransfer = false, amount = 0) => {
    setMessages(prev => [...prev, { id: Date.now(), sender, text, isTransfer, amount }]);
  };

  const handleAction = async (actionType: string) => {
    setInteractionDone(true);
    let energyChange = -10; 
    const roll = Math.random();

    if (actionType === "friendly") {
      addMessage('me', 'Just checking in, how are things?');
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        addMessage('npc', 'Doing great! Let’s grab food later.');
        updateEnergy(-5);
      }, 1500);
    } 
    
    else if (actionType === "bill") {
      addMessage('me', 'Bro I’m stranded right now, can you send something urgent?');
      setIsTyping(true);
      setTimeout(() => {
        if (roll > 0.4) {
          addMessage('npc', 'Send IBAN fast.');
          setTimeout(() => {
            addMessage('me', 'TR12 0001 0000 1234 5678 9012 34 Ziraat Bankası');
            setTimeout(() => {
              setIsTyping(false);
              const moneyChange = npc.wealth === "Loaded" ? 150000 : 25000;
              addMessage('npc', 'Done.', true, moneyChange);
              updateWallet(moneyChange);
            }, 1500);
          }, 1000);
        } else {
          setIsTyping(false);
          addMessage('npc', 'I don’t have it bro, maybe tomorrow.');
        }
        updateEnergy(energyChange);
      }, 1500);
    } 
    
    else if (actionType === "scam") {
      addMessage('me', 'I have a guaranteed 5x return investment for you today only.');
      setIsTyping(true);
      setTimeout(() => {
        if (roll > 0.65) {
          setIsTyping(false);
          const moneyChange = 500000;
          addMessage('npc', 'I trust you. Sending it now.', true, moneyChange);
          updateWallet(moneyChange);
        } else {
          setIsTyping(false);
          addMessage('npc', 'Are you crazy? I’m calling the police.');
          updateWallet(-50000); 
        }
        updateEnergy(energyChange);
      }, 2000);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 sm:p-0 backdrop-blur-md">
      {/* iPhone Frame */}
      <div className="bg-black border-[6px] border-slate-800 rounded-[3rem] w-full max-w-sm h-[85vh] sm:h-[750px] flex flex-col relative overflow-hidden shadow-2xl">
        
        {/* Dynamic Island Notch */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-6 bg-black rounded-full z-20"></div>

        {/* Chat Header */}
        <div className="bg-slate-900/90 backdrop-blur-sm pt-12 pb-3 px-4 flex items-center gap-3 border-b border-slate-800 z-10">
          <button onClick={onClose} className="text-blue-500 font-medium text-lg">⟨</button>
          <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-xl">👤</div>
          <div>
            <h2 className="text-white font-semibold text-sm">{npc.name}</h2>
            <p className="text-slate-400 text-[10px]">Online</p>
          </div>
        </div>

        {/* Chat Messages Area */}
        <div className="flex-1 bg-[#0a0a0a] overflow-y-auto p-4 flex flex-col gap-3 custom-scrollbar">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${
                msg.sender === 'me' ? 'bg-blue-600 text-white rounded-br-sm' : 'bg-slate-800 text-slate-100 rounded-bl-sm'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}

          {/* Ziraat Bank Transfer Receipt UI */}
          {messages.filter(m => m.isTransfer).map(msg => (
             <div key={`receipt-${msg.id}`} className="flex justify-start mt-1">
               <div className="bg-slate-800 border border-slate-700 rounded-xl p-3 max-w-[85%] flex items-center gap-3">
                 <div className="bg-red-600 rounded-full w-8 h-8 flex items-center justify-center text-white font-black text-lg font-serif">Z</div>
                 <div>
                   <p className="text-slate-100 font-bold text-sm">Ziraat Mobil <span className="text-emerald-400 text-xs ml-1">✔</span></p>
                   <p className="text-slate-300 text-xs">+{msg.amount?.toLocaleString()} ₺ received</p>
                 </div>
               </div>
             </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-slate-800 rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1 items-center">
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-75"></div>
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-150"></div>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Action Buttons */}
        <div className="bg-slate-900 p-4 pb-8 border-t border-slate-800 flex flex-col gap-2">
          {!interactionDone ? (
            <>
              <button onClick={() => handleAction("friendly")} className="w-full bg-slate-800 hover:bg-slate-700 text-white rounded-xl py-3 text-sm font-semibold transition-colors">
                Say Hello (+Social)
              </button>
              <button onClick={() => handleAction("bill")} className="w-full bg-blue-600 hover:bg-blue-500 text-white rounded-xl py-3 text-sm font-semibold transition-colors">
                Bill Them For Money
              </button>
              <button onClick={() => handleAction("scam")} className="w-full bg-rose-600 hover:bg-rose-500 text-white rounded-xl py-3 text-sm font-semibold transition-colors">
                Run Heavy Scam
              </button>
            </>
          ) : (
            <button onClick={onClose} className="w-full bg-slate-700 hover:bg-slate-600 text-white rounded-xl py-3 text-sm font-semibold transition-colors">
              Close Chat
            </button>
          )}
        </div>
      </div>
    </div>
  );
}