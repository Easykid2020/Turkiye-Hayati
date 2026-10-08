'use client';

import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { createClient } from '@supabase/supabase-js';
import ChatModal from './ChatModal';
import Onboarding from './Onboarding';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey) : null;

type Tab = 'home' | 'map' | 'phone';

function CityWorldMap({ currentLocation, onSelectLocation }: { currentLocation: string, onSelectLocation: (id: string) => void }) {
  return (
    <group position={[0, -1, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color="#cbd5e1" />
      </mesh>

      <group position={[-3, 0, -3]} onClick={() => onSelectLocation('kadikoy')}>
        <mesh position={[0, 0.5, 0]}>
          <boxGeometry args={[3, 1, 3]} />
          <meshStandardMaterial color={currentLocation === 'kadikoy' ? '#dc2626' : '#3b82f6'} />
        </mesh>
      </group>

      <group position={[3, 0, -3]} onClick={() => onSelectLocation('kizilay')}>
        <mesh position={[0, 0.7, 0]}>
          <boxGeometry args={[3, 1.4, 3]} />
          <meshStandardMaterial color={currentLocation === 'kizilay' ? '#dc2626' : '#f59e0b'} />
        </mesh>
        <mesh position={[0, 1.8, 0]}>
          <boxGeometry args={[2.2, 0.8, 0.2]} />
          <meshStandardMaterial color="#111827" />
        </mesh>
      </group>

      <group position={[-3, 0, 3]} onClick={() => onSelectLocation('besiktas')}>
        <mesh position={[0, 0.6, 0]}>
          <boxGeometry args={[3, 1.2, 3]} />
          <meshStandardMaterial color={currentLocation === 'besiktas' ? '#dc2626' : '#10b981'} />
        </mesh>
      </group>

      <group position={[3, 0, 3]} onClick={() => onSelectLocation('bagcilar')}>
        <mesh position={[0, 0.4, 0]}>
          <boxGeometry args={[3, 0.8, 3]} />
          <meshStandardMaterial color={currentLocation === 'bagcilar' ? '#dc2626' : '#64748b'} />
        </mesh>
      </group>
    </group>
  );
}

export default function GameHome() {
  const [activeTab, setActiveTab] = useState<Tab>('map');
  const [isPhoneOpen, setIsPhoneOpen] = useState<boolean>(false);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [language, setLanguage] = useState<'en' | 'tr'>('en');
  
  const [player, setPlayer] = useState({
    username: '@istanbul_boss',
    money: 5000000, 
    health: 10000, 
    happiness: 8500, 
    energy: 10000, 
    location: 'kadikoy',
    rent: 5000
  });

  const content = {
    en: {
      activeLocation: 'ACTIVE DISTRICT',
      eatFood: 'Eat Döner',
      eatDesc: 'Satisfy hunger & gain energy',
      homeTab: 'Home',
      mapTab: '3D Map',
      phoneTab: 'Phone',
      rentLabel: 'Rent',
      week: 'week',
      health: 'Health',
      energy: 'Energy',
      transitBtn: 'Take İETT Bus / Dolmuş (15 ₺)'
    },
    tr: {
      activeLocation: 'AKTİF BÖLGE',
      eatFood: 'Döner Ye',
      eatDesc: 'Açlığını gider, enerji topla',
      homeTab: 'Ev',
      mapTab: '3D Harita',
      phoneTab: 'Telefon',
      rentLabel: 'Kira',
      week: 'hafta',
      health: 'Sağlık',
      energy: 'Enerji',
      transitBtn: 'İETT Otobüsü / Dolmuşuna Bin (15 ₺)'
    }
  };

  const t = content[language];

  const locations = [
    { id: 'kadikoy', name: 'Kadıköy Sahil', district: 'Istanbul', icon: '⛵', desc: { en: 'Sea breeze, street musicians, and cafes.', tr: 'Deniz havası, sokak müzisyenleri ve kafeler.' } },
    { id: 'besiktas', name: 'Beşiktaş Çarşı', district: 'Istanbul', icon: '🦅', desc: { en: 'Crowded square, local street food & culture.', tr: 'Kartal heykeli önü, sokak lezzetleri ve kalabalık.' } },
    { id: 'kizilay', name: 'Kızılay Square (Billboard Zone)', district: 'Ankara', icon: '🚇', desc: { en: 'Heart of the capital with custom ad billboards.', tr: 'Başkentin kalbi ve reklam tabelaları.' } },
    { id: 'bagcilar', name: 'Bağcılar Street', district: 'Istanbul', icon: '🛵', desc: { en: 'Hard start, street hustle rules apply.', tr: 'Sokak kültürü, ucuz kira ve hızlı hustle.' } },
  ];

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

  const travelWithTransit = (id: string) => {
    if (player.money < 15) {
      alert("Yetersiz bakiye! (Insufficient funds for transit)");
      return;
    }
    setPlayer(p => ({
      ...p,
      money: p.money - 15,
      location: id
    }));
  };

  const getMood = () => {
    if (player.happiness > 8000) return { emoji: '🤩', text: language === 'en' ? 'Blessed' : 'Harika', color: 'text-emerald-500' };
    if (player.happiness > 5000) return { emoji: '😊', text: language === 'en' ? 'Happy' : 'Mutlu', color: 'text-emerald-400' };
    return { emoji: '😐', text: language === 'en' ? 'Okay' : 'Normal', color: 'text-amber-500' };
  };

  const mood = getMood();
  const currentLocation = locations.find(l => l.id === player.location) || locations[0];

  return (
    <main className="min-h-screen bg-[#f0f4f8] text-slate-800 flex flex-col font-sans overflow-hidden relative">
      
      {/* FLOATING TOP STATUS BAR */}
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

      {/* LEFT SIDE ACTION QUEUE */}
      <div className="fixed top-20 left-4 z-40 flex flex-col gap-2 pointer-events-none">
        <div className="bg-white/90 backdrop-blur-md p-3 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-3 pointer-events-auto w-56 cursor-pointer hover:bg-slate-50 transition-colors">
          <div className="bg-red-100 w-8 h-8 rounded-full flex items-center justify-center text-xl">🍽️</div>
          <div>
            <p className="text-xs font-bold text-slate-800 leading-tight">{t.eatFood}</p>
            <p className="text-[10px] text-slate-500">{t.eatDesc}</p>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT AREA: 3D WORLD MAP & TRANSIT */}
      <div className="flex-1 w-full h-full flex items-center justify-center p-4 pt-24 pb-32">
        {activeTab === 'map' && (
          <div className="bg-white/90 backdrop-blur-md p-6 rounded-[3rem] shadow-xl border border-white max-w-3xl w-full flex flex-col items-center">
            <div className="text-center mb-4">
              <span className="bg-red-100 text-red-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">{t.activeLocation}</span>
              <h2 className="text-2xl font-black text-slate-800 mt-1">{currentLocation.name}</h2>
              <p className="text-xs text-slate-500">{currentLocation.desc[language]}</p>
            </div>

            {/* Interactive 3D Canvas Viewport */}
            <div className="w-full h-60 bg-gradient-to-b from-slate-900 to-slate-800 rounded-3xl overflow-hidden shadow-inner border-4 border-white relative mb-4">
              <Canvas camera={{ position: [5, 5, 5], fov: 60 }}>
                <ambientLight intensity={0.8} />
                <directionalLight position={[10, 20, 10]} intensity={1.5} />
                <CityWorldMap currentLocation={player.location} onSelectLocation={(id) => travelWithTransit(id)} />
                <OrbitControls enableZoom={true} enablePan={true} maxPolarAngle={Math.PI / 2.2} />
              </Canvas>
              <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md text-white text-[10px] px-3 py-1 rounded-full pointer-events-none">
                🚌 {t.transitBtn}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 w-full">
              {locations.map(loc => (
                <button
                  key={loc.id}
                  onClick={() => travelWithTransit(loc.id)}
                  className={`p-3 rounded-2xl border-2 transition-all flex items-center gap-3 text-left ${player.location === loc.id ? 'border-red-600 bg-red-50 shadow-sm' : 'border-slate-100 bg-white hover:border-slate-300'}`}
                >
                  <span className="text-2xl">{loc.icon}</span>
                  <div>
                    <h3 className="font-bold text-slate-800 text-xs">{loc.name}</h3>
                    <p className="text-[9px] text-slate-500">15 ₺ Transit</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'home' && (
          <div className="bg-white/80 backdrop-blur-md p-8 rounded-[3rem] shadow-xl border border-white max-w-lg w-full text-center">
            <div className="w-20 h-20 bg-red-600 rounded-3xl mx-auto flex items-center justify-center text-4xl shadow-lg mb-4">🏠</div>
            <h2 className="text-2xl font-black text-slate-800">{language === 'en' ? 'Residence' : 'Ev Sahnesi'}</h2>
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