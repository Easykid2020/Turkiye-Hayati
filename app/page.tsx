'use client';

import { useState } from 'react';

type Language = 'tr' | 'en';
type ModalType = 'none' | 'shop' | 'jobs' | 'realestate' | 'travel';
type TileType = 'road' | 'grass' | 'house' | 'shop' | 'school' | 'mosque' | 'hospital' | 'office' | 'estate' | 'airport';

interface LocalizedText {
  tr: string;
  en: string;
}

interface Job {
  tr: string;
  en: string;
  salary: number;
}

interface Housing {
  id: string;
  type: 'rent' | 'owned';
  name: LocalizedText;
  price: number;
}

interface ShopItemEffect {
  happiness?: number;
  energy?: number;
  gpa?: number;
}

interface ShopItem {
  id: string;
  category: 'clothes' | 'tech' | 'food';
  name: LocalizedText;
  cost: number;
  effect: ShopItemEffect;
}

interface LocationData {
  id: string;
  name: LocalizedText;
  cost: number;
}

interface PlayerStats {
  money: number;
  health: number;
  happiness: number;
  energy: number;
  gpa: number;
  faith: number;
  location: string;
  job: Job;
  housing: { tr: string; en: string; rent: number; type: 'rent' | 'owned' };
  inventory: string[];
  x: number;
  y: number;
}

// Global Game Data
const locations: LocationData[] = [
  { id: 'Ankara', name: { tr: 'Ankara (Başkent)', en: 'Ankara (Capital)' }, cost: 300 },
  { id: 'Istanbul', name: { tr: 'İstanbul (Metropol)', en: 'Istanbul (Metro)' }, cost: 600 },
  { id: 'Izmir', name: { tr: 'İzmir (Sahil)', en: 'Izmir (Coast)' }, cost: 500 },
  { id: 'Trabzon', name: { tr: 'Trabzon (Karadeniz)', en: 'Trabzon (Black Sea)' }, cost: 400 }
];

const jobsList: Job[] = [
  { tr: 'Öğrenci (İşsiz)', en: 'Student (Unemployed)', salary: 0 },
  { tr: 'Kafe Barista', en: 'Cafe Barista', salary: 11500 },
  { tr: 'Mağaza Görevlisi', en: 'Retail Worker', salary: 12000 },
  { tr: 'Motorlu Kurye', en: 'Motorcycle Courier', salary: 16000 },
  { tr: 'Yazılım Stajyeri', en: 'Software Intern', salary: 9000 },
  { tr: 'Banka Gişe Memuru', en: 'Bank Teller', salary: 22000 },
  { tr: 'Özel Ders Öğretmeni', en: 'Private Tutor', salary: 18000 },
  { tr: 'Kıdemli Mühendis', en: 'Senior Engineer', salary: 45000 }
];

const realEstateList: Housing[] = [
  { id: 'kyk', type: 'rent', name: { tr: 'KYK Yurdu', en: 'KYK Dorm' }, price: 850 },
  { id: 'shared', type: 'rent', name: { tr: 'Paylaşımlı Öğrenci Evi', en: 'Shared Flat' }, price: 4500 },
  { id: 'studio', type: 'rent', name: { tr: '1+0 Stüdyo Daire', en: 'Studio Apartment' }, price: 12000 },
  { id: 'house1', type: 'owned', name: { tr: 'Şehir Dışında Eski Ev', en: 'Old House Suburbs' }, price: 1500000 },
  { id: 'house2', type: 'owned', name: { tr: 'Merkezde 2+1 Daire', en: '2+1 City Center' }, price: 4500000 },
  { id: 'villa', type: 'owned', name: { tr: 'Sahil Villası', en: 'Coastal Villa' }, price: 12000000 }
];

const shopItems: ShopItem[] = [
  { id: 'iskender', category: 'food', name: { tr: 'İskender Kebap', en: 'Iskender Kebab' }, cost: 350, effect: { happiness: 10, energy: 20 } },
  { id: 'tshirt', category: 'clothes', name: { tr: 'Marka Tişört', en: 'Branded T-Shirt' }, cost: 800, effect: { happiness: 5 } },
  { id: 'sneakers', category: 'clothes', name: { tr: 'Spor Ayakkabı', en: 'Sneakers' }, cost: 3500, effect: { happiness: 10, energy: 5 } },
  { id: 'suit', category: 'clothes', name: { tr: 'Takım Elbise', en: 'Business Suit' }, cost: 6000, effect: { happiness: 15 } },
  { id: 'phone', category: 'tech', name: { tr: 'Akıllı Telefon', en: 'Smartphone' }, cost: 45000, effect: { happiness: 25 } },
  { id: 'laptop', category: 'tech', name: { tr: 'Oyun Bilgisayarı', en: 'Gaming Laptop' }, cost: 65000, effect: { happiness: 30, gpa: 0.2 } }
];

// Interactive 2D Map Grid (5x4)
const cityMap: TileType[][] = [
  ['house', 'road', 'shop', 'road', 'estate'],
  ['grass', 'road', 'road', 'road', 'grass'],
  ['school', 'road', 'mosque', 'road', 'office'],
  ['hospital', 'road', 'grass', 'road', 'airport'],
];

const tileIcons: Record<TileType, string> = {
  road: '🛣️', grass: '🌳', house: '🏠', shop: '🛒', 
  school: '📚', mosque: '🕌', hospital: '🏥', office: '💼', 
  estate: '🏢', airport: '✈️'
};

const tileColors: Record<TileType, string> = {
  road: 'bg-slate-700', grass: 'bg-emerald-800', house: 'bg-sky-700', shop: 'bg-amber-600', 
  school: 'bg-purple-700', mosque: 'bg-indigo-700', hospital: 'bg-rose-700', office: 'bg-blue-600', 
  estate: 'bg-teal-700', airport: 'bg-zinc-600'
};

const tileNames: Record<TileType, LocalizedText> = {
  road: { tr: 'Sokak', en: 'Street' }, grass: { tr: 'Park', en: 'Park' },
  house: { tr: 'Evim', en: 'My Home' }, shop: { tr: 'Market', en: 'Shop' },
  school: { tr: 'Üniversite', en: 'University' }, mosque: { tr: 'Cami', en: 'Mosque' },
  hospital: { tr: 'Hastane', en: 'Hospital' }, office: { tr: 'İş Merkezi', en: 'Offices' },
  estate: { tr: 'Emlakçı', en: 'Real Estate' }, airport: { tr: 'Havalimanı', en: 'Airport' }
};

export default function GameHome() {
  const [lang, setLang] = useState<Language>('tr');
  const [activeModal, setActiveModal] = useState<ModalType>('none');
  const [logs, setLogs] = useState<string[]>([]);
  
  const [player, setPlayer] = useState<PlayerStats>({
    money: 5000, health: 80, happiness: 75, energy: 100, gpa: 2.50, faith: 50,
    location: 'Istanbul', job: jobsList[0],
    housing: { tr: 'Aile Evi', en: 'Family House', rent: 0, type: 'rent' },
    inventory: [], x: 0, y: 0
  });

  const addLog = (msg: string) => {
    setLogs((prev) => [msg, ...prev].slice(0, 5)); 
  };

  const clamp = (val: number, min = 0, max = 100) => Math.max(min, Math.min(max, val));

  // --- Core Game Mechanics ---
  const moveToTile = (targetX: number, targetY: number) => {
    const tile = cityMap[targetY][targetX];
    const p = { ...player, x: targetX, y: targetY };
    
    if (p.energy < 5) {
      addLog(lang === 'tr' ? 'Hareket etmek için çok yorgunsun! Eve git ve uyu.' : 'Too tired to move! Go home and sleep.');
      return;
    }

    p.energy -= 2; // Walking cost
    let msg = '';

    switch (tile) {
      case 'house':
        p.energy = 100;
        p.health = clamp(p.health + 10);
        msg = lang === 'tr' ? 'Eve geldin ve uyudun. Enerjin tamamen doldu.' : 'Went home and slept. Energy restored.';
        break;
      case 'school':
        p.gpa = Math.min(4.0, p.gpa + 0.1);
        p.energy -= 15;
        p.happiness -= 5;
        msg = lang === 'tr' ? 'Derse girdin ve çalıştın. (GPA +, Enerji -)' : 'Attended class and studied. (GPA +, Energy -)';
        break;
      case 'mosque':
        p.faith = clamp(p.faith + 20);
        p.happiness = clamp(p.happiness + 15);
        msg = lang === 'tr' ? 'Camiye girdin ve ibadet ettin. Huzur buldun.' : 'Entered the mosque and prayed. Found peace.';
        break;
      case 'hospital':
        if (p.money >= 500) {
          p.money -= 500;
          p.health = 100;
          msg = lang === 'tr' ? 'Hastanede tedavi oldun (-500₺). Tamamen iyileştin.' : 'Got treated at the hospital (-500₺). Fully healed.';
        } else {
          msg = lang === 'tr' ? 'Hastane masrafı için paran yok!' : 'Cannot afford the hospital!';
        }
        break;
      case 'shop':
        setActiveModal('shop');
        msg = lang === 'tr' ? 'Alışveriş merkezine girdin.' : 'Entered the shopping mall.';
        break;
      case 'office':
        setActiveModal('jobs');
        msg = lang === 'tr' ? 'İş merkezine girdin. Kariyer fırsatlarına bakıyorsun.' : 'Entered the office building. Looking for careers.';
        break;
      case 'estate':
        setActiveModal('realestate');
        msg = lang === 'tr' ? 'Emlakçıya girdin. Yeni bir ev arıyorsun.' : 'Entered the real estate agency. Looking for a new home.';
        break;
      case 'airport':
        setActiveModal('travel');
        msg = lang === 'tr' ? 'Havalimanına geldin. Uçuşlar kontrol ediliyor.' : 'Arrived at the airport. Checking flights.';
        break;
      case 'grass':
        p.happiness = clamp(p.happiness + 5);
        msg = lang === 'tr' ? 'Parkta hava alıyorsun. Stresin azaldı.' : 'Getting some fresh air in the park. Stress reduced.';
        break;
      case 'road':
        msg = lang === 'tr' ? 'Sokakta yürüyorsun...' : 'Walking down the street...';
        break;
    }

    setPlayer(p);
    if (msg) addLog(msg);
  };

  const buyProperty = (prop: Housing) => {
    if (prop.type === 'owned') {
      if (player.money >= prop.price) {
        setPlayer({ ...player, money: player.money - prop.price, housing: { tr: prop.name.tr, en: prop.name.en, rent: 0, type: 'owned' } });
        setActiveModal('none');
        addLog(lang === 'tr' ? `Yeni ev satın aldın: ${prop.name.tr}` : `Bought new house: ${prop.name.en}`);
      } else {
        addLog(lang === 'tr' ? 'Yetersiz bakiye!' : 'Insufficient funds!');
      }
    } else {
      setPlayer({ ...player, housing: { tr: prop.name.tr, en: prop.name.en, rent: prop.price, type: 'rent' } });
      setActiveModal('none');
      addLog(lang === 'tr' ? `Yeni eve taşındın: ${prop.name.tr}.` : `Moved to: ${prop.name.en}.`);
    }
  };

  const buyItem = (item: ShopItem) => {
    if (player.money >= item.cost) {
      const p = { ...player, money: player.money - item.cost };
      if (item.effect.happiness) p.happiness = clamp(p.happiness + item.effect.happiness);
      if (item.effect.energy) p.energy = clamp(p.energy + item.effect.energy);
      if (item.effect.gpa) p.gpa = Math.min(4.0, p.gpa + item.effect.gpa);
      p.inventory.push(item.name[lang]);
      setPlayer(p);
      addLog(lang === 'tr' ? `${item.name.tr} satın alındı!` : `Bought ${item.name.en}!`);
    } else {
      addLog(lang === 'tr' ? 'Paran yetmiyor!' : 'Not enough money!');
    }
  };

  const changeJob = (job: Job) => {
    setPlayer({ ...player, job });
    setActiveModal('none');
    addLog(lang === 'tr' ? `Yeni işe kabul edildin: ${job.tr}` : `Accepted new job: ${job.en}`);
  };

  const travelTo = (loc: LocationData) => {
    if (player.money >= loc.cost) {
      setPlayer({ ...player, money: player.money - loc.cost, location: loc.id });
      setActiveModal('none');
      addLog(lang === 'tr' ? `${loc.name.tr} şehrine uçtun.` : `Flew to ${loc.name.en}.`);
    } else {
      addLog(lang === 'tr' ? 'Uçak bileti için paran yetersiz.' : 'Not enough money for a flight.');
    }
  };

  const nextMonth = () => {
    const p = { ...player };
    p.money += p.job.salary;
    if (p.housing.type === 'rent') {
      p.money -= p.housing.rent;
    }
    p.energy = 100; // Reset energy every month
    setPlayer(p);
    addLog(lang === 'tr' ? `Bir ay geçti. Maaş yattı, kiralar ödendi.` : `A month passed. Salary paid, rent collected.`);
  };

  // --- Render ---
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-rose-500 pb-10">
      
      {/* Top HUD */}
      <header className="bg-slate-900 border-b-4 border-slate-800 p-4 shadow-xl z-10 sticky top-0">
        <div className="max-w-4xl mx-auto flex justify-between items-center mb-4">
          <div>
            <h1 className="text-xl md:text-2xl font-black text-rose-500 tracking-wider drop-shadow-md">
              TÜRKİYE HAYATI
            </h1>
            <p className="text-xs text-sky-400 font-bold uppercase tracking-widest mt-1">
              📍 {locations.find(l => l.id === player.location)?.name[lang]}
            </p>
          </div>
          <button onClick={() => setLang(lang === 'tr' ? 'en' : 'tr')} className="bg-slate-800 px-4 py-2 rounded font-bold text-sm border border-slate-700 hover:bg-slate-700 transition">
            {lang === 'tr' ? 'EN' : 'TR'}
          </button>
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-5 gap-2 text-center text-[10px] md:text-xs">
          <div className="bg-slate-950 p-2 rounded-lg border border-slate-800 flex flex-col justify-center">
            <span className="text-slate-500 font-bold uppercase mb-1">{lang === 'tr' ? 'Cüzdan' : 'Wallet'}</span>
            <span className={`font-black text-sm md:text-base ${player.money < 0 ? 'text-red-500' : 'text-emerald-400'}`}>{player.money.toLocaleString()}₺</span>
          </div>
          <div className="bg-slate-950 p-2 rounded-lg border border-slate-800 flex flex-col justify-center">
            <span className="text-rose-500 font-bold uppercase mb-1">HP</span>
            <span className="font-black text-white">{player.health}%</span>
          </div>
          <div className="bg-slate-950 p-2 rounded-lg border border-slate-800 flex flex-col justify-center">
            <span className="text-amber-500 font-bold uppercase mb-1">ENG</span>
            <span className="font-black text-white">{player.energy}%</span>
          </div>
          <div className="bg-slate-950 p-2 rounded-lg border border-slate-800 flex flex-col justify-center">
            <span className="text-purple-400 font-bold uppercase mb-1">GPA</span>
            <span className="font-black text-white">{player.gpa.toFixed(2)}</span>
          </div>
          <div className="bg-slate-950 p-2 rounded-lg border border-slate-800 flex flex-col justify-center">
            <span className="text-indigo-400 font-bold uppercase mb-1">FAI</span>
            <span className="font-black text-white">{player.faith}%</span>
          </div>
        </div>
      </header>

      {/* Main Game Area */}
      <div className="flex-1 max-w-4xl w-full mx-auto p-4 flex flex-col gap-6 relative">
        
        {/* Month Progression Button */}
        <button onClick={nextMonth} className="w-full bg-gradient-to-r from-sky-700 to-blue-600 hover:from-sky-600 hover:to-blue-500 text-white font-black text-lg py-4 rounded-xl shadow-lg border-b-4 border-blue-900 active:border-b-0 active:translate-y-1 transition-all uppercase tracking-widest">
          {lang === 'tr' ? 'Aylık Döngüyü İlerlet ➔' : 'Advance Monthly Cycle ➔'}
        </button>

        {/* The 2D Visual Map */}
        <div className="bg-black p-6 rounded-2xl border-4 border-slate-800 shadow-2xl overflow-x-auto relative">
          <h2 className="text-center text-slate-500 font-bold mb-6 uppercase tracking-widest text-xs">
            {lang === 'tr' ? 'Şehir Haritası - Etkileşim İçin Tıkla' : 'City Map - Click to Interact'}
          </h2>
          
          <div className="flex flex-col gap-2 min-w-[500px] items-center">
            {cityMap.map((row, y) => (
              <div key={y} className="flex gap-2">
                {row.map((tile, x) => {
                  const isPlayerHere = player.x === x && player.y === y;
                  return (
                    <button 
                      key={`${x}-${y}`}
                      onClick={() => moveToTile(x, y)}
                      className={`relative w-24 h-24 md:w-28 md:h-28 rounded-xl flex flex-col items-center justify-center border-b-4 active:border-b-0 active:translate-y-1 transition-all ${tileColors[tile]} border-slate-950 hover:brightness-110 shadow-md`}
                    >
                      <span className="text-4xl filter drop-shadow-md">{tileIcons[tile]}</span>
                      <span className="text-[10px] font-black text-white bg-black/60 px-2 py-0.5 rounded mt-2 uppercase tracking-wider">
                        {tileNames[tile][lang]}
                      </span>
                      
                      {/* Player Sprite */}
                      {isPlayerHere && (
                        <div className="absolute -top-4 -right-3 text-3xl animate-bounce filter drop-shadow-xl z-10 bg-white rounded-full h-10 w-10 flex items-center justify-center border-4 border-rose-500 shadow-lg">
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

        {/* Character Info & Logs Side-by-Side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-900 border-2 border-slate-800 rounded-xl p-5 shadow-lg">
            <h3 className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-4">{lang === 'tr' ? 'Karakter Özeti' : 'Character Summary'}</h3>
            <div className="flex flex-col gap-3 text-sm">
              <div className="flex justify-between border-b border-slate-800 pb-2"><span className="text-slate-400">{lang === 'tr' ? 'Meslek' : 'Job'}</span><span className="font-bold text-amber-300">{player.job[lang]}</span></div>
              <div className="flex justify-between border-b border-slate-800 pb-2"><span className="text-slate-400">{lang === 'tr' ? 'Maaş' : 'Salary'}</span><span className="font-bold text-emerald-400">+{player.job.salary.toLocaleString()}₺ / {lang === 'tr' ? 'Ay' : 'Mo'}</span></div>
              <div className="flex justify-between border-b border-slate-800 pb-2"><span className="text-slate-400">{lang === 'tr' ? 'Konut' : 'Housing'}</span><span className="font-bold text-sky-300">{player.housing[lang]}</span></div>
              <div className="flex justify-between pb-1"><span className="text-slate-400">{lang === 'tr' ? 'Kira' : 'Rent'}</span><span className="font-bold text-rose-400">-{player.housing.rent.toLocaleString()}₺ / {lang === 'tr' ? 'Ay' : 'Mo'}</span></div>
            </div>
          </div>

          <div className="bg-black border-2 border-slate-800 rounded-xl p-5 min-h-[180px] font-mono shadow-inner flex flex-col justify-end overflow-hidden">
            {logs.length === 0 ? (
              <p className="text-slate-600 animate-pulse text-sm">{lang === 'tr' ? '> Komut bekleniyor...' : '> Awaiting input...'}</p>
            ) : (
              logs.map((log, i) => (
                <p key={i} className={`text-xs md:text-sm py-1.5 border-b border-slate-900 last:border-0 ${i === logs.length - 1 ? 'text-emerald-400 font-bold' : 'text-slate-500'}`}>
                  {"> "} {log}
                </p>
              ))
            )}
          </div>
        </div>

      </div>

      {/* --- MODALS OVERLAYS --- */}
      {activeModal !== 'none' && (
        <div className="fixed inset-0 bg-black/90 flex justify-center items-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-slate-900 border-2 border-slate-700 rounded-2xl p-6 max-w-lg w-full shadow-2xl flex flex-col max-h-[85vh]">
            
            <div className="flex justify-between items-center mb-6 border-b border-slate-700 pb-4">
              <h3 className="text-2xl font-black text-white uppercase tracking-widest">
                {activeModal === 'shop' && (lang === 'tr' ? '🛒 Şehir Marketi' : '🛒 City Shop')}
                {activeModal === 'jobs' && (lang === 'tr' ? '💼 İş Merkezi' : '💼 Job Center')}
                {activeModal === 'realestate' && (lang === 'tr' ? '🏢 Emlak Ofisi' : '🏢 Real Estate')}
                {activeModal === 'travel' && (lang === 'tr' ? '✈️ Havalimanı' : '✈️ Airport')}
              </h3>
              <button onClick={() => setActiveModal('none')} className="text-rose-500 hover:text-rose-400 font-black text-xl px-2">✕</button>
            </div>

            <div className="flex flex-col gap-3 overflow-y-auto pr-2 custom-scrollbar flex-1">
              {/* SHOP MENU */}
              {activeModal === 'shop' && shopItems.map((item) => (
                <button key={item.id} onClick={() => buyItem(item)} className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-left hover:border-amber-500 transition-colors flex justify-between items-center group">
                  <div>
                    <span className="font-bold text-white block">{item.name[lang]}</span>
                    <span className="text-[10px] text-slate-500 uppercase">{item.category}</span>
                  </div>
                  <span className="font-black text-amber-400 bg-amber-950/50 px-3 py-1 rounded-lg group-hover:bg-amber-500 group-hover:text-black transition-colors">{item.cost.toLocaleString()} ₺</span>
                </button>
              ))}

              {/* JOBS MENU */}
              {activeModal === 'jobs' && jobsList.map((job, idx) => (
                <button key={idx} onClick={() => changeJob(job)} className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-left hover:border-blue-500 transition-colors flex justify-between items-center group">
                  <span className="font-bold text-white">{job[lang]}</span>
                  <span className="font-black text-emerald-400 bg-emerald-950/50 px-3 py-1 rounded-lg group-hover:bg-emerald-500 group-hover:text-black transition-colors">+{job.salary.toLocaleString()} ₺</span>
                </button>
              ))}

              {/* REAL ESTATE MENU */}
              {activeModal === 'realestate' && realEstateList.map((prop, idx) => (
                <button key={idx} onClick={() => buyProperty(prop)} className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-left hover:border-teal-500 transition-colors flex justify-between items-center group">
                  <div>
                    <span className="font-bold text-white block">{prop.name[lang]}</span>
                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded mt-1 inline-block ${prop.type === 'rent' ? 'bg-rose-950 text-rose-400' : 'bg-teal-950 text-teal-400'}`}>
                      {prop.type === 'rent' ? (lang === 'tr' ? 'Kiralık' : 'Rent') : (lang === 'tr' ? 'Satılık' : 'Buy')}
                    </span>
                  </div>
                  <span className="font-black text-teal-400 bg-teal-950/50 px-3 py-1 rounded-lg group-hover:bg-teal-500 group-hover:text-black transition-colors">
                    {prop.price.toLocaleString()} ₺ {prop.type === 'rent' && (lang === 'tr' ? '/ay' : '/mo')}
                  </span>
                </button>
              ))}

              {/* TRAVEL MENU */}
              {activeModal === 'travel' && locations.map((loc) => (
                <button key={loc.id} onClick={() => travelTo(loc)} disabled={player.location === loc.id} className={`p-4 rounded-xl text-left flex justify-between items-center transition-colors group ${player.location === loc.id ? 'bg-slate-900 border border-slate-800 opacity-50 cursor-not-allowed' : 'bg-slate-950 border border-slate-800 hover:border-purple-500'}`}>
                  <span className="font-bold text-white flex items-center gap-2">
                    {loc.name[lang]} {player.location === loc.id && '📍'}
                  </span>
                  {player.location !== loc.id && <span className="font-black text-purple-400 bg-purple-950/50 px-3 py-1 rounded-lg group-hover:bg-purple-500 group-hover:text-black transition-colors">BİLET: {loc.cost} ₺</span>}
                </button>
              ))}
            </div>
            
          </div>
        </div>
      )}

    </main>
  );
}