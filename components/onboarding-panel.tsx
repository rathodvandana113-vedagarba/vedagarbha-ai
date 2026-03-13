"use client";

import { useEffect } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, Info } from "lucide-react";
import { useUiStore } from "@/lib/ui-store";

const steps = [
  {
    title: "Describe your feature clearly",
    detail: "Use short prompts with outcomes, users, and constraints for stronger generation quality."
  },
  {
    title: "Select 3D or 2D mode",
    detail: "Switch to 2D mode for motion sensitivity, accessibility preference, or low-end hardware."
  },
  {
    title: "Review AI output and approvals",
    detail: "Critical actions like production deploy require manual approval for safety and governance."
  },
  {
    title: "Use history + undo",
    detail: "Every generation is tracked in history. You can undo changes and restore previous outputs."
  },
  {
    title: "Run demo mode safely",
    detail: "Demo mode lets you explore workflows without writing your own production data."
  }
];

export function OnboardingPanel() {
  const showOnboarding = useUiStore((state) => state.showOnboarding);
  const onboardingStep = useUiStore((state) => state.onboardingStep);
  const closeOnboarding = useUiStore((state) => state.closeOnboarding);
  const nextStep = useUiStore((state) => state.nextStep);
  const prevStep = useUiStore((state) => state.prevStep);

  useEffect(() => {
    if (!showOnboarding) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeOnboarding();
      }
      if (event.key === "ArrowRight") {
        nextStep();
      }
      if (event.key === "ArrowLeft") {
        prevStep();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [closeOnboarding, nextStep, prevStep, showOnboarding]);

  if (!showOnboarding) {
    return null;
  }

  const active = steps[onboardingStep] ?? steps[0];

  return (
    <div className="panel mb-4 p-4" role="dialog" aria-label="Interactive onboarding tutorial">
      <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-white">
        <Info size={16} className="text-sky-300" />
        Interactive Walkthrough
      </div>

      <h3 className="text-lg text-white">{active.title}</h3>
      <p className="mt-1 text-sm text-slate-300">{active.detail}</p>

      <div className="mt-3 flex items-center justify-between gap-2">
        <div className="text-xs text-slate-400">
          Step {onboardingStep + 1} of {steps.length}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={prevStep}
            className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-slate-200"
          >
            <ArrowLeft size={12} /> Prev
          </button>
          <button
            type="button"
            onClick={nextStep}
            className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-slate-200"
          >
            Next <ArrowRight size={12} />
          </button>
          <button
            type="button"
            onClick={closeOnboarding}
            className="inline-flex items-center gap-1 rounded-full border border-emerald-400/40 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-200"
          >
            <CheckCircle2 size={12} /> Done
          </button>
        </div>
      </div>
    </div>
  );
}
