import { NextResponse } from "next/server";

interface GenerateBody {
  prompt: string;
  framework?: "react" | "vue";
  user_id?: string;
  project_id?: string;
  demo_mode?: boolean;
}

const API_GATEWAY_URL = process.env.API_GATEWAY_URL ?? "http://localhost:8080";

function localFallback(prompt: string, framework: "react" | "vue") {
  const safeName = prompt
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 32);

  if (framework === "vue") {
    return {
      framework,
      fileName: `${safeName || "feature"}.vue`,
      rationale: "Generated locally as fallback when gateway is unavailable.",
      code: `<script setup lang=\"ts\">\nconst title = \"AI Generated View\";\n<\/script>\n\n<template>\n  <section class=\"panel\">\n    <h2>{{ title }}</h2>\n    <p>${prompt}</p>\n  <\/section>\n<\/template>`
    };
  }

  return {
    framework,
    fileName: `${safeName || "feature"}.tsx`,
    rationale: "Generated locally as fallback when gateway is unavailable.",
    code: `export function GeneratedFeature() {\n  return (\n    <section className=\"rounded-xl border border-white/15 bg-white/5 p-4\">\n      <h2 className=\"text-lg font-semibold text-white\">AI Generated Feature</h2>\n      <p className=\"mt-2 text-sm text-slate-300\">${prompt}</p>\n    </section>\n  );\n}`
  };
}

export async function POST(req: Request) {
  let body: GenerateBody;

  try {
    body = (await req.json()) as GenerateBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!body.prompt?.trim()) {
    return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
  }

  const framework = body.framework ?? "react";

  try {
    const resp = await fetch(`${API_GATEWAY_URL}/v1/generate-ui`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: body.prompt,
        framework,
        user_id: body.user_id,
        project_id: body.project_id,
        demo_mode: body.demo_mode
      })
    });

    const data = (await resp.json()) as Record<string, unknown>;
    if (!resp.ok) {
      return NextResponse.json(
        {
          error: (data.error as string | undefined) ?? `Gateway returned ${resp.status}`
        },
        { status: resp.status }
      );
    }

    return NextResponse.json({
      framework: data.framework,
      fileName: data.fileName ?? data.file_name,
      code: data.code,
      rationale: data.rationale,
      run_id: data.run_id ?? null
    });
  } catch {
    return NextResponse.json(localFallback(body.prompt, framework));
  }
}
