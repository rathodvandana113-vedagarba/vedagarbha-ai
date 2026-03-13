"use client";

import { useEffect, useState } from "react";
import { Activity } from "lucide-react";
import { useUiStore } from "@/lib/ui-store";

interface PerfSummary {
  runtime: {
    rss: number;
    heapUsed: number;
    heapTotal: number;
  };
  fps: {
    average: number;
    samples: number;
  };
}

export function PerformanceMonitor({ userId = "demo-user" }: { userId?: string }) {
  const immersiveMode = useUiStore((state) => state.immersiveMode);
  const [clientFps, setClientFps] = useState<number>(0);
  const [serverPerf, setServerPerf] = useState<PerfSummary | null>(null);

  useEffect(() => {
    let raf = 0;
    let frames = 0;
    let start = performance.now();

    const tick = (time: number) => {
      frames += 1;
      const elapsed = time - start;
      if (elapsed >= 1000) {
        const fps = Math.round((frames * 1000) / elapsed);
        setClientFps(fps);
        frames = 0;
        start = time;
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    const id = window.setInterval(async () => {
      try {
        await fetch("/api/metrics/fps", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: userId,
            fps: clientFps || 1,
            mode: immersiveMode ? "3d" : "2d"
          })
        });

        const perfResp = await fetch("/api/metrics/performance");
        if (perfResp.ok) {
          const data = (await perfResp.json()) as PerfSummary;
          setServerPerf(data);
        }
      } catch {
        // Ignore telemetry errors in local dev.
      }
    }, 6000);

    return () => window.clearInterval(id);
  }, [clientFps, immersiveMode, userId]);

  return (
    <div className="panel p-4">
      <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-white">
        <Activity size={16} className="text-sky-300" />
        Performance Monitor
      </div>

      <div className="grid gap-2 text-xs text-slate-300">
        <div className="rounded-lg border border-white/15 bg-white/5 px-3 py-2">Client FPS: {clientFps || "-"}</div>
        <div className="rounded-lg border border-white/15 bg-white/5 px-3 py-2">
          Mode: {immersiveMode ? "3D immersive" : "2D standard"}
        </div>
        <div className="rounded-lg border border-white/15 bg-white/5 px-3 py-2">
          Server Heap: {serverPerf ? Math.round(serverPerf.runtime.heapUsed / 1_000_000) : "-"} MB
        </div>
      </div>
    </div>
  );
}
