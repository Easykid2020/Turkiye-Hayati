'use client';

import { useState } from 'react';

type Language = 'tr' | 'en';
type TileType = 'road' | 'grass' | 'house' | 'shop' | 'school' | 'mosque' | 'hospital' | 'bus';

interface PlayerStats {
  money: number;
  energy: number;
  gpa: number;
  faith: number;
  x: number;
  y: number;
  inventory: string[];
}

const cityMap: TileType[][] = [
  ['house', 'road', 'shop', 'grass', 'hospital'],
  ['grass', 'road', 'road', 'road', 'grass'],
  ['school', 'road', 'mosque', 'road', 'bus'],
  ['grass', 'road', 'grass', 'grass', 'grass'],
];

const tileIcons: Record<TileType, string> = {
  road: '🛣️',
  grass: '🌳',
  house: '🏠',
  shop: '🛒',
  school: '📚',
  mosque: '🕌',
  hospital: '🏥',
  bus: '🚌'
};

const tileColors: Record<TileType, string> = {
  road: 'bg-slate-700',
  grass: 'bg-emerald-800',
  house: 'bg-sky-700',
  shop: 'bg-amber-600',
  school: 'bg-purple-700',
  mosque: 'bg-indigo-700',
  hospital: 'bg-rose-700',
  bus: 'bg-yellow-600'
};

const tileNames: Record<TileType, { tr: string, en: string }> = {
  road: { tr: 'Sokak', en: 'Street' },
  grass: { tr: 'Park', en: 'Park' },
  house: { tr: 'Ev', en: 'Home' },
  shop: { tr: 'Market', en: 'Shop' },
  school: { tr: 'Üniversite', en: 'University' },
  mosque: { tr: 'Cami', en: 'Mosque' },
  hospital: { tr: 'Hastane', en: 'Hospital' },
  bus: { tr: 'Otobüs Durağı', en: 'Bus Stop' }
};

export default function GameHome() {
  const [lang, setLang] = useState<Language>('tr');
  const [logs, setLogs] = useState<string[]>([]);
  
  const [player, setPlayer] = useState<PlayerStats>({
    money: 2500,
    energy: 100,
    gpa: 2.50,
    faith: 50,
    x: 0, 
    y: 0, 
    inventory: []
  });

  const addLog = (msg: string) => {
    setLogs((prev) => [msg, ...prev].slice(0, 6)); 
  };

  const clamp = (val: number, min = 0, max = 100) => Math.max(min, Math.min(max, val));

  const moveToTile = (targetX: number, targetY: number) => {
    const tile = cityMap[targetY][targetX];
    const p = { ...player, x: targetX, y: targetY };
    
    if (p.energy < 5) {
      addLog(lang === 'tr' ? 'Hareket etmek için çok yorgunsun! Eve git ve uyu.' : 'Too tired to move! Go home and sleep.');
      return;
    }

    p.energy -= 2;

    let msg = '';
    switch (tile) {
      case 'house':
        p.energy = 100;
        msg = lang === 'tr' ? 'Eve geldin ve uyudun. Enerjin tamamen doldu.' : 'Went home and slept. Energy restored.';
        break;
      case 'school':
        p.gpa = Math.min(4.0, p.gpa + 0.1);
        p.energy -= 15;
        msg = lang === 'tr' ? 'Derse girdin. (GPA arttı, Enerji düştü)' : 'Attended class. (GPA up, Energy down)';
        break;
      case 'mosque':
        p.faith = clamp(p.faith + 20);
        msg = lang === 'tr' ? 'Camiye girdin ve ibadet ettin. Huzur buldun.' : 'Entered the mosque and prayed. Found peace.';
        break;
      case 'shop':
        if (p.money >= 100) {
          p.money -= 100;
          p.inventory.push(lang === 'tr' ? 'Kahve' : 'Coffee');
          p.energy = clamp(p.energy + 20);
          msg = lang === 'tr' ? 'Marketten Kahve aldın (-100₺). Enerjin arttı.' : 'Bought Coffee (-100₺). Energy increased.';
        } else {
          msg = lang === 'tr' ? 'Alışveriş için paran yetersiz!' : 'Not enough money to shop!';
        }
        break;
      case 'hospital':
        if (p.money >= 500) {
          p.money -= 500;
          msg = lang === 'tr' ? 'Hastanede muayene oldun (-500₺).' : 'Got a checkup at the hospital (-500₺).';
        } else {
          msg = lang === 'tr' ? 'Hastane masrafı için paran yok!' : 'Cannot afford the hospital!';
        }
        break;
      case 'bus':
        p.money += 250;
        p.energy -= 20;
        msg = lang === 'tr' ? 'Otobüsle işe gittin ve günlük yevmiyeni aldın (+250₺).' : 'Took the bus to work and earned daily wage (+250₺).';
        break;
      case 'road':
        msg = lang === 'tr' ? 'Sokakta yürüyorsun...' : 'Walking down the street...';
        break;
      case 'grass':
        msg = lang === 'tr' ? 'Parkta hava alıyorsun.' : 'Getting some fresh air in the park.';
        break;
    }

    setPlayer(p);
    if (msg) addLog(msg);
  };

  return (
    <main className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans selection:bg-rose-500">
      
      <header className="bg-slate-950 border-b-4 border-slate-800 p-4 shadow-xl z-10">
        <div className="max-w-4xl mx-auto flex justify-between items-center mb-4">
          <h1 className="text-2xl font-black text-rose-500 tracking-wider">
            TÜRKİYE HAYATI <span className="text-xs bg-rose-900 text-white px-2 py-1 rounded">2D MAP</span>
          </h1>
          <button onClick={() => setLang(lang === 'tr' ? 'en' : 'tr')} className="bg-slate-800 px-4 py-2 rounded font-bold text-sm border border-slate-700">
            {lang === 'tr' ? 'EN' : 'TR'}
          </button>
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-4 gap-2 text-center text-xs md:text-sm">
          <div className="bg-slate-900 p-2 rounded border border-slate-700 flex flex-col">
            <span className="text-slate-400 font-bold mb-1 uppercase">{lang === 'tr' ? 'Bakiye' : 'Money'}</span>
            <span className="font-black text-emerald-400 text-lg">{player.money} ₺</span>
          </div>
          <div className="bg-slate-900 p-2 rounded border border-slate-700 flex flex-col">
            <span className="text-slate-400 font-bold mb-1 uppercase">{lang === 'tr' ? 'Enerji' : 'Energy'}</span>
            <span className="font-black text-amber-400 text-lg">{player.energy}%</span>
          </div>
          <div className="bg-slate-900 p-2 rounded border border-slate-700 flex flex-col">
            <span className="text-slate-400 font-bold mb-1 uppercase">GPA</span>
            <span className="font-black text-purple-400 text-lg">{player.gpa.toFixed(2)}</span>
          </div>
          <div className="bg-slate-900 p-2 rounded border border-slate-700 flex flex-col">
            <span className="text-slate-400 font-bold mb-1 uppercase">{lang === 'tr' ? 'İnanç' : 'Faith'}</span>
            <span className="font-black text-indigo-400 text-lg">{player.faith}%</span>
          </div>
        </div>
      </header>

      <div className="flex-1 max-w-4xl w-full mx-auto p-4 flex flex-col gap-6 relative">
        
        <div className="bg-black p-4 rounded-xl border-4 border-slate-800 shadow-2xl overflow-x-auto">
          <h2 className="text-center text-slate-400 font-bold mb-4 uppercase tracking-widest text-sm">
            {lang === 'tr' ? 'Şehir Haritası (Tıklayarak İlerle)' : 'City Map (Click to Move)'}
          </h2>
          
          <div className="flex flex-col gap-1 min-w-[400px]">
            {cityMap.map((row, y) => (
              <div key={y} className="flex gap-1 justify-center">
                {row.map((tile, x) => {
                  const isPlayerHere = player.x === x && player.y === y;
                  return (
                    <button 
                      key={`${x}-${y}`}
                      onClick={() => moveToTile(x, y)}
                      className={`relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-lg flex flex-col items-center justify-center border-b-4 active:border-b-0 active:translate-y-1 transition-all ${tileColors[tile]} border-black hover:brightness-110 shadow-lg`}
                    >
                      <span className="text-3xl md:text-4xl filter drop-shadow-md">{tileIcons[tile]}</span>
                      <span className="text-[9px] md:text-[10px] font-black text-white bg-black/50 px-1 rounded mt-1 uppercase">
                        {tileNames[tile][lang]}
                      </span>
                      
                      {isPlayerHere && (
                        <div className="absolute -top-3 -right-2 text-2xl md:text-3xl animate-bounce filter drop-shadow-xl z-10 bg-white rounded-full h-8 w-8 flex items-center justify-center border-2 border-rose-500">
                          🧍
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-950 border-2 border-slate-800 rounded-xl p-4 min-h-[150px] font-mono shadow-inner flex flex-col justify-end">
          {logs.length === 0 ? (
            <p className="text-slate-600 animate-pulse">{lang === 'tr' ? '> Haritadan bir yere tıkla ve hareket et...' : '> Click somewhere on the map to move...'}</p>
          ) : (
            logs.map((log, i) => (
              <p key={i} className={`text-sm py-1 border-b border-slate-800 last:border-0 ${i === logs.length - 1 ? 'text-rose-400 font-bold' : 'text-slate-500'}`}>
                > {log}
              </p>
            ))
          )}
        </div>

      </div>
    </main>
  );
}