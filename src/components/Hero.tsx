import { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars, Environment } from '@react-three/drei';
import * as THREE from 'three';
import DeskScene from './DeskScene';
import { useStore, SiteSettings } from '../lib/store';
import { ErrorBoundary } from 'react-error-boundary';

function CameraAnimator({ setControlsEnabled }: { setControlsEnabled: (v: boolean) => void }) {
  const { camera } = useThree();
  const animState = useRef({ progress: 0 });
  
  const startPos = useRef(new THREE.Vector3(0, 50, 400)).current; 
  const endPos = useRef(new THREE.Vector3(0, 4, 30)).current;

  useEffect(() => {
    camera.position.copy(startPos);
    setControlsEnabled(false);
  }, [camera, setControlsEnabled, startPos]);

  useFrame((state, delta) => {
    if (animState.current.progress < 1) {
      // Complete in ~2.5 seconds (depends on delta)
      animState.current.progress += delta * 0.4;
      
      if (animState.current.progress >= 1) {
        animState.current.progress = 1;
        setControlsEnabled(true);
      }
      
      const t = animState.current.progress;
      const easeOutQuart = 1 - Math.pow(1 - t, 4);
      camera.position.lerpVectors(startPos, endPos, easeOutQuart);
    }
  });

  return null;
}

function SolarSystemBg() {
  const groupRef = useRef<THREE.Group>(null);
  const sunGlowRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      // Very slow rotation for the whole system
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.005;
    }
    if (sunGlowRef.current) {
      // Pulsating sun glow
      sunGlowRef.current.scale.setScalar(1 + Math.sin(state.clock.getElapsedTime() * 3) * 0.015);
    }
  });

  // Generative orbital rings for a dense, dust-like effect
  const orbits = Array.from({ length: 30 }).map((_, i) => ({
    radius: 40 + i * 4 + (i * i * 0.05) + Math.random() * 2,
    opacity: Math.random() * 0.4 + 0.05,
    thickness: Math.random() * 0.15 + 0.02,
  }));

  const planets = [
    { radius: 55, size: 1.2, color: "#88ccff", angle: 0.5, hasRing: false },
    { radius: 75, size: 2.5, color: "#ff8855", angle: 1.8, hasRing: false },
    { radius: 110, size: 5.5, color: "#cca988", angle: -0.5, hasRing: true, ringColor: "#ddbb99" },
    { radius: 160, size: 3.2, color: "#44aaff", angle: 2.2, hasRing: true, ringColor: "#aaddff" },
    { radius: 210, size: 2.0, color: "#887799", angle: -1.2, hasRing: false },
  ];

  return (
    <group ref={groupRef} position={[-90, 10, -120]} rotation={[0.15, 0.2, -0.1]}>
      {/* Huge Glowing Sun */}
      <mesh>
        <sphereGeometry args={[35, 64, 64]} />
        <meshBasicMaterial color="#ff4400" />
      </mesh>
      {/* Bright Core glow */}
      <mesh ref={sunGlowRef}>
        <sphereGeometry args={[38, 64, 64]} />
        <meshBasicMaterial color="#ff7700" transparent opacity={0.6} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      {/* Outer Corona Glow */}
      <mesh>
        <sphereGeometry args={[65, 64, 64]} />
        <meshBasicMaterial color="#ff2200" transparent opacity={0.15} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <mesh>
        <sphereGeometry args={[100, 64, 64]} />
        <meshBasicMaterial color="#ff1100" transparent opacity={0.05} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      
      {/* Powerful light source from the Sun */}
      <pointLight color="#ff8833" intensity={800} distance={800} decay={1.5} />
      <pointLight color="#ff4400" intensity={400} distance={1500} decay={1} />
      
      {/* Orbital Tracks */}
      {orbits.map((orbit, i) => (
        <mesh key={`orbit-${i}`} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[orbit.radius, orbit.radius + orbit.thickness, 128]} />
          <meshBasicMaterial 
            color="#ff6600" 
            transparent 
            opacity={orbit.opacity} 
            side={THREE.DoubleSide} 
            blending={THREE.AdditiveBlending} 
            depthWrite={false}
          />
        </mesh>
      ))}
      
      {/* Planets */}
      {planets.map((planet, i) => {
        const x = Math.cos(planet.angle) * planet.radius;
        const z = Math.sin(planet.angle) * planet.radius;
        
        return (
          <group key={`planet-${i}`}>
            {/* Planet Mesh */}
            <mesh position={[x, 0, z]}>
              <sphereGeometry args={[planet.size, 64, 64]} />
              <meshStandardMaterial color={planet.color} roughness={0.4} metalness={0.2} />
              
              {/* Atmosphere Glow */}
              <mesh>
                <sphereGeometry args={[planet.size * 1.15, 32, 32]} />
                <meshBasicMaterial color={planet.color} transparent opacity={0.2} blending={THREE.AdditiveBlending} depthWrite={false} />
              </mesh>
              
              {/* Optional Planet Ring */}
              {planet.hasRing && (
                <group rotation={[Math.PI / 2.2, 0.1, 0]}>
                  {/* Dense inner ring */}
                  <mesh>
                    <ringGeometry args={[planet.size * 1.4, planet.size * 2.0, 128]} />
                    <meshStandardMaterial color={planet.ringColor} transparent opacity={0.9} side={THREE.DoubleSide} />
                  </mesh>
                  {/* Translucent outer ring */}
                  <mesh>
                    <ringGeometry args={[planet.size * 2.02, planet.size * 2.6, 128]} />
                    <meshStandardMaterial color={planet.ringColor} transparent opacity={0.4} side={THREE.DoubleSide} />
                  </mesh>
                </group>
              )}
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

export default function Hero({ overrideSettings, onExitPreview }: { overrideSettings?: SiteSettings, onExitPreview?: () => void }) {
  const { settings: globalSettings } = useStore();
  const settings = overrideSettings || globalSettings;
  const [controlsEnabled, setControlsEnabled] = useState(false);

  return (
    <section 
      id="home"
      className="relative w-full h-[100svh] bg-[#050505] overflow-hidden text-white font-sans bg-noise flex flex-col justify-center items-center"
    >
      {/* 4 Corner Navigation Details */}
      <div className="absolute top-8 left-8 lg:top-12 lg:left-12 z-20 text-[10px] tracking-[0.4em] uppercase font-bold text-white/50 hover:text-white cursor-pointer transition-colors duration-300">
        SEYAM
      </div>
      <div className="absolute top-8 right-8 lg:top-12 lg:right-12 z-20 text-[10px] tracking-[0.4em] uppercase font-bold text-white/50 hover:text-white transition-colors duration-300 cursor-pointer">
        PROFILE
      </div>
      <div className="absolute bottom-8 left-8 lg:bottom-12 lg:left-12 z-20 text-[10px] tracking-[0.4em] uppercase font-bold text-white/30 hover:text-white transition-colors cursor-pointer">
        2024
      </div>
      <div className="absolute bottom-8 right-8 lg:bottom-12 lg:right-12 z-20 text-[10px] tracking-[0.4em] uppercase font-bold text-white/50 hover:text-white transition-colors duration-300 cursor-pointer">
        REEL
      </div>

      {onExitPreview && (
        <button 
          onClick={onExitPreview}
          className="absolute top-8 right-8 z-50 flex items-center gap-2 px-6 py-3 bg-black/50 backdrop-blur border border-brand-primary/20 text-brand-primary rounded-full hover:bg-brand-primary/10 transition-colors font-bold text-sm shadow-[0_0_20px_rgba(51,255,51,0.1)]"
        >
          <span className="w-2 h-2 rounded-full bg-brand-primary animate-pulse" />
          Back to Admin Editor
        </button>
      )}

      <div className="absolute inset-0 z-10 cursor-grab active:cursor-grabbing w-full h-full">
        <Canvas camera={{ position: [0, 4, 30], fov: 40 }} dpr={[1, 2]}>
          <color attach="background" args={['#050505']} />
          <fog attach="fog" args={['#050505', 40, 250]} />
          
          <Stars radius={150} depth={50} count={10000} factor={6} saturation={1} fade speed={0.5} />
          <ambientLight intensity={0.5} />
          <Environment preset="city" environmentIntensity={0.2} />
          
          <OrbitControls 
            enableZoom={controlsEnabled} 
            enablePan={controlsEnabled} 
            enableRotate={controlsEnabled}
            minDistance={5} 
            maxDistance={80} 
            minPolarAngle={0} 
            maxPolarAngle={Math.PI} 
          />
          <CameraAnimator setControlsEnabled={setControlsEnabled} />
          
          <Suspense fallback={null}>
            <SolarSystemBg />
          </Suspense>

          <ErrorBoundary fallback={<mesh scale={[10, 10, 10]}><boxGeometry /><meshBasicMaterial color="red" wireframe /></mesh>}>
            <Suspense fallback={null}>
              <DeskScene overrideSettings={settings} />
            </Suspense>
          </ErrorBoundary>
        </Canvas>
      </div>

      {/* Vignette Overlay for realism */}
      <div className="absolute inset-0 z-10 pointer-events-none bg-[radial-gradient(ellipse_at_center,_transparent_0%,_#030303_120%)]" />
    </section>
  );
}
