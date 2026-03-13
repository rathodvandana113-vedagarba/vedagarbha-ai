"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { io } from "socket.io-client";
import { AlertTriangle, Brain, Database, Rocket, Sparkles, Undo2, WandSparkles, Waves } from "lucide-react";
import { useWorkspaceStore } from "@/lib/store";
import { useUiStore } from "@/lib/ui-store";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function statusClass(status: "pending" | "running" | "done" | "failed") {
  if (status === "running") {
    return "text-sky-300";
  }
  if (status === "done") {
    return "text-emerald-300";
  }
  if (status === "failed") {
    return "text-rose-300";
  }
  return "text-amber-300";
}

interface StreamedRun {
  id: string;
  status: "queued" | "running" | "done" | "failed";
  progress: number;
  steps: Array<{ agent: string; status: "pending" | "running" | "done" | "failed"; message: string }>;
}

const USER_ID = "demo-user";
const PROJECT_ID = "workspace-project";

export function WorkspaceRuntime() {
  const {
    prompt,
    setPrompt,
    progress,
    phaseLabel,
    runId,
    agents,
    terminal,
    output,
    predicted,
    errorMessage,
    resetRun,
    setProgress,
    setAgentStatus,
    appendTerminal,
    setOutput,
    undoOutput,
    setPredicted,
    setRunId,
    setErrorMessage
  } = useWorkspaceStore();

  const demoMode = useUiStore((state) => state.demoMode);

  const [isRunning, setIsRunning] = useState(false);
  const [lastRunId, setLastRunId] = useState<string | null>(null);
  const [approvalId, setApprovalId] = useState<string | null>(null);
  const [deployStatus, setDeployStatus] = useState<string>("idle");

  const agentSequence = useMemo(
    () => [
      { name: "Planning Agent", progress: 12, label: "Creating architecture graph" },
      { name: "Design Agent", progress: 25, label: "Synthesizing visual language" },
      { name: "Frontend Agent", progress: 38, label: "Generating UI and interactions" },
      { name: "Backend Agent", progress: 51, label: "Creating APIs and schemas" },
      { name: "Integration Agent", progress: 64, label: "Wiring services and auth providers" },
      { name: "Mobile Agent", progress: 74, label: "Compiling mobile companion output" },
      { name: "Testing Agent", progress: 83, label: "Running test and resilience checks" },
      { name: "Review Agent", progress: 90, label: "Auditing for security and performance" },
      { name: "Deployment Agent", progress: 96, label: "Deploying runtime infrastructure" },
      { name: "Ops Agent", progress: 100, label: "Activating monitor and self-healing" }
    ],
    []
  );

  useEffect(() => {
    if (!runId) {
      return;
    }

    const socketUrl = process.env.NEXT_PUBLIC_API_SOCKET_URL ?? "http://localhost:8080";
    const socket = io(socketUrl, {
      transports: ["websocket"],
      reconnectionAttempts: 4,
      timeout: 4000,
      query: { user_id: USER_ID }
    });

    socket.on("connect", () => {
      appendTerminal(`[socket] connected (${socket.id})`);
    });

    const onRunUpdate = (payload: StreamedRun) => {
      if (payload.id !== runId) {
        return;
      }

      setProgress(payload.progress, `Agent orchestration (${payload.status})`);
      payload.steps.forEach((step) => {
        setAgentStatus(step.agent, step.status);
      });
    };

    const onRunDone = (payload: StreamedRun) => {
      if (payload.id !== runId) {
        return;
      }

      appendTerminal("[socket] run completed via realtime stream");
      setProgress(100, "Completed");
      setIsRunning(false);
      setRunId(null);
      setLastRunId(payload.id);
    };

    socket.on("run:update", onRunUpdate);
    socket.on("run:done", onRunDone);

    socket.on("connect_error", () => {
      appendTerminal("[socket] stream unavailable, continuing in fallback mode");
    });

    return () => {
      socket.off("run:update", onRunUpdate);
      socket.off("run:done", onRunDone);
      socket.disconnect();
    };
  }, [appendTerminal, runId, setAgentStatus, setProgress, setRunId]);

  const runLocalSimulation = async () => {
    for (const step of agentSequence) {
      setAgentStatus(step.name, "running");
      setProgress(step.progress, step.label);
      appendTerminal(`[${step.name.toLowerCase().replace(/\s+/g, "-")}] running`);
      await sleep(760);
      setAgentStatus(step.name, "done");
      appendTerminal(`[${step.name.toLowerCase().replace(/\s+/g, "-")}] done`);
      await sleep(160);
    }

    setLastRunId(`local-${Date.now()}`);
    appendTerminal("[system] run completed. live deployment ready.");
    setIsRunning(false);
  };

  const onRun = async () => {
    if (isRunning) {
      return;
    }

    setIsRunning(true);
    setErrorMessage(null);
    setApprovalId(null);
    setDeployStatus("idle");

    resetRun();
    appendTerminal(`$ mode: ${demoMode ? "demo" : "live"}`);
    appendTerminal("$ generating predictive workflow");

    try {
      const predictionResp = await fetch("/api/predict-next-step", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, user_id: USER_ID, project_id: PROJECT_ID })
      });

      const predictionData = (await predictionResp.json()) as {
        title?: string;
        reason?: string;
        confidence?: number;
        error?: string;
      };

      if (predictionResp.ok && predictionData.title && predictionData.reason && typeof predictionData.confidence === "number") {
        setPredicted({
          title: predictionData.title,
          reason: predictionData.reason,
          confidence: predictionData.confidence
        });
        appendTerminal(`[predictive] ${predictionData.title} (${Math.round(predictionData.confidence * 100)}%)`);
      } else {
        const message = predictionData.error ?? "Predictive service unavailable.";
        appendTerminal(`[predictive] ${message}`);
      }
    } catch {
      appendTerminal("[predictive] fallback activated due to network error");
    }

    appendTerminal("$ synthesizing generative ui component");

    try {
      const genResp = await fetch("/api/generate-ui", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          framework: "react",
          user_id: USER_ID,
          project_id: PROJECT_ID,
          demo_mode: demoMode
        })
      });

      const generated = (await genResp.json()) as {
        framework?: "react" | "vue";
        fileName?: string;
        code?: string;
        rationale?: string;
        error?: string;
      };

      if (genResp.ok && generated.framework && generated.fileName && generated.code && generated.rationale) {
        setOutput({
          framework: generated.framework,
          fileName: generated.fileName,
          code: generated.code,
          rationale: generated.rationale
        });
        appendTerminal(`[gen-ui] created ${generated.fileName}`);
      } else {
        const message = generated.error ?? "AI generation failed. Please revise prompt or retry.";
        setErrorMessage(message);
        appendTerminal(`[gen-ui] ${message}`);
      }
    } catch {
      const message = "Gateway unavailable. Local simulation active.";
      setErrorMessage(message);
      appendTerminal(`[gen-ui] ${message}`);
    }

    if (demoMode) {
      appendTerminal("$ demo mode active; skipping external run creation");
      await runLocalSimulation();
      return;
    }

    appendTerminal("$ requesting autonomous run from gateway");

    let createdRunId: string | null = null;
    try {
      const runResp = await fetch("/api/agents/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, user_id: USER_ID, project_id: PROJECT_ID, demo_mode: demoMode })
      });

      if (runResp.ok) {
        const runData = (await runResp.json()) as { run_id: string | null; error?: string };
        createdRunId = runData.run_id;
        if (!createdRunId && runData.error) {
          setErrorMessage(runData.error);
        }
      }
    } catch {
      appendTerminal("[run] gateway request failed - fallback simulation enabled");
    }

    if (createdRunId) {
      setRunId(createdRunId);
      setLastRunId(createdRunId);
      appendTerminal(`[run] gateway accepted run ${createdRunId}`);

      const pollUntilDone = async () => {
        let attempts = 0;
        while (attempts < 24) {
          attempts += 1;
          await sleep(1100);
          const statusResp = await fetch(`/api/agents/run/${createdRunId}`);
          if (!statusResp.ok) {
            continue;
          }

          const statusData = (await statusResp.json()) as StreamedRun;
          statusData.steps.forEach((step) => setAgentStatus(step.agent, step.status));
          setProgress(statusData.progress, `Agent orchestration (${statusData.status})`);

          if (statusData.status === "done" || statusData.status === "failed") {
            appendTerminal(`[run] polled status: ${statusData.status}`);
            setIsRunning(false);
            setRunId(null);
            return;
          }
        }

        setIsRunning(false);
      };

      void pollUntilDone();
      return;
    }

    await runLocalSimulation();
  };

  const requestProductionDeploy = async () => {
    if (!lastRunId) {
      setErrorMessage("No completed run found. Execute a run before deployment.");
      return;
    }

    setDeployStatus("requesting");
    setErrorMessage(null);

    try {
      const resp = await fetch("/api/deploy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          run_id: lastRunId,
          user_id: USER_ID,
          environment: "production",
          approval_id: approvalId ?? undefined
        })
      });

      const data = (await resp.json()) as {
        status?: string;
        approval_id?: string;
        message?: string;
        error?: string;
        url?: string;
      };

      if (resp.ok && data.status === "deployed") {
        setDeployStatus(`deployed:${data.url ?? "ok"}`);
        appendTerminal(`[deploy] production deployed at ${data.url ?? "N/A"}`);
        return;
      }

      if (data.status === "approval_required" && data.approval_id) {
        setApprovalId(data.approval_id);
        setDeployStatus("approval_required");
        appendTerminal(`[deploy] approval required (${data.approval_id})`);
        return;
      }

      const message = data.error ?? data.message ?? "Deployment failed.";
      setErrorMessage(message);
      setDeployStatus("failed");
    } catch {
      setErrorMessage("Deployment service unavailable.");
      setDeployStatus("failed");
    }
  };

  const approveAndDeploy = async () => {
    if (!approvalId) {
      setErrorMessage("No pending approval request found.");
      return;
    }

    try {
      const resp = await fetch(`/api/governance/approvals/${approvalId}/decision`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "approved", decided_by: USER_ID })
      });

      if (!resp.ok) {
        setErrorMessage("Approval decision failed.");
        return;
      }

      appendTerminal(`[approval] ${approvalId} approved`);
      await requestProductionDeploy();
    } catch {
      setErrorMessage("Approval service unavailable.");
    }
  };

  return (
    <div className="grid gap-4">
      {errorMessage && (
        <div className="panel border-rose-400/35 bg-rose-500/10 p-3 text-sm text-rose-200" role="alert">
          <AlertTriangle size={15} className="mr-2 inline" />
          {errorMessage}
        </div>
      )}

      <div className="panel p-4">
        <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
          <Brain size={16} />
          Living AI Command Layer
        </div>

        <div className="grid gap-3">
          <textarea
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            className="min-h-[110px] w-full rounded-xl border border-white/15 bg-[#0b132a]/70 p-3 text-sm text-slate-100 outline-none focus:border-sky-400"
          />

          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="text-xs text-slate-300">
              Supports text/voice/image ingestion with moderation, quota checks, and governance policy enforcement.
            </div>
            <button
              type="button"
              onClick={onRun}
              disabled={isRunning}
              className="rounded-full border border-white/15 bg-gradient-to-r from-[#1a56db] to-[#7c3aed] px-4 py-2 text-xs font-semibold text-white disabled:opacity-60"
            >
              {isRunning ? "Running Autonomous Workflow..." : `Run ${demoMode ? "Demo" : "Live"} Build`}
            </button>
          </div>

          <div>
            <div className="mb-1 flex items-center justify-between text-xs text-slate-300">
              <span>{phaseLabel}</span>
              <span>{progress}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full border border-white/20 bg-white/5">
              <span
                className="block h-full bg-gradient-to-r from-[#1a56db] via-[#7c3aed] to-[#11b4b0] transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={requestProductionDeploy}
              className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-slate-200"
            >
              Request Production Deploy
            </button>
            <button
              type="button"
              onClick={approveAndDeploy}
              className="rounded-full border border-emerald-400/40 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-200"
            >
              Approve + Deploy
            </button>
            <span className="text-xs text-slate-400">Deploy status: {deployStatus}</span>
            {approvalId && <span className="text-xs text-amber-300">Approval: {approvalId}</span>}
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.25fr_1fr]">
        <div className="panel p-4">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
            <Sparkles size={16} />
            Autonomous Agent Matrix
          </div>

          <div className="grid gap-2">
            {agents.map((agent) => (
              <div
                key={agent.name}
                className="flex items-center justify-between gap-2 rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-xs"
              >
                <div>
                  <div className="font-medium text-slate-100">{agent.name}</div>
                  <div className="text-slate-400">{agent.description}</div>
                </div>
                <span className={statusClass(agent.status)}>{agent.status}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-4">
          <div className="panel p-4">
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-white">
              <WandSparkles size={16} />
              Predictive Workflow
            </div>
            {predicted ? (
              <div className="rounded-lg border border-white/15 bg-white/5 p-3 text-xs text-slate-300">
                <div className="text-sm font-semibold text-slate-100">{predicted.title}</div>
                <p className="mt-1">{predicted.reason}</p>
                <p className="mt-2 text-sky-300">Confidence: {Math.round(predicted.confidence * 100)}%</p>
              </div>
            ) : (
              <p className="text-xs text-slate-400">Run the agent workflow to see AI-predicted next actions.</p>
            )}
          </div>

          <div className="panel p-4">
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-white">
              <Database size={16} />
              Contextual Memory Layer
            </div>
            <p className="text-xs text-slate-300">
              Vector-memory hooks persist preferences and patterns. Retention and delete/export controls are wired through compliance APIs.
            </p>
          </div>

          <div className="panel p-4">
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-white">
              <Rocket size={16} />
              Self-Healing Runtime
            </div>
            <p className="text-xs text-slate-300">
              Ops agent monitors health signals and auto-patches known regressions using replayable fix recipes.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
        <div className="panel p-4">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-white">
            <Waves size={16} />
            Execution Terminal
          </div>
          <pre className="max-h-[260px] overflow-auto rounded-xl border border-white/15 bg-[#0a1226]/80 p-3 text-xs text-slate-300">
            {terminal.join("\n")}
          </pre>
        </div>

        <div className="panel p-4">
          <div className="mb-2 flex items-center justify-between gap-2 text-sm font-semibold text-white">
            <span>Generative UI Output</span>
            <button
              type="button"
              onClick={() => {
                undoOutput();
                appendTerminal("[history] undo applied");
              }}
              className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/5 px-2 py-1 text-[11px] text-slate-200"
            >
              <Undo2 size={12} /> Undo
            </button>
          </div>
          {output ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="rounded-xl border border-white/15 bg-[#0b132a]/70 p-3"
            >
              <div className="mb-2 text-xs text-slate-300">
                <strong className="text-slate-100">{output.fileName}</strong> ({output.framework})
              </div>
              <pre className="max-h-[210px] overflow-auto text-[11px] text-slate-300">{output.code}</pre>
            </motion.div>
          ) : (
            <p className="text-xs text-slate-400">AI-generated component output appears here after run.</p>
          )}
        </div>
      </div>
    </div>
  );
}
