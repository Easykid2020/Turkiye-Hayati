'use client';

import { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { createClient } from '@supabase/supabase-js';
import ChatModal from './ChatModal';
import Onboarding from './Onboarding';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey) : null;

type Tab = 'home' | 'map' | 'phone';

function TürkiyeMapScene({ onSelectVenue }: { onSelectVenue: (venue: any) => void }) {
  const venues = [
    { id: 'mosque', name: 'Sultanahmet / Kocatepe Cami', type: 'Faith & Peace', icon: '🕌', pos: [-5, 0, -3], color: '#059669' },
    { id: 'market', name: 'BİM / Migros Market', type: 'Shopping & Groceries', icon: '🛒', pos: [2, 0, -3], color: '#f59e0b' },
    { id: 'lc_waikiki', name: 'LC Waikiki Boutique', type: 'Fashion & Clothing', icon: '🛍️', pos: [5, 0, 2], color: '#3b82f6' },
    { id: 'cay_ocagi', name: 'Sokak Çay Ocağı', type: 'Social & Chill', icon: '☕', pos: [-2, 0, 2], color: '#dc2626' },
    { id: 'metro', name: 'İETT / Metro Station', type: 'Public Transit', icon: '🚇', pos: [-5, 0, 3], color: '#475569' },
  ];

  return (
    <group position={[0, -1, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[28, 20]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.9} />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <planeGeometry args={[24, 3]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <planeGeometry args={[3, 18]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>

      {venues.map((v) => (
        <group key={v.id} position={v.pos as [number, number, number]} onClick={() => onSelectVenue(v)}>
          <mesh position={[0, 0.7, 0]}>
            <boxGeometry args={[1.6, 1.4, 1.6]} />
            <meshStandardMaterial color={v.color} roughness={0.3} />
          </mesh>
          <mesh position={[0, 1.45, 0]}>
            <boxGeometry args={[1.8, 0.2, 1.8]} />
            <meshStandardMaterial color="#0f172a" />
          </mesh>
        </group>
      ))}
    </group>
  );
}

export default function GameHome() {
  const [activeTab, setActiveTab] = useState<Tab>('map');
  const [isPhoneOpen, setIsPhoneOpen] = useState<boolean>(false);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [language, setLanguage] = useState<'en' | 'tr'>('en');
  const [selectedVenue, setSelectedVenue] = useState<any>(null);
  
  const [player, setPlayer] = useState({
    username: '@istanbul_boss',
    money: 5000000, 
    health: 10000, 
    happiness: 8500, 
    energy: 10000, 
    location: 'kadikoy',
    rent: 5000
  });

  // Supabase Cloud Sync Effect
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
              <Canvas camera={{ position: [8, 10, 10], fov: 45 }}>
                <ambientLight intensity={1.2} />
                <directionalLight position={[10, 20, 10]} intensity={1.5} />
                <TürkiyeMapScene onSelectVenue={(v) => setSelectedVenue(v)} />
                <OrbitControls enableZoom={true} enablePan={true} maxPolarAngle={Math.PI / 2.2} />
              </Canvas>
              
              <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-md text-white text-[11px] font-semibold px-4 py-2 rounded-xl shadow-lg border border-white/10 pointer-events-none flex items-center gap-2">
                🏛️ Click any building block on the map to interact
              </div>
            </div>

            {selectedVenue && (
              <div className="absolute inset-x-4 bottom-16 bg-white p-6 rounded-3xl shadow-2xl border-2 border-slate-200 z-50 flex flex-col items-center text-center animate-fade-in max-w-lg mx-auto">
                <span className="text-4xl mb-2">{selectedVenue.icon}</span>
                <h3 className="text-xl font-black text-slate-800">{selectedVenue.name}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{selectedVenue.type}</p>
                <div className="flex gap-3 w-full mt-4">
                  <button onClick={() => setSelectedVenue(null)} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl text-xs">
                    Close
                  </button>
                  <button onClick={() => { alert(`Visited ${selectedVenue.name}!`); setSelectedVenue(null); }} className="flex-1 bg-red-600 hover:bg-red-500 text-white font-bold py-3 rounded-xl text-xs shadow-md">
                    Enter / Visit (15 ₺)
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'home' && (
          <div className="bg-white/95 backdrop-blur-xl p-8 rounded-[3rem] shadow-2xl border border-white/20 max-w-lg w-full text-center">
            <div className="w-20 h-20 bg-red-600 rounded-3xl mx-auto flex items-center justify-center text-4xl shadow-lg mb-4 text-white">🏠</div>
            <h2 className="text-2xl font-black text-slate-800">Residence Room</h2>
            <p className="text-xs text-slate-500 mt-1">{t.rentLabel}: {player.rent.toLocaleString()} ₺ / {t.week}</p>
            <div className="mt-6 p-4 bg-slate-50 rounded-2xl border border-slate-200 text-left space-y-2">
              <p className="text-xs font-bold text-slate-700">Username: {player.username}</p>
              <p className="text-xs font-bold text-slate-700">{t.health}: {player.health} / 10000</p>
              <p className="text-xs font-bold text-slate-700">{t.energy}: {player.energy} / 10000</p>
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