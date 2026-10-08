'use client';

import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import { createClient } from '@supabase/supabase-js';
import ChatModal from './ChatModal';
import Onboarding from './Onboarding';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey) : null;

type Tab = 'home' | 'map' | 'phone';

function ImmersiveCityMap({ currentLocation, onSelectLocation }: { currentLocation: string, onSelectLocation: (id: string) => void }) {
  return (
    <group position={[0, -1, 0]}>
      {/* Asphalt Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>

      {/* Cross Roads / Streets */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[36, 4]} />
        <meshStandardMaterial color="#334155" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[4, 36]} />
        <meshStandardMaterial color="#334155" />
      </mesh>

      {/* DISTRICT 1: KADIKÖY SAHİL (Blue Theme / Waterfront) */}
      <group position={[-5, 0, -5]} onClick={() => onSelectLocation('kadikoy')}>
        {/* Building Base */}
        <mesh position={[0, 1, 0]}>
          <boxGeometry args={[3.5, 2, 3.5]} />
          <meshStandardMaterial color={currentLocation === 'kadikoy' ? '#dc2626' : '#2563eb'} />
        </mesh>
        {/* Storefront Windows */}
        <mesh position={[0, 0.5, 1.8]}>
          <boxGeometry args={[2.5, 0.8, 0.1]} />
          <meshStandardMaterial color="#93c5fd" emissive="#3b82f6" emissiveIntensity={0.5} />
        </mesh>
        <mesh position={[0, 2.2, 0]}>
          <coneGeometry args={[2.5, 1, 4]} />
          <meshStandardMaterial color="#1d4ed8" />
        </mesh>
      </group>

      {/* DISTRICT 2: KIZILAY MEYDANI (Ankara Center + Custom Billboard) */}
      <group position={[5, 0, -5]} onClick={() => onSelectLocation('kizilay')}>
        {/* Modern Tower */}
        <mesh position={[0, 1.8, 0]}>
          <boxGeometry args={[3, 3.6, 3]} />
          <meshStandardMaterial color={currentLocation === 'kizilay' ? '#dc2626' : '#d97706'} />
        </mesh>
        {/* Glowing Custom Billboard */}
        <mesh position={[0, 3.2, 1.55]}>
          <boxGeometry args={[2.6, 1, 0.2]} />
          <meshStandardMaterial color="#000000" emissive="#f59e0b" emissiveIntensity={1} />
        </mesh>
      </group>

      {/* DISTRICT 3: BEŞİKTAŞ ÇARŞI */}
      <group position={[-5, 0, 5]} onClick={() => onSelectLocation('besiktas')}>
        <mesh position={[0, 1.2, 0]}>
          <boxGeometry args={[3.5, 2.4, 3.5]} />
          <meshStandardMaterial color={currentLocation === 'besiktas' ? '#dc2626' : '#059669'} />
        </mesh>
        <mesh position={[0, 0.6, 1.8]}>
          <boxGeometry args={[2.5, 0.8, 0.1]} />
          <meshStandardMaterial color="#6ee7b7" emissive="#10b981" emissiveIntensity={0.5} />
        </mesh>
      </group>

      {/* DISTRICT 4: BAĞCILAR SOKAK */}
      <group position={[5, 0, 5]} onClick={() => onSelectLocation('bagcilar')}>
        <mesh position={[0, 0.8, 0]}>
          <boxGeometry args={[3.5, 1.6, 3.5]} />
          <meshStandardMaterial color={currentLocation === 'bagcilar' ? '#dc2626' : '#475569'} />
        </mesh>
        <mesh position={[0, 0.4, 1.8]}>
          <boxGeometry args={[2.5, 0.6, 0.1]} />
          <meshStandardMaterial color="#cbd5e1" />
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
      mapTab: '3D City',
      phoneTab: 'Phone',
      rentLabel: 'Rent',
      week: 'week',
      health: 'Health',
      energy: 'Energy',
      travelPrompt: 'Click any 3D building to travel & inspect billboards'
    },
    tr: {
      activeLocation: 'AKTİF BÖLGE',
      eatFood: 'Döner Ye',
      eatDesc: 'Açlığını gider, enerji topla',
      homeTab: 'Ev',
      mapTab: '3D Şehir',
      phoneTab: 'Telefon',
      rentLabel: 'Kira',
      week: 'hafta',
      health: 'Sağlık',
      energy: 'Enerji',
      travelPrompt: 'Seyahat etmek ve tabelaları görmek için binalara tıkla'
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

  const travelToDistrict = (id: string) => {
    setPlayer(p => ({ ...p, location: id }));
  };

  const getMood = () => {
    if (player.happiness > 8000) return { emoji: '🤩', text: language === 'en' ? 'Blessed' : 'Harika', color: 'text-emerald-500' };
    if (player.happiness > 5000) return { emoji: '😊', text: language === 'en' ? 'Happy' : 'Mutlu', color: 'text-emerald-400' };
    return { emoji: '😐', text: language === 'en' ? 'Okay' : 'Normal', color: 'text-amber-500' };
  };

  const mood = getMood();
  const currentLocation = locations.find(l => l.id === player.location) || locations[0];

  return (
    <main className="min-h-screen bg-[#0f172a] text-slate-800 flex flex-col font-sans overflow-hidden relative">
      
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

      {/* MAIN CONTENT AREA: IMMERSIVE 3D CITY VIEWPORT */}
      <div className="flex-1 w-full h-full flex items-center justify-center p-4 pt-24 pb-32">
        {activeTab === 'map' && (
          <div className="bg-white/95 backdrop-blur-xl p-6 rounded-[3rem] shadow-2xl border border-white/20 max-w-4xl w-full flex flex-col items-center">
            <div className="text-center mb-3">
              <span className="bg-red-100 text-red-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">{t.activeLocation}</span>
              <h2 className="text-2xl font-black text-slate-800 mt-1">{currentLocation.name}</h2>
              <p className="text-xs text-slate-500">{currentLocation.desc[language]}</p>
            </div>

            {/* Immersive 3D Street Canvas */}
            <div className="w-full h-96 bg-gradient-to-b from-slate-950 to-slate-900 rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-200 relative mb-4">
              <Canvas camera={{ position: [8, 8, 8], fov: 50 }}>
                <ambientLight intensity={0.9} />
                <directionalLight position={[10, 25, 10]} intensity={1.8} />
                <ImmersiveCityMap currentLocation={player.location} onSelectLocation={(id) => travelToDistrict(id)} />
                <OrbitControls enableZoom={true} enablePan={true} maxPolarAngle={Math.PI / 2.2} />
              </Canvas>
              <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-md text-white text-[11px] font-semibold px-4 py-2 rounded-xl shadow-lg border border-white/10 pointer-events-none flex items-center gap-2">
                🏙️ {t.travelPrompt}
              </div>
            </div>

            {/* District Quick Switcher */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full">
              {locations.map(loc => (
                <button
                  key={loc.id}
                  onClick={() => travelToDistrict(loc.id)}
                  className={`p-3.5 rounded-2xl border-2 transition-all flex items-center gap-3 text-left ${player.location === loc.id ? 'border-red-600 bg-red-50 shadow-md scale-[1.02]' : 'border-slate-100 bg-white hover:border-slate-300'}`}
                >
                  <span className="text-2xl">{loc.icon}</span>
                  <div>
                    <h3 className="font-bold text-slate-800 text-xs">{loc.name}</h3>
                    <p className="text-[9px] text-slate-500">{loc.district}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'home' && (
          <div className="bg-white/90 backdrop-blur-xl p-8 rounded-[3rem] shadow-2xl border border-white/20 max-w-lg w-full text-center">
            <div className="w-20 h-20 bg-red-600 rounded-3xl mx-auto flex items-center justify-center text-4xl shadow-lg mb-4 text-white">🏠</div>
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