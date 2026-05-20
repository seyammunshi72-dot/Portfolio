import { Html } from '@react-three/drei';
import * as THREE from 'three';
import NLEInterface from './NLEInterface';

export default function MacbookModel(props: any) {
  return (
    <group {...props} dispose={null}>
      {/* Base/Keyboard Section */}
      <group position={[0, -0.1, 0]}>
        {/* Main Body */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[12, 0.2, 8]} />
          <meshStandardMaterial color="#e2e4e9" roughness={0.2} metalness={0.6} />
        </mesh>
        
        {/* Trackpad */}
        <mesh position={[0, 0.11, 2.5]}>
          <boxGeometry args={[4, 0.05, 2.5]} />
          <meshStandardMaterial color="#d1d3d8" roughness={0.3} metalness={0.5} />
        </mesh>

        {/* Keyboard Area */}
        <mesh position={[0, 0.11, -1]}>
          <boxGeometry args={[10.5, 0.05, 4.5]} />
          <meshStandardMaterial color="#c2c4ca" roughness={0.5} metalness={0.3} />
        </mesh>
      </group>

      {/* Screen Section (hinged at the back of the base) */}
      {/* Hinge position is approximately at z = -4, y = 0 */}
      <group position={[0, 0, -4]} rotation={[-0.2, 0, 0]}>
        <group position={[0, 4, 0]}>
          {/* Screen Back/Lid */}
          <mesh position={[0, 0, -0.1]}>
            <boxGeometry args={[12, 8, 0.2]} />
            <meshStandardMaterial color="#e2e4e9" roughness={0.2} metalness={0.6} />
          </mesh>
          
          {/* Screen Bezel (Front) */}
          <mesh position={[0, 0, 0.01]}>
            <boxGeometry args={[12, 8, 0.05]} />
            <meshStandardMaterial color="#000" roughness={0.9} metalness={0.1} />
          </mesh>

          {/* HTML Screen Content */}
          <mesh position={[0, 0.1, 0.04]} rotation={[0, 0, 0]}>
            {/* The actual viewable area, slightly smaller than the bezel */}
            <planeGeometry args={[11.5, 7.3]} />
            <meshBasicMaterial color="#000" />
            <Html 
              className="content" 
              transform 
              occlude
              position={[0, 0, 0.01]}
              scale={0.0112} // Scale down HTML appropriately to fit [11.5, 7.3] aspect
            >
              <div 
                className="w-[1024px] h-[640px] overflow-hidden bg-[#0f0f0f]" 
                onPointerDown={(e) => e.stopPropagation()}
              >
                <NLEInterface />
              </div>
            </Html>
          </mesh>
        </group>
      </group>
    </group>
  );
}

