"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface UiState {
  immersiveMode: boolean;
  demoMode: boolean;
  showOnboarding: boolean;
  onboardingStep: number;
  setImmersiveMode: (enabled: boolean) => void;
  toggleImmersiveMode: () => void;
  setDemoMode: (enabled: boolean) => void;
  toggleDemoMode: () => void;
  startOnboarding: () => void;
  nextStep: () => void;
  prevStep: () => void;
  closeOnboarding: () => void;
}

export const useUiStore = create<UiState>()(
  persist(
    (set, get) => ({
      immersiveMode: true,
      demoMode: true,
      showOnboarding: false,
      onboardingStep: 0,
      setImmersiveMode: (enabled) => set({ immersiveMode: enabled }),
      toggleImmersiveMode: () => set({ immersiveMode: !get().immersiveMode }),
      setDemoMode: (enabled) => set({ demoMode: enabled }),
      toggleDemoMode: () => set({ demoMode: !get().demoMode }),
      startOnboarding: () => set({ showOnboarding: true, onboardingStep: 0 }),
      nextStep: () => set({ onboardingStep: Math.min(get().onboardingStep + 1, 4) }),
      prevStep: () => set({ onboardingStep: Math.max(get().onboardingStep - 1, 0) }),
      closeOnboarding: () => set({ showOnboarding: false })
    }),
    {
      name: "super-ai-ui-settings",
      storage: createJSONStorage(() => localStorage)
    }
  )
);
