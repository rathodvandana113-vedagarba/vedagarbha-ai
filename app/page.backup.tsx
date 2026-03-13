import Link from "next/link";
import {
  Bot,
  Brain,
  Boxes,
  ShieldCheck,
  Database,
  Radar,
  Globe,
  Accessibility,
  Landmark,
  Wallet,
  BarChart3,
  Plug
} from "lucide-react";
import { MainNav } from "@/components/main-nav";
import { GlowCursor } from "@/components/glow-cursor";
import { HeroScene } from "@/components/hero-scene";
import { MotionCard } from "@/components/motion-card";
import { ExperienceControls } from "@/components/experience-controls";

const capabilityCards = [
  {
    icon: Bot,
    title: "Generative UI Engine",
    description:
      "Describe features in natural language and generate React/Vue components instantly with editable outputs."
  },
  {
    icon: Brain,
    title: "Autonomous Agent System",
    description:
      "Agents plan, build, test, deploy, and monitor without constant prompts, including self-healing pathways."
  },
  {
    icon: Database,
    title: "Contextual Memory",
    description:
      "Vector-memory integration stores preferences, past decisions, and project history for adaptive behavior."
  },
  {
    icon: Radar,
    title: "Predictive Workflow",
    description:
      "AI anticipates the next operation and preloads tasks, assets, and integrations before you ask."
  },
  {
    icon: Boxes,
    title: "3D Immersive Navigation",
    description:
      "Real-time 3D hub with high-fidelity motion graphics, particle fields, keyboard navigation, and fallback controls."
  },
  {
    icon: ShieldCheck,
    title: "Governed AI Runtime",
    description:
      "Prompt moderation, output filtering, approval gates, undo history, and auditable policy decisions."
  }
];

const architectureRows = [
  ["Frontend", "Next.js 14+, React, R3F, Framer Motion, Zustand, Tailwind + shadcn"],
  ["Node API", "Fastify + Socket.io for real-time gateway and orchestration"],
  ["AI Service", "FastAPI for generation, memory, policy moderation, and model-provider abstraction"],
  ["Data", "PostgreSQL + Redis + Vector DB (Pinecone/Milvus-compatible memory layer)"],
  ["Security", "Sandbox execution, policy guardrails, OAuth2/WebAuthn-ready, audit logs"],
  ["Infra", "Docker, Kubernetes manifests, Cloudflare edge strategy, AWS/GCP pattern"]
];

const planRows = [
  ["Free", "50k tokens/month", "Basic AI + 2D fallback + demo mode", "$0"],
  ["Pro", "1.5M tokens/month", "Advanced 3D, priority runs, integrations", "$39/mo"],
  ["Enterprise", "Custom", "SSO, dedicated models, custom API + invoicing", "Custom"]
];

const governanceCards = [
  {
    icon: Accessibility,
    title: "UX + Accessibility",
    detail:
      "WCAG-minded controls, keyboard-accessible 3D interactions, text alternatives, and a one-click 2D standard mode."
  },
  {
    icon: Landmark,
    title: "Legal + Compliance",
    detail:
      "Data ownership controls, opt-in model-improvement preference, deletion/export flows, and audit/session logs."
  },
  {
    icon: Wallet,
    title: "Monetization + Quotas",
    detail:
      "Token quotas, plan tiers, per-minute rate limiting, checkout session stubs (Stripe/PayPal), and invoices."
  },
  {
    icon: BarChart3,
    title: "DevOps + Cost Control",
    detail:
      "TTFB/cost metrics, FPS telemetry hooks, runtime resource stats, and deploy gate workflows for safe release."
  },
  {
    icon: Plug,
    title: "Future Extensibility",
    detail:
      "Plugin registry endpoints, model-agnostic provider layer, and mobile-ready API surface for native wrappers."
  }
];

export default function HomePage() {
  return (
    <>
      <GlowCursor />
      <MainNav />

      <main className="pb-14">
        <section className="mx-auto w-[min(1220px,calc(100%-2rem))] pt-6">
          <ExperienceControls />
        </section>

        <section className="mx-auto grid w-[min(1220px,calc(100%-2rem))] gap-8 pb-10 pt-10 lg:grid-cols-[1.05fr_1fr] lg:items-center">
          <div>
            <p className="pill">Living AI Interface • Lovable speed + Emergent autonomy</p>
            <h1 className="mt-4 text-4xl font-bold text-white md:text-6xl">
              Build adaptive apps in a
              <span className="gradient-text"> real-time 3D AI ecosystem</span>
            </h1>
            <p className="mt-4 max-w-2xl text-sm text-muted md:text-base">
              This foundation now includes UX accessibility controls, AI governance guardrails, billing/quotas, compliance-ready
              endpoints, monitoring hooks, and plugin/model extensibility scaffolding.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/workspace"
                className="rounded-full border border-white/15 bg-gradient-to-r from-[#1a56db] to-[#7c3aed] px-5 py-2 text-sm font-semibold text-white"
              >
                Launch Workspace
              </Link>
              <a
                href="#capabilities"
                className="rounded-full border border-white/15 bg-white/5 px-5 py-2 text-sm font-semibold text-slate-200"
              >
                Explore Capabilities
              </a>
            </div>

            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              <div className="panel p-3 text-sm">
                <div className="text-2xl font-bold text-white">60 FPS</div>
                <div className="text-xs text-muted">Target high-end rendering</div>
              </div>
              <div className="panel p-3 text-sm">
                <div className="text-2xl font-bold text-white">10 Agents</div>
                <div className="text-xs text-muted">Parallel orchestration roles</div>
              </div>
              <div className="panel p-3 text-sm">
                <div className="text-2xl font-bold text-white">Governed</div>
                <div className="text-xs text-muted">Moderation + approvals + audit</div>
              </div>
            </div>
          </div>

          <HeroScene />
        </section>

        <section id="capabilities" className="mx-auto w-[min(1220px,calc(100%-2rem))] py-8">
          <div className="mb-4 flex items-end justify-between gap-4">
            <h2 className="text-2xl font-bold text-white md:text-3xl">Core AI Capabilities</h2>
            <p className="max-w-xl text-right text-sm text-muted">
              The interface is designed as an active AI operating system, not a static page builder.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {capabilityCards.map((item) => (
              <MotionCard key={item.title} className="p-4">
                <item.icon size={17} className="text-sky-300" />
                <h3 className="mt-3 text-lg text-white">{item.title}</h3>
                <p className="mt-2 text-sm text-muted">{item.description}</p>
              </MotionCard>
            ))}
          </div>
        </section>

        <section className="mx-auto w-[min(1220px,calc(100%-2rem))] py-8">
          <div className="mb-4 flex items-end justify-between gap-4">
            <h2 className="text-2xl font-bold text-white md:text-3xl">Business + Governance Layer</h2>
            <p className="text-sm text-muted">Everything required for safe scaling beyond prototype stage.</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {governanceCards.map((item) => (
              <MotionCard key={item.title} className="p-4">
                <item.icon size={17} className="text-fuchsia-300" />
                <h3 className="mt-3 text-lg text-white">{item.title}</h3>
                <p className="mt-2 text-sm text-muted">{item.detail}</p>
              </MotionCard>
            ))}
          </div>
        </section>

        <section id="architecture" className="mx-auto w-[min(1220px,calc(100%-2rem))] py-8">
          <div className="panel overflow-hidden">
            <div className="border-b border-white/10 p-4">
              <h2 className="text-2xl font-bold text-white">Technical Architecture</h2>
              <p className="mt-2 text-sm text-muted">
                Scalable stack combining Next.js frontend, Node real-time gateway, and Python AI service orchestration.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse text-left text-sm">
                <thead>
                  <tr>
                    <th className="border-b border-white/10 px-4 py-3 text-slate-200">Layer</th>
                    <th className="border-b border-white/10 px-4 py-3 text-slate-200">Implementation</th>
                  </tr>
                </thead>
                <tbody>
                  {architectureRows.map(([layer, implementation]) => (
                    <tr key={layer}>
                      <td className="border-b border-white/10 px-4 py-3 font-semibold text-white">{layer}</td>
                      <td className="border-b border-white/10 px-4 py-3 text-slate-300">{implementation}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="mx-auto w-[min(1220px,calc(100%-2rem))] py-8">
          <div className="panel overflow-hidden">
            <div className="border-b border-white/10 p-4">
              <h2 className="text-2xl font-bold text-white">Subscription Tiers</h2>
              <p className="mt-2 text-sm text-muted">Quota and monetization scaffolding with billing API routes included.</p>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse text-left text-sm">
                <thead>
                  <tr>
                    <th className="border-b border-white/10 px-4 py-3 text-slate-200">Plan</th>
                    <th className="border-b border-white/10 px-4 py-3 text-slate-200">Usage Limit</th>
                    <th className="border-b border-white/10 px-4 py-3 text-slate-200">Features</th>
                    <th className="border-b border-white/10 px-4 py-3 text-slate-200">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {planRows.map(([plan, quota, features, price]) => (
                    <tr key={plan}>
                      <td className="border-b border-white/10 px-4 py-3 font-semibold text-white">{plan}</td>
                      <td className="border-b border-white/10 px-4 py-3 text-slate-300">{quota}</td>
                      <td className="border-b border-white/10 px-4 py-3 text-slate-300">{features}</td>
                      <td className="border-b border-white/10 px-4 py-3 text-slate-300">{price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section id="roadmap" className="mx-auto w-[min(1220px,calc(100%-2rem))] py-8">
          <div className="mb-4 flex items-end justify-between gap-4">
            <h2 className="text-2xl font-bold text-white md:text-3xl">Development Roadmap</h2>
            <p className="text-sm text-muted">6-12 month execution model for a senior multi-disciplinary team.</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {[
              ["Phase 1", "Prototype", "3D landing, chatbot, text-to-UI MVP, fallback UX"],
              ["Phase 2", "Core AI", "Autonomous agents, vector memory, governance + approval workflows"],
              ["Phase 3", "Polish", "Motion optimization, mobile LOD fallback, security and compliance hardening"],
              ["Phase 4", "Launch", "Beta rollout, monetization activation, observability + public release"]
            ].map(([phase, title, details]) => (
              <MotionCard key={phase} className="p-4">
                <div className="pill">{phase}</div>
                <h3 className="mt-3 text-xl text-white">{title}</h3>
                <p className="mt-2 text-sm text-muted">{details}</p>
              </MotionCard>
            ))}
          </div>
        </section>

        <section className="mx-auto w-[min(1220px,calc(100%-2rem))] py-8">
          <div className="panel flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">Ready to run your autonomous build loop?</h2>
              <p className="mt-2 text-sm text-muted">
                Open the workspace to test predictive workflows, approvals, undo history, safety filters, and performance telemetry.
              </p>
            </div>

            <Link
              href="/workspace"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-gradient-to-r from-[#1a56db] to-[#7c3aed] px-5 py-2 text-sm font-semibold text-white"
            >
              Open 3D Workspace
              <Globe size={16} />
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
