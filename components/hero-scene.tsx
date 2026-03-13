"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, OrbitControls, Points, PointMaterial } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import type { Group } from "three";
import { AlertTriangle, Layers3, RotateCcw } from "lucide-react";
import { useUiStore } from "@/lib/ui-store";

function CoreMesh({ speed }: { speed: number }) {
  const groupRef = useRef<Group>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (!groupRef.current) {
      return;
    }

    groupRef.current.rotation.x = t * 0.22 * speed;
    groupRef.current.rotation.y = t * 0.28 * speed;
    groupRef.current.position.y = Math.sin(t * 0.8) * 0.2;
  });

  return (
    <group ref={groupRef}>
      <mesh>
        <torusKnotGeometry args={[1.45, 0.38, 220, 28]} />
        <meshStandardMaterial color="#7195ff" metalness={0.65} roughness={0.3} emissive="#1c357a" emissiveIntensity={0.58} />
      </mesh>
      <mesh rotation={[Math.PI / 2.6, 0, 0]}>
        <torusGeometry args={[2.8, 0.05, 16, 128]} />
        <meshBasicMaterial color="#9bb8ff" transparent opacity={0.36} />
      </mesh>
      <Float floatIntensity={1.6} speed={2.4}>
        <mesh position={[1.6, 1.2, 0.6]}>
          <icosahedronGeometry args={[0.35, 0]} />
          <MeshDistortMaterial color="#9f74ff" distort={0.25} speed={2.4} roughness={0.2} />
        </mesh>
      </Float>
    </group>
  );
}

function StarField() {
  const points = useMemo(() => {
    const positions = new Float32Array(1000 * 3);
    for (let i = 0; i < positions.length; i += 3) {
      positions[i] = (Math.random() - 0.5) * 14;
      positions[i + 1] = (Math.random() - 0.5) * 10;
      positions[i + 2] = (Math.random() - 0.5) * 10;
    }
    return positions;
  }, []);

  return (
    <Points positions={points} stride={3} frustumCulled>
      <PointMaterial transparent color="#d2dfff" size={0.04} sizeAttenuation depthWrite={false} opacity={0.8} />
    </Points>
  );
}

function SceneFallback({ reason }: { reason: string }) {
  return (
    <div className="panel relative flex h-[500px] flex-col justify-between overflow-hidden p-4">
      <div>
        <div className="pill">2D Standard Mode</div>
        <h3 className="mt-3 text-2xl font-semibold text-white">Accessible fallback interface active</h3>
        <p className="mt-2 text-sm text-slate-300">{reason}</p>
      </div>

      <div className="grid gap-2 rounded-xl border border-white/15 bg-black/35 p-3 backdrop-blur">
        <div className="flex items-center justify-between rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-xs text-[#d2ddff]">
          <span>Planning Agent</span>
          <span className="text-emerald-300">running</span>
        </div>
        <div className="flex items-center justify-between rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-xs text-[#d2ddff]">
          <span>Design + Frontend Agents</span>
          <span className="text-sky-300">parallel</span>
        </div>
        <div className="flex items-center justify-between rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-xs text-[#d2ddff]">
          <span>Ops Agent</span>
          <span className="text-amber-300">queued</span>
        </div>
      </div>
    </div>
  );
}

export function HeroScene() {
  const immersiveMode = useUiStore((state) => state.immersiveMode);
  const [webglSupported, setWebglSupported] = useState(true);
  const [rotationSpeed, setRotationSpeed] = useState(1);

  const controlsRef = useRef<any>(null);

  useEffect(() => {
    const canvas = document.createElement("canvas");
    const supported = Boolean(canvas.getContext("webgl") || canvas.getContext("experimental-webgl"));
    setWebglSupported(supported);
  }, []);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const step = 0.18;
    if (event.key === "ArrowLeft") {
      controlsRef.current?.rotateLeft(step);
      event.preventDefault();
    }
    if (event.key === "ArrowRight") {
      controlsRef.current?.rotateLeft(-step);
      event.preventDefault();
    }
    if (event.key === "ArrowUp") {
      controlsRef.current?.rotateUp(step);
      event.preventDefault();
    }
    if (event.key === "ArrowDown") {
      controlsRef.current?.rotateUp(-step);
      event.preventDefault();
    }
    if (event.key.toLowerCase() === "r") {
      setRotationSpeed((curr) => (curr === 0 ? 1 : 0));
      event.preventDefault();
    }
  };

  if (!immersiveMode) {
    return <SceneFallback reason="3D disabled by user preference." />;
  }

  if (!webglSupported) {
    return <SceneFallback reason="WebGL unavailable on this device/browser. Rendering 2D experience instead." />;
  }

  return (
    <div
      className="panel relative h-[500px] overflow-hidden"
      tabIndex={0}
      role="region"
      aria-label="Interactive 3D AI orchestration scene"
      aria-describedby="hero-scene-help"
      onKeyDown={onKeyDown}
    >
      <p id="hero-scene-help" className="sr-only">
        Use arrow keys to rotate the 3D scene. Press R to pause or resume rotation. Toggle 2D mode anytime from controls.
      </p>

      <Canvas camera={{ position: [0, 0, 7.5], fov: 45 }} dpr={[1, 2]}>
        <fog attach="fog" args={["#071024", 5, 14]} />
        <ambientLight intensity={0.55} />
        <pointLight color="#4e8dff" intensity={1.4} position={[3, 2, 4]} />
        <pointLight color="#9f62ff" intensity={1.1} position={[-3, -1, 4]} />
        <pointLight color="#11b4b0" intensity={0.8} position={[0, 2.4, -2]} />
        <CoreMesh speed={rotationSpeed} />
        <StarField />
        <OrbitControls ref={controlsRef} enablePan={false} enableZoom={false} autoRotate autoRotateSpeed={0.35 * rotationSpeed} />
      </Canvas>

      <div className="absolute left-4 top-4 flex flex-wrap items-center gap-2">
        <span className="pill" title="Interactive 3D data fabric">
          <Layers3 size={12} className="mr-1 text-sky-300" /> 3D Data Fabric
        </span>
        <button
          type="button"
          title="Pause or resume auto rotation"
          onClick={() => setRotationSpeed((curr) => (curr === 0 ? 1 : 0))}
          className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-black/30 px-2 py-1 text-xs text-slate-200"
        >
          <RotateCcw size={12} /> {rotationSpeed === 0 ? "Resume" : "Pause"}
        </button>
      </div>

      <div className="absolute bottom-4 left-4 right-4 grid gap-2 rounded-xl border border-white/15 bg-black/35 p-3 backdrop-blur">
        <div title="Planning agent decomposes scope and tasks" className="flex items-center justify-between rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-xs text-[#d2ddff]">
          <span>Planning Agent</span>
          <span className="text-emerald-300">running</span>
        </div>
        <div title="Parallel UI and interaction synthesis" className="flex items-center justify-between rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-xs text-[#d2ddff]">
          <span>Design + Frontend Agents</span>
          <span className="text-sky-300">parallel</span>
        </div>
        <div title="Operations guard and self-healing" className="flex items-center justify-between rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-xs text-[#d2ddff]">
          <span>Ops Agent</span>
          <span className="text-amber-300">queued</span>
        </div>
      </div>

      {!webglSupported && (
        <div className="absolute right-4 top-4 rounded-full border border-amber-400/40 bg-amber-500/10 px-3 py-1 text-xs text-amber-200">
          <AlertTriangle size={12} className="mr-1 inline" /> 3D unavailable
        </div>
      )}
    </div>
  );
}
