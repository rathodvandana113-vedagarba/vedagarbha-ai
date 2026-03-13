import Link from "next/link";
import { MainNav } from "@/components/main-nav";
import { GlowCursor } from "@/components/glow-cursor";
import { WorkspaceRuntime } from "@/components/workspace-runtime";
import { OnboardingPanel } from "@/components/onboarding-panel";
import { ExperienceControls } from "@/components/experience-controls";
import { PerformanceMonitor } from "@/components/performance-monitor";

const moduleCards = [
  "Generative UI Engine (React/Vue)",
  "Autonomous Agent Orchestration",
  "Self-Healing Runtime",
  "Vector Memory + Semantic Recall",
  "Web + Mobile Build Synchronization",
  "Real-time WebSocket Activity Layer",
  "Secure Code Sandbox Execution",
  "OAuth2 + WebAuthn Security Controls"
];

export default function WorkspacePage() {
  return (
    <>
      <GlowCursor />
      <MainNav />

      <main className="mx-auto w-[min(1220px,calc(100%-2rem))] pb-14 pt-6">
        <ExperienceControls />

        <section className="mt-4">
          <OnboardingPanel />
        </section>

        <section className="mb-6 mt-2 grid gap-4 md:grid-cols-[1.3fr_1fr] md:items-center">
          <div className="panel p-5">
            <p className="pill">Autonomous Build Workspace</p>
            <h1 className="mt-3 text-3xl font-bold text-white md:text-4xl">
              Living orchestration hub with
              <span className="gradient-text"> predictive AI behavior</span>
            </h1>
            <p className="mt-3 text-sm text-muted">
              This workspace now includes demo mode, onboarding, moderation-aware generation, approval gates, undo history, and
              performance telemetry hooks.
            </p>
            <div className="mt-4 flex gap-2">
              <Link
                href="/"
                className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold text-slate-200"
              >
                Back to Overview
              </Link>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="panel p-4">
              <h2 className="text-lg font-semibold text-white">Mode Coverage</h2>
              <div className="mt-3 grid gap-2">
                {moduleCards.map((item) => (
                  <div key={item} className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-xs text-slate-300">
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <PerformanceMonitor />
          </div>
        </section>

        <WorkspaceRuntime />
      </main>
    </>
  );
}
