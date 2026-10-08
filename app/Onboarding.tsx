'use client';

import React, { useState } from 'react';

export default function Onboarding({ onComplete }: { onComplete: (data: any) => void }) {
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState('');
  const [traits, setTraits] = useState<string[]>([]);
  const [dream, setDream] = useState('');
  const [lotteryResult, setLotteryResult] = useState<any>(null);
  const [isSpinning, setIsSpinning] = useState(false);

  const traitOptions = [
    { id: 'ticaret', title: 'Ticaret Zekası', desc: 'Sokak ticareti becerilerin daha hızlı artar.' },
    { id: 'gurme', title: 'Gurme', desc: 'Yemeklerden ekstra mutluluk kazanırsın.' },
    { id: 'gece_kusu', title: 'Gece Kuşu', desc: 'Gece kulüplerinde stresin anında sıfırlanır.' },
    { id: 'spor_delisi', title: 'Spor Delisi', desc: 'Sağlık puanın daha yavaş düşer.' }
  ];

  const dreamOptions = [
    { id: 'ceo', title: 'Holding CEO\'su', desc: 'Kariyer basamaklarının en zirvesine ulaş.' },
    { id: 'yali', title: 'Boğaz\'da Yalı', desc: 'Milyon dolarlık net servete ulaş ve yalı al.' },
    { id: 'fenomen', title: 'T-Rap Yıldızı', desc: 'Müzik ve şöhret seviyeni maksimuma çıkar.' }
  ];

  const neighborhoods = [
    { id: 'bagcilar', name: 'Bağcılar (Hard Start)', rent: 1500, desc: 'Ucuz kira, bol aksiyon. Sokak kuralları geçerli.' },
    { id: 'kadikoy', name: 'Kadıköy (Balanced)', rent: 5000, desc: 'Kafeler, sanat ve deniz havası. Tam kararında.' },
    { id: 'etiler', name: 'Etiler (Big Spender)', rent: 15000, desc: 'Lüks arabalar ve yüksek sosyete.' }
  ];

  const toggleTrait = (id: string) => {
    if (traits.includes(id)) {
      setTraits(traits.filter(t => t !== id));
    } else if (traits.length < 2) {
      setTraits([...traits, id]);
    }
  };

  const spinLottery = () => {
    setIsSpinning(true);
    setTimeout(() => {
      // Rigging it to match your 5,000,000₺ God Mode request
      setLotteryResult({
        title: 'Müteahhit Çocuğu!',
        desc: 'Babanın ihaleleri sayesinde hayata 5-0 önde başladın.',
        money: 5000000,
        perk: 'Kirayı düşünmene gerek yok, paran var.'
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
    <div className="min-h-screen bg-[#f0f4f8] flex items-center justify-center p-4 font-sans text-slate-800">
      
      {/* Top Header like Lagos Life */}
      <div className="fixed top-0 w-full bg-white/80 backdrop-blur-md px-6 py-4 flex justify-between items-center border-b border-slate-200 z-50">
        <h1 className="font-black text-xl tracking-tighter">Türkiye Hayatı</h1>
        {step > 1 && <span className="text-xs font-bold text-slate-400">Step {step} of 5</span>}
      </div>

      <div className="bg-white w-full max-w-3xl rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-slate-100 flex flex-col md:flex-row overflow-hidden min-h-[500px] mt-12">
        
        {/* Left Side: Avatar Preview (Static for now) */}
        <div className="bg-slate-50 w-full md:w-5/12 p-8 flex flex-col items-center justify-center border-r border-slate-100 relative">
          <div className="w-32 h-64 bg-slate-200 rounded-full animate-pulse flex items-center justify-center text-slate-400 font-bold mb-4 shadow-inner">
            Avatar Model
          </div>
          <p className="font-bold text-slate-700">{username || '@kullanici_adi'}</p>
        </div>

        {/* Right Side: Step Forms */}
        <div className="w-full md:w-7/12 p-8 md:p-10 flex flex-col justify-center bg-white relative">
          
          {step === 1 && (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-black text-slate-800 mb-2">Create account</h2>
              <p className="text-sm text-slate-500 mb-8">Türkiye Hayatı'nda kendi hikayeni yaz.</p>
              
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 ml-1">Username</label>
                  <input 
                    type="text" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="örn. istanbul_beyi"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all font-medium"
                  />
                </div>
              </div>
              <button 
                onClick={() => setStep(2)}
                disabled={!username.trim()}
                className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-300 text-white font-bold py-3.5 rounded-xl mt-8 transition-colors"
              >
                Continue
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-black text-slate-800 mb-2">Personality</h2>
              <p className="text-sm text-slate-500 mb-6">Choose 2 traits for {username}.</p>
              
              <div className="grid grid-cols-1 gap-3">
                {traitOptions.map(trait => (
                  <button 
                    key={trait.id}
                    onClick={() => toggleTrait(trait.id)}
                    className={`text-left p-4 rounded-2xl border-2 transition-all ${traits.includes(trait.id) ? 'border-emerald-500 bg-emerald-50' : 'border-slate-100 hover:border-slate-300'}`}
                  >
                    <h3 className="font-bold text-slate-800">{trait.title}</h3>
                    <p className="text-xs text-slate-500 mt-1">{trait.desc}</p>
                  </button>
                ))}
              </div>
              <button 
                onClick={() => setStep(3)}
                disabled={traits.length !== 2}
                className="w-full bg-emerald-500 disabled:bg-slate-300 text-white font-bold py-3.5 rounded-xl mt-6 transition-colors"
              >
                Continue
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-black text-slate-800 mb-2">Dream</h2>
              <p className="text-sm text-slate-500 mb-6">What is {username}'s big dream?</p>
              
              <div className="grid grid-cols-1 gap-3">
                {dreamOptions.map(d => (
                  <button 
                    key={d.id}
                    onClick={() => setDream(d.id)}
                    className={`text-left p-4 rounded-2xl border-2 transition-all ${dream === d.id ? 'border-emerald-500 bg-emerald-50' : 'border-slate-100 hover:border-slate-300'}`}
                  >
                    <h3 className="font-bold text-slate-800">{d.title}</h3>
                    <p className="text-xs text-slate-500 mt-1">{d.desc}</p>
                  </button>
                ))}
              </div>
              <button 
                onClick={() => setStep(4)}
                disabled={!dream}
                className="w-full bg-emerald-500 disabled:bg-slate-300 text-white font-bold py-3.5 rounded-xl mt-6 transition-colors"
              >
                Continue
              </button>
            </div>
          )}

          {step === 4 && (
            <div className="animate-fade-in flex flex-col items-center justify-center text-center py-10">
              <h2 className="text-2xl font-black text-slate-800 mb-2">Birth Lottery</h2>
              <p className="text-sm text-slate-500 mb-8">Türkiye'de herkes bir şeylerin içine doğar.<br/>Sen neye doğdun?</p>
              
              {!lotteryResult ? (
                <button 
                  onClick={spinLottery}
                  disabled={isSpinning}
                  className="bg-amber-400 hover:bg-amber-300 text-amber-900 font-black text-xl px-12 py-5 rounded-2xl shadow-lg transition-transform active:scale-95"
                >
                  {isSpinning ? 'Zarlar Atılıyor...' : 'Zar At (Roll)'}
                </button>
              ) : (
                <div className="bg-amber-50 border-2 border-amber-200 p-6 rounded-3xl w-full animate-fade-in">
                  <div className="text-4xl mb-3">💰</div>
                  <h3 className="font-black text-2xl text-amber-900">{lotteryResult.title}</h3>
                  <p className="text-sm font-bold text-amber-700 mt-2">{lotteryResult.desc}</p>
                  <div className="mt-4 pt-4 border-t border-amber-200 text-left space-y-2 text-xs font-bold text-amber-800">
                    <p>✓ {lotteryResult.money.toLocaleString()} ₺ ile başla.</p>
                    <p>✓ {lotteryResult.perk}</p>
                  </div>
                  <button onClick={() => setStep(5)} className="w-full bg-emerald-500 text-white font-bold py-3 rounded-xl mt-6">
                    Choose where to live
                  </button>
                </div>
              )}
            </div>
          )}

          {step === 5 && (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-black text-slate-800 mb-2">Home</h2>
              <p className="text-sm text-slate-500 mb-6">Where will {username} live? Rent is paid every Saturday.</p>
              
              <div className="grid grid-cols-1 gap-3 h-64 overflow-y-auto pr-2 custom-scrollbar">
                {neighborhoods.map(hood => (
                  <button 
                    key={hood.id}
                    onClick={() => handleFinish(hood)}
                    className="text-left p-4 rounded-2xl border-2 border-slate-100 hover:border-emerald-500 hover:bg-slate-50 transition-all flex justify-between items-center group"
                  >
                    <div>
                      <h3 className="font-bold text-slate-800">{hood.name}</h3>
                      <p className="text-[10px] text-slate-500 mt-1">{hood.desc}</p>
                      <p className="text-xs font-bold text-emerald-600 mt-2">Rent: {hood.rent.toLocaleString()} ₺/week</p>
                    </div>
                    <span className="opacity-0 group-hover:opacity-100 bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-opacity">
                      Move In
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