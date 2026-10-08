'use client';

import React, { useState, useEffect, useRef } from 'react';

interface Message {
  id: number;
  sender: 'me' | 'npc';
  text: string;
  isTransfer?: boolean;
  amount?: number;
}

export default function ChatModal({ onClose, updateWallet, updateEnergy, playerData }: any) {
  const [activeApp, setActiveApp] = useState<'home' | 'messages' | 'bank' | 'career' | 'borsa' | 'housing' | 'social'>('home');
  
  // Chat State
  const [npc] = useState(generateRandomNPC());
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, sender: 'npc', text: `What's up?` }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [interactionDone, setInteractionDone] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Career State
  const [currentJob, setCurrentJob] = useState<string>('Unemployed');
  const [jobIncome, setJobIncome] = useState<number>(0);

  // Housing State
  const [currentHome, setCurrentHome] = useState<string>('Bağcılar Studio');
  const [weeklyRent, setWeeklyRent] = useState<number>(1500);

  // Social Media State
  const [followers, setFollowers] = useState<number>(1250);
  const [posts, setPosts] = useState<string[]>(['Just moved to Türkiye Hayatı! 🚀']);
  const [newPostText, setNewPostText] = useState<string>('');

  function generateRandomNPC() {
    const names = ["Emre", "Ayşe", "Tariq", "Fatma", "Ozan", "Leyla"];
    const wealthTiers = ["Broke", "Comfortable", "Loaded"];
    return {
      name: names[Math.floor(Math.random() * names.length)],
      wealth: wealthTiers[Math.floor(Math.random() * wealthTiers.length)]
    };
  }

  useEffect(() => {
    if (activeApp === 'messages') {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping, activeApp]);

  const addMessage = (sender: 'me' | 'npc', text: string, isTransfer = false, amount = 0) => {
    setMessages(prev => [...prev, { id: Date.now(), sender, text, isTransfer, amount }]);
  };

  const handleAction = async (actionType: string) => {
    setInteractionDone(true);
    let energyChange = -10; 
    const roll = Math.random();

    if (actionType === "friendly") {
      addMessage('me', 'How are you doing, everything good?');
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        addMessage('npc', 'Doing great! Let grab a coffee later.');
        updateEnergy(-5);
      }, 1500);
    } 
    
    else if (actionType === "bill") {
      addMessage('me', 'Hey, I am running a bit low on cash. Can you spot me some?');
      setIsTyping(true);
      setTimeout(() => {
        if (roll > 0.4) {
          addMessage('npc', 'Send your IBAN right now.');
          setTimeout(() => {
            addMessage('me', 'TR12 0001 0000 1234 5678 9012 34 Ziraat Bank');
            setTimeout(() => {
              setIsTyping(false);
              const moneyChange = npc.wealth === "Loaded" ? 150000 : 25000;
              addMessage('npc', 'Done. Sent it over.', true, moneyChange);
              updateWallet(moneyChange);
            }, 1500);
          }, 1000);
        } else {
          setIsTyping(false);
          addMessage('npc', 'I am broke too bro, ask me tomorrow.');
        }
        updateEnergy(energyChange);
      }, 1500);
    } 
    
    else if (actionType === "scam") {
      addMessage('me', 'I got an insider trading tip guaranteed to return 500% today.');
      setIsTyping(true);
      setTimeout(() => {
        if (roll > 0.65) {
          setIsTyping(false);
          const moneyChange = 500000;
          addMessage('npc', 'I trust you. Sent.', true, moneyChange);
          updateWallet(moneyChange);
        } else {
          setIsTyping(false);
          addMessage('npc', 'Are you out of your mind? Calling the cops.');
          updateWallet(-50000); 
        }
        updateEnergy(energyChange);
      }, 2000);
    }
  };

  const applyForJob = (title: string, salary: number) => {
    setCurrentJob(title);
    setJobIncome(salary);
    updateWallet(salary);
  };

  const tradeAsset = (cost: number, multiplier: number, name: string) => {
    if (playerData.money < cost) {
      alert("Insufficient funds!");
      return;
    }
    updateWallet(-cost);
    const win = Math.random() > 0.45;
    const payout = win ? cost * multiplier : 0;
    if (win) {
      updateWallet(payout);
      alert(`Success! Your ${name} investment returned ${payout.toLocaleString()} ₺! 🎉`);
    } else {
      alert(`Market crash! Your ${name} investment went under, you lost ${cost.toLocaleString()} ₺. 📉`);
    }
  };

  const rentHousing = (title: string, rentCost: number) => {
    setCurrentHome(title);
    setWeeklyRent(rentCost);
    alert(`Successfully moved into ${title}! Weekly rent is set to ${rentCost.toLocaleString()} ₺.`);
  };

  const createPost = () => {
    if (!newPostText.trim()) return;
    setPosts([newPostText, ...posts]);
    setFollowers(prev => prev + Math.floor(Math.random() * 500) + 100);
    setNewPostText('');
    alert("Post published successfully! Followers increased. 📈");
  };

  return (
    <div className="fixed inset-0 bg-slate-900/80 flex items-center justify-center z-[100] p-4 backdrop-blur-sm">
      
      {/* HARD-CODED IPHONE DIMENSIONS */}
      <div className="bg-black border-[12px] border-slate-800 rounded-[3rem] shadow-2xl relative w-[350px] h-[700px] flex flex-col overflow-hidden">
        
        {/* Dynamic Island Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-slate-800 rounded-b-3xl z-50 flex items-center justify-end px-3 shadow-inner">
           <div className="w-2.5 h-2.5 rounded-full bg-slate-900 shadow-inner"></div>
        </div>

        {/* iOS Status Bar */}
        <div className="absolute top-0 w-full h-10 z-40 flex justify-between items-center px-5 text-white text-[11px] font-bold pt-1 pointer-events-none">
          <span>10:49</span>
          <div className="flex items-center gap-1">
            <span className="text-[10px]">5G</span>
            <div className="w-5 h-2.5 border border-white rounded-sm p-[1px]"><div className="bg-white w-full h-full rounded-sm"></div></div>
          </div>
        </div>

        {/* ======================= */}
        {/* APP 1: HOME SCREEN      */}
        {/* ======================= */}
        {activeApp === 'home' && (
          <div className="flex-1 bg-gradient-to-b from-indigo-900 to-black w-full h-full flex flex-col relative pt-16 px-6">
             <div className="grid grid-cols-4 gap-4 mt-8">
                {/* Messages */}
                <div onClick={() => setActiveApp('messages')} className="flex flex-col items-center gap-1 cursor-pointer hover:scale-105 transition-transform">
                   <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg"><span className="text-white text-3xl">💬</span></div>
                   <span className="text-white text-[10px] font-medium">Messages</span>
                </div>

                {/* Ziraat Bank */}
                <div onClick={() => setActiveApp('bank')} className="flex flex-col items-center gap-1 cursor-pointer hover:scale-105 transition-transform">
                   <div className="w-14 h-14 bg-red-600 rounded-2xl flex items-center justify-center shadow-lg border border-red-500"><span className="text-white text-3xl font-serif font-black">Z</span></div>
                   <span className="text-white text-[10px] font-medium">Ziraat</span>
                </div>

                {/* Career */}
                <div onClick={() => setActiveApp('career')} className="flex flex-col items-center gap-1 cursor-pointer hover:scale-105 transition-transform">
                   <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg"><span className="text-white text-2xl">💼</span></div>
                   <span className="text-white text-[10px] font-medium">Career</span>
                </div>

                {/* Stocks */}
                <div onClick={() => setActiveApp('borsa')} className="flex flex-col items-center gap-1 cursor-pointer hover:scale-105 transition-transform">
                   <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-lg"><span className="text-white text-2xl">📈</span></div>
                   <span className="text-white text-[10px] font-medium">Stocks</span>
                </div>

                {/* Real Estate */}
                <div onClick={() => setActiveApp('housing')} className="flex flex-col items-center gap-1 cursor-pointer hover:scale-105 transition-transform mt-2">
                   <div className="w-14 h-14 bg-amber-600 rounded-2xl flex items-center justify-center shadow-lg"><span className="text-white text-2xl">🏠</span></div>
                   <span className="text-white text-[10px] font-medium">Real Estate</span>
                </div>

                {/* Social Media */}
                <div onClick={() => setActiveApp('social')} className="flex flex-col items-center gap-1 cursor-pointer hover:scale-105 transition-transform mt-2">
                   <div className="w-14 h-14 bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg"><span className="text-white text-2xl">📸</span></div>
                   <span className="text-white text-[10px] font-medium">Insta</span>
                </div>
             </div>

             <button onClick={onClose} className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-md px-6 py-2 rounded-full text-white text-xs font-bold border border-white/20">
                Lock Phone
             </button>
          </div>
        )}

        {/* ======================= */}
        {/* APP 2: ZIRAAT MOBIL     */}
        {/* ======================= */}
        {activeApp === 'bank' && (
          <div className="flex-1 bg-white w-full h-full flex flex-col relative pt-12">
            <div className="bg-red-600 px-5 py-4 flex justify-between items-center shadow-md z-10">
               <button onClick={() => setActiveApp('home')} className="text-white text-2xl font-light">‹</button>
               <h1 className="text-white font-bold text-sm tracking-widest">ZIRAAT MOBILE</h1>
               <div className="w-6"></div>
            </div>
            
            <div className="p-5 flex-1 bg-slate-50 flex flex-col gap-4">
               <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
                  <p className="text-xs text-slate-500 font-bold mb-1">Checking Account (TL)</p>
                  <p className="text-3xl font-black text-slate-800">{playerData?.money?.toLocaleString() || 0} ₺</p>
                  <p className="text-[10px] text-slate-400 mt-2">TR12 0001 0000 1234 5678 9012 34</p>
               </div>

               <div>
                 <p className="text-xs font-bold text-slate-500 mb-3 pl-1">Recent Transactions</p>
                 <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold">↓</div>
                       <div>
                         <p className="text-xs font-bold text-slate-800">Birth Lottery</p>
                         <p className="text-[9px] text-slate-400">Today</p>
                       </div>
                    </div>
                    <p className="text-emerald-500 font-bold text-sm">+5,000,000 ₺</p>
                 </div>
               </div>
            </div>
          </div>
        )}

        {/* ======================= */}
        {/* APP 3: CAREER           */}
        {/* ======================= */}
        {activeApp === 'career' && (
          <div className="flex-1 bg-white w-full h-full flex flex-col relative pt-12">
            <div className="bg-blue-600 px-5 py-4 flex justify-between items-center shadow-md z-10">
               <button onClick={() => setActiveApp('home')} className="text-white text-2xl font-light">‹</button>
               <h1 className="text-white font-bold text-sm tracking-widest">CAREER HUB</h1>
               <div className="w-6"></div>
            </div>
            
            <div className="p-5 flex-1 bg-slate-50 flex flex-col gap-4 overflow-y-auto">
               <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
                  <p className="text-[10px] font-bold text-blue-600 uppercase">Current Status</p>
                  <p className="text-lg font-black text-blue-900 mt-1">{currentJob}</p>
                  <p className="text-xs text-blue-700 mt-0.5">Weekly Income: {jobIncome.toLocaleString()} ₺</p>
               </div>

               <p className="text-xs font-bold text-slate-500 mt-2">Open Positions</p>
               
               <div className="space-y-3">
                  <div className="bg-white p-3.5 rounded-2xl border border-slate-200 flex justify-between items-center shadow-sm">
                     <div>
                       <p className="text-xs font-bold text-slate-800">Döner Shop Apprentice</p>
                       <p className="text-[10px] text-emerald-600 font-semibold">1,500 ₺ / week</p>
                     </div>
                     <button onClick={() => applyForJob('Döner Shop Apprentice', 1500)} className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-sm">Apply</button>
                  </div>

                  <div className="bg-white p-3.5 rounded-2xl border border-slate-200 flex justify-between items-center shadow-sm">
                     <div>
                       <p className="text-xs font-bold text-slate-800">Junior Developer</p>
                       <p className="text-[10px] text-emerald-600 font-semibold">12,500 ₺ / week</p>
                     </div>
                     <button onClick={() => applyForJob('Junior Developer', 12500)} className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-sm">Apply</button>
                  </div>

                  <div className="bg-white p-3.5 rounded-2xl border border-slate-200 flex justify-between items-center shadow-sm">
                     <div>
                       <p className="text-xs font-bold text-slate-800">Holding Executive Trainee</p>
                       <p className="text-[10px] text-emerald-600 font-semibold">75,000 ₺ / week</p>
                     </div>
                     <button onClick={() => applyForJob('Holding Executive Trainee', 75000)} className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-sm">Apply</button>
                  </div>
               </div>
            </div>
          </div>
        )}

        {/* ======================= */}
        {/* APP 4: STOCKS & CRYPTO  */}
        {/* ======================= */}
        {activeApp === 'borsa' && (
          <div className="flex-1 bg-white w-full h-full flex flex-col relative pt-12">
            <div className="bg-emerald-600 px-5 py-4 flex justify-between items-center shadow-md z-10">
               <button onClick={() => setActiveApp('home')} className="text-white text-2xl font-light">‹</button>
               <h1 className="text-white font-bold text-sm tracking-widest">BIST & CRYPTO</h1>
               <div className="w-6"></div>
            </div>
            
            <div className="p-5 flex-1 bg-slate-50 flex flex-col gap-4 overflow-y-auto">
               <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
                  <p className="text-[10px] font-bold text-emerald-600 uppercase">Quick Trading</p>
                  <p className="text-xs text-emerald-800 mt-1">Double your money or lose it all!</p>
               </div>

               <div className="space-y-3">
                  <div className="bg-white p-3.5 rounded-2xl border border-slate-200 flex justify-between items-center shadow-sm">
                     <div>
                       <p className="text-xs font-bold text-slate-800">✈️ Turkish Airlines (THYAO)</p>
                       <p className="text-[10px] text-slate-500">Cost: 100,000 ₺ (2x Return)</p>
                     </div>
                     <button onClick={() => tradeAsset(100000, 2, 'THYAO')} className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-sm">Invest</button>
                  </div>

                  <div className="bg-white p-3.5 rounded-2xl border border-slate-200 flex justify-between items-center shadow-sm">
                     <div>
                       <p className="text-xs font-bold text-slate-800">⚡ IPO Adventure</p>
                       <p className="text-[10px] text-slate-500">Cost: 500,000 ₺ (3x Return)</p>
                     </div>
                     <button onClick={() => tradeAsset(500000, 3, 'IPO')} className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-sm">Invest</button>
                  </div>

                  <div className="bg-white p-3.5 rounded-2xl border border-slate-200 flex justify-between items-center shadow-sm">
                     <div>
                       <p className="text-xs font-bold text-slate-800">🚀 Meme Coin Speculation</p>
                       <p className="text-[10px] text-slate-500">Cost: 1,000,000 ₺ (5x Return)</p>
                     </div>
                     <button onClick={() => tradeAsset(1000000, 5, 'Meme Coin')} className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-sm">Invest</button>
                  </div>
               </div>
            </div>
          </div>
        )}

        {/* ======================= */}
        {/* APP 5: REAL ESTATE      */}
        {/* ======================= */}
        {activeApp === 'housing' && (
          <div className="flex-1 bg-white w-full h-full flex flex-col relative pt-12">
            <div className="bg-amber-600 px-5 py-4 flex justify-between items-center shadow-md z-10">
               <button onClick={() => setActiveApp('home')} className="text-white text-2xl font-light">‹</button>
               <h1 className="text-white font-bold text-sm tracking-widest">REAL ESTATE</h1>
               <div className="w-6"></div>
            </div>
            
            <div className="p-5 flex-1 bg-slate-50 flex flex-col gap-4 overflow-y-auto">
               <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
                  <p className="text-[10px] font-bold text-amber-600 uppercase">Current Residence</p>
                  <p className="text-lg font-black text-amber-900 mt-1">{currentHome}</p>
                  <p className="text-xs text-amber-700 mt-0.5">Weekly Rent: {weeklyRent.toLocaleString()} ₺</p>
               </div>

               <p className="text-xs font-bold text-slate-500 mt-2">Available Properties</p>
               
               <div className="space-y-3">
                  <div className="bg-white p-3.5 rounded-2xl border border-slate-200 flex justify-between items-center shadow-sm">
                     <div>
                       <p className="text-xs font-bold text-slate-800">Bağcılar Studio</p>
                       <p className="text-[10px] text-slate-500">1,500 ₺ / week</p>
                     </div>
                     <button onClick={() => rentHousing('Bağcılar Studio', 1500)} className="bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-sm">Rent</button>
                  </div>

                  <div className="bg-white p-3.5 rounded-2xl border border-slate-200 flex justify-between items-center shadow-sm">
                     <div>
                       <p className="text-xs font-bold text-slate-800">Kadıköy Sea View Flat</p>
                       <p className="text-[10px] text-slate-500">5,000 ₺ / week</p>
                     </div>
                     <button onClick={() => rentHousing('Kadıköy Sea View Flat', 5000)} className="bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-sm">Rent</button>
                  </div>

                  <div className="bg-white p-3.5 rounded-2xl border border-slate-200 flex justify-between items-center shadow-sm">
                     <div>
                       <p className="text-xs font-bold text-slate-800">Etiler Luxury Residence</p>
                       <p className="text-[10px] text-slate-500">15,000 ₺ / week</p>
                     </div>
                     <button onClick={() => rentHousing('Etiler Luxury Residence', 15000)} className="bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-sm">Rent</button>
                  </div>
               </div>
            </div>
          </div>
        )}

        {/* ======================= */}
        {/* APP 6: SOCIAL MEDIA     */}
        {/* ======================= */}
        {activeApp === 'social' && (
          <div className="flex-1 bg-white w-full h-full flex flex-col relative pt-12">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-5 py-4 flex justify-between items-center shadow-md z-10">
               <button onClick={() => setActiveApp('home')} className="text-white text-2xl font-light">‹</button>
               <h1 className="text-white font-bold text-sm tracking-widest">INSTAGRAM</h1>
               <div className="w-6"></div>
            </div>
            
            <div className="p-5 flex-1 bg-slate-50 flex flex-col gap-4 overflow-y-auto">
               <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between shadow-sm">
                  <div>
                    <p className="text-xs font-bold text-slate-800">{playerData?.username || '@istanbul_boss'}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">{followers.toLocaleString()} Followers</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-yellow-400 to-purple-600 flex items-center justify-center text-white font-bold text-sm">📸</div>
               </div>

               <div className="flex gap-2">
                 <input 
                   type="text" 
                   value={newPostText}
                   onChange={(e) => setNewPostText(e.target.value)}
                   placeholder="Share your hustle..."
                   className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-pink-500"
                 />
                 <button onClick={createPost} className="bg-pink-600 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-sm">Post</button>
               </div>

               <div className="space-y-3">
                  <p className="text-xs font-bold text-slate-500">Your Feed</p>
                  {posts.map((post, idx) => (
                    <div key={idx} className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm">
                       <p className="text-xs text-slate-800 font-medium">{post}</p>
                       <p className="text-[9px] text-slate-400 mt-2">Just now • Türkiye Hayatı</p>
                    </div>
                  ))}
               </div>
            </div>
          </div>
        )}

        {/* ======================= */}
        {/* APP 7: MESSAGES         */}
        {/* ======================= */}
        {activeApp === 'messages' && (
          <div className="flex-1 bg-black flex flex-col relative pt-10">
            <div className="bg-slate-900/90 py-3 px-4 flex items-center gap-3 border-b border-slate-800 z-30">
              <button onClick={() => setActiveApp('home')} className="text-blue-500 text-3xl font-light mb-1 hover:text-blue-400 leading-none">‹</button>
              <div className="w-9 h-9 rounded-full bg-slate-600 flex items-center justify-center text-lg shadow-sm">👤</div>
              <div className="flex flex-col justify-center">
                <h2 className="text-white font-medium text-[14px] leading-tight">{npc.name} ❯</h2>
                <p className="text-slate-400 text-[10px]">iMessage</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2 custom-scrollbar pb-4">
              <p className="text-center text-slate-500 text-[10px] font-medium mb-3 uppercase tracking-widest mt-2">Today 10:49</p>
              
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

              {messages.filter(m => m.isTransfer).map(msg => (
                 <div key={`receipt-${msg.id}`} className="flex justify-start mt-2 mb-2">
                   <div className="bg-slate-900 border border-slate-700 rounded-2xl p-3.5 w-60 shadow-lg flex flex-col gap-2">
                     <div className="flex items-center gap-3">
                        <div className="bg-red-600 rounded-full w-8 h-8 flex items-center justify-center text-white font-black text-lg font-serif border border-red-500 shadow-inner">Z</div>
                        <div className="flex-1">
                          <p className="text-white font-semibold text-[12px] leading-tight">Ziraat Mobile</p>
                          <p className="text-emerald-400 font-medium text-[10px]">Transfer Successful ✔</p>
                        </div>
                     </div>
                     <div className="bg-black/50 rounded-lg p-2 text-center border border-slate-800 mt-1">
                        <p className="text-white font-bold text-lg">+{msg.amount?.toLocaleString()} ₺</p>
                     </div>
                   </div>
                 </div>
              ))}

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

            <div className="bg-slate-900 px-4 pt-3 pb-8 border-t border-slate-800 z-30">
              {!interactionDone ? (
                <div className="flex flex-col gap-2">
                  <button onClick={() => handleAction("friendly")} className="w-full bg-slate-800 hover:bg-slate-700 text-blue-400 rounded-xl py-3 text-[14px] font-semibold transition-colors">Say Hello (+Social)</button>
                  <button onClick={() => handleAction("bill")} className="w-full bg-slate-800 hover:bg-slate-700 text-amber-500 rounded-xl py-3 text-[14px] font-semibold transition-colors">Ask for Money</button>
                  <button onClick={() => handleAction("scam")} className="w-full bg-rose-950/30 hover:bg-rose-900/40 text-rose-500 border border-rose-900/50 rounded-xl py-3 text-[14px] font-semibold transition-colors">Insider Trading Scam</button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <div className="flex-1 border border-slate-700 rounded-full flex items-center px-4 py-2 bg-black">
                     <span className="text-slate-600 text-[14px]">iMessage</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-slate-500 rounded-full z-[100] cursor-pointer" onClick={() => setActiveApp('home')}></div>
      </div>
    </div>
  );
}