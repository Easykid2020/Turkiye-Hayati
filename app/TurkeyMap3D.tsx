'use client';

import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

export default function TurkeyMap3D() {
  const [selectedVenue, setSelectedVenue] = useState<any>(null);

  const venues = [
    { id: 'mosque', name: 'Sultanahmet / Kocatepe Cami', type: 'Faith & Peace', icon: '🕌', pos: [-5, 0, -3], color: '#059669' },
    { id: 'market', name: 'BİM / Migros Market', type: 'Shopping & Groceries', icon: '🛒', pos: [2, 0, -3], color: '#f59e0b' },
    { id: 'lc_waikiki', name: 'LC Waikiki Boutique', type: 'Fashion & Clothing', icon: '🛍️', pos: [5, 0, 2], color: '#3b82f6' },
    { id: 'cay_ocagi', name: 'Sokak Çay Ocağı', type: 'Social & Chill', icon: '☕', pos: [-2, 0, 2], color: '#dc2626' },
    { id: 'metro', name: 'İETT / Metro Station', type: 'Public Transit', icon: '🚇', pos: [-5, 0, 3], color: '#475569' },
  ];

  return (
    <div className="w-full h-full relative">
      <Canvas camera={{ position: [8, 10, 10], fov: 45 }}>
        <ambientLight intensity={1.2} />
        <directionalLight position={[10, 20, 10]} intensity={1.5} />
        
        <group position={[0, -1, 0]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
            <planeGeometry args={[28, 20]} />
            <meshStandardMaterial color="#cbd5e1" roughness={0.9} />
          </mesh>

          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
            <planeGeometry args={[24, 3]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
            <planeGeometry args={[3, 18]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>

          {venues.map((v) => (
            <group key={v.id} position={v.pos as [number, number, number]} onClick={() => setSelectedVenue(v)}>
              <mesh position={[0, 0.7, 0]}>
                <boxGeometry args={[1.6, 1.4, 1.6]} />
                <meshStandardMaterial color={v.color} roughness={0.3} />
              </mesh>
              <mesh position={[0, 1.45, 0]}>
                <boxGeometry args={[1.8, 0.2, 1.8]} />
                <meshStandardMaterial color="#0f172a" />
              </mesh>
            </group>
          ))}
        </group>

        <OrbitControls enableZoom={true} enablePan={true} maxPolarAngle={Math.PI / 2.2} />
      </Canvas>

      <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-md text-white text-[11px] font-semibold px-4 py-2 rounded-xl shadow-lg border border-white/10 pointer-events-none flex items-center gap-2">
        🏛️ Click any building block on the map to interact
      </div>

      {selectedVenue && (
        <div className="absolute inset-x-4 bottom-16 bg-white p-6 rounded-3xl shadow-2xl border-2 border-slate-200 z-50 flex flex-col items-center text-center max-w-lg mx-auto text-slate-800">
          <span className="text-4xl mb-2">{selectedVenue.icon}</span>
          <h3 className="text-xl font-black">{selectedVenue.name}</h3>
          <p className="text-xs text-slate-500 mt-0.5">{selectedVenue.type}</p>
          <div className="flex gap-3 w-full mt-4">
            <button onClick={() => setSelectedVenue(null)} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl text-xs">
              Close
            </button>
            <button onClick={() => { alert(`Visited ${selectedVenue.name}!`); setSelectedVenue(null); }} className="flex-1 bg-red-600 hover:bg-red-500 text-white font-bold py-3 rounded-xl text-xs shadow-md">
              Enter / Visit (15 ₺)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}