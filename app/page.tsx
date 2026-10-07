'use client';

import { useState } from 'react';

type Language = 'tr' | 'en';
type TabType = 'main' | 'activities' | 'realestate' | 'shopping' | 'jobs' | 'travel';

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
  category: 'clothes' | 'tech';
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
}

const locations: LocationData[] = [
  { id: 'Ankara', name: { tr: 'Ankara', en: 'Ankara' }, cost: 300 },
  { id: 'Istanbul', name: { tr: 'İstanbul', en: 'Istanbul' }, cost: 600 },
  { id: 'Izmir', name: { tr: 'İzmir', en: 'Izmir' }, cost: 500 },
  { id: 'Trabzon', name: { tr: 'Trabzon', en: 'Trabzon' }, cost: 400 }
];

const jobsList: Job[] = [
  { tr: 'Öğrenci (İşsiz)', en: 'Student (Unemployed)', salary: 0 },
  { tr: 'Kafe Barista', en: 'Cafe Barista', salary: 11500 },
  { tr: 'Mağaza Görevlisi', en: 'Retail Worker', salary: 12000 },
  { tr: 'Motorlu Kurye', en: 'Motorcycle Courier', salary: 16000 },
  { tr: 'Yazılım Stajyeri', en: 'Software Intern', salary: 9000 },
  { tr: 'Banka Gişe Memuru', en: 'Bank Teller', salary: 22000 },
  { tr: 'Özel Ders Öğretmeni', en: 'Private Tutor', salary: 18000 }
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
  { id: 'tshirt', category: 'clothes', name: { tr: 'Marka Tişört', en: 'Branded T-Shirt' }, cost: 800, effect: { happiness: 5 } },
  { id: 'sneakers', category: 'clothes', name: { tr: 'Spor Ayakkabı', en: 'Sneakers' }, cost: 3500, effect: { happiness: 10, energy: 5 } },
  { id: 'suit', category: 'clothes', name: { tr: 'Takım Elbise', en: 'Business Suit' }, cost: 6000, effect: { happiness: 15 } },
  { id: 'phone', category: 'tech', name: { tr: 'Akıllı Telefon', en: 'Smartphone' }, cost: 45000, effect: { happiness: 25 } },
  { id: 'laptop', category: 'tech', name: { tr: 'Oyun Bilgisayarı', en: 'Gaming Laptop' }, cost: 65000, effect: { happiness: 30, gpa: 0.2 } }
];

const navTabs: { id: TabType; icon: string; tr: string; en: string }[] = [
  { id: 'main', icon: '🎮', tr: 'ANA', en: 'MAIN' },
  { id: 'activities', icon: '🏃', tr: 'AKSİYON', en: 'ACT' },
  { id: 'realestate', icon: '🏠', tr: 'EMLAK', en: 'HOME' },
  { id: 'shopping', icon: '🛒', tr: 'MARKET', en: 'SHOP' },
  { id: 'jobs', icon: '💼', tr: 'KARİYER', en: 'JOBS' },
  { id: 'travel', icon: '✈️', tr: 'GEZİ', en: 'MAP' }
];

export default function GameHome() {
  const [lang, setLang] = useState<Language>('tr');
  const [isStarted, setIsStarted] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('main');
  const [logs, setLogs] = useState<string[]>([]);
  
  const [player, setPlayer] = useState<PlayerStats>({
    money: 10000,
    health: 80,
    happiness: 70,
    energy: 100,
    gpa: 2.50,
    faith: 50,
    location: 'Istanbul',
    job: jobsList[0],
    housing: { tr: 'Aile Evi', en: 'Family House', rent: 0, type: 'rent' },
    inventory: []
  });

  const addLog = (msg: string) => {
    setLogs((prev) => [msg, ...prev].slice(0, 15));
  };

  const clamp = (val: number, min = 0, max = 100) => Math.max(min, Math.min(max, val));

  const doActivity = (activity: string) => {
    const p = { ...player };
    let msg = '';
    
    if (p.energy < 15) {
      addLog(lang === 'tr' ? 'Bunu yapmak için çok yorgunsun! Uyumalısın.' : 'Too tired to do this! You need to sleep.');
      return;
    }

    switch (activity) {
      case 'school':
        p.gpa = Math.min(4.0, p.gpa + 0.05);
        p.energy -= 20;
        p.happiness -= 5;
        msg = lang === 'tr' ? 'Okula gittin ve ders çalıştın. (GPA artışı, Enerji düştü)' : 'Went to school and studied. (GPA up, Energy down)';
        break;
      case 'mosque':
        p.faith = clamp(p.faith + 15);
        p.happiness = clamp(p.happiness + 10);
        p.energy -= 10;
        msg = lang === 'tr' ? 'Camiye gittin, ibadet ettin ve huzur buldun. (İnanç ve Mutluluk arttı)' : 'Went to the mosque, prayed, and found peace. (Faith and Happiness up)';
        break;
      case 'bus':
        p.energy -= 15;
        const busEvents = [
          { tr: 'Otobüs çok kalabalıktı, ayakta kaldın.', en: 'Bus was packed, you had to stand.' },
          { tr: 'Otobüste yer buldun ve rahat bir yolculuk yaptın.', en: 'Found a seat and had a relaxing ride.' },
          { tr: 'Trafik kilitlendi, saatlerce yolda kaldın!', en: 'Traffic jam, stuck on the road for hours!' }
        ];
        msg = busEvents[Math.floor(Math.random() * busEvents.length)][lang];
        break;
      case 'work':
        if (p.job.salary === 0) {
          msg = lang === 'tr' ? 'Şu an işsizsin!' : 'You are currently unemployed!';
        } else {
          const dailyEarn = Math.floor(p.job.salary / 20);
          p.money += dailyEarn;
          p.energy -= 30;
          p.happiness -= 10;
          msg = lang === 'tr' ? `Mesaiye kaldın ve ${dailyEarn}₺ kazandın.` : `Worked a shift and earned ${dailyEarn}₺.`;
        }
        break;
      case 'sleep':
        p.energy = 100;
        p.health = clamp(p.health + 10);
        msg = lang === 'tr' ? 'Derin bir uyku çektin. Enerjin tamamen doldu.' : 'Slept deeply. Energy fully restored.';
        break;
      case 'hospital':
        if (p.money >= 1000) {
          p.money -= 1000;
          p.health = 100;
          msg = lang === 'tr' ? 'Hastaneye gittin, tedavi oldun (-1000₺).' : 'Went to hospital, got treated (-1000₺).';
        } else {
          msg = lang === 'tr' ? 'Hastane masrafı için paran yetersiz!' : 'Not enough money for hospital bills!';
        }
        break;
      default:
        break;
    }
    setPlayer(p);
    addLog(msg);
  };

  const buyProperty = (prop: Housing) => {
    if (prop.type === 'owned') {
      if (player.money >= prop.price) {
        setPlayer({ ...player, money: player.money - prop.price, housing: { tr: prop.name.tr, en: prop.name.en, rent: 0, type: 'owned' } });
        addLog(lang === 'tr' ? `Yeni ev satın aldın: ${prop.name.tr}` : `Bought new house: ${prop.name.en}`);
      } else {
        addLog(lang === 'tr' ? 'Yetersiz bakiye!' : 'Insufficient funds!');
      }
    } else {
      setPlayer({ ...player, housing: { tr: prop.name.tr, en: prop.name.en, rent: prop.price, type: 'rent' } });
      addLog(lang === 'tr' ? `Yeni eve taşındın: ${prop.name.tr}. Aylık kira: ${prop.price}₺` : `Moved to: ${prop.name.en}. Monthly rent: ${prop.price}₺`);
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
    addLog(lang === 'tr' ? `Yeni işe başladın: ${job.tr}` : `Started new job: ${job.en}`);
  };

  const travel = (loc: LocationData) => {
    if (player.money >= loc.cost) {
      setPlayer({ ...player, money: player.money - loc.cost, location: loc.id });
      addLog(lang === 'tr' ? `${loc.name.tr} şehrine seyahat ettin.` : `Traveled to ${loc.name.en}.`);
    } else {
      addLog(lang === 'tr' ? 'Bilet parası çıkışmıyor.' : 'Cannot afford the ticket.');
    }
  };

  const nextMonth = () => {
    const p = { ...player };
    p.money += p.job.salary;
    if (p.housing.type === 'rent') {
      p.money -= p.housing.rent;
    }
    setPlayer(p);
    addLog(lang === 'tr' ? `Bir ay geçti. Maaş yattı, kiralar ödendi.` : `A month passed. Salary paid, rent collected.`);
  };

  if (!isStarted) {
    return (
      <main className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-4 font-mono text-center">
        <div className="border-4 border-rose-500 bg-neutral-900 p-8 rounded-2xl shadow-[0_0_40px_rgba(244,63,94,0.3)] max-w-lg w-full">
          <h1 className="text-4xl md:text-5xl font-black text-rose-500 tracking-widest mb-2 drop-shadow-lg">
            TÜRKİYE HAYATI
          </h1>
          <p className="text-sky-400 font-bold mb-12 uppercase tracking-widest text-sm">
            Ultimate Life Simulator
          </p>
          
          <div className="flex gap-4 justify-center mb-8">
            <button onClick={() => setLang('tr')} className={`px-4 py-2 font-bold border-2 rounded-lg ${lang === 'tr' ? 'bg-sky-500 border-sky-400 text-black' : 'text-neutral-400 border-neutral-700'}`}>TR</button>
            <button onClick={() => setLang('en')} className={`px-4 py-2 font-bold border-2 rounded-lg ${lang === 'en' ? 'bg-sky-500 border-sky-400 text-black' : 'text-neutral-400 border-neutral-700'}`}>EN</button>
          </div>

          <button 
            onClick={() => setIsStarted(true)} 
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-black text-2xl py-6 rounded-xl border-b-8 border-emerald-700 active:border-b-0 active:translate-y-2 transition-all"
          >
            {lang === 'tr' ? 'OYUNA BAŞLA' : 'START GAME'}
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-200 font-sans pb-24 selection:bg-rose-500 selection:text-white">
      <div className="bg-neutral-900 border-b-4 border-neutral-800 sticky top-0 z-10 p-4 shadow-xl">
        <div className="max-w-md mx-auto flex justify-between items-center mb-4">
          <h1 className="text-xl font-black text-rose-500 tracking-wider drop-shadow-md">TÜRKİYE HAYATI</h1>
          <div className="flex gap-2">
            <span className="bg-neutral-800 px-3 py-1 rounded font-bold border border-neutral-700 text-sky-400 text-xs flex items-center">
              📍 {locations.find(l => l.id === player.location)?.name[lang]}
            </span>
          </div>
        </div>
        
        <div className="max-w-md mx-auto bg-neutral-950 p-4 rounded-xl border-2 border-neutral-800 shadow-inner">
          <div className="flex justify-between items-end mb-3">
            <p className="text-xs text-neutral-500 uppercase font-bold tracking-widest">{lang === 'tr' ? 'CÜZDAN' : 'WALLET'}</p>
            <p className={`font-black text-3xl ${player.money < 0 ? 'text-red-500' : 'text-emerald-400'}`}>
              {player.money.toLocaleString()} ₺
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex justify-between text-[10px] font-bold mb-1"><span className="text-rose-400">HP</span><span>{player.health}%</span></div>
              <div className="w-full bg-neutral-800 rounded-full h-2.5 border border-neutral-700"><div className="bg-rose-500 h-2 rounded-full" style={{ width: `${player.health}%` }}></div></div>
            </div>
            <div>
              <div className="flex justify-between text-[10px] font-bold mb-1"><span className="text-amber-400">ENG</span><span>{player.energy}%</span></div>
              <div className="w-full bg-neutral-800 rounded-full h-2.5 border border-neutral-700"><div className="bg-amber-400 h-2 rounded-full" style={{ width: `${player.energy}%` }}></div></div>
            </div>
            <div>
              <div className="flex justify-between text-[10px] font-bold mb-1"><span className="text-sky-400">HAP</span><span>{player.happiness}%</span></div>
              <div className="w-full bg-neutral-800 rounded-full h-2.5 border border-neutral-700"><div className="bg-sky-400 h-2 rounded-full" style={{ width: `${player.happiness}%` }}></div></div>
            </div>
            <div>
              <div className="flex justify-between text-[10px] font-bold mb-1"><span className="text-indigo-400">FAI</span><span>{player.faith}%</span></div>
              <div className="w-full bg-neutral-800 rounded-full h-2.5 border border-neutral-700"><div className="bg-indigo-500 h-2 rounded-full" style={{ width: `${player.faith}%` }}></div></div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4 flex flex-col gap-4">
        
        {activeTab === 'main' && (
          <div className="flex flex-col gap-4">
            <button onClick={nextMonth} className="w-full py-4 bg-sky-600 hover:bg-sky-500 text-white font-black text-xl rounded-xl border-b-4 border-sky-800 active:border-b-0 active:translate-y-1 transition-all">
              {lang === 'tr' ? 'AYI İLERLET ➔' : 'NEXT MONTH ➔'}
            </button>
            
            <div className="bg-neutral-900 border-2 border-neutral-800 rounded-xl p-4 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-rose-500 to-transparent opacity-50"></div>
              <h3 className="text-xs text-neutral-500 uppercase tracking-widest font-bold mb-3">{lang === 'tr' ? 'KARAKTER BİLGİSİ' : 'CHARACTER INFO'}</h3>
              <div className="grid grid-cols-2 gap-y-4 text-sm">
                <div><span className="text-neutral-500 block text-xs">GPA</span><span className="font-bold text-purple-400 text-lg">{player.gpa.toFixed(2)}</span></div>
                <div><span className="text-neutral-500 block text-xs">{lang === 'tr' ? 'MESLEK' : 'JOB'}</span><span className="font-bold text-amber-300">{player.job[lang]}</span></div>
                <div className="col-span-2"><span className="text-neutral-500 block text-xs">{lang === 'tr' ? 'KONUT' : 'HOUSING'}</span><span className="font-bold text-emerald-300">{player.housing[lang]} {player.housing.type === 'rent' ? `(-${player.housing.rent}₺)` : '(Sahibi)'}</span></div>
              </div>
            </div>

            <div className="bg-black border-2 border-neutral-800 rounded-xl p-4 min-h-[250px] flex flex-col-reverse overflow-y-auto gap-3 font-mono shadow-inner">
              {logs.length === 0 ? (
                <p className="text-neutral-600 text-center animate-pulse">{lang === 'tr' ? '> Oyun başladı. Komut bekleniyor...' : '> Game started. Awaiting input...'}</p>
              ) : (
                logs.map((log, i) => (
                  <div key={i} className={`p-3 rounded border text-sm ${i === 0 ? 'bg-neutral-900 border-rose-500/50 text-white' : 'border-neutral-800 text-neutral-500'}`}>
                    {"> "} {log}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'activities' && (
          <div className="flex flex-col gap-3">
            <h2 className="text-lg font-black text-white uppercase tracking-wider mb-2">{lang === 'tr' ? 'AKTİVİTELER' : 'ACTIVITIES'}</h2>
            {[
              { id: 'school', icon: '📚', tr: 'Okula Git / Çalış', en: 'Go to School', stat: 'GPA+, ENG-' },
              { id: 'mosque', icon: '🕌', tr: 'Camiye Git', en: 'Go to Mosque', stat: 'FAI+, HAP+' },
              { id: 'work', icon: '💼', tr: 'Mesaiye Kal', en: 'Work Shift', stat: '₺₺₺, ENG-' },
              { id: 'bus', icon: '🚌', tr: 'Otobüsle Gez', en: 'Ride Bus', stat: '? RND ?' },
              { id: 'hospital', icon: '🏥', tr: 'Hastaneye Git', en: 'Go to Hospital', stat: '-1000₺, HP MAX' },
              { id: 'sleep', icon: '🛏️', tr: 'Uyu & Dinlen', en: 'Sleep & Rest', stat: 'ENG MAX' }
            ].map(act => (
              <button key={act.id} onClick={() => doActivity(act.id)} className="p-4 bg-neutral-900 border-2 border-neutral-800 rounded-xl text-left flex justify-between items-center active:bg-neutral-800 active:border-rose-500 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{act.icon}</span>
                  <span className="font-bold">{lang === 'tr' ? act.tr : act.en}</span>
                </div>
                <span className="text-[10px] font-black text-neutral-500 bg-black px-2 py-1 rounded">{act.stat}</span>
              </button>
            ))}
          </div>
        )}

        {activeTab === 'realestate' && (
          <div className="flex flex-col gap-3">
            <h2 className="text-lg font-black text-white uppercase tracking-wider mb-2">{lang === 'tr' ? 'EMLAK OFİSİ' : 'REAL ESTATE'}</h2>
            {realEstateList.map((prop, idx) => (
              <button key={idx} onClick={() => buyProperty(prop)} className="p-4 bg-neutral-900 border-2 border-neutral-800 rounded-xl text-left active:border-emerald-500 transition-colors flex flex-col gap-2">
                <div className="flex justify-between items-start">
                  <span className="font-bold text-white">{prop.name[lang]}</span>
                  <span className={`text-[10px] font-black px-2 py-1 rounded uppercase ${prop.type === 'rent' ? 'bg-rose-950 text-rose-400' : 'bg-emerald-950 text-emerald-400'}`}>
                    {prop.type === 'rent' ? (lang === 'tr' ? 'KİRALIK' : 'RENT') : (lang === 'tr' ? 'SATILIK' : 'BUY')}
                  </span>
                </div>
                <span className="font-black text-lg text-emerald-400">{prop.price.toLocaleString()} ₺ {prop.type === 'rent' && '/ay'}</span>
              </button>
            ))}
          </div>
        )}

        {activeTab === 'shopping' && (
          <div className="flex flex-col gap-3">
            <h2 className="text-lg font-black text-white uppercase tracking-wider mb-2">{lang === 'tr' ? 'MARKET' : 'SHOP'}</h2>
            <div className="mb-2 bg-black p-4 rounded-xl border-2 border-neutral-800">
              <span className="text-[10px] font-bold text-neutral-500 uppercase block mb-2">{lang === 'tr' ? 'ENVANTER' : 'INVENTORY'}</span>
              <p className="text-amber-400 font-mono text-sm leading-relaxed">
                {player.inventory.length > 0 ? player.inventory.join(' • ') : (lang === 'tr' ? '[ BOŞ ]' : '[ EMPTY ]')}
              </p>
            </div>
            {shopItems.map((item, idx) => (
              <button key={idx} onClick={() => buyItem(item)} className="p-4 bg-neutral-900 border-2 border-neutral-800 rounded-xl text-left active:border-amber-500 transition-colors flex justify-between items-center">
                <span className="font-bold text-white">{item.name[lang]}</span>
                <span className="font-black text-amber-400">{item.cost.toLocaleString()} ₺</span>
              </button>
            ))}
          </div>
        )}

        {activeTab === 'jobs' && (
          <div className="flex flex-col gap-3">
            <h2 className="text-lg font-black text-white uppercase tracking-wider mb-2">{lang === 'tr' ? 'İŞ İLANLARI' : 'JOB BOARD'}</h2>
            {jobsList.map((job, idx) => (
              <button key={idx} onClick={() => changeJob(job)} className="p-4 bg-neutral-900 border-2 border-neutral-800 rounded-xl text-left active:border-sky-500 transition-colors flex flex-col gap-1">
                <span className="font-bold text-white">{job[lang]}</span>
                <span className="font-black text-emerald-400 text-sm">+{job.salary.toLocaleString()} ₺ {lang === 'tr' ? '/ay' : '/mo'}</span>
              </button>
            ))}
          </div>
        )}

        {activeTab === 'travel' && (
          <div className="flex flex-col gap-3">
            <h2 className="text-lg font-black text-white uppercase tracking-wider mb-2">{lang === 'tr' ? 'SEYAHAT' : 'TRAVEL'}</h2>
            {locations.map((loc, idx) => (
              <button key={idx} onClick={() => travel(loc)} disabled={player.location === loc.id} className={`p-4 rounded-xl text-left flex justify-between items-center border-2 transition-colors ${player.location === loc.id ? 'bg-sky-950 border-sky-500 opacity-60' : 'bg-neutral-900 border-neutral-800 active:border-purple-500'}`}>
                <span className="font-bold text-white flex items-center gap-2">
                  {loc.name[lang]} {player.location === loc.id && '📍'}
                </span>
                {player.location !== loc.id && <span className="font-black text-rose-400">BİLET: {loc.cost} ₺</span>}
              </button>
            ))}
          </div>
        )}
      </div>

      <nav className="fixed bottom-0 w-full bg-neutral-900 border-t-2 border-neutral-800 p-2 pb-6 px-2 z-20 shadow-[0_-10px_20px_rgba(0,0,0,0.5)]">
        <div className="max-w-md mx-auto grid grid-cols-6 gap-1 text-[9px] font-black text-center text-neutral-500 uppercase tracking-tighter">
          {navTabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors ${activeTab === tab.id ? 'text-rose-400 bg-neutral-950 border border-neutral-800' : 'hover:bg-neutral-800'}`}>
              <span className="text-xl mb-1 filter drop-shadow-md">{tab.icon}</span>
              {lang === 'tr' ? tab.tr : tab.en}
            </button>
          ))}
        </div>
      </nav>
    </main>
  );
}