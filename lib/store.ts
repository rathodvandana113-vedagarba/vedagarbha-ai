"use client";

import { create } from "zustand";
import type { AgentRow, GeneratedUiResult, PredictiveStep } from "./types";

interface WorkspaceState {
  prompt: string;
  progress: number;
  phaseLabel: string;
  runId: string | null;
  agents: AgentRow[];
  output: GeneratedUiResult | null;
  outputHistory: GeneratedUiResult[];
  predicted: PredictiveStep | null;
  terminal: string[];
  errorMessage: string | null;
  setPrompt: (prompt: string) => void;
  resetRun: () => void;
  setProgress: (progress: number, phaseLabel: string) => void;
  setAgentStatus: (name: string, status: AgentRow["status"]) => void;
  appendTerminal: (line: string) => void;
  setOutput: (output: GeneratedUiResult | null) => void;
  undoOutput: () => void;
  setPredicted: (predicted: PredictiveStep | null) => void;
  setRunId: (runId: string | null) => void;
  setErrorMessage: (message: string | null) => void;
}

const initialAgents: AgentRow[] = [
  { name: "Planning Agent", description: "Architecture and decomposition", status: "pending" },
  { name: "Design Agent", description: "Visual language and UX", status: "pending" },
  { name: "Frontend Agent", description: "Component and route generation", status: "pending" },
  { name: "Backend Agent", description: "API and schema generation", status: "pending" },
  { name: "Integration Agent", description: "3rd-party service orchestration", status: "pending" },
  { name: "Mobile Agent", description: "React Native output synthesis", status: "pending" },
  { name: "Testing Agent", description: "Validation and resilience checks", status: "pending" },
  { name: "Review Agent", description: "Security/performance governance", status: "pending" },
  { name: "Deployment Agent", description: "Release + infrastructure", status: "pending" },
  { name: "Ops Agent", description: "Monitoring and self-healing", status: "pending" }
];

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
  prompt:
    "Build a collaborative AI analytics dashboard with Stripe billing, role-based access, and mobile companion app.",
  progress: 0,
  phaseLabel: "Idle",
  runId: null,
  agents: initialAgents,
  output: null,
  outputHistory: [],
  predicted: null,
  terminal: ["$ waiting for run"],
  errorMessage: null,
  setPrompt: (prompt) => set({ prompt }),
  resetRun: () =>
    set({
      progress: 0,
      phaseLabel: "Initializing",
      runId: null,
      output: null,
      predicted: null,
      terminal: ["$ bootstrapping autonomous run"],
      errorMessage: null,
      agents: initialAgents.map((agent) => ({ ...agent, status: "pending" }))
    }),
  setProgress: (progress, phaseLabel) => set({ progress, phaseLabel }),
  setAgentStatus: (name, status) =>
    set((state) => ({
      agents: state.agents.map((agent) => (agent.name === name ? { ...agent, status } : agent))
    })),
  appendTerminal: (line) => set((state) => ({ terminal: [...state.terminal, line] })),
  setOutput: (output) =>
    set((state) => ({
      output,
      outputHistory: output ? [...state.outputHistory, output] : state.outputHistory
    })),
  undoOutput: () =>
    set((state) => {
      if (state.outputHistory.length === 0) {
        return { output: null, outputHistory: [] };
      }
      const nextHistory = state.outputHistory.slice(0, -1);
      const previous = nextHistory.length > 0 ? nextHistory[nextHistory.length - 1] : null;
      return {
        output: previous,
        outputHistory: nextHistory
      };
    }),
  setPredicted: (predicted) => set({ predicted }),
  setRunId: (runId) => set({ runId }),
  setErrorMessage: (message) => set({ errorMessage: message })
}));
