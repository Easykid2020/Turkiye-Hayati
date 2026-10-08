'use client';

import React, { useState } from 'react';

export default function ChatModal({ onClose, playerData, updateWallet, updateEnergy }: any) {
  const [activeApp, setActiveApp] = useState<'home' | 'bank' | 'career' | 'stocks'>('home');
  const [jobs] = useState([
    { id: 'intern', title: 'Computer Engineering Intern', salary: 15000, desc: 'Coding, Verilog & debugging at Teknopark' },
    { id: 'barista', title: 'Kadıköy Barista', salary: 8000, desc: 'Make Turkish coffee & serve locals' },
    { id: 'courier', title: 'Getir / Trendyol Courier', salary: 12000, desc: 'Fast scooter deliveries across the district' }
  ]);
  const [currentJob, setCurrentJob] = useState<string | null>(null);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 w-full max-w-sm h-[650px] rounded-[3rem] shadow-2xl border-4 border-slate-700 flex flex-col overflow-hidden relative text-white">
        
        {/* Phone Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl z-20 flex items-center justify-center">
          <div className="w-12 h-1 bg-slate-800 rounded-full"></div>
        </div>

        {/* Phone Header */}
        <div className="pt-8 px-6 pb-4 bg-slate-950 flex justify-between items-center border-b border-slate-800">
          <span className="text-xs font-bold text-red-500">Ziraat & VakıfBank OS</span>
          <button onClick={onClose} className="bg-slate-800 hover:bg-slate-700 w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center">✕</button>
        </div>

        {/* App Content Screen */}
        <div className="flex-1 p-6 overflow-y-auto">
          {activeApp === 'home' && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h3 className="text-lg font-black">{playerData.username}</h3>
                <p className="text-xs text-slate-400">Net Worth: {playerData.money.toLocaleString()} ₺</p>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <button onClick={() => setActiveApp('bank')} className="bg-red-600/20 border border-red-500/40 p-4 rounded-2xl flex flex-col items-center gap-2 hover:bg-red-600/30 transition-all">
                  <span className="text-2xl">🏛️</span>
                  <span className="text-xs font-bold">Ziraat Bank</span>
                </button>
                <button onClick={() => setActiveApp('career')} className="bg-blue-600/20 border border-blue-500/40 p-4 rounded-2xl flex flex-col items-center gap-2 hover:bg-blue-600/30 transition-all">
                  <span className="text-2xl">💼</span>
                  <span className="text-xs font-bold">Career Hub</span>
                </button>
                <button onClick={() => setActiveApp('stocks')} className="bg-emerald-600/20 border border-emerald-500/40 p-4 rounded-2xl flex flex-col items-center gap-2 hover:bg-emerald-600/30 transition-all">
                  <span className="text-2xl">📈</span>
                  <span className="text-xs font-bold">BIST Stocks</span>
                </button>
              </div>

              <div className="mt-6 p-4 bg-slate-800/50 rounded-2xl border border-slate-700">
                <p className="text-xs font-bold text-slate-300">Active Job: {currentJob || 'Unemployed (İşsiz)'}</p>
                <button onClick={() => updateEnergy(1000)} className="mt-3 w-full bg-slate-700 hover:bg-slate-600 text-xs font-bold py-2.5 rounded-xl">
                  Drink Turkish Tea (+ Energy)
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
        </div>

        {/* Bottom Phone Bar */}
        <div className="py-3 bg-slate-950 flex justify-center border-t border-slate-800">
          <div className="w-32 h-1 bg-slate-700 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}