'use client';

import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

type Language = 'tr' | 'en';

interface PlayerStats {
  name: string;
  age: number;
  money: number;
  health: number;
  happiness: number;
  energy: number;
  status: { tr: string; en: string };
  location: { tr: string; en: string };
}

interface GameEvent {
  id: string;
  category: 'street' | 'university' | 'economy' | 'travel';
  title: { tr: string; en: string };
  description: { tr: string; en: string };
  choices: {
    text: { tr: string; en: string };
    effect: (stats: PlayerStats) => PlayerStats;
    response: { tr: string; en: string };
  }[];
}

const universalEvents: GameEvent[] = [
  {
    id: 'kyk_burs_day',
    category: 'economy',
    title: { tr: 'KYK Bursu Yatmış! 💳', en: 'KYK Allowance Credited! 💳' },
    description: {
      tr: 'Ayın 6\'sı geldi ve Ziraat bankası hesabına KYK bursu yattı. Enflasyon ortasında bu parayı nasıl değerlendireceksin?',
      en: 'The 6th of the month has arrived, and your student allowance hit your account. How will you manage it amidst inflation?'
    },
    choices: [
      {
        text: { tr: 'Hepsini dışarıda yemek ve eğlenceye harca', en: 'Blow it all on food and going out' },
        effect: (s) => ({ ...s, money: s.money - 1500, happiness: Math.min(100, s.happiness + 25), energy: Math.min(100, s.energy + 20) }),
        response: { tr: 'Anlık keyif yaşandı ama cüzdan erken boşaldı!', en: 'Instant joy achieved, but the wallet emptied early!' }
      },
      {
        text: { tr: 'Akbil doldur ve bütçeyi idareli kullan', en: 'Top up your Akbil and budget carefully' },
        effect: (s) => ({ ...s, money: s.money - 300, happiness: Math.min(100, s.happiness + 5), energy: Math.min(100, s.energy + 10) }),
        response: { tr: 'Akıllıca bir hamle! Ulaşım derdi bitti.', en: 'Smart move! Transportation worries solved for now.' }
      }
    ]
  },
  {
    id: 'historical_trip_ephesus',
    category: 'travel',
    title: { tr: 'Efes Antik Kenti Gezisi', en: 'Trip to Ancient Ephesus' },
    description: {
      tr: 'Hafta sonu arkadaş grubunla İzmir Selçuk\'taki Efes Antik Kenti\'ne ya da Bodrum sahiline kaçamak yapma planı yapıyorsunuz.',
      en: 'You and your friends are planning a weekend getaway to the ancient city of Ephesus in Izmir or the shores of Bodrum.'
    },
    choices: [
      {
        text: { tr: 'Kültür turu yap, Efes Harabeleri\'ni gez', en: 'Go cultural, explore the Ephesus ruins' },
        effect: (s) => ({ ...s, money: s.money - 750, happiness: Math.min(100, s.happiness + 30), energy: Math.max(0, s.energy - 10) }),
        response: { tr: 'Tarihe tanıklık ettin, ruhun dinlendi ama bütçe azaldı.', en: 'Witnessed history, your soul refreshed but your budget dropped.' }
      },
      {
        text: { tr: 'Sahile in, Akdeniz güneşinin tadını çıkar', en: 'Head to the coast, enjoy the Mediterranean sun' },
        effect: (s) => ({ ...s, money: s.money - 1200, health: Math.min(100, s.health + 10), happiness: Math.min(100, s.happiness + 35) }),
        response: { tr: 'Sahil havası tüm yılın yorgunluğunu aldı götürdü!', en: 'Coastal air washed away the fatigue of the whole year!' }
      }
    ]
  },
  {
    id: 'istanbul_vapur_cay',
    category: 'street',
    title: { tr: 'Vapurda Çay ve Simit Keyfi', en: 'Tea and Simit on the Ferry' },
    description: {
      tr: 'Boğaz hattında vapurla seyrederken martılara simit atmak ve demli çay yudumlamak gibisi yok.',
      en: 'Cruising across the Bosphorus on a ferry while feeding seagulls and sipping brewed tea is unmatched.'
    },
    choices: [
      {
        text: { tr: 'Çay ve simit al, manzaranın tadını çıkar (40 TL)', en: 'Get tea and simit, enjoy the view (40 TL)' },
        effect: (s) => ({ ...s, money: s.money - 40, happiness: Math.min(100, s.happiness + 15), energy: Math.min(100, s.energy + 10) }),
        response: { tr: 'Klasik Türkiye huzuru! Keyfin yerine geldi.', en: 'Classic Turkish peace! Your mood is lifted.' }
      },
      {
        text: { tr: 'Sadece müziği dinle ve masraf yapma', en: 'Just listen to music and save money' },
        effect: (s) => ({ ...s, happiness: Math.min(100, s.happiness + 5) }),
        response: { tr: 'Tasarruf yaptın ama çayın eksikliğini hissettin.', en: 'Saved money, but missed out on the tea.' }
      }
    ]
  }
];

export default function GameHome() {
  const [lang, setLang] = useState<Language>('tr');
  const [eventIndex, setEventIndex] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);

  const [player, setPlayer] = useState<PlayerStats>({
    name: 'Oyuncu',
    age: 21,
    money: 4500.00,
    health: 90,
    happiness: 80,
    energy: 85,
    status: {
      tr: 'Üniversite Öğrencisi / Gezgin',
      en: 'University Student / Traveler'
    },
    location: {
      tr: 'Türkiye',
      en: 'Turkey'
    }
  });

  const currentEvent = universalEvents[eventIndex];

  const handleChoice = (choice: typeof currentEvent.choices[0]) => {
    const updated = choice.effect(player);
    setPlayer(updated);
    setFeedback(choice.response[lang]);
  };

  const nextEvent = () => {
    setFeedback(null);
    setEventIndex((prev) => (prev + 1) % universalEvents.length);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center p-4 md:p-8 font-sans">
      {/* Header */}
      <header className="w-full max-w-2xl flex justify-between items-center mb-6 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-black tracking-wider text-red-500">
            TÜRKİYE HAYATI <span className="text-xs bg-red-950 text-red-400 px-2 py-0.5 rounded border border-red-800">v2.1</span>
          </h1>
          <p className="text-xs text-slate-400">
            {lang === 'tr' ? 'Kültür, Sokaklar ve Yaşam Simülasyonu' : 'Culture, Streets & Life Simulation'}
          </p>
        </div>
        <button
          onClick={() => setLang(lang === 'tr' ? 'en' : 'tr')}
          className="bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg text-sm font-semibold border border-slate-700 transition"
        >
          {lang === 'tr' ? '🇬🇧 English' : '🇹🇷 Türkçe'}
        </button>
      </header>

      {/* Stats Dashboard */}
      <section className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-xl p-4 mb-6 shadow-xl grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <p className="text-xs text-slate-400">{lang === 'tr' ? 'Bakiye' : 'Balance'}</p>
          <p className="font-bold text-lg text-emerald-400">{player.money.toLocaleString()} ₺</p>
        </div>
        <div>
          <p className="text-xs text-slate-400">{lang === 'tr' ? 'Sağlık / Mutluluk' : 'Health / Happy'}</p>
          <p className="font-bold text-lg text-sky-400">❤️ {player.health}% | 😃 {player.happiness}%</p>
        </div>
        <div>
          <p className="text-xs text-slate-400">{lang === 'tr' ? 'Enerji' : 'Energy'}</p>
          <p className="font-bold text-lg text-amber-400">⚡ {player.energy}%</p>
        </div>
        <div>
          <p className="text-xs text-slate-400">{lang === 'tr' ? 'Yaş' : 'Age'}</p>
          <p className="font-bold text-lg">{player.age}</p>
        </div>
      </section>

      {/* Game Window */}
      <section className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl flex flex-col gap-6">
        <div>
          <span className="text-xs uppercase tracking-widest bg-slate-800 text-amber-400 px-2 py-1 rounded font-semibold">
            {currentEvent.category}
          </span>
          <h2 className="text-xl font-bold text-amber-300 mt-2 mb-2">{currentEvent.title[lang]}</h2>
          <p className="text-slate-300 text-base leading-relaxed">{currentEvent.description[lang]}</p>
        </div>

        {feedback ? (
          <div className="bg-slate-950 border border-slate-700 p-4 rounded-lg flex flex-col gap-4">
            <p className="text-emerald-300 font-medium">{feedback}</p>
            <button
              onClick={nextEvent}
              className="self-end bg-red-600 hover:bg-red-500 text-white font-bold px-5 py-2 rounded-lg transition"
            >
              {lang === 'tr' ? 'Sıradaki Olay ➔' : 'Next Event ➔'}
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {currentEvent.choices.map((choice, idx) => (
              <button
                key={idx}
                onClick={() => handleChoice(choice)}
                className="w-full text-left bg-slate-800 hover:bg-slate-700 border border-slate-700 p-4 rounded-lg font-medium transition duration-200 flex justify-between items-center group"
              >
                <span>{choice.text[lang]}</span>
                <span className="text-slate-500 group-hover:text-white transition">▶</span>
              </button>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}