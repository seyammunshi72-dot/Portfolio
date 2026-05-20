import { Html, Environment, useGLTF } from '@react-three/drei';
import React, { Suspense, useRef, useMemo } from 'react';
import { useFrame, createPortal } from '@react-three/fiber';
import * as THREE from 'three';
import MonitorScreen from './MonitorScreen';
import { useStore, SiteSettings } from '../lib/store';

function ComputerModel({ overrideSettings }: { overrideSettings?: SiteSettings }) {
  const { settings: globalSettings } = useStore();
  const settings = overrideSettings || globalSettings;
  const { scene } = useGLTF('/ibm_desktop.glb');
  const ref = useRef<THREE.Group>(null);
  
  const screenMesh = useMemo(() => {
    let found: THREE.Mesh | null = null;
    scene.traverse((child) => {
      if (child.name === 'Plane_Pantalla_0') {
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
      <primitive object={scene} scale={0.045} />
      
      {/* We use createPortal to inject our 3D UI directly into the 3D screen's coordinate space! */}
      {screenMesh && createPortal(
        <Html
          transform
          position={[settings.portalPosX ?? -0.002, settings.portalPosY ?? 0.048, settings.portalPosZ ?? 0.485]} 
          rotation={[0, 0, 0]}
          scale={settings.portalScale ?? 0.00085}
          zIndexRange={[100, 0]}
          occlude="blending"
        >
          <div 
            style={{ width: `${settings.portalWidth ?? 800}px`, height: `${settings.portalHeight ?? 600}px`, backfaceVisibility: 'hidden', borderRadius: `${settings.portalBorderRadius ?? 80}px` }} 
            className="pointer-events-auto overflow-hidden flex flex-col relative box-border bg-black"
          >
            <MonitorScreen overrideSettings={settings} />
          </div>
        </Html>,
        screenMesh
      )}
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
