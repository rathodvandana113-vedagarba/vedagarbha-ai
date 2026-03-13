import { NextResponse } from "next/server";

interface PredictBody {
  prompt: string;
  user_id?: string;
  project_id?: string;
}

const API_GATEWAY_URL = process.env.API_GATEWAY_URL ?? "http://localhost:8080";

function fallback(prompt: string) {
  return {
    title: "Prepare data model before UI refinement",
    reason: `Based on prompt intent, the next likely step is defining entities and role scopes before deep UI generation. Prompt context: ${prompt}`,
    confidence: 0.78
  };
}

export async function POST(req: Request) {
  let body: PredictBody;

  try {
    body = (await req.json()) as PredictBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!body.prompt?.trim()) {
    return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
  }

  try {
    const resp = await fetch(`${API_GATEWAY_URL}/v1/predict-next-step`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
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

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(fallback(body.prompt));
  }
}
