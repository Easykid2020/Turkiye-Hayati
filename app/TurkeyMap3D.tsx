'use client';

import { useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

function MovingVehicle({ startX, startZ, direction, speed }: { startX: number, startZ: number, direction: 'x' | 'z', speed: number }) {
  const ref = useRef<THREE.Group>(null);
  
  useFrame((_, delta) => {
    if (ref.current) {
      if (direction === 'x') {
        ref.current.position.x += speed * delta;
        if (ref.current.position.x > 25) ref.current.position.x = -25;
        if (ref.current.position.x < -25) ref.current.position.x = 25;
      } else {
        ref.current.position.z += speed * delta;
        if (ref.current.position.z > 25) ref.current.position.z = -25;
        if (ref.current.position.z < -25) ref.current.position.z = 25;
      }
    }
  });

  return (
    <group ref={ref} position={[startX, 0.2, startZ]}>
      <mesh position={[0, 0.2, 0]}>
        <boxGeometry args={[1.2, 0.4, 0.7]} />
        <meshStandardMaterial color="#b91c1c" roughness={0.3} />
      </mesh>
      <mesh position={[-0.1, 0.5, 0]}>
        <boxGeometry args={[0.6, 0.35, 0.65]} />
        <meshStandardMaterial color="#38bdf8" roughness={0.1} />
      </mesh>
    </group>
  );
}

function LivingNPC({ initialPos, color }: { initialPos: [number, number, number], color: string }) {
  const ref = useRef<THREE.Group>(null);
  const targetPos = useRef<[number, number, number]>(initialPos);
  const timer = useRef(Math.random() * 10);

  useFrame(({ clock }, delta) => {
    if (ref.current) {
      // Idle bobbing
      ref.current.position.y = initialPos[1] + Math.sin(clock.getElapsedTime() * 4 + initialPos[0]) * 0.04;
      
      // Wander around slightly
      timer.current += delta;
      if (timer.current > 6) {
        targetPos.current = [
          initialPos[0] + (Math.random() * 6 - 3),
          initialPos[1],
          initialPos[2] + (Math.random() * 6 - 3)
        ];
        timer.current = 0;
      }
      ref.current.position.x = THREE.MathUtils.lerp(ref.current.position.x, targetPos.current[0], delta * 0.5);
      ref.current.position.z = THREE.MathUtils.lerp(ref.current.position.z, targetPos.current[2], delta * 0.5);
    }
  });

  return (
    <group ref={ref} position={initialPos}>
      <mesh position={[0, 0.4, 0]}>
        <capsuleGeometry args={[0.18, 0.35, 4, 8]} />
        <meshStandardMaterial color={color} roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.75, 0]}>
        <sphereGeometry args={[0.13, 16, 16]} />
        <meshStandardMaterial color="#fcd34d" />
      </mesh>
    </group>
  );
}

export default function TurkeyMap3D() {
  const [selectedVenue, setSelectedVenue] = useState<any>(null);
  const [playerPosition, setPlayerPosition] = useState<[number, number, number]>([0, 0, 2]);

  const landmarks = [
    { id: 'kizilay', name: 'Kızılay AVM (Ankara Hub)', type: 'Mega Mall & Retail', icon: '🏢', pos: [-8, 0, -6], color: '#dc2626', size: [3.5, 2.5, 3] },
    { id: 'marmara', name: 'Marmara Park (Istanbul Hub)', type: 'Entertainment & Shopping', icon: '🛍️', pos: [8, 0, -6], color: '#2563eb', size: [4, 2.2, 3] },
    { id: 'mosque', name: 'Kocatepe Cami', type: 'Faith & Peace', icon: '🕌', pos: [-8, 0, 6], color: '#059669', size: [2.5, 2.5, 2.5] },
    { id: 'cchub', name: 'Teknopark / CCHub', type: 'Startup & Tech', icon: '💻', pos: [8, 0, 6], color: '#7c3aed', size: [2.5, 2, 2.5] },
    { id: 'bim', name: 'BİM & Migros Market', type: 'Groceries', icon: '🛒', pos: [0, 0, -7], color: '#f59e0b', size: [2, 1.5, 2] },
    { id: 'lcw', name: 'LC Waikiki Flagship', type: 'Fashion', icon: '👕', pos: [0, 0, 7], color: '#db2777', size: [2, 1.8, 2] },
  ];

  const handleMapClick = (e: any) => {
    const point = e.point;
    if (point) {
      setPlayerPosition([point.x, 0, point.z]);
    }
  };

  return (
    <div className="w-full h-full relative">
      <Canvas camera={{ position: [12, 18, 18], fov: 45 }}>
        <ambientLight intensity={1.4} />
        <directionalLight position={[20, 30, 20]} intensity={1.6} castShadow />
        
        <group position={[0, -1, 0]}>
          {/* Massive City Ground Grid */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} onClick={handleMapClick} receiveShadow>
            <planeGeometry args={[50, 50]} />
            <meshStandardMaterial color="#86efac" roughness={0.9} />
          </mesh>

          {/* Expansive Asphalt Road Grid */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
            <planeGeometry args={[46, 4]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
            <planeGeometry args={[4, 46]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>

          {/* Advertising Billboards */}
          <group position={[-3, 0, -3]}>
            <mesh position={[0, 1.5, 0]}>
              <boxGeometry args={[2.5, 1.2, 0.2]} />
              <meshStandardMaterial color="#facc15" emissive="#ca8a04" emissiveIntensity={0.5} />
            </mesh>
            <mesh position={[-1, 0.75, 0]}><cylinderGeometry args={[0.05, 0.05, 1.5]} /><meshStandardMaterial color="#334155" /></mesh>
            <mesh position={[1, 0.75, 0]}><cylinderGeometry args={[0.05, 0.05, 1.5]} /><meshStandardMaterial color="#334155" /></mesh>
          </group>

          <group position={[3, 0, 3]}>
            <mesh position={[0, 1.5, 0]}>
              <boxGeometry args={[2.5, 1.2, 0.2]} />
              <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={0.5} />
            </mesh>
            <mesh position={[-1, 0.75, 0]}><cylinderGeometry args={[0.05, 0.05, 1.5]} /><meshStandardMaterial color="#334155" /></mesh>
            <mesh position={[1, 0.75, 0]}><cylinderGeometry args={[0.05, 0.05, 1.5]} /><meshStandardMaterial color="#334155" /></mesh>
          </group>

          {/* Moving Traffic Across the Mega Grid */}
          <MovingVehicle startX={-20} startZ={-1.5} direction="x" speed={5} />
          <MovingVehicle startX={20} startZ={1.5} direction="x" speed={-5.5} />
          <MovingVehicle startX={-1.5} startZ={-20} direction="z" speed={5} />
          <MovingVehicle startX={1.5} startZ={20} direction="z" speed={-4.5} />

          {/* Crowds of Walking NPCs */}
          <LivingNPC initialPos={[-7, 0, -4]} color="#4f46e5" />
          <LivingNPC initialPos={[-9, 0, -5]} color="#db2777" />
          <LivingNPC initialPos={[7, 0, -5]} color="#2563eb" />
          <LivingNPC initialPos={[9, 0, -7]} color="#d97706" />
          <LivingNPC initialPos={[-7, 0, 5]} color="#10b981" />
          <LivingNPC initialPos={[-9, 0, 7]} color="#ec4899" />
          <LivingNPC initialPos={[7, 0, 5]} color="#6366f1" />
          <LivingNPC initialPos={[9, 0, 7]} color="#84cc16" />

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

          {/* Massive Landmarks & Buildings */}
          {landmarks.map((l) => (
            <group key={l.id} position={l.pos as [number, number, number]} onClick={(e) => { e.stopPropagation(); setSelectedVenue(l); }}>
              <mesh position={[0, l.size[1] / 2, 0]} castShadow>
                <boxGeometry args={l.size as [number, number, number]} />
                <meshStandardMaterial color={l.color} roughness={0.3} />
              </mesh>
              <mesh position={[0, l.size[1] + 0.1, 0]}>
                <boxGeometry args={[l.size[0] + 0.3, 0.2, l.size[2] + 0.3]} />
                <meshStandardMaterial color="#0f172a" />
              </mesh>
            </group>
          ))}
        </group>

        <OrbitControls enableZoom={true} enablePan={true} maxPolarAngle={Math.PI / 2.2} />
      </Canvas>

      {/* Floating Instructions Bar */}
      <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-md text-white text-[11px] font-semibold px-4 py-2.5 rounded-xl shadow-lg border border-white/10 pointer-events-none flex items-center gap-2">
        🌆 Massive Open World • Click ground to walk • Click Kızılay AVM & Marmara Park to enter
      </div>

      {/* Landmark Interaction Modal */}
      {selectedVenue && (
        <div className="absolute inset-x-4 bottom-16 bg-white p-6 rounded-3xl shadow-2xl border-2 border-slate-200 z-50 flex flex-col items-center text-center max-w-lg mx-auto text-slate-800 animate-fade-in">
          <span className="text-4xl mb-2">{selectedVenue.icon}</span>
          <h3 className="text-xl font-black">{selectedVenue.name}</h3>
          <p className="text-xs text-slate-500 mt-0.5">{selectedVenue.type}</p>
          <div className="flex gap-3 w-full mt-4">
            <button onClick={() => setSelectedVenue(null)} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl text-xs">
              Close
            </button>
            <button onClick={() => { alert(`Entering ${selectedVenue.name}! Explore the bustling interior.`); setSelectedVenue(null); }} className="flex-1 bg-red-600 hover:bg-red-500 text-white font-bold py-3 rounded-xl text-xs shadow-md">
              Walk Inside & Browse
            </button>
          </div>
        </div>
      )}
    </div>
  );
}