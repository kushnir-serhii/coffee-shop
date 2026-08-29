"use client";

import { useState, type ReactNode } from "react";
import { Canvas } from "@react-three/fiber";
import {
  ContactShadows,
  Environment,
  Lightformer,
  OrbitControls,
} from "@react-three/drei";
import * as THREE from "three";
import { AtlasE1 } from "@/components/three/AtlasE1";
import { usePrefersReducedMotion } from "@/lib/media";

/**
 * The canvas around the model: a studio built from lightformers rather than an
 * HDR file, so nothing is fetched at runtime and the scene works offline.
 *
 * Motion budget: it idles at a slow spin, and the first drag stops the spin for
 * good and drops the loop to on-demand — after that the GPU only works while
 * the user is actually turning the machine. `prefers-reduced-motion` skips the
 * spin entirely.
 */
export default function GrinderScene({
  finish,
  label,
  poster,
  onReady,
}: {
  finish: string;
  label: string;
  poster: ReactNode;
  onReady: () => void;
}) {
  const reduced = usePrefersReducedMotion();
  const [idle, setIdle] = useState(true);
  const spinning = idle && !reduced;

  return (
    <div
      role="img"
      aria-label={`${label} — interactive 3D model`}
      className="absolute inset-0"
    >
      <Canvas
        shadows
        dpr={[1, 1.75]}
        frameloop={spinning ? "always" : "demand"}
        camera={{ position: [2.7, 1.15, 8.6], fov: 28 }}
        gl={{ antialias: true, alpha: true }}
        fallback={poster}
        onCreated={onReady}
        onPointerDown={() => setIdle(false)}
      >
        <ambientLight intensity={0.35} />
        <directionalLight
          position={[3.5, 6, 4]}
          intensity={1.15}
          castShadow
          shadow-mapSize={[1024, 1024]}
          shadow-bias={-0.0005}
        />

        <AtlasE1 finish={finish} autoRotate={spinning} />

        <ContactShadows
          position={[0, -1.74, 0]}
          opacity={0.34}
          scale={9}
          blur={2.6}
          far={4.5}
          color="#3A3733"
        />

        {/* Studio: a key softbox overhead, fill left, rim right, plus a warm
            dome so the anodised finishes have something to reflect. */}
        <Environment resolution={256}>
          <mesh scale={24}>
            <sphereGeometry args={[1, 32, 16]} />
            <meshBasicMaterial color="#EFE9E1" side={THREE.BackSide} />
          </mesh>
          <Lightformer
            form="rect"
            intensity={2.6}
            position={[0, 5, 2]}
            scale={[9, 4, 1]}
            rotation={[-Math.PI / 2.6, 0, 0]}
            color="#FFFFFF"
          />
          <Lightformer
            form="rect"
            intensity={1.3}
            position={[-5, 1.5, 2]}
            scale={[3, 7, 1]}
            rotation={[0, -Math.PI / 2.6, 0]}
            color="#FFFDF9"
          />
          <Lightformer
            form="rect"
            intensity={1.1}
            position={[5, 1.5, -1.5]}
            scale={[3, 7, 1]}
            rotation={[0, Math.PI / 2.2, 0]}
            color="#E8E1D6"
          />
          <Lightformer
            form="ring"
            intensity={2}
            position={[2.5, 3.5, -5]}
            scale={4}
            color="#FFFFFF"
          />
        </Environment>

        <OrbitControls
          makeDefault
          enableZoom={false}
          enablePan={false}
          enableDamping
          dampingFactor={0.08}
          rotateSpeed={0.6}
          minPolarAngle={Math.PI / 3.4}
          maxPolarAngle={Math.PI / 1.95}
          target={[0, 0.05, 0]}
          onStart={() => setIdle(false)}
        />
      </Canvas>
    </div>
  );
}
