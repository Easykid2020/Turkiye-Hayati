'use client';

import React, { useState } from 'react';

type Language = 'en' | 'tr';

export default function Onboarding({ onComplete }: { onComplete: (data: any) => void }) {
  const [lang, setLang] = useState<Language>('en'); 
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState('');
  const [traits, setTraits] = useState<string[]>([]);
  const [dream, setDream] = useState('');
  const [lotteryResult, setLotteryResult] = useState<any>(null);
  const [isSpinning, setIsSpinning] = useState(false);

  const text = {
    en: {
      title: 'Türkiye Hayatı',
      step: 'Step',
      of: 'of',
      createAcc: 'Create account',
      createSub: 'Write your own story in Türkiye Hayatı.',
      username: 'Username',
      placeholder: 'e.g. istanbul_boss',
      continue: 'Continue',
      personality: 'Personality',
      persSub: 'Choose 2 traits for',
      dream: 'Dream',
      dreamSub: 'What is your big dream?',
      lottery: 'Birth Lottery',
      lotterySub1: 'In Türkiye, everyone is born into something.',
      lotterySub2: 'What were you born into?',
      roll: 'Roll Dice',
      rolling: 'Rolling...',
      home: 'Home',
      homeSub: 'Where will you live? Rent is paid every Saturday.',
      moveIn: 'Move In',
      rentLabel: 'Rent',
      week: 'week',
      perkLabel: 'Start with',
      lotteryResultTitle: 'Trust Fund Baby!',
      lotteryResultDesc: 'Thanks to your father\'s government tenders, you start life 5-0 ahead.',
      lotteryResultPerk: 'You don\'t need to worry about rent, you have money.'
    },
    tr: {
      title: 'Türkiye Hayatı',
      step: 'Adım',
      of: '/',
      createAcc: 'Hesap oluştur',
      createSub: 'Türkiye Hayatı\'nda kendi hikayeni yaz.',
      username: 'Kullanıcı Adı',
      placeholder: 'örn. istanbul_beyi',
      continue: 'Devam Et',
      personality: 'Karakter',
      persSub: 'Şunun için 2 özellik seç:',
      dream: 'Hayal',
      dreamSub: 'En büyük hayalin nedir?',
      lottery: 'Doğum Piyangosu',
      lotterySub1: 'Türkiye\'de herkes bir şeylerin içine doğar.',
      lotterySub2: 'Sen neye doğdun?',
      roll: 'Zar At',
      rolling: 'Zarlar Atılıyor...',
      home: 'Ev',
      homeSub: 'Nerede yaşayacaksın? Kiralar her Cumartesi ödenir.',
      moveIn: 'Taşın',
      rentLabel: 'Kira',
      week: 'hafta',
      perkLabel: 'Şununla başla',
      lotteryResultTitle: 'Müteahhit Çocuğu!',
      lotteryResultDesc: 'Babanın ihaleleri sayesinde hayata 5-0 önde başladın.',
      lotteryResultPerk: 'Kirayı düşünmene gerek yok, paran var.'
    }
  };

  const t = text[lang];

  const traitOptions = [
    { id: 'ticaret', title: { en: 'Business Mind', tr: 'Ticaret Zekası' }, desc: { en: 'Your street trading skills increase faster.', tr: 'Sokak ticareti becerilerin daha hızlı artar.' } },
    { id: 'gurme', title: { en: 'Foodie', tr: 'Gurme' }, desc: { en: 'You gain extra happiness from food.', tr: 'Yemeklerden ekstra mutluluk kazanırsın.' } },
    { id: 'gece_kusu', title: { en: 'Night Owl', tr: 'Gece Kuşu' }, desc: { en: 'Your stress instantly resets in nightclubs.', tr: 'Gece kulüplerinde stresin anında sıfırlanır.' } },
    { id: 'spor_delisi', title: { en: 'Gym Rat', tr: 'Spor Delisi' }, desc: { en: 'Your health points drop slower.', tr: 'Sağlık puanın daha yavaş düşer.' } }
  ];

  const dreamOptions = [
    { id: 'ceo', title: { en: 'Holding CEO', tr: 'Holding CEO\'su' }, desc: { en: 'Reach the absolute peak of the career ladder.', tr: 'Kariyer basamaklarının en zirvesine ulaş.' } },
    { id: 'yali', title: { en: 'Bosphorus Mansion', tr: 'Boğaz\'da Yalı' }, desc: { en: 'Reach a million-dollar net worth and buy a mansion.', tr: 'Milyon dolarlık net servete ulaş ve yalı al.' } },
    { id: 'fenomen', title: { en: 'T-Rap Star', tr: 'T-Rap Yıldızı' }, desc: { en: 'Max out your music and fame levels.', tr: 'Müzik ve şöhret seviyeni maksimuma çıkar.' } }
  ];

  const neighborhoods = [
    { id: 'bagcilar', name: 'Bağcılar (Hard Start)', rent: 1500, desc: { en: 'Cheap rent, lots of action. Street rules apply.', tr: 'Ucuz kira, bol aksiyon. Sokak kuralları geçerli.' } },
    { id: 'kadikoy', name: 'Kadıköy (Balanced)', rent: 5000, desc: { en: 'Cafes, art, and sea breeze. Perfectly balanced.', tr: 'Kafeler, sanat ve deniz havası. Tam kararında.' } },
    { id: 'etiler', name: 'Etiler (Big Spender)', rent: 15000, desc: { en: 'Luxury cars and high society.', tr: 'Lüks arabalar ve yüksek sosyete.' } }
  ];

  const toggleTrait = (id: string) => {
    if (traits.includes(id)) {
      setTraits(traits.filter(item => item !== id));
    } else if (traits.length < 2) {
      setTraits([...traits, id]);
    }
  };

  const spinLottery = () => {
    setIsSpinning(true);
    setTimeout(() => {
      setLotteryResult({
        title: t.lotteryResultTitle,
        desc: t.lotteryResultDesc,
        money: 5000000,
        perk: t.lotteryResultPerk
      });
      setIsSpinning(false);
    }, 2000);
  };

  const handleFinish = (neighborhood: any) => {
    onComplete({
      username,
      traits,
      dream,
      money: lotteryResult.money,
      location: neighborhood.id,
      rent: neighborhood.rent
    });
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 font-sans text-slate-800">
      
      <div className="fixed top-0 w-full bg-white/90 backdrop-blur-md px-6 py-4 flex justify-between items-center border-b border-slate-200 z-50 shadow-sm">
        <h1 className="font-black text-xl tracking-tighter text-red-600 uppercase">Türkiye Hayatı</h1>
        
        <div className="flex items-center gap-4">
          <div className="bg-slate-100 p-1 rounded-lg flex border border-slate-200">
            <button 
              onClick={() => setLang('en')} 
              className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${lang === 'en' ? 'bg-white shadow-sm text-red-600' : 'text-slate-400'}`}
            >
              EN
            </button>
            <button 
              onClick={() => setLang('tr')} 
              className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${lang === 'tr' ? 'bg-white shadow-sm text-red-600' : 'text-slate-400'}`}
            >
              TR
            </button>
          </div>
          
          {step > 1 && <span className="text-xs font-bold text-slate-400">{t.step} {step} {t.of} 5</span>}
        </div>
      </div>

      <div className="bg-white w-full max-w-3xl rounded-[2rem] shadow-[0_15px_40px_rgba(250,204,21,0.15)] border border-slate-200 flex flex-col md:flex-row overflow-hidden min-h-[500px] mt-12 relative">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-600 via-red-500 to-yellow-400 z-10"></div>

        <div className="bg-slate-50 w-full md:w-5/12 p-8 flex flex-col items-center justify-center border-r border-slate-100 relative">
          <div className="w-full h-full min-h-[300px] flex-1 relative bg-gradient-to-b from-slate-200 to-slate-100 rounded-3xl overflow-hidden shadow-inner border-[4px] border-white mb-4 flex flex-col items-center justify-center">
            <div className="w-20 h-32 bg-red-600 rounded-2xl shadow-lg relative flex items-center justify-center border border-red-500 animate-pulse">
               <span className="text-white font-black text-xs">TÜRKİYE</span>
            </div>
            <p className="text-[10px] font-bold text-slate-400 mt-3 uppercase tracking-wider">3D Avatar Preview</p>
          </div>
          <p className="font-bold text-slate-700 z-10">{username || '@username'}</p>
        </div>

        <div className="w-full md:w-7/12 p-8 md:p-10 flex flex-col justify-center bg-white relative">
          
          {step === 1 && (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-black text-slate-800 mb-2">{t.createAcc}</h2>
              <p className="text-sm text-slate-500 mb-8">{t.createSub}</p>
              
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 ml-1">{t.username}</label>
                  <input 
                    type="text" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder={t.placeholder}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all font-medium"
                  />
                </div>
              </div>
              <button 
                onClick={() => setStep(2)}
                disabled={!username.trim()}
                className="w-full bg-red-600 hover:bg-red-500 disabled:bg-slate-200 text-white font-bold py-3.5 rounded-xl mt-8 transition-colors shadow-md disabled:shadow-none"
              >
                {t.continue}
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-black text-slate-800 mb-2">{t.personality}</h2>
              <p className="text-sm text-slate-500 mb-6">{t.persSub} {username}.</p>
              
              <div className="grid grid-cols-1 gap-3">
                {traitOptions.map(trait => (
                  <button 
                    key={trait.id}
                    onClick={() => toggleTrait(trait.id)}
                    className={`text-left p-4 rounded-2xl border-2 transition-all ${traits.includes(trait.id) ? 'border-yellow-400 bg-yellow-50' : 'border-slate-100 hover:border-slate-300'}`}
                  >
                    <h3 className="font-bold text-slate-800">{trait.title[lang]}</h3>
                    <p className="text-xs text-slate-500 mt-1">{trait.desc[lang]}</p>
                  </button>
                ))}
              </div>
              <button 
                onClick={() => setStep(3)}
                disabled={traits.length !== 2}
                className="w-full bg-red-600 disabled:bg-slate-200 text-white font-bold py-3.5 rounded-xl mt-6 transition-colors shadow-md disabled:shadow-none"
              >
                {t.continue}
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-black text-slate-800 mb-2">{t.dream}</h2>
              <p className="text-sm text-slate-500 mb-6">{t.dreamSub}</p>
              
              <div className="grid grid-cols-1 gap-3">
                {dreamOptions.map(d => (
                  <button 
                    key={d.id}
                    onClick={() => setDream(d.id)}
                    className={`text-left p-4 rounded-2xl border-2 transition-all ${dream === d.id ? 'border-yellow-400 bg-yellow-50' : 'border-slate-100 hover:border-slate-300'}`}
                  >
                    <h3 className="font-bold text-slate-800">{d.title[lang]}</h3>
                    <p className="text-xs text-slate-500 mt-1">{d.desc[lang]}</p>
                  </button>
                ))}
              </div>
              <button 
                onClick={() => setStep(4)}
                disabled={!dream}
                className="w-full bg-red-600 disabled:bg-slate-200 text-white font-bold py-3.5 rounded-xl mt-6 transition-colors shadow-md disabled:shadow-none"
              >
                {t.continue}
              </button>
            </div>
          )}

          {step === 4 && (
            <div className="animate-fade-in flex flex-col items-center justify-center text-center py-10">
              <h2 className="text-2xl font-black text-slate-800 mb-2">{t.lottery}</h2>
              <p className="text-sm text-slate-500 mb-8">{t.lotterySub1}<br/>{t.lotterySub2}</p>
              
              {!lotteryResult ? (
                <button 
                  onClick={spinLottery}
                  disabled={isSpinning}
                  className="bg-yellow-400 hover:bg-yellow-300 text-yellow-900 font-black text-xl px-12 py-5 rounded-2xl shadow-[0_10px_20px_rgba(250,204,21,0.3)] transition-transform active:scale-95 border-b-4 border-yellow-500 active:border-b-0"
                >
                  {isSpinning ? t.rolling : t.roll}
                </button>
              ) : (
                <div className="bg-gradient-to-br from-yellow-50 to-white border-2 border-yellow-300 p-6 rounded-3xl w-full animate-fade-in shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/10 rounded-full blur-3xl"></div>
                  <div className="text-4xl mb-3">💰</div>
                  <h3 className="font-black text-2xl text-yellow-800">{lotteryResult.title}</h3>
                  <p className="text-sm font-bold text-yellow-700 mt-2">{lotteryResult.desc}</p>
                  <div className="mt-4 pt-4 border-t border-yellow-200 text-left space-y-2 text-xs font-bold text-yellow-800">
                    <p>✓ {t.perkLabel} {lotteryResult.money.toLocaleString()} ₺</p>
                    <p>✓ {lotteryResult.perk}</p>
                  </div>
                  <button onClick={() => setStep(5)} className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3 rounded-xl mt-6 shadow-md transition-colors">
                    {t.homeSub.split('?')[0]}?
                  </button>
                </div>
              )}
            </div>
          )}

          {step === 5 && (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-black text-slate-800 mb-2">{t.home}</h2>
              <p className="text-sm text-slate-500 mb-6">{t.homeSub}</p>
              
              <div className="grid grid-cols-1 gap-3 h-64 overflow-y-auto pr-2 custom-scrollbar">
                {neighborhoods.map(hood => (
                  <button 
                    key={hood.id}
                    onClick={() => handleFinish(hood)}
                    className="text-left p-4 rounded-2xl border-2 border-slate-100 hover:border-red-500 hover:bg-red-50 transition-all flex justify-between items-center group"
                  >
                    <div>
                      <h3 className="font-bold text-slate-800">{hood.name}</h3>
                      <p className="text-[10px] text-slate-500 mt-1">{hood.desc[lang]}</p>
                      <p className="text-xs font-bold text-red-600 mt-2">{t.rentLabel}: {hood.rent.toLocaleString()} ₺/{t.week}</p>
                    </div>
                    <span className="opacity-0 group-hover:opacity-100 bg-red-600 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-md transition-all transform translate-x-2 group-hover:translate-x-0">
                      {t.moveIn}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}