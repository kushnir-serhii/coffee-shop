"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";

/**
 * The Atlas E1, built from primitives rather than loaded from a .glb.
 *
 * Why: the shape is a machined billet — boxes, cylinders and a cone — so the
 * geometry costs a few kilobytes of code instead of a 2 MB asset, the finish is
 * a real PBR material rather than a baked texture, and there is nothing to
 * download. Proportions follow the spec sheet — 128 × 196 × 390 mm — at
 * 1 unit = 100 mm.
 *
 * To swap in a real model later, replace the return with a useGLTF scene and
 * keep the `finish` prop. Nothing outside this file changes.
 */

/** Beans in the hopper. Fixed positions — random would differ per render. */
const BEANS: Array<[number, number, number]> = [
  [0.0, 2.78, -0.2],
  [0.17, 2.76, -0.07],
  [-0.16, 2.77, -0.32],
  [0.08, 2.87, -0.34],
  [-0.1, 2.86, -0.09],
  [0.23, 2.85, -0.25],
  [-0.25, 2.85, -0.18],
  [0.03, 2.95, -0.2],
  [-0.14, 2.94, -0.31],
  [0.16, 2.96, -0.12],
];

const ACCENT = "#B9B2A8"; // machined aluminium — collar, cup, lid
const DARK = "#26231F"; // plinth, chute, recesses
const ROAST = "#B4532A"; // the one accent from the design system

export function AtlasE1({
  finish,
  autoRotate,
}: {
  finish: string;
  autoRotate: boolean;
}) {
  const group = useRef<THREE.Group>(null);
  const target = useRef(new THREE.Color(finish));
  const { invalidate } = useThree();

  // Materials are created once and shared across meshes: the body and the burr
  // chamber must be the same object for the finish cross-fade to stay in step.
  const mats = useMemo(() => {
    return {
      body: new THREE.MeshStandardMaterial({
        color: new THREE.Color(finish),
        metalness: 0.68,
        roughness: 0.34,
      }),
      accent: new THREE.MeshStandardMaterial({
        color: ACCENT,
        metalness: 1,
        roughness: 0.26,
      }),
      dark: new THREE.MeshStandardMaterial({
        color: DARK,
        metalness: 0.72,
        roughness: 0.44,
      }),
      roast: new THREE.MeshStandardMaterial({
        color: ROAST,
        metalness: 0.2,
        roughness: 0.5,
      }),
      screen: new THREE.MeshStandardMaterial({
        color: "#191512",
        metalness: 0.35,
        roughness: 0.18,
        emissive: new THREE.Color(ROAST),
        emissiveIntensity: 0.09,
      }),
      glass: new THREE.MeshPhysicalMaterial({
        color: "#FFFFFF",
        metalness: 0,
        roughness: 0.07,
        transparent: true,
        opacity: 0.2,
        side: THREE.DoubleSide,
        clearcoat: 1,
        clearcoatRoughness: 0.04,
      }),
      beanA: new THREE.MeshStandardMaterial({
        color: "#6F4425",
        roughness: 0.62,
        metalness: 0.04,
      }),
      beanB: new THREE.MeshStandardMaterial({
        color: "#8E4A24",
        roughness: 0.6,
        metalness: 0.04,
      }),
    };
    // `finish` seeds the body colour only — later changes are lerped, not rebuilt.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(
    () => () => Object.values(mats).forEach((m) => m.dispose()),
    [mats],
  );

  // Cross-fade the finish instead of snapping, matching the 700 ms colour
  // transitions the rest of the system uses.
  useEffect(() => {
    target.current.set(finish);
    invalidate();
  }, [finish, invalidate]);

  useFrame((_, delta) => {
    const c = mats.body.color;
    const t = target.current;
    if (
      Math.abs(c.r - t.r) + Math.abs(c.g - t.g) + Math.abs(c.b - t.b) >
      0.002
    ) {
      c.lerp(t, Math.min(1, delta * 6));
      invalidate();
    }
    if (autoRotate && group.current) {
      group.current.rotation.y += delta * 0.2;
    }
  });

  return (
    <group ref={group} position={[0, -1.7, 0]} dispose={null}>
      {/* Plinth */}
      <RoundedBox
        args={[1.46, 0.14, 2.34]}
        radius={0.045}
        smoothness={4}
        position={[0, 0.07, 0.06]}
        material={mats.dark}
        castShadow
        receiveShadow
      />

      {/* Body — one billet, set back so the chute clears the cup */}
      <RoundedBox
        args={[1.28, 2.0, 1.96]}
        radius={0.1}
        smoothness={5}
        position={[0, 1.14, -0.24]}
        material={mats.body}
        castShadow
        receiveShadow
      />

      {/* Display */}
      <RoundedBox
        args={[0.56, 0.24, 0.03]}
        radius={0.01}
        smoothness={3}
        position={[0, 1.62, 0.729]}
        material={mats.screen}
      />

      {/* Start button */}
      <mesh
        position={[0, 1.16, 0.75]}
        rotation={[Math.PI / 2, 0, 0]}
        material={mats.roast}
      >
        <cylinderGeometry args={[0.075, 0.075, 0.03, 32]} />
      </mesh>

      {/* Adjustment dial on the right flank */}
      <mesh
        position={[0.66, 0.98, -0.24]}
        rotation={[0, 0, Math.PI / 2]}
        material={mats.accent}
        castShadow
      >
        <cylinderGeometry args={[0.17, 0.17, 0.08, 48]} />
      </mesh>

      {/* Recess under the collar, so the ring reads as a separate part */}
      <mesh position={[0, 2.16, -0.24]} material={mats.dark}>
        <cylinderGeometry args={[0.6, 0.6, 0.12, 64]} />
      </mesh>

      {/* Stepless collar — the product's signature control */}
      <mesh position={[0, 2.3, -0.24]} material={mats.accent} castShadow>
        <cylinderGeometry args={[0.7, 0.7, 0.2, 64]} />
      </mesh>
      {[2.205, 2.395].map((y) => (
        <mesh
          key={y}
          position={[0, y, -0.24]}
          rotation={[Math.PI / 2, 0, 0]}
          material={mats.dark}
        >
          <torusGeometry args={[0.702, 0.011, 10, 72]} />
        </mesh>
      ))}
      {/* Index mark, so the collar reads as adjustable */}
      <mesh position={[0, 2.3, 0.46]} material={mats.roast}>
        <boxGeometry args={[0.022, 0.13, 0.03]} />
      </mesh>

      {/* Burr chamber — same billet, same finish */}
      <mesh position={[0, 2.55, -0.24]} material={mats.body} castShadow>
        <cylinderGeometry args={[0.6, 0.6, 0.3, 64]} />
      </mesh>

      {/* Single-dose hopper */}
      <mesh position={[0, 2.98, -0.24]} material={mats.glass}>
        <cylinderGeometry args={[0.42, 0.57, 0.56, 64, 1, true]} />
      </mesh>
      {BEANS.map(([x, y, z], i) => (
        <mesh
          key={i}
          position={[x, y, z]}
          rotation={[i * 0.7, i * 1.1, i * 0.3]}
          scale={[1, 0.72, 0.78]}
          material={i % 3 === 0 ? mats.beanA : mats.beanB}
          castShadow
        >
          <sphereGeometry args={[0.062, 16, 12]} />
        </mesh>
      ))}

      {/* Lid */}
      <mesh position={[0, 3.3, -0.24]} material={mats.accent} castShadow>
        <cylinderGeometry args={[0.45, 0.45, 0.08, 64]} />
      </mesh>
      <mesh position={[0, 3.37, -0.24]} material={mats.dark}>
        <cylinderGeometry args={[0.1, 0.12, 0.07, 32]} />
      </mesh>

      {/* Chute */}
      <mesh
        position={[0, 0.84, 0.88]}
        rotation={[Math.PI / 2, 0, 0]}
        material={mats.dark}
        castShadow
      >
        <cylinderGeometry args={[0.17, 0.17, 0.36, 48]} />
      </mesh>
      <mesh position={[0, 0.84, 1.04]} material={mats.accent}>
        <torusGeometry args={[0.17, 0.028, 10, 48]} />
      </mesh>

      {/* Dosing cup */}
      <mesh
        position={[0, 0.36, 0.96]}
        material={mats.accent}
        castShadow
        receiveShadow
      >
        <cylinderGeometry args={[0.31, 0.27, 0.44, 64, 1, true]} />
      </mesh>
      <mesh position={[0, 0.155, 0.96]} material={mats.accent}>
        <cylinderGeometry args={[0.27, 0.27, 0.03, 48]} />
      </mesh>
    </group>
  );
}
