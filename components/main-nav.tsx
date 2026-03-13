"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ScreenShare, Sparkles } from "lucide-react";
import { useUiStore } from "@/lib/ui-store";

export function MainNav() {
  const [progress, setProgress] = useState(0);
  const immersiveMode = useUiStore((state) => state.immersiveMode);
  const demoMode = useUiStore((state) => state.demoMode);
  const setImmersiveMode = useUiStore((state) => state.setImmersiveMode);
  const setDemoMode = useUiStore((state) => state.setDemoMode);

  useEffect(() => {
    const onScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = total > 0 ? (window.scrollY / total) * 100 : 0;
      setProgress(Math.min(100, Math.max(0, ratio)));
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <>
      <div className="scroll-progress" aria-hidden="true">
        <span style={{ width: `${progress}%` }} />
      </div>

      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#070d1d]/80 backdrop-blur">
        <div className="mx-auto flex min-h-16 w-[min(1220px,calc(100%-2rem))] items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 font-[var(--font-space)] text-sm font-bold tracking-wide text-white">
            <span className="h-2.5 w-2.5 rounded-full bg-gradient-to-r from-[#1a56db] to-[#7c3aed] shadow-[0_0_24px_rgba(58,113,255,0.8)]" />
            Super AI Ecosystem
          </Link>

          <nav className="hidden items-center gap-4 text-xs text-slate-300 md:flex">
            <a href="#capabilities" className="hover:text-white">
              Capabilities
            </a>
            <a href="#architecture" className="hover:text-white">
              Architecture
            </a>
            <a href="#roadmap" className="hover:text-white">
              Roadmap
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <label className="hidden items-center gap-1 rounded-full border border-white/15 bg-white/5 px-2 py-1 text-[11px] text-slate-200 md:inline-flex">
              <ScreenShare size={12} />
              3D
              <input
                aria-label="Toggle 3D immersive mode"
                type="checkbox"
                checked={immersiveMode}
                onChange={(event) => setImmersiveMode(event.target.checked)}
              />
            </label>

            <label className="hidden items-center gap-1 rounded-full border border-white/15 bg-white/5 px-2 py-1 text-[11px] text-slate-200 md:inline-flex">
              <Sparkles size={12} />
              Demo
              <input
                aria-label="Toggle demo mode"
                type="checkbox"
                checked={demoMode}
                onChange={(event) => setDemoMode(event.target.checked)}
              />
            </label>

            <Link
              href="/workspace"
              className="rounded-full border border-white/15 bg-gradient-to-r from-[#1a56db] to-[#7c3aed] px-3 py-1.5 text-xs font-semibold text-white"
            >
              Open Workspace
            </Link>
          </div>
        </div>
      </header>
    </>
  );
}
