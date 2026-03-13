export type AgentStatus = "pending" | "running" | "done" | "failed";

export interface AgentRow {
  name: string;
  description: string;
  status: AgentStatus;
}

export interface GeneratedUiResult {
  framework: "react" | "vue";
  fileName: string;
  code: string;
  rationale: string;
}

export interface PredictiveStep {
  title: string;
  reason: string;
  confidence: number;
}
