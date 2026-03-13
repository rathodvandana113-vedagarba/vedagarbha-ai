"use client";

import { HelpCircle, Monitor, Orbit, PlayCircle } from "lucide-react";
import { useUiStore } from "@/lib/ui-store";

export function ExperienceControls() {
  const immersiveMode = useUiStore((state) => state.immersiveMode);
  const demoMode = useUiStore((state) => state.demoMode);
  const setImmersiveMode = useUiStore((state) => state.setImmersiveMode);
  const setDemoMode = useUiStore((state) => state.setDemoMode);
  const startOnboarding = useUiStore((state) => state.startOnboarding);

  return (
    <div className="panel flex flex-wrap items-center gap-2 p-3 text-xs">
      <label className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-slate-200">
        <Orbit size={14} />
        <span>3D Immersive</span>
        <input
          aria-label="Toggle immersive 3D mode"
          type="checkbox"
          checked={immersiveMode}
          onChange={(event) => setImmersiveMode(event.target.checked)}
        />
      </label>

      <label className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-slate-200">
        <PlayCircle size={14} />
        <span>Demo Mode</span>
        <input
          aria-label="Toggle demo mode"
          type="checkbox"
          checked={demoMode}
          onChange={(event) => setDemoMode(event.target.checked)}
        />
      </label>

      <button
        type="button"
        onClick={startOnboarding}
        className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-slate-200"
      >
        <HelpCircle size={14} />
        Tutorial
      </button>

      <div className="ml-auto inline-flex items-center gap-2 text-slate-400">
        <Monitor size={14} />
        <span>{immersiveMode ? "Immersive mode active" : "2D standard mode active"}</span>
      </div>
    </div>
  );
}
