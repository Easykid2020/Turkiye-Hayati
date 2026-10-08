'use client';

import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import ChatModal from './ChatModal';
import Onboarding from './Onboarding';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey) : null;

type Tab = 'home' | 'map' | 'phone';
type LocationType = {
  id: string;
  name: string;
  district: string;
  icon: string;
  desc: string;
  color: string;
};

export default function GameHome() {
  const [activeTab, setActiveTab] = useState<Tab>('map');
  const [isPhoneOpen, setIsPhoneOpen] = useState<boolean>(false);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  
  const [player, setPlayer] = useState({
    username: '@istanbul_boss',
    money: 5000000, 
    health: 10000, 
    happiness: 8500, 
    energy: 10000, 
    location: 'kadikoy',
    rent: 5000
  });

  // Locations across Türkiye
  const locations: LocationType[] = [
    { id: 'kadikoy', name: 'Kadıköy Sahil', district: 'İstanbul', icon: '⛵', desc: 'Deniz havası, sokak müzisyenleri ve kafeler.', color: 'bg-blue-100 border-blue-300' },
    { id: 'besiktas', name: 'Beşiktaş Çarşı', district: 'İstanbul', icon: '🦅', desc: 'Kartal heykeli önü, sokak lezzetleri ve kalabalık.', color: 'bg-red-100 border-red-300' },
    { id: 'kizilay', name: 'Kızılay Meydanı', district: 'Ankara', icon: '🚇', desc: 'Başkentin kalbi, Güvenpark ve buluşma noktası.', color: 'bg-amber-100 border-amber-300' },
    { id: 'bagcilar', name: 'Bağcılar Sokak', district: 'İstanbul', icon: '🛵', desc: 'Sokak kültürü, ucuz kira ve hızlı hustle.', color: 'bg-slate-200 border-slate-400' },
  ];

  if (!gameStarted) {
    return (
      <Onboarding 
        onComplete={(onboardingData) => {
          setPlayer(prev => ({
            ...prev,
            username: `@${onboardingData.username}`,
            money: onboardingData.money,
            location: onboardingData.location,
            rent: onboardingData.rent
          }));
          setGameStarted(true);
        }} 
      />
    );
  }

  const getMood = () => {
    if (player.happiness > 8000) return { emoji: '🤩', text: 'Blessed', color: 'text-emerald-500' };
    if (player.happiness > 5000) return { emoji: '😊', text: 'Happy', color: 'text-emerald-400' };
    return { emoji: '😐', text: 'Okay', color: 'text-amber-500' };
  };

  const mood = getMood();
  const currentLocation = locations.find(l => l.id === player.location) || locations[0];

  return (
    <main className="min-h-screen bg-[#f0f4f8] text-slate-800 flex flex-col font-sans overflow-hidden relative">
      
      {/* FLOATING TOP STATUS BAR */}
      <header className="fixed top-4 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-4xl flex justify-between items-center pointer-events-none">
        <div className="bg-white/90 backdrop-blur-md px-4 py-2.5 rounded-full shadow-sm border border-slate-200 flex items-center gap-4 text-xs font-semibold pointer-events-auto">
          <span className="flex items-center gap-1.5 text-slate-600">
            ☀️ Pzt 5 - 16:40
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

        <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm border border-slate-200 flex items-center gap-3 pointer-events-auto">
          <span className="font-bold text-slate-800 tracking-tight text-sm">
            {player.money.toLocaleString()} ₺
          </span>
          <button className="bg-red-600 hover:bg-red-500 text-white w-7 h-7 rounded-full flex items-center justify-center font-black text-lg transition-transform active:scale-95 shadow-sm">
            +
          </button>
        </div>
      </header>

      {/* LEFT SIDE ACTION QUEUE */}
      <div className="fixed top-20 left-4 z-40 flex flex-col gap-2 pointer-events-none">
        <div className="bg-white/90 backdrop-blur-md p-3 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-3 pointer-events-auto w-52 cursor-pointer hover:bg-slate-50 transition-colors">
          <div className="bg-red-100 w-8 h-8 rounded-full flex items-center justify-center text-xl">🍽️</div>
          <div>
            <p className="text-xs font-bold text-slate-800 leading-tight">Döner Ye</p>
            <p className="text-[10px] text-slate-500">Açlığını gider, enerji topla</p>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 w-full h-full flex items-center justify-center p-4 pt-24 pb-32">
        {activeTab === 'map' && (
          <div className="bg-white/80 backdrop-blur-md p-8 rounded-[3rem] shadow-xl border border-white max-w-2xl w-full flex flex-col items-center">
            <div className="text-center mb-6">
              <span className="bg-red-100 text-red-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Aktif Konum</span>
              <h2 className="text-3xl font-black text-slate-800 mt-2">{currentLocation.name}</h2>
              <p className="text-sm text-slate-500">{currentLocation.desc}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              {locations.map(loc => (
                <button
                  key={loc.id}
                  onClick={() => setPlayer(p => ({ ...p, location: loc.id }))}
                  className={`p-4 rounded-2xl border-2 transition-all flex items-center gap-4 text-left ${player.location === loc.id ? 'border-red-600 bg-red-50 shadow-md' : 'border-slate-100 bg-white hover:border-slate-300'}`}
                >
                  <span className="text-3xl">{loc.icon}</span>
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm">{loc.name}</h3>
                    <p className="text-[11px] text-slate-500">{loc.district}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'home' && (
          <div className="bg-white/80 backdrop-blur-md p-8 rounded-[3rem] shadow-xl border border-white max-w-lg w-full text-center">
            <div className="w-20 h-20 bg-red-600 rounded-3xl mx-auto flex items-center justify-center text-4xl shadow-lg mb-4">🏠</div>
            <h2 className="text-2xl font-black text-slate-800">Ev Sahnesi</h2>
            <p className="text-xs text-slate-500 mt-1">Kira: {player.rent.toLocaleString()} ₺ / hafta</p>
            <div className="mt-6 p-4 bg-slate-50 rounded-2xl border border-slate-200 text-left space-y-2">
              <p className="text-xs font-bold text-slate-700">Kullanıcı: {player.username}</p>
              <p className="text-xs font-bold text-slate-700">Sağlık: {player.health} / 10000</p>
              <p className="text-xs font-bold text-slate-700">Enerji: {player.energy} / 10000</p>
            </div>
          </div>
        )}
      </div>

      {/* BOTTOM NAVIGATION DOCK */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
        <div className="bg-white/95 backdrop-blur-xl px-2 py-2 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-200 flex items-center gap-2">
          
          <button 
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center justify-center w-20 h-14 rounded-full transition-colors ${activeTab === 'home' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-100'}`}
          >
            <svg className="w-5 h-5 mb-0.5" fill={activeTab === 'home' ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
            <span className="text-[10px] font-medium">Ev</span>
          </button>

          <button 
            onClick={() => setActiveTab('map')}
            className={`flex flex-col items-center justify-center w-20 h-14 rounded-full transition-colors ${activeTab === 'map' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-100'}`}
          >
            <svg className="w-5 h-5 mb-0.5" fill={activeTab === 'map' ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path></svg>
            <span className="text-[10px] font-medium">Harita</span>
          </button>

          <button 
            onClick={() => setIsPhoneOpen(true)}
            className={`flex flex-col items-center justify-center w-20 h-14 rounded-full transition-colors ${isPhoneOpen ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-100'}`}
          >
            <svg className="w-5 h-5 mb-0.5" fill={isPhoneOpen ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
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