'use client';

import React, { useState } from 'react';

type Language = 'en' | 'tr';

export default function Onboarding({ onComplete }: { onComplete: (data: any) => void }) {
  const [lang, setLang] = useState<Language>('en'); 
  const [username, setUsername] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [selectedHood, setSelectedHood] = useState('kadikoy');

  const text = {
    en: {
      title: 'Türkiye Hayatı',
      subtitle: 'Create your account and start your hustle.',
      username: 'Username',
      placeholder: 'e.g. istanbul_boss',
      genderLabel: 'Avatar Style',
      male: 'Efendi (Male)',
      female: 'Hanım (Female)',
      hoodLabel: 'Starting District',
      startBtn: 'Start Life (5,000,000 ₺)'
    },
    tr: {
      title: 'Türkiye Hayatı',
      subtitle: 'Hesabını oluştur ve maceraya başla.',
      username: 'Kullanıcı Adı',
      placeholder: 'örn. istanbul_beyi',
      genderLabel: 'Avatar Stili',
      male: 'Beyefendi',
      female: 'Hanımefendi',
      hoodLabel: 'Başlangıç Semti',
      startBtn: 'Hayata Başla (5,000,000 ₺)'
    }
  };

  const t = text[lang];

  const neighborhoods = [
    { id: 'bagcilar', name: 'Bağcılar', rent: 1500, desc: 'Hard start, low rent' },
    { id: 'kadikoy', name: 'Kadıköy Sahil', rent: 5000, desc: 'Balanced, cafes & sea' },
    { id: 'etiler', name: 'Etiler', rent: 15000, desc: 'High society & luxury' }
  ];

  const handleStart = () => {
    if (!username.trim()) return;
    const hood = neighborhoods.find(h => h.id === selectedHood) || neighborhoods[1];
    onComplete({
      username,
      gender,
      money: 5000000,
      location: hood.id,
      rent: hood.rent
    });
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 font-sans text-slate-800 relative overflow-hidden">
      
      {/* Background glow effects */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-red-600/20 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-yellow-500/20 rounded-full blur-3xl"></div>

      <div className="fixed top-4 right-6 z-50 flex bg-white/10 backdrop-blur-md p-1 rounded-xl border border-white/20">
        <button 
          onClick={() => setLang('en')} 
          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${lang === 'en' ? 'bg-white text-red-600 shadow-sm' : 'text-white/70'}`}
        >
          EN
        </button>
        <button 
          onClick={() => setLang('tr')} 
          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${lang === 'tr' ? 'bg-white text-red-600 shadow-sm' : 'text-white/70'}`}
        >
          TR
        </button>
      </div>

      <div className="bg-white w-full max-w-md rounded-[2.5px] p-8 shadow-2xl border border-slate-100 relative z-10 animate-fade-in">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-600 via-red-500 to-yellow-400 rounded-t-[2.5px]"></div>
        
        <div className="text-center mb-6 mt-2">
          <h1 className="text-2xl font-black text-red-600 uppercase tracking-tight">{t.title}</h1>
          <p className="text-xs text-slate-500 mt-1">{t.subtitle}</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-600 ml-1">{t.username}</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={t.placeholder}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all font-medium mt-1"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-600 ml-1">{t.genderLabel}</label>
            <div className="grid grid-cols-2 gap-2 mt-1">
              <button 
                onClick={() => setGender('male')}
                className={`py-3 rounded-xl border-2 text-xs font-bold transition-all ${gender === 'male' ? 'border-red-600 bg-red-50 text-red-700' : 'border-slate-200 text-slate-600'}`}
              >
                👨 {t.male}
              </button>
              <button 
                onClick={() => setGender('female')}
                className={`py-3 rounded-xl border-2 text-xs font-bold transition-all ${gender === 'female' ? 'border-red-600 bg-red-50 text-red-700' : 'border-slate-200 text-slate-600'}`}
              >
                👩 {t.female}
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-600 ml-1">{t.hoodLabel}</label>
            <div className="space-y-2 mt-1">
              {neighborhoods.map(h => (
                <div 
                  key={h.id}
                  onClick={() => setSelectedHood(h.id)}
                  className={`p-3 rounded-xl border-2 cursor-pointer transition-all flex justify-between items-center ${selectedHood === h.id ? 'border-red-600 bg-red-50/50' : 'border-slate-200 hover:border-slate-300'}`}
                >
                  <div>
                    <p className="text-xs font-bold text-slate-800">{h.name}</p>
                    <p className="text-[10px] text-slate-500">{h.desc}</p>
                  </div>
                  <span className="text-xs font-bold text-red-600">{h.rent.toLocaleString()} ₺/wk</span>
                </div>
              ))}
            </div>
          </div>

          <button 
            onClick={handleStart}
            disabled={!username.trim()}
            className="w-full bg-red-600 hover:bg-red-500 disabled:bg-slate-200 text-white font-bold py-4 rounded-xl mt-4 transition-colors shadow-lg shadow-red-600/20 disabled:shadow-none text-sm"
          >
            {t.startBtn}
          </button>
        </div>
      </div>
    </div>
  );
}