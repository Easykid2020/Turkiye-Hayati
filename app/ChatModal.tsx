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
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-md">
      
      {/* 📱 PHYSICAL IPHONE FRAME */}
      <div className="bg-black border-[8px] border-[#1f1f1f] rounded-[3.5rem] w-full max-w-[390px] h-[85vh] sm:h-[844px] flex flex-col relative overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.5)] ring-1 ring-white/10">
        
        {/* iOS Status Bar */}
        <div className="absolute top-0 w-full h-12 z-30 flex justify-between items-center px-6 text-white text-[13px] font-semibold pt-1">
          <span>10:49</span>
          <div className="flex items-center gap-1.5">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M15.5 14.5c0-2.8 2.2-5 5-5 .36 0 .71.04 1.05.11L23.64 7c-3.21-3.2-7.66-5-12.14-5-4.48 0-8.93 1.8-12.14 5l2.09 2.61c.34-.07.69-.11 1.05-.11 2.8 0 5 2.2 5 5v5h8v-5zM11.5 16l-2.09-2.61C10.05 13.06 10.74 13 11.5 13s1.45.06 2.09.39L11.5 16z"/></svg>
            <div className="w-6 h-3 border border-white/50 rounded-sm p-[1px]"><div className="bg-white w-full h-full rounded-sm"></div></div>
          </div>
        </div>

        {/* Dynamic Island */}
        <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-[120px] h-[32px] bg-black rounded-full z-40 flex items-center justify-end px-3">
           <div className="w-2.5 h-2.5 rounded-full bg-blue-900/40 shadow-inner"></div>
        </div>

        {/* iMessage Header */}
        <div className="bg-[#1c1c1e]/90 backdrop-blur-xl pt-14 pb-2 px-4 flex items-center gap-3 border-b border-white/10 z-20">
          <button onClick={onClose} className="text-blue-500 text-3xl font-light mb-1 hover:text-blue-400">‹</button>
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-slate-600 to-slate-400 flex items-center justify-center text-xl shadow-sm">👤</div>
          <div className="flex flex-col justify-center">
            <h2 className="text-white font-medium text-[15px] leading-tight">{npc.name} ❯</h2>
            <p className="text-slate-400 text-[11px]">iMessage</p>
          </div>
        </div>

        {/* Chat Canvas */}
        <div className="flex-1 bg-black overflow-y-auto p-4 flex flex-col gap-1.5 custom-scrollbar pb-6 pt-6">
          <p className="text-center text-slate-500 text-[10px] font-medium mb-4 uppercase tracking-widest">Today 10:49 AM</p>
          
          {messages.map((msg, index) => {
            const isMe = msg.sender === 'me';
            const showTail = index === messages.length - 1 || messages[index + 1]?.sender !== msg.sender;
            
            return (
              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[75%] px-4 py-2 text-[15px] leading-tight relative shadow-sm ${
                  isMe 
                    ? `bg-[#0b84ff] text-white rounded-2xl ${showTail ? 'rounded-br-sm' : ''}` 
                    : `bg-[#262628] text-white rounded-2xl ${showTail ? 'rounded-bl-sm' : ''}`
                }`}>
                  {msg.text}
                </div>
              </div>
            );
          })}

          {/* Epic Ziraat Bank Transfer Receipt */}
          {messages.filter(m => m.isTransfer).map(msg => (
             <div key={`receipt-${msg.id}`} className="flex justify-start mt-2 mb-2">
               <div className="bg-[#1c1c1e] border border-white/10 rounded-[1.25rem] p-3.5 w-64 shadow-lg flex flex-col gap-3">
                 <div className="flex items-center gap-3">
                    <div className="bg-[#e1001a] rounded-full w-9 h-9 flex items-center justify-center text-white font-black text-xl font-serif tracking-tighter border border-[#ff3344] shadow-inner">Z</div>
                    <div className="flex-1">
                      <p className="text-white font-semibold text-[13px] leading-tight">Ziraat Mobil</p>
                      <p className="text-emerald-400 font-medium text-[11px]">Transfer Başarılı ✔</p>
                    </div>
                 </div>
                 <div className="bg-black/50 rounded-lg p-2 text-center border border-white/5">
                    <p className="text-white font-bold text-lg">+{msg.amount?.toLocaleString()} ₺</p>
                 </div>
               </div>
             </div>
          ))}

          {/* Typing Bubble */}
          {isTyping && (
            <div className="flex justify-start mt-1">
              <div className="bg-[#262628] rounded-2xl rounded-bl-sm px-4 py-3.5 flex gap-1.5 items-center w-16 justify-center">
                <div className="w-1.5 h-1.5 bg-[#8e8e93] rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-[#8e8e93] rounded-full animate-bounce delay-75"></div>
                <div className="w-1.5 h-1.5 bg-[#8e8e93] rounded-full animate-bounce delay-150"></div>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Bottom Actions Area */}
        <div className="bg-[#1c1c1e]/90 backdrop-blur-xl px-4 pt-3 pb-8 border-t border-white/10 relative z-20">
          {!interactionDone ? (
            <div className="flex flex-col gap-2">
              <button onClick={() => handleAction("friendly")} className="w-full bg-[#2c2c2e] hover:bg-[#3a3a3c] text-[#0b84ff] rounded-[1rem] py-3.5 text-[15px] font-semibold transition-colors active:scale-[0.98]">
                Say Hello (+Social)
              </button>
              <button onClick={() => handleAction("bill")} className="w-full bg-[#2c2c2e] hover:bg-[#3a3a3c] text-amber-500 rounded-[1rem] py-3.5 text-[15px] font-semibold transition-colors active:scale-[0.98]">
                Bill Them For Money
              </button>
              <button onClick={() => handleAction("scam")} className="w-full bg-[#e1001a]/10 hover:bg-[#e1001a]/20 text-[#ff453a] border border-[#ff453a]/30 rounded-[1rem] py-3.5 text-[15px] font-semibold transition-colors active:scale-[0.98]">
                Run Heavy Scam
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <div className="flex-1 border border-white/20 rounded-full flex items-center px-4 py-2 bg-black">
                 <span className="text-white/40 text-[15px]">iMessage</span>
              </div>
              <button onClick={onClose} className="bg-slate-700 hover:bg-slate-600 rounded-full w-10 h-10 flex items-center justify-center transition-colors">
                <span className="text-white">✕</span>
              </button>
            </div>
          )}
          
          {/* iOS Home Indicator */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[130px] h-1 bg-white rounded-full"></div>
        </div>
      </div>
    </div>
  );
}