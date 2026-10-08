'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { createClient } from '@supabase/supabase-js';
import ChatModal from './ChatModal';
import Onboarding from './Onboarding';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey) : null;

type Tab = 'home' | 'map' | 'phone';

const TurkeyMap3D = dynamic(() => import('./TurkeyMap3D'), { ssr: false });

export default function GameHome() {
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [isPhoneOpen, setIsPhoneOpen] = useState<boolean>(false);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [language, setLanguage] = useState<'en' | 'tr'>('en');
  
  const [player, setPlayer] = useState({
    username: '@istanbul_boss',
    money: 5000000, 
    health: 10000, 
    happiness: 8500, 
    energy: 7500, 
    hunger: 6000,
    hygiene: 8000,
    location: 'kadikoy',
    rent: 5000
  });

  useEffect(() => {
    if (supabase && gameStarted) {
      supabase.from('turkiye_players').upsert({
        username: player.username,
        data: player,
        updated_at: new Date()
      }).then(({ error }) => {
        if (error) console.log('Sync note:', error.message);
      });
    }
  }, [player, gameStarted]);

  const content = {
    en: {
      homeTab: 'Home',
      mapTab: 'Map',
      phoneTab: 'Phone',
      rentLabel: 'Rent',
      week: 'week',
      health: 'Health',
      energy: 'Energy',
      hunger: 'Hunger',
      hygiene: 'Hygiene',
      travelPrompt: 'Click any venue on the map to interact & travel via İETT / Dolmuş'
    },
    tr: {
      homeTab: 'Ev',
      mapTab: 'Harita',
      phoneTab: 'Telefon',
      rentLabel: 'Kira',
      week: 'hafta',
      health: 'Sağlık',
      energy: 'Enerji',
      hunger: 'Açlık',
      hygiene: 'Hijyen',
      travelPrompt: 'Etkileşime geçmek ve İETT / Dolmuş ile gitmek için haritadaki mekanlara tıkla'
    }
  };

  const t = content[language];

  if (!gameStarted) {
    return (
      <Onboarding 
        onComplete={(onboardingData) => {
          setLanguage(onboardingData.lang || 'en');
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
    if (player.happiness > 8000) return { emoji: '🤩', text: language === 'en' ? 'Blessed' : 'Harika', color: 'text-emerald-500' };
    if (player.happiness > 5000) return { emoji: '😊', text: language === 'en' ? 'Happy' : 'Mutlu', color: 'text-emerald-400' };
    return { emoji: '😐', text: language === 'en' ? 'Okay' : 'Normal', color: 'text-amber-500' };
  };

  const mood = getMood();

  return (
    <main className="min-h-screen bg-[#f0f4f8] text-slate-800 flex flex-col font-sans overflow-hidden relative">
      
      {/* TOP STATUS BAR */}
      <header className="fixed top-4 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-4xl flex justify-between items-center pointer-events-none">
        <div className="bg-white/90 backdrop-blur-md px-4 py-2.5 rounded-full shadow-sm border border-slate-200 flex items-center gap-4 text-xs font-semibold pointer-events-auto">
          <span className="flex items-center gap-1.5 text-slate-600">☀️ Mon 5 - 16:40</span>
          <div className="w-px h-4 bg-slate-300"></div>
          <span className={`flex items-center gap-1.5 ${mood.color}`}>{mood.emoji} {mood.text}</span>
          <div className="w-px h-4 bg-slate-300"></div>
          <span className="flex items-center gap-1.5 text-slate-500">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            123k online
          </span>
        </div>

        <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm border border-slate-200 flex items-center gap-3 pointer-events-auto">
          <span className="font-bold text-slate-800 tracking-tight text-sm">{player.money.toLocaleString()} ₺</span>
          <button className="bg-red-600 hover:bg-red-500 text-white w-7 h-7 rounded-full flex items-center justify-center font-black text-lg transition-transform active:scale-95 shadow-sm">+</button>
        </div>
      </header>

      {/* QUICK SURVIVAL ACTIONS WIDGET */}
      <div className="fixed top-20 left-4 z-40 flex flex-col gap-2 pointer-events-none">
        <div 
          onClick={() => setPlayer(p => ({ ...p, hunger: Math.min(10000, p.hunger + 1500), energy: Math.min(10000, p.energy + 500) }))}
          className="bg-white/90 backdrop-blur-md p-3 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-3 pointer-events-auto w-56 cursor-pointer hover:bg-slate-50 transition-colors"
        >
          <div className="bg-amber-100 w-8 h-8 rounded-full flex items-center justify-center text-xl">🍲</div>
          <div>
            <p className="text-xs font-bold text-slate-800 leading-tight">Yemek Ye / Eat</p>
            <p className="text-[10px] text-slate-500">Restore Hunger & Energy</p>
          </div>
        </div>
        <div 
          onClick={() => setPlayer(p => ({ ...p, hygiene: Math.min(10000, p.hygiene + 2000) }))}
          className="bg-white/90 backdrop-blur-md p-3 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-3 pointer-events-auto w-56 cursor-pointer hover:bg-slate-50 transition-colors"
        >
          <div className="bg-blue-100 w-8 h-8 rounded-full flex items-center justify-center text-xl">🚿</div>
          <div>
            <p className="text-xs font-bold text-slate-800 leading-tight">Duş Al / Fresh Up</p>
            <p className="text-[10px] text-slate-500">Boost Hygiene & Mood</p>
          </div>
        </div>
      </div>

      {/* MAIN VIEWPORT */}
      <div className="flex-1 w-full h-full flex items-center justify-center p-4 pt-24 pb-32">
        {activeTab === 'map' && (
          <div className="bg-white/95 backdrop-blur-xl p-6 rounded-[3rem] shadow-2xl border border-white/20 max-w-4xl w-full flex flex-col items-center relative">
            <div className="text-center mb-3">
              <span className="bg-red-100 text-red-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Türkiye Hayatı Map</span>
              <h2 className="text-2xl font-black text-slate-800 mt-1">Istanbul & Ankara City Grid</h2>
              <p className="text-xs text-slate-500">{t.travelPrompt}</p>
            </div>

            <div className="w-full h-[420px] bg-gradient-to-b from-slate-900 to-slate-800 rounded-3xl overflow-hidden shadow-2xl border-4 border-white relative mb-4">
              <TurkeyMap3D />
            </div>
          </div>
        )}

        {activeTab === 'home' && (
          <div className="bg-white/95 backdrop-blur-xl p-8 rounded-[3rem] shadow-2xl border border-white/20 max-w-lg w-full text-center">
            <div className="w-20 h-20 bg-red-600 rounded-3xl mx-auto flex items-center justify-center text-4xl shadow-lg mb-4 text-white">🏠</div>
            <h2 className="text-2xl font-black text-slate-800">Residence Room</h2>
            <p className="text-xs text-slate-500 mt-1">{t.rentLabel}: {player.rent.toLocaleString()} ₺ / {t.week}</p>
            <div className="mt-6 p-4 bg-slate-50 rounded-2xl border border-slate-200 text-left space-y-3">
              <p className="text-xs font-bold text-slate-700">Username: {player.username}</p>
              <div>
                <div className="flex justify-between text-[11px] font-bold text-slate-600 mb-1">
                  <span>{t.hunger}</span>
                  <span>{player.hunger} / 10000</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full transition-all" style={{ width: `${(player.hunger / 10000) * 100}%` }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[11px] font-bold text-slate-600 mb-1">
                  <span>{t.energy}</span>
                  <span>{player.energy} / 10000</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full transition-all" style={{ width: `${(player.energy / 10000) * 100}%` }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[11px] font-bold text-slate-600 mb-1">
                  <span>{t.hygiene}</span>
                  <span>{player.hygiene} / 10000</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full transition-all" style={{ width: `${(player.hygiene / 10000) * 100}%` }}></div>
                </div>
              </div>
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
            <span className="text-[10px] font-medium">{t.homeTab}</span>
          </button>

          <button 
            onClick={() => setActiveTab('map')}
            className={`flex flex-col items-center justify-center w-20 h-14 rounded-full transition-colors ${activeTab === 'map' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-100'}`}
          >
            <span className="text-[10px] font-medium">{t.mapTab}</span>
          </button>

          <button 
            onClick={() => setIsPhoneOpen(true)}
            className={`flex flex-col items-center justify-center w-20 h-14 rounded-full transition-colors ${isPhoneOpen ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-100'}`}
          >
            <span className="text-[10px] font-medium">{t.phoneTab}</span>
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