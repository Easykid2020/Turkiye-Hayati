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
    <div className="fixed inset-0 bg-slate-900/80 flex items-center justify-center z-[100] p-4 backdrop-blur-sm">
      
      {/* HARD-CODED IPHONE DIMENSIONS - Will not stretch on small screens */}
      <div className="bg-black border-[12px] border-slate-800 rounded-[3rem] shadow-2xl relative w-[350px] h-[700px] flex flex-col overflow-hidden">
        
        {/* Dynamic Island Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-slate-800 rounded-b-3xl z-50 flex items-center justify-end px-3 shadow-inner">
           <div className="w-2.5 h-2.5 rounded-full bg-slate-900 shadow-inner"></div>
        </div>

        {/* iOS Status Bar */}
        <div className="absolute top-0 w-full h-10 z-40 flex justify-between items-center px-5 text-white text-[11px] font-bold pt-1">
          <span>10:49</span>
          <div className="flex items-center gap-1">
            <span className="text-[10px]">5G</span>
            <div className="w-5 h-2.5 border border-white rounded-sm p-[1px]"><div className="bg-white w-full h-full rounded-sm"></div></div>
          </div>
        </div>

        {/* iMessage Header */}
        <div className="bg-slate-900/90 pt-12 pb-3 px-4 flex items-center gap-3 border-b border-slate-800 z-30">
          <button onClick={onClose} className="text-blue-500 text-3xl font-light mb-1 hover:text-blue-400 leading-none">‹</button>
          <div className="w-9 h-9 rounded-full bg-slate-600 flex items-center justify-center text-lg shadow-sm">👤</div>
          <div className="flex flex-col justify-center">
            <h2 className="text-white font-medium text-[14px] leading-tight">{npc.name} ❯</h2>
            <p className="text-slate-400 text-[10px]">iMessage</p>
          </div>
        </div>

        {/* Chat Canvas */}
        <div className="flex-1 bg-black overflow-y-auto p-4 flex flex-col gap-2 custom-scrollbar pb-4">
          <p className="text-center text-slate-500 text-[10px] font-medium mb-3 uppercase tracking-widest mt-2">Today 10:49 AM</p>
          
          {messages.map((msg, index) => {
            const isMe = msg.sender === 'me';
            const showTail = index === messages.length - 1 || messages[index + 1]?.sender !== msg.sender;
            
            return (
              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] px-4 py-2 text-[14px] leading-snug relative shadow-sm ${
                  isMe 
                    ? `bg-blue-600 text-white rounded-2xl ${showTail ? 'rounded-br-sm' : ''}` 
                    : `bg-slate-800 text-white rounded-2xl ${showTail ? 'rounded-bl-sm' : ''}`
                }`}>
                  {msg.text}
                </div>
              </div>
            );
          })}

          {/* Ziraat Bank Transfer Receipt */}
          {messages.filter(m => m.isTransfer).map(msg => (
             <div key={`receipt-${msg.id}`} className="flex justify-start mt-2 mb-2">
               <div className="bg-slate-900 border border-slate-700 rounded-2xl p-3.5 w-60 shadow-lg flex flex-col gap-2">
                 <div className="flex items-center gap-3">
                    <div className="bg-red-600 rounded-full w-8 h-8 flex items-center justify-center text-white font-black text-lg font-serif border border-red-500 shadow-inner">Z</div>
                    <div className="flex-1">
                      <p className="text-white font-semibold text-[12px] leading-tight">Ziraat Mobil</p>
                      <p className="text-emerald-400 font-medium text-[10px]">Transfer Başarılı ✔</p>
                    </div>
                 </div>
                 <div className="bg-black/50 rounded-lg p-2 text-center border border-slate-800 mt-1">
                    <p className="text-white font-bold text-lg">+{msg.amount?.toLocaleString()} ₺</p>
                 </div>
               </div>
             </div>
          ))}

          {/* Typing Bubble */}
          {isTyping && (
            <div className="flex justify-start mt-1">
              <div className="bg-slate-800 rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1.5 items-center w-14 justify-center">
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-75"></div>
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-150"></div>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Bottom Actions Area */}
        <div className="bg-slate-900 px-4 pt-3 pb-6 border-t border-slate-800 z-30">
          {!interactionDone ? (
            <div className="flex flex-col gap-2">
              <button onClick={() => handleAction("friendly")} className="w-full bg-slate-800 hover:bg-slate-700 text-blue-400 rounded-xl py-3 text-[14px] font-semibold transition-colors">
                Say Hello (+Social)
              </button>
              <button onClick={() => handleAction("bill")} className="w-full bg-slate-800 hover:bg-slate-700 text-amber-500 rounded-xl py-3 text-[14px] font-semibold transition-colors">
                Bill Them For Money
              </button>
              <button onClick={() => handleAction("scam")} className="w-full bg-rose-950/30 hover:bg-rose-900/40 text-rose-500 border border-rose-900/50 rounded-xl py-3 text-[14px] font-semibold transition-colors">
                Run Heavy Scam
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <div className="flex-1 border border-slate-700 rounded-full flex items-center px-4 py-2 bg-black">
                 <span className="text-slate-600 text-[14px]">iMessage</span>
              </div>
              <button onClick={onClose} className="bg-slate-700 hover:bg-slate-600 rounded-full w-10 h-10 flex items-center justify-center transition-colors">
                <span className="text-white text-sm">✕</span>
              </button>
            </div>
          )}
          
          {/* iOS Home Indicator */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-slate-500 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}