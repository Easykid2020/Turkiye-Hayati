'use client';

import { useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

function MovingVehicle({ startX, zPos, speed }: { startX: number, zPos: number, speed: number }) {
  const ref = useRef<THREE.Group>(null);
  
  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.position.x += speed * delta;
      if (ref.current.position.x > 14) ref.current.position.x = -14;
    }
  });

  return (
    <group ref={ref} position={[startX, 0.2, zPos]}>
      {/* Car Body */}
      <mesh position={[0, 0.2, 0]}>
        <boxGeometry args={[1.2, 0.4, 0.7]} />
        <meshStandardMaterial color="#dc2626" roughness={0.3} />
      </mesh>
      {/* Cabin */}
      <mesh position={[-0.1, 0.5, 0]}>
        <boxGeometry args={[0.6, 0.35, 0.65]} />
        <meshStandardMaterial color="#38bdf8" roughness={0.1} />
      </mesh>
    </group>
  );
}

function LivingNPC({ position, color, name }: { position: [number, number, number], color: string, name: string }) {
  const ref = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (ref.current) {
      // Gentle idle breathing / bobbing
      ref.current.position.y = position[1] + Math.sin(clock.getElapsedTime() * 3 + position[0]) * 0.05;
    }
  });

  return (
    <group ref={ref} position={position}>
      {/* Body / Torso */}
      <mesh position={[0, 0.4, 0]}>
        <capsuleGeometry args={[0.2, 0.4, 4, 8]} />
        <meshStandardMaterial color={color} roughness={0.5} />
      </mesh>
      {/* Head */}
      <mesh position={[0, 0.8, 0]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color="#fcd34d" />
      </mesh>
    </group>
  );
}

export default function TurkeyMap3D() {
  const [selectedVenue, setSelectedVenue] = useState<any>(null);
  const [playerPosition, setPlayerPosition] = useState<[number, number, number]>([0, 0, 1]);

  const venues = [
    { id: 'mosque', name: 'Sultanahmet / Kocatepe Cami', type: 'Faith & Peace', icon: '🕌', pos: [-5, 0, -3], color: '#059669' },
    { id: 'market', name: 'BİM / Migros Market', type: 'Shopping & Groceries', icon: '🛒', pos: [2, 0, -3], color: '#f59e0b' },
    { id: 'lc_waikiki', name: 'LC Waikiki Boutique', type: 'Fashion & Clothing', icon: '🛍️', pos: [5, 0, 2], color: '#3b82f6' },
    { id: 'cay_ocagi', name: 'Sokak Çay Ocağı', type: 'Social & Chill', icon: '☕', pos: [-2, 0, 2], color: '#dc2626' },
    { id: 'cchub', name: 'Teknopark / CCHub', type: 'Tech & Work', icon: '💻', pos: [-5, 0, 4], color: '#3b82f6' },
  ];

  const handleMapClick = (e: any) => {
    const point = e.point;
    if (point) {
      setPlayerPosition([point.x, 0, point.z]);
    }
  };

  return (
    <div className="w-full h-full relative">
      <Canvas camera={{ position: [8, 12, 12], fov: 45 }}>
        <ambientLight intensity={1.3} />
        <directionalLight position={[10, 25, 10]} intensity={1.5} castShadow />
        
        <group position={[0, -1, 0]}>
          {/* Ground / Grass Grid */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} onClick={handleMapClick} receiveShadow>
            <planeGeometry args={[30, 22]} />
            <meshStandardMaterial color="#86efac" roughness={0.9} />
          </mesh>

          {/* Asphalt Roads */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
            <planeGeometry args={[26, 3.5]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
            <planeGeometry args={[3.5, 20]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>

          {/* Moving Traffic Vehicles */}
          <MovingVehicle startX={-10} zPos={-0.5} speed={4} />
          <MovingVehicle startX={5} zPos={0.5} speed={-5} />

          {/* Living NPCs stationed around the city */}
          <LivingNPC position={[-4.5, 0, -2.5]} color="#4f46e5" name="Ahmet" />
          <LivingNPC position={[2.5, 0, -2.5]} color="#db2777" name="Zeynep" />
          <LivingNPC position={[4.5, 0, 1.5]} color="#2563eb" name="Can" />
          <LivingNPC position={[-1.5, 0, 1.5]} color="#d97706" name="Ebru" />

          {/* Player Avatar */}
          <group position={playerPosition}>
            <mesh position={[0, 0.5, 0]}>
              <capsuleGeometry args={[0.22, 0.5, 4, 8]} />
              <meshStandardMaterial color="#ef4444" roughness={0.3} />
            </mesh>
            <mesh position={[0, 0.95, 0]}>
              <sphereGeometry args={[0.16, 16, 16]} />
              <meshStandardMaterial color="#fcd34d" />
            </mesh>
          </group>

          {/* 3D Venue Buildings */}
          {venues.map((v) => (
            <group key={v.id} position={v.pos as [number, number, number]} onClick={(e) => { e.stopPropagation(); setSelectedVenue(v); }}>
              <mesh position={[0, 0.8, 0]} castShadow>
                <boxGeometry args={[1.8, 1.6, 1.8]} />
                <meshStandardMaterial color={v.color} roughness={0.3} />
              </mesh>
              <mesh position={[0, 1.7, 0]}>
                <boxGeometry args={[2.0, 0.25, 2.0]} />
                <meshStandardMaterial color="#0f172a" />
              </mesh>
            </group>
          ))}
        </group>

        <OrbitControls enableZoom={true} enablePan={true} maxPolarAngle={Math.PI / 2.2} />
      </Canvas>

      {/* Floating Instructions Bar */}
      <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-md text-white text-[11px] font-semibold px-4 py-2.5 rounded-xl shadow-lg border border-white/10 pointer-events-none flex items-center gap-2">
        🚶‍♂️ Click anywhere on grass to walk • Click buildings to enter
      </div>

      {/* Venue Interaction Modal */}
      {selectedVenue && (
        <div className="absolute inset-x-4 bottom-16 bg-white p-6 rounded-3xl shadow-2xl border-2 border-slate-200 z-50 flex flex-col items-center text-center max-w-lg mx-auto text-slate-800 animate-fade-in">
          <span className="text-4xl mb-2">{selectedVenue.icon}</span>
          <h3 className="text-xl font-black">{selectedVenue.name}</h3>
          <p className="text-xs text-slate-500 mt-0.5">{selectedVenue.type}</p>
          <div className="flex gap-3 w-full mt-4">
            <button onClick={() => setSelectedVenue(null)} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl text-xs">
              Close
            </button>
            <button onClick={() => { alert(`You walked into and entered ${selectedVenue.name}!`); setSelectedVenue(null); }} className="flex-1 bg-red-600 hover:bg-red-500 text-white font-bold py-3 rounded-xl text-xs shadow-md">
              Walk Inside & Interact
            </button>
          </div>
        </div>
      )}
    </div>
  );
}