import { NextResponse } from "next/server";

const API_GATEWAY_URL = process.env.API_GATEWAY_URL ?? "http://localhost:8080";

export async function POST(req: Request) {
  let body: { prompt?: string; user_id?: string; project_id?: string; demo_mode?: boolean };

  try {
    body = (await req.json()) as { prompt?: string };
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!body.prompt?.trim()) {
    return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
  }

  try {
    const resp = await fetch(`${API_GATEWAY_URL}/v1/agents/run`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: body.prompt,
        user_id: body.user_id,
        project_id: body.project_id,
        demo_mode: body.demo_mode
      })
    });

    const data = (await resp.json()) as Record<string, unknown>;
    if (!resp.ok) {
      return NextResponse.json(
        {
          error: (data.error as string | undefined) ?? `Gateway returned ${resp.status}`,
          run_id: null
        },
        { status: resp.status }
      );
    }

    return NextResponse.json(data, { status: 202 });
  } catch {
    return NextResponse.json({ run_id: null, status: "offline-fallback" }, { status: 202 });
  }
}
