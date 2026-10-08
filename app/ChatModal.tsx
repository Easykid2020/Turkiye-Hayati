'use client';

import React, { useState } from 'react';

export default function ChatModal({ onClose, updateWallet, updateEnergy }: any) {
  const [npc] = useState(generateRandomNPC());
  const [chatLog, setChatLog] = useState([`You bumped into ${npc.name}. They look at you expectantly.`]);
  const [interactionDone, setInteractionDone] = useState(false);

  function generateRandomNPC() {
    const names = ["Emre", "Ayşe", "Tariq", "Fatma", "Ozan", "Leyla", "A rich tourist", "A stressed local"];
    const wealthTiers = ["Broke", "Comfortable", "Loaded"];
    return {
      name: names[Math.floor(Math.random() * names.length)],
      wealth: wealthTiers[Math.floor(Math.random() * wealthTiers.length)]
    };
  }

  const handleAction = (actionType: string) => {
    let outcomeText = "";
    let moneyChange = 0;
    let energyChange = -10; 
    const roll = Math.random();

    if (actionType === "friendly") {
      outcomeText = `${npc.name} smiled. "Nice chatting with you! Let's grab tea sometime."`;
      energyChange = -5;
    } else if (actionType === "bill") {
      if (roll > 0.4) {
        moneyChange = npc.wealth === "Loaded" ? 150000 : 25000;
        outcomeText = `Success! You spun a wild story about your rent. ${npc.name} transferred ${moneyChange.toLocaleString()}₺ to your account!`;
      } else {
        outcomeText = `${npc.name} saw right through your lies and blocked your number on WhatsApp.`;
      }
    } else if (actionType === "scam") {
      if (roll > 0.65) {
        moneyChange = 500000;
        outcomeText = `Jackpot! You pulled off the ultimate street finesse. +${moneyChange.toLocaleString()}₺!`;
      } else {
        moneyChange = -50000;
        outcomeText = `Busted! ${npc.name} threatened to call the authorities. You dropped 50,000₺ running away!`;
      }
    }

    setChatLog([...chatLog, outcomeText]);
    updateWallet(moneyChange);
    updateEnergy(energyChange);
    setInteractionDone(true);
  };

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-slate-900 border-2 border-fuchsia-500 rounded-2xl p-6 w-full max-w-md text-white shadow-2xl">
        <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-3">
          <h2 className="text-xl font-black text-fuchsia-400 tracking-wider">💬 STREET CHAT & FINESSE</h2>
          <button onClick={onClose} className="text-rose-500 font-bold text-xl hover:scale-110 transition">✕</button>
        </div>

        <div className="bg-slate-950 rounded-xl p-4 mb-4 h-44 overflow-y-auto font-mono text-xs md:text-sm border border-slate-800 flex flex-col gap-2">
          {chatLog.map((log, index) => (
            <p key={index} className={`py-1 border-b border-slate-900 last:border-0 ${index === chatLog.length - 1 ? 'text-emerald-400 font-bold' : 'text-slate-400'}`}>
              &gt; {log}
            </p>
          ))}
        </div>

        {!interactionDone ? (
          <div className="grid grid-cols-1 gap-2.5">
            <button onClick={() => handleAction("friendly")} className="bg-blue-600 hover:bg-blue-500 p-3 rounded-xl font-bold transition-all text-xs uppercase tracking-wider">
              Chat Normally (Safe)
            </button>
            <button onClick={() => handleAction("bill")} className="bg-amber-600 hover:bg-amber-500 p-3 rounded-xl font-bold transition-all text-xs uppercase tracking-wider">
              Bill Them for Cash (Medium Risk)
            </button>
            <button onClick={() => handleAction("scam")} className="bg-rose-600 hover:bg-rose-500 p-3 rounded-xl font-bold transition-all text-xs uppercase tracking-wider">
              Run a Heavy Finesse (High Risk)
            </button>
          </div>
        ) : (
          <button onClick={onClose} className="w-full bg-slate-800 hover:bg-slate-700 p-3 rounded-xl font-bold mt-2 text-xs uppercase tracking-wider">
            Walk Away
          </button>
        )}
      </div>
    </div>
  );
}