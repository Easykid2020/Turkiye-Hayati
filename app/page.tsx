'use client';

import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import ChatModal from './ChatModal';
import Onboarding from './Onboarding';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey) : null;

type Language = 'en' | 'tr';
type Tab = 'home' | 'map' | 'phone';
type TileType = 'road' | 'grass' | 'house' | 'shop' | 'club' | 'mosque' | 'hospital' | 'office' | 'estate' | 'airport' | 'cafe' | 'gym';

export default function GameHome() {
  const [lang, setLang] = useState<Language>('tr');
  const [activeTab, setActiveTab] = useState<Tab>('map');
  const [isPhoneOpen, setIsPhoneOpen] = useState<boolean>(false);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  
  const [player, setPlayer] = useState({
    money: 5000000, 
    health: 10000, 
    happiness: 8500, 
    energy: 10000, 
    location: 'Istanbul',
    x: 0, 
    y: 0
  });

  if (!gameStarted) {
    return (
      <Onboarding 
        onComplete={(onboardingData) => {
          setPlayer(prev => ({
            ...prev,
            money: onboardingData.money,
            location: onboardingData.location
          }));
          setGameStarted(true);
        }} 
      />
    );
  }

  const getMood = () => {
    if (player.happiness > 8000) return { emoji: '🤩', text: 'Blessed', color: 'text-emerald-500' };
    if (player.happiness > 5000) return { emoji: '😊', text: 'Happy', color: 'text-emerald-400' };
    if (player.happiness > 2000) return { emoji: '😐', text: 'Okay', color: 'text-amber-500' };
    return { emoji: '😩', text: 'Stressed', color: 'text-rose-500' };
  };

  const mood = getMood();

  const cityMap: TileType[][] = [
    ['house', 'road', 'shop', 'road', 'estate', 'grass', 'grass', 'road'],
    ['grass', 'road', 'road', 'road', 'cafe', 'road', 'hospital', 'road'],
    ['club', 'road', 'mosque', 'road', 'office', 'road', 'grass', 'road'],
    ['grass', 'road', 'gym', 'road', 'airport', 'road', 'shop', 'road'],
  ];

  const tileIcons: Record<TileType, string> = {
    road: '', grass: '🌳', house: '🏠', shop: '🛒', 
    club: '🪩', mosque: '🕌', hospital: '🏥', office: '💼', 
    estate: '🏢', airport: '✈️', cafe: '☕', gym: '🏋️'
  };

  const tileColors: Record<TileType, string> = {
    road: 'bg-[#e5e7eb]', grass: 'bg-[#dcfce7]', house: 'bg-blue-100', shop: 'bg-amber-100', 
    club: 'bg-fuchsia-100', mosque: 'bg-indigo-100', hospital: 'bg-rose-100', office: 'bg-slate-200', 
    estate: 'bg-teal-100', airport: 'bg-zinc-200', cafe: 'bg-orange-100', gym: 'bg-red-100'
  };

  return (
    <main className="min-h-screen bg-[#f0f4f8] text-slate-800 flex flex-col font-sans overflow-hidden relative">
      
      {/* FLOATING TOP STATUS BAR */}
      <header className="fixed top-4 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-4xl flex justify-between items-center pointer-events-none">
        <div className="bg-white/90 backdrop-blur-md px-4 py-2.5 rounded-full shadow-sm border border-slate-200 flex items-center gap-4 text-xs font-semibold pointer-events-auto">
          <span className="flex items-center gap-1.5 text-slate-600">
            ☀️ Mon 5 - 4:40 PM
          </span>
          <div className="w-px h-4 bg-slate-300"></div>
          <span className={`flex items-center gap-1.5 ${mood.color}`}>
            {mood.emoji} {mood.text}
          </span>
          <div className="w-px h-4 bg-slate-300"></div>
          <span className="flex items-center gap-1.5 text-slate-500">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            123k online
          </span>
        </div>

        <div className="bg-white/90 backdrop-blur-md px-2 py-1.5 rounded-full shadow-sm border border-slate-200 flex items-center gap-3 pointer-events-auto">
          <span className="pl-3 font-bold text-slate-800 tracking-tight">
            {player.money.toLocaleString()} ₺
          </span>
          <button className="bg-emerald-500 hover:bg-emerald-400 text-white w-7 h-7 rounded-full flex items-center justify-center font-black text-lg transition-transform active:scale-95 shadow-sm">
            +
          </button>
        </div>
      </header>

      {/* LEFT SIDE ACTION QUEUE */}
      <div className="fixed top-20 left-4 z-40 flex flex-col gap-2 pointer-events-none">
        <div className="bg-white/90 backdrop-blur-md p-3 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-3 pointer-events-auto w-48 cursor-pointer hover:bg-slate-50 transition-colors">
          <div className="bg-emerald-100 w-8 h-8 rounded-full flex items-center justify-center text-xl">🍽️</div>
          <div>
            <p className="text-xs font-bold text-slate-800 leading-tight">Yemek Ye</p>
            <p className="text-[10px] text-slate-500">Kafeye veya markete git</p>
          </div>
        </div>
      </div>

      {/* MAIN GAME CANVAS */}
      <div className="flex-1 w-full h-full flex items-center justify-center p-4 pt-24 pb-32">
        <div className="bg-white p-8 rounded-[3rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-white relative overflow-hidden transform perspective-1000 rotateX-12">
           <div className="flex flex-col gap-1 items-center">
            {cityMap.map((row, y) => (
              <div key={y} className="flex gap-1">
                {row.map((tile, x) => {
                  const isPlayerHere = player.x === x && player.y === y;
                  return (
                    <div 
                      key={`${x}-${y}`} 
                      className={`w-20 h-20 md:w-24 md:h-24 flex flex-col items-center justify-center ${tileColors[tile]} ${tile === 'road' ? '' : 'rounded-2xl shadow-sm border border-black/5'} transition-all cursor-pointer hover:brightness-95`}
                    >
                      <span className="text-3xl filter drop-shadow-sm">{tileIcons[tile]}</span>
                      {isPlayerHere && (
                        <div className="absolute -mt-10 bg-white px-2 py-1 rounded-full shadow-lg border border-slate-200 flex items-center gap-1 z-10 animate-bounce">
                           <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                           <span className="text-[10px] font-bold text-slate-800">Sen</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* BOTTOM NAVIGATION DOCK */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
        <div className="bg-white/95 backdrop-blur-xl px-2 py-2 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-200 flex items-center gap-2">
          
          <button 
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center justify-center w-20 h-14 rounded-full transition-colors ${activeTab === 'home' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-100'}`}
          >
            <svg className="w-6 h-6 mb-0.5" fill={activeTab === 'home' ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
            <span className="text-[10px] font-medium">Ev</span>
          </button>

          <button 
            onClick={() => setActiveTab('map')}
            className={`flex flex-col items-center justify-center w-20 h-14 rounded-full transition-colors ${activeTab === 'map' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-100'}`}
          >
            <svg className="w-6 h-6 mb-0.5" fill={activeTab === 'map' ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path></svg>
            <span className="text-[10px] font-medium">Harita</span>
          </button>

          <button 
            onClick={() => setIsPhoneOpen(true)}
            className={`flex flex-col items-center justify-center w-20 h-14 rounded-full transition-colors ${isPhoneOpen ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-100'}`}
          >
            <svg className="w-5 h-5 mb-1" fill={isPhoneOpen ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
            <span className="text-[10px] font-medium">Telefon</span>
          </button>

        </div>
      </div>

      {isPhoneOpen && (
        <ChatModal 
          onClose={() => setIsPhoneOpen(false)} 
          playerData={player}
          updateWallet={(amount: number) => setPlayer(p => ({ ...p, money: p.money + amount }))}
          updateEnergy={(amount: number) => setPlayer(p => ({ ...p, energy: Math.max(0, p.energy + amount) }))}
        />
      )}
    </main>
  );
}