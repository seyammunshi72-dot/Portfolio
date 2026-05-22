import { Html, Environment, useGLTF } from '@react-three/drei';
import React, { Suspense, useRef, useMemo } from 'react';
import { useFrame, createPortal } from '@react-three/fiber';
import * as THREE from 'three';
import MonitorScreen from './MonitorScreen';
import { useStore, SiteSettings } from '../lib/store';

function ComputerModel({ overrideSettings }: { overrideSettings?: SiteSettings }) {
  const { settings: globalSettings } = useStore();
  const settings = overrideSettings || globalSettings;
  const { scene } = useGLTF('/computer_model.glb');
  const ref = useRef<THREE.Group>(null);
  
  const screenMesh = useMemo(() => {
    let found: THREE.Mesh | null = null;
    scene.traverse((child) => {
      if (child.name && child.name.toLowerCase().includes('screen')) {
        found = child as THREE.Mesh;
        if (found.material) {
          const mat = found.material as THREE.MeshStandardMaterial;
          mat.color.set('#030A03');
          mat.roughness = 0.1;
          mat.metalness = 0.5;
          mat.emissive.set('#000000');
          mat.map = null;
          mat.emissiveMap = null;
        }
      }
    });
    return found;
  }, [scene]);

  return (
    <group ref={ref} position={[settings.cameraPositionX, settings.cameraPositionY, settings.cameraPositionZ]} rotation={[0, -0.1, 0]}>
      {/* We need to use generic scale/position since we don't know the exact computer_model.glb scale without viewing it. */}
      <primitive object={scene} scale={2} position={[0, -1, 0]} />
      
      <Html
        transform
        position={[0, 0, 0.5]} 
        rotation={[0, 0, 0]}
        scale={0.1}
        zIndexRange={[100, 0]}
        occlude="blending"
      >
        <div 
          style={{ width: `1000px`, height: `660px`, backfaceVisibility: 'hidden', borderRadius: `20px` }} 
          className="pointer-events-auto overflow-hidden flex flex-col relative box-border bg-black border-[8px] border-[#222]"
        >
          <MonitorScreen overrideSettings={settings} />
        </div>
      </Html>
    </group>
  );
}

export default function DeskScene({ overrideSettings }: { overrideSettings?: SiteSettings }) {
  return (
    <group position={[0, -2, 0]}>
      {/* Lighting setup to mimic the dark cinematic environment */}
      <spotLight position={[0, 20, 10]} color="#ffffff" intensity={2000} angle={0.8} penumbra={0.5} distance={100} />
      
      <Environment preset="city" />

      <Suspense fallback={null}>
        <ComputerModel overrideSettings={overrideSettings} />
      </Suspense>

    </group>
  );
}



