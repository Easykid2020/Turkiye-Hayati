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
  job: { tr: string; en: string; salary: number };
  housing: { tr: string; en: string; rent: number };
  status: { tr: string; en: string };
  location: { tr: string; en: string };
}

interface GameEvent {
  id: string;
  category: 'street' | 'university' | 'economy' | 'travel' | 'work' | 'housing';
  title: { tr: string; en: string };
  description: { tr: string; en: string };
  choices: {
    text: { tr: string; en: string };
    effect: (stats: PlayerStats) => PlayerStats;
    response: { tr: string; en: string };
  }[];
}

const gameEvents: GameEvent[] = [
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
    id: 'monthly_financial_cycle',
    category: 'economy',
    title: { tr: 'Aylık Ödeme ve Kira Günü 🏠💰', en: 'Monthly Bills & Rent Day 🏠💰' },
    description: {
      tr: 'Ay sonu geldi! Maaşın yatıyor ancak seçtiğin konutun kirasını da ödeme vakti.',
      en: 'End of the month is here! Your salary is credited, but it is also time to pay your housing rent.'
    },
    choices: [
      {
        text: { tr: 'Maaşı al ve kirayı öde', en: 'Collect salary and pay rent' },
        effect: (s) => ({ ...s, money: s.money + s.job.salary - s.housing.rent, happiness: Math.max(0, s.happiness - 5) }),
        response: { tr: `Maaş alındı (+${s.job.salary.toLocaleString()} ₺) ve kira ödendi (-${s.housing.rent.toLocaleString()} ₺).`, en: `Salary collected (+${s.job.salary.toLocaleString()} ₺) and rent paid (-${s.housing.rent.toLocaleString()} ₺).` }
      }
    ]
  },
  {
    id: 'landlord_negotiation',
    category: 'housing',
    title: { tr: 'Ev Sahibinden Zam Haberi 📈', en: 'Landlord Rent Hike Notice 📈' },
    description: {
      tr: 'Ev sahibi piyasa koşullarını bahane ederek kiraya %50 zam yapmak istediğini söylüyor!',
      en: 'The landlord calls, demanding a 50% rent hike citing market conditions!'
    },
    choices: [
      {
        text: { tr: 'Zammı kabul et ve bütçeyi kıs', en: 'Accept the hike and tighten your budget' },
        effect: (s) => ({ ...s, housing: { ...s.housing, rent: Math.round(s.housing.rent * 1.5) }, happiness: Math.max(0, s.happiness - 15) }),
        response: { tr: 'Kira masrafın önemli ölçüde arttı!', en: 'Your monthly rent expenses increased significantly!' }
      },
      {
        text: { tr: 'KYK yurduna veya daha küçük bir odaya taşın', en: 'Move to a KYK dorm or smaller room' },
        effect: (s) => ({ ...s, housing: { tr: 'KYK Yurdu', en: 'KYK Dormitory', rent: 800 }, happiness: Math.max(0, s.happiness - 10) }),
        response: { tr: 'Yurda yerleştin, kira masrafın azaldı ama odada 4 kişisiniz.', en: 'Moved into the dorm, rent dropped but you share with 4 people.' }
      }
    ]
  },
  {
    id: 'derby_match_crisis',
    category: 'street',
    title: { tr: 'Derbi Heyecanı ⚽', en: 'Derby Match Fever ⚽' },
    description: {
      tr: 'Büyük derbi gecesi geldi! Maçı stadyumda izlemek mi, yoksa mahalle kahvesinde izlemek mi?',
      en: 'The big derby night has arrived! Watch it at the stadium or at a local spot with friends?'
    },
    choices: [
      {
        text: { tr: 'Bilet al ve stadyum atmosferini yaşa (-1000 TL)', en: 'Buy stadium tickets (-1000 TL)' },
        effect: (s) => ({ ...s, money: s.money - 1000, happiness: Math.min(100, s.happiness + 40) }),
        response: { tr: 'Stadyum sesinden kulakların çınladı, unutulmaz gece!', en: 'Unforgettable night at the stadium!' }
      },
      {
        text: { tr: 'Mahallede çay eşliğinde izle (-50 TL)', en: 'Watch locally with tea (-50 TL)' },
        effect: (s) => ({ ...s, money: s.money - 50, happiness: Math.min(100, s.happiness + 15) }),
        response: { tr: 'Sıcak ortam ve çay ile harika bir maç keyfi.', en: 'Great match experience with warm tea.' }
      }
    ]
  }
];

export default function GameHome() {
  const [lang, setLang] = useState<Language>('tr');
  const [eventIndex, setEventIndex] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [showJobModal, setShowJobModal] = useState(false);
  const [showHousingModal, setShowHousingModal] = useState(false);

  const [player, setPlayer] = useState<PlayerStats>({
    name: 'Oyuncu',
    age: 21,
    money: 4500.00,
    health: 90,
    happiness: 80,
    energy: 85,
    job: {
      tr: 'Yazılım Stajyeri',
      en: 'Software Intern',
      salary: 6000
    },
    housing: {
      tr: 'Öğrenci Evi (Paylaşımlı)',
      en: 'Student Flat (Shared)',
      rent: 3500
    },
    status: {
      tr: 'Üniversite Öğrencisi / Stajyer',
      en: 'University Student / Intern'
    },
    location: {
      tr: 'Türkiye',
      en: 'Turkey'
    }
  });

  const jobsList = [
    { tr: 'Kurye / Paket Servis', en: 'Delivery Courier', salary: 14000 },
    { tr: 'Yazılım Stajyeri', en: 'Software Intern', salary: 6000 },
    { tr: 'Garson / Barista', en: 'Waiter / Barista', salary: 11000 },
    { tr: 'Özel Ders Öğretmeni', en: 'Private Tutor', salary: 18000 }
  ];

  const housingList = [
    { tr: 'KYK Yurdu', en: 'KYK Dormitory', rent: 800 },
    { tr: 'Öğrenci Evi (Paylaşımlı)', en: 'Student Flat (Shared)', rent: 3500 },
    { tr: 'Stüdyo Daire (Tek Başına)', en: 'Studio Apartment (Solo)', rent: 9500 }
  ];

  const currentEvent = gameEvents[eventIndex];

  const handleChoice = (choice: typeof currentEvent.choices[0]) => {
    const updated = choice.effect(player);
    setPlayer(updated);
    setFeedback(choice.response[lang]);
  };

  const nextEvent = () => {
    setFeedback(null);
    setEventIndex((prev) => (prev + 1) % gameEvents.length);
  };

  const changeJob = (newJob: typeof jobsList[0]) => {
    setPlayer({ ...player, job: newJob });
    setShowJobModal(false);
  };

  const changeHousing = (newHousing: typeof housingList[0]) => {
    setPlayer({ ...player, housing: newHousing });
    setShowHousingModal(false);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center p-4 md:p-8 font-sans">
      {/* Header */}
      <header className="w-full max-w-2xl flex justify-between items-center mb-6 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-black tracking-wider text-red-500">
            TÜRKİYE HAYATI <span className="text-xs bg-red-950 text-red-400 px-2 py-0.5 rounded border border-red-800">v2.4</span>
          </h1>
          <p className="text-xs text-slate-400">
            {lang === 'tr' ? 'Kültür, Sokaklar ve Yaşam Simülasyonu' : 'Culture, Streets & Life Simulation'}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowHousingModal(true)}
            className="bg-sky-600 hover:bg-sky-500 text-slate-950 font-bold px-3 py-1.5 rounded-lg text-xs transition"
          >
            {lang === 'tr' ? '🏠 Ev' : '🏠 Housing'}
          </button>
          <button
            onClick={() => setShowJobModal(true)}
            className="bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold px-3 py-1.5 rounded-lg text-xs transition"
          >
            {lang === 'tr' ? '💼 Meslek' : '💼 Job'}
          </button>
          <button
            onClick={() => setLang(lang === 'tr' ? 'en' : 'tr')}
            className="bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg text-sm font-semibold border border-slate-700 transition"
          >
            {lang === 'tr' ? '🇬🇧 English' : '🇹🇷 Türkçe'}
          </button>
        </div>
      </header>

      {/* Job Selection Modal */}
      {showJobModal && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 max-w-md w-full flex flex-col gap-4 shadow-2xl">
            <h3 className="text-lg font-bold text-amber-300">
              {lang === 'tr' ? 'Meslek Seçimi / Değişikliği' : 'Select or Change Job'}
            </h3>
            <div className="flex flex-col gap-2">
              {jobsList.map((j, i) => (
                <button
                  key={i}
                  onClick={() => changeJob(j)}
                  className="flex justify-between items-center bg-slate-800 hover:bg-slate-700 p-3 rounded-lg border border-slate-700 text-left transition"
                >
                  <span className="font-medium">{j[lang]}</span>
                  <span className="text-emerald-400 font-bold text-sm">+{j.salary.toLocaleString()} ₺/mo</span>
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowJobModal(false)}
              className="mt-2 bg-slate-800 hover:bg-slate-700 py-2 rounded-lg text-sm font-semibold text-slate-300 transition"
            >
              {lang === 'tr' ? 'Kapat' : 'Close'}
            </button>
          </div>
        </div>
      )}

      {/* Housing Selection Modal */}
      {showHousingModal && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 max-w-md w-full flex flex-col gap-4 shadow-2xl">
            <h3 className="text-lg font-bold text-sky-300">
              {lang === 'tr' ? 'Konut ve Yurt Seçimi' : 'Select Housing / Dorm'}
            </h3>
            <div className="flex flex-col gap-2">
              {housingList.map((h, i) => (
                <button
                  key={i}
                  onClick={() => changeHousing(h)}
                  className="flex justify-between items-center bg-slate-800 hover:bg-slate-700 p-3 rounded-lg border border-slate-700 text-left transition"
                >
                  <span className="font-medium">{h[lang]}</span>
                  <span className="text-red-400 font-bold text-sm">-{h.rent.toLocaleString()} ₺/mo</span>
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowHousingModal(false)}
              className="mt-2 bg-slate-800 hover:bg-slate-700 py-2 rounded-lg text-sm font-semibold text-slate-300 transition"
            >
              {lang === 'tr' ? 'Kapat' : 'Close'}
            </button>
          </div>
        </div>
      )}

      {/* Stats Dashboard */}
      <section className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-xl p-4 mb-6 shadow-xl grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <p className="text-xs text-slate-400">{lang === 'tr' ? 'Bakiye' : 'Balance'}</p>
          <p className={`font-bold text-lg ${player.money < 0 ? 'text-red-400' : 'text-emerald-400'}`}>
            {player.money.toLocaleString()} ₺
          </p>
        </div>
        <div>
          <p className="text-xs text-slate-400">{lang === 'tr' ? 'Konut / Kira' : 'Housing / Rent'}</p>
          <p className="font-bold text-sm text-sky-300 truncate">{player.housing[lang]} (-{player.housing.rent.toLocaleString()}₺)</p>
        </div>
        <div>
          <p className="text-xs text-slate-400">{lang === 'tr' ? 'Sağlık / Mutluluk' : 'Health / Happy'}</p>
          <p className="font-bold text-lg text-sky-400">❤️ {player.health}% | 😃 {player.happiness}%</p>
        </div>
        <div>
          <p className="text-xs text-slate-400">{lang === 'tr' ? 'Enerji' : 'Energy'}</p>
          <p className="font-bold text-lg text-amber-400">⚡ {player.energy}%</p>
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