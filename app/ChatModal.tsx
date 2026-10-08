'use client';

import React, { useState } from 'react';

export default function ChatModal({ onClose, playerData, updateWallet, updateEnergy }: any) {
  const [activeApp, setActiveApp] = useState<'home' | 'bank' | 'career' | 'stocks' | 'market' | 'lcw' | 'houses' | 'cars' | 'forbes'>('home');
  const [jobs] = useState([
    { id: 'intern', title: 'Computer Engineering Intern', salary: 15000, desc: 'Coding, Verilog & debugging at Teknopark' },
    { id: 'barista', title: 'Kadıköy Barista', salary: 8000, desc: 'Make Turkish coffee & serve locals' },
    { id: 'courier', title: 'Getir / Trendyol Courier', salary: 12000, desc: 'Fast scooter deliveries across the district' }
  ]);
  const [currentJob, setCurrentJob] = useState<string | null>(null);

  const marketItems = [
    { id: 'simit', name: 'Taze Simit & Çay', cost: 35, energy: 500, icon: '🥯' },
    { id: 'doner', name: 'İskender / Et Döner', cost: 250, energy: 2500, icon: '🌯' },
    { id: 'ayran', name: 'Mis Ayran', cost: 20, energy: 200, icon: '🥛' },
    { id: 'baklava', name: 'Gaziantep Baklavası', cost: 180, energy: 1000, icon: '🥮' },
  ];

  const lcwItems = [
    { id: 'tee', name: 'LCW Casual T-Shirt', cost: 450, icon: '👕' },
    { id: 'jacket', name: 'Kışlık Mont', cost: 2500, icon: '🧥' },
    { id: 'sneakers', name: 'Trendyol Sneaker', cost: 1200, icon: '👟' },
  ];

  const houses = [
    { id: 'bagcilar', name: 'Bağcılar Basık Ev', rent: 1500, desc: 'Hard start, cheap rent, street hustle rules.' },
    { id: 'kadikoy', name: 'Kadıköy Sahil Daire', rent: 6000, desc: 'Sea breeze, cafes, and vibrant nightlife.' },
    { id: 'besiktas', name: 'Beşiktaş Çarşı Rezidans', rent: 12000, desc: 'Right in the heart of student & football culture.' },
    { id: 'etiler', name: 'Etiler Lüks Villa', rent: 45000, desc: 'Top tier living for the elite.' },
  ];

  const cars = [
    { id: 'tofas', name: 'Tofaş Şahin (Doğan SLX)', cost: 120000, icon: '🚗', desc: 'Legendary street drift machine.' },
    { id: 'toros', name: 'Renault 12 Toros', cost: 85000, icon: '🚙', desc: 'Indestructible village & city cruiser.' },
    { id: 'TOGG', name: 'TOGG T10X (Electric SUV)', cost: 1800000, icon: '🚙⚡', desc: 'The pride of Turkish EV engineering.' },
  ];

  const forbesList = [
    { rank: 1, name: '@ankara_boss', netWorth: '12,450,000 ₺', title: 'Tech Mogul' },
    { rank: 2, name: '@istanbul_king', netWorth: '9,800,000 ₺', title: 'Crypto Whale' },
    { rank: 3, name: playerData.username, netWorth: `${playerData.money.toLocaleString()} ₺`, title: 'Rising Hustler' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 w-full max-w-sm h-[700px] rounded-[3rem] shadow-2xl border-4 border-slate-700 flex flex-col overflow-hidden relative text-white">
        
        {/* Phone Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl z-20 flex items-center justify-center">
          <div className="w-12 h-1 bg-slate-800 rounded-full"></div>
        </div>

        {/* Phone Header */}
        <div className="pt-8 px-6 pb-4 bg-slate-950 flex justify-between items-center border-b border-slate-800">
          <span className="text-xs font-bold text-red-500">Türkiye Hayatı iOS</span>
          <button onClick={onClose} className="bg-slate-800 hover:bg-slate-700 w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center">✕</button>
        </div>

        {/* App Content Screen */}
        <div className="flex-1 p-6 overflow-y-auto">
          {activeApp === 'home' && (
            <div className="space-y-4">
              <div className="text-center mb-4">
                <h3 className="text-lg font-black">{playerData.username}</h3>
                <p className="text-xs text-slate-400">Net Worth: {playerData.money.toLocaleString()} ₺</p>
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                <button onClick={() => setActiveApp('bank')} className="bg-red-600/20 border border-red-500/40 p-3 rounded-2xl flex flex-col items-center gap-1 hover:bg-red-600/30 transition-all">
                  <span className="text-2xl">🏛️</span>
                  <span className="text-[10px] font-bold">Ziraat Bank</span>
                </button>
                <button onClick={() => setActiveApp('career')} className="bg-blue-600/20 border border-blue-500/40 p-3 rounded-2xl flex flex-col items-center gap-1 hover:bg-blue-600/30 transition-all">
                  <span className="text-2xl">💼</span>
                  <span className="text-[10px] font-bold">Career Hub</span>
                </button>
                <button onClick={() => setActiveApp('stocks')} className="bg-emerald-600/20 border border-emerald-500/40 p-3 rounded-2xl flex flex-col items-center gap-1 hover:bg-emerald-600/30 transition-all">
                  <span className="text-2xl">📈</span>
                  <span className="text-[10px] font-bold">BIST Stocks</span>
                </button>
                <button onClick={() => setActiveApp('market')} className="bg-amber-600/20 border border-amber-500/40 p-3 rounded-2xl flex flex-col items-center gap-1 hover:bg-amber-600/30 transition-all">
                  <span className="text-2xl">🛒</span>
                  <span className="text-[10px] font-bold">BİM / Migros</span>
                </button>
                <button onClick={() => setActiveApp('lcw')} className="bg-purple-600/20 border border-purple-500/40 p-3 rounded-2xl flex flex-col items-center gap-1 hover:bg-purple-600/30 transition-all">
                  <span className="text-2xl">🛍️</span>
                  <span className="text-[10px] font-bold">LC Waikiki</span>
                </button>
                <button onClick={() => setActiveApp('houses')} className="bg-indigo-600/20 border border-indigo-500/40 p-3 rounded-2xl flex flex-col items-center gap-1 hover:bg-indigo-600/30 transition-all">
                  <span className="text-2xl">🏠</span>
                  <span className="text-[10px] font-bold">Real Estate</span>
                </button>
                <button onClick={() => setActiveApp('cars')} className="bg-cyan-600/20 border border-cyan-500/40 p-3 rounded-2xl flex flex-col items-center gap-1 hover:bg-cyan-600/30 transition-all">
                  <span className="text-2xl">🚗</span>
                  <span className="text-[10px] font-bold">Car Gallery</span>
                </button>
                <button onClick={() => setActiveApp('forbes')} className="bg-yellow-600/20 border border-yellow-500/40 p-3 rounded-2xl flex flex-col items-center gap-1 hover:bg-yellow-600/30 transition-all">
                  <span className="text-2xl">👑</span>
                  <span className="text-[10px] font-bold">Forbes TR</span>
                </button>
              </div>

              <div className="mt-4 p-4 bg-slate-800/50 rounded-2xl border border-slate-700">
                <p className="text-xs font-bold text-slate-300">Active Job: {currentJob || 'Unemployed (İşsiz)'}</p>
                <button onClick={() => updateEnergy(1000)} className="mt-3 w-full bg-slate-700 hover:bg-slate-600 text-xs font-bold py-2.5 rounded-xl">
                  İç Çayı (+ Energy)
                </button>
              </div>
            </div>
          )}

          {activeApp === 'bank' && (
            <div className="space-y-4">
              <button onClick={() => setActiveApp('home')} className="text-xs text-red-400 font-bold mb-2">← Back to Home</button>
              <div className="bg-gradient-to-r from-red-600 to-red-800 p-5 rounded-2xl shadow-lg">
                <p className="text-[10px] uppercase font-bold text-red-200">Ziraat Bankası Account</p>
                <p className="text-2xl font-black mt-1">{playerData.money.toLocaleString()} ₺</p>
                <p className="text-[10px] text-red-100 mt-2">Weekly Rent Due: {playerData.rent.toLocaleString()} ₺ / wk</p>
              </div>
              <button onClick={() => updateWallet(100000)} className="w-full bg-slate-800 hover:bg-slate-700 p-3 rounded-xl text-xs font-bold border border-slate-700">
                + Top Up Wallet (100k ₺ Simulation)
              </button>
            </div>
          )}

          {activeApp === 'career' && (
            <div className="space-y-4">
              <button onClick={() => setActiveApp('home')} className="text-xs text-red-400 font-bold mb-2">← Back to Home</button>
              <h4 className="text-sm font-black mb-3">Available Positions</h4>
              <div className="space-y-3">
                {jobs.map(j => (
                  <div key={j.id} className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700 flex justify-between items-center">
                    <div>
                      <p className="text-xs font-bold">{j.title}</p>
                      <p className="text-[10px] text-slate-400">{j.desc}</p>
                      <p className="text-[10px] text-emerald-400 font-bold mt-1">{j.salary.toLocaleString()} ₺ / shift</p>
                    </div>
                    <button onClick={() => { setCurrentJob(j.title); alert(`Hired as ${j.title}!`); }} className="bg-red-600 hover:bg-red-500 px-3 py-2 rounded-xl text-[10px] font-bold">
                      Apply
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeApp === 'stocks' && (
            <div className="space-y-4">
              <button onClick={() => setActiveApp('home')} className="text-xs text-red-400 font-bold mb-2">← Back to Home</button>
              <h4 className="text-sm font-black mb-3">BIST 100 & Crypto Market</h4>
              <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700 flex justify-between items-center">
                <div>
                  <p className="text-xs font-bold">THYAO (Turkish Airlines)</p>
                  <p className="text-[10px] text-emerald-400">+4.20% Today</p>
                </div>
                <span className="text-xs font-bold">298.50 ₺</span>
              </div>
              <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700 flex justify-between items-center">
                <div>
                  <p className="text-xs font-bold">GARAN (Garanti BBVA)</p>
                  <p className="text-[10px] text-red-400">-1.15% Today</p>
                </div>
                <span className="text-xs font-bold">114.20 ₺</span>
              </div>
            </div>
          )}

          {activeApp === 'market' && (
            <div className="space-y-4">
              <button onClick={() => setActiveApp('home')} className="text-xs text-red-400 font-bold mb-2">← Back to Home</button>
              <h4 className="text-sm font-black mb-3">🛒 BİM / Migros Market</h4>
              <div className="space-y-2.5">
                {marketItems.map(item => (
                  <div key={item.id} className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{item.icon}</span>
                      <div>
                        <p className="text-xs font-bold">{item.name}</p>
                        <p className="text-[10px] text-emerald-400 font-bold">+{item.energy} Energy</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => {
                        if (playerData.money < item.cost) {
                          alert("Yetersiz bakiye!");
                          return;
                        }
                        updateWallet(-item.cost);
                        updateEnergy(item.energy);
                        alert(`Purchased ${item.name}!`);
                      }} 
                      className="bg-amber-600 hover:bg-amber-500 px-3 py-2 rounded-xl text-[10px] font-bold"
                    >
                      {item.cost} ₺
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeApp === 'lcw' && (
            <div className="space-y-4">
              <button onClick={() => setActiveApp('home')} className="text-xs text-red-400 font-bold mb-2">← Back to Home</button>
              <h4 className="text-sm font-black mb-3">🛍️ LC Waikiki Boutique</h4>
              <div className="space-y-2.5">
                {lcwItems.map(item => (
                  <div key={item.id} className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{item.icon}</span>
                      <div>
                        <p className="text-xs font-bold">{item.name}</p>
                        <p className="text-[10px] text-blue-400 font-bold">Style & Happiness Boost</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => {
                        if (playerData.money < item.cost) {
                          alert("Yetersiz bakiye!");
                        } else {
                          updateWallet(-item.cost);
                          alert(`Bought ${item.name} from LC Waikiki!`);
                        }
                      }} 
                      className="bg-blue-600 hover:bg-blue-500 px-3 py-2 rounded-xl text-[10px] font-bold"
                    >
                      {item.cost} ₺
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeApp === 'houses' && (
            <div className="space-y-4">
              <button onClick={() => setActiveApp('home')} className="text-xs text-red-400 font-bold mb-2">← Back to Home</button>
              <h4 className="text-sm font-black mb-3">🏠 Real Estate Agency</h4>
              <div className="space-y-2.5">
                {houses.map(h => (
                  <div key={h.id} className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700 flex justify-between items-center">
                    <div>
                      <p className="text-xs font-bold">{h.name}</p>
                      <p className="text-[10px] text-slate-400">{h.desc}</p>
                      <p className="text-[10px] text-red-400 font-bold mt-1">{h.rent.toLocaleString()} ₺ / week</p>
                    </div>
                    <button onClick={() => alert(`Moved into ${h.name}!`)} className="bg-indigo-600 hover:bg-indigo-500 px-3 py-2 rounded-xl text-[10px] font-bold">
                      Rent
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeApp === 'cars' && (
            <div className="space-y-4">
              <button onClick={() => setActiveApp('home')} className="text-xs text-red-400 font-bold mb-2">← Back to Home</button>
              <h4 className="text-sm font-black mb-3">🚗 Car Showroom</h4>
              <div className="space-y-2.5">
                {cars.map(c => (
                  <div key={c.id} className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{c.icon}</span>
                      <div>
                        <p className="text-xs font-bold">{c.name}</p>
                        <p className="text-[10px] text-slate-400">{c.desc}</p>
                        <p className="text-[10px] text-cyan-400 font-bold mt-1">{c.cost.toLocaleString()} ₺</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => {
                        if (playerData.money < c.cost) {
                          alert("Yetersiz bakiye!");
                        } else {
                          updateWallet(-c.cost);
                          alert(`Congratulations on your new ${c.name}!`);
                        }
                      }} 
                      className="bg-cyan-600 hover:bg-cyan-500 px-3 py-2 rounded-xl text-[10px] font-bold"
                    >
                      Buy
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeApp === 'forbes' && (
            <div className="space-y-4">
              <button onClick={() => setActiveApp('home')} className="text-xs text-red-400 font-bold mb-2">← Back to Home</button>
              <div className="bg-gradient-to-r from-yellow-600 to-amber-700 p-4 rounded-2xl text-center mb-3">
                <h4 className="text-sm font-black">👑 FORBES TÜRKİYE</h4>
                <p className="text-[10px] text-amber-200">The Richest Citizens in Türkiye Hayatı</p>
              </div>
              <div className="space-y-2.5">
                {forbesList.map(f => (
                  <div key={f.rank} className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-black text-yellow-400">#{f.rank}</span>
                      <div>
                        <p className="text-xs font-bold">{f.name}</p>
                        <p className="text-[10px] text-slate-400">{f.title}</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-emerald-400">{f.netWorth}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Phone Bar */}
        <div className="py-3 bg-slate-950 flex justify-center border-t border-slate-800">
          <div className="w-32 h-1 bg-slate-700 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}