'use client';

import React, { useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useFrame } from '@react-three/fiber';

type Language = 'en' | 'tr';

function Real3DCharacter({ customization }: { customization: any }) {
  const groupRef = useRef<any>();
  
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.008;
    }
  });

  return (
    <group ref={groupRef} position={[0, -1.2, 0]}>
      <mesh position={[0, 2.5, 0]}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial color={customization.skinTone} />
      </mesh>

      <mesh position={[-0.15, 2.6, 0.45]}>
        <sphereGeometry args={[0.07, 16, 16]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      <mesh position={[0.15, 2.6, 0.45]}>
        <sphereGeometry args={[0.07, 16, 16]} />
        <meshStandardMaterial color="#000000" />
      </mesh>

      {customization.hasGlasses && (
        <group position={[0, 2.6, 0.42]}>
          <mesh position={[-0.15, 0, 0]}>
            <boxGeometry args={[0.2, 0.12, 0.1]} />
            <meshStandardMaterial color="#111827" />
          </mesh>
          <mesh position={[0.15, 0, 0]}>
            <boxGeometry args={[0.2, 0.12, 0.1]} />
            <meshStandardMaterial color="#111827" />
          </mesh>
          <mesh position={[0, 0.02, 0]}>
            <boxGeometry args={[0.1, 0.03, 0.05]} />
            <meshStandardMaterial color="#111827" />
          </mesh>
        </group>
      )}

      <mesh position={[0, 2.85, 0]}>
        <boxGeometry args={[0.55, 0.25, 0.55]} />
        <meshStandardMaterial color={customization.hairColor} />
      </mesh>

      <mesh position={[0, 1.2, 0]}>
        <cylinderGeometry args={[0.6, 0.6, 1.6, 32]} />
        <meshStandardMaterial color={customization.shirtColor} />
      </mesh>

      <mesh position={[-0.7, 1.3, 0]} rotation={[0, 0, -0.2]}>
        <cylinderGeometry args={[0.18, 0.18, 1.2, 32]} />
        <meshStandardMaterial color={customization.shirtColor} />
      </mesh>
      <mesh position={[0.7, 1.3, 0]} rotation={[0, 0, 0.2]}>
        <cylinderGeometry args={[0.18, 0.18, 1.2, 32]} />
        <meshStandardMaterial color={customization.shirtColor} />
      </mesh>

      <mesh position={[-0.25, 0, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.8, 32]} />
        <meshStandardMaterial color="#1e3a8a" />
      </mesh>
      <mesh position={[0.25, 0, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.8, 32]} />
        <meshStandardMaterial color="#1e3a8a" />
      </mesh>
    </group>
  );
}

const SafeCanvas = dynamic(
  () => import('@react-three/fiber').then((mod) => {
    const { Canvas } = mod;
    return function Component({ children }: any) {
      return <Canvas camera={{ position: [0, 1, 5], fov: 50 }}>{children}</Canvas>;
    };
  }),
  { ssr: false }
);

const SafeOrbitControls = dynamic(
  () => import('@react-three/drei').then((mod) => mod.OrbitControls),
  { ssr: false }
);

export default function Onboarding({ onComplete }: { onComplete: (data: any) => void }) {
  const [lang, setLang] = useState<Language>('en'); 
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState('');
  const [traits, setTraits] = useState<string[]>([]);
  const [dream, setDream] = useState('');
  const [lotteryResult, setLotteryResult] = useState<any>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const [customization, setCustomization] = useState({
    skinTone: '#fcd34d',
    hairColor: '#1e293b',
    shirtColor: '#dc2626',
    hasGlasses: false
  });

  const text = {
    en: {
      title: 'Türkiye Hayatı',
      step: 'Step',
      of: 'of',
      createAcc: 'Create account & 3D Avatar',
      createSub: 'Customize your look and write your story.',
      username: 'Username',
      placeholder: 'e.g. istanbul_boss',
      continue: 'Continue',
      avatarTitle: '3D Avatar Customization',
      skinLabel: 'Skin Tone',
      hairLabel: 'Hair Color',
      shirtLabel: 'Outfit Color',
      glassesLabel: 'Sunglasses',
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
      createAcc: 'Hesap ve 3D Avatar Oluştur',
      createSub: 'Görünümünü özelleştir ve hikayeni yaz.',
      username: 'Kullanıcı Adı',
      placeholder: 'örn. istanbul_beyi',
      continue: 'Devam Et',
      avatarTitle: '3D Avatar Özelleştirme',
      skinLabel: 'Ten Rengi',
      hairLabel: 'Saç Rengi',
      shirtLabel: 'Kıyafet Rengi',
      glassesLabel: 'Güneş Gözlüğü',
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
      customization,
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
          <div className="w-full h-full min-h-[300px] flex-1 relative bg-gradient-to-b from-slate-200 to-slate-100 rounded-3xl overflow-hidden shadow-inner border-[4px] border-white mb-4">
            {mounted && (
              <SafeCanvas>
                <ambientLight intensity={0.7} />
                <directionalLight position={[5, 5, 5]} intensity={1.2} />
                <Real3DCharacter customization={customization} />
                <SafeOrbitControls enableZoom={false} enablePan={false} minPolarAngle={Math.PI / 2.5} maxPolarAngle={Math.PI / 2.5} />
              </SafeCanvas>
            )}
          </div>
          <p className="font-bold text-slate-700 z-10">{username || '@username'}</p>
        </div>

        <div className="w-full md:w-7/12 p-8 md:p-10 flex flex-col justify-center bg-white relative">
          
          {step === 1 && (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-black text-slate-800 mb-2">{t.createAcc}</h2>
              <p className="text-sm text-slate-500 mb-6">{t.createSub}</p>
              
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

                <div className="pt-2">
                  <p className="text-xs font-bold text-slate-700 mb-3">{t.avatarTitle}</p>
                  
                  <div className="space-y-2.5">
                    <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                      <span className="text-xs font-semibold text-slate-600">{t.skinLabel}</span>
                      <div className="flex gap-1.5">
                        {['#fcd34d', '#f87171', '#d97706', '#92400e'].map(color => (
                          <button key={color} onClick={() => setCustomization(c => ({ ...c, skinTone: color }))} style={{ backgroundColor: color }} className={`w-6 h-6 rounded-full border-2 ${customization.skinTone === color ? 'border-slate-900 scale-110' : 'border-transparent'}`} />
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                      <span className="text-xs font-semibold text-slate-600">{t.hairLabel}</span>
                      <div className="flex gap-1.5">
                        {['#1e293b', '#b45309', '#78716c', '#0f172a'].map(color => (
                          <button key={color} onClick={() => setCustomization(c => ({ ...c, hairColor: color }))} style={{ backgroundColor: color }} className={`w-6 h-6 rounded-full border-2 ${customization.hairColor === color ? 'border-slate-900 scale-110' : 'border-transparent'}`} />
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                      <span className="text-xs font-semibold text-slate-600">{t.shirtLabel}</span>
                      <div className="flex gap-1.5">
                        {['#dc2626', '#2563eb', '#16a34a', '#eab308'].map(color => (
                          <button key={color} onClick={() => setCustomization(c => ({ ...c, shirtColor: color }))} style={{ backgroundColor: color }} className={`w-6 h-6 rounded-full border-2 ${customization.shirtColor === color ? 'border-slate-900 scale-110' : 'border-transparent'}`} />
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                      <span className="text-xs font-semibold text-slate-600">{t.glassesLabel}</span>
                      <button 
                        onClick={() => setCustomization(c => ({ ...c, hasGlasses: !c.hasGlasses }))} 
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${customization.hasGlasses ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-600'}`}
                      >
                        {customization.hasGlasses ? 'ON' : 'OFF'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setStep(2)}
                disabled={!username.trim()}
                className="w-full bg-red-600 hover:bg-red-500 disabled:bg-slate-200 text-white font-bold py-3.5 rounded-xl mt-6 transition-colors shadow-md disabled:shadow-none"
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