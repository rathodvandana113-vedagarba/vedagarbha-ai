import { NextResponse } from "next/server";

const API_GATEWAY_URL = process.env.API_GATEWAY_URL ?? "http://localhost:8080";

export async function GET(_req: Request, ctx: { params: { runId: string } }) {
  try {
    const resp = await fetch(`${API_GATEWAY_URL}/v1/agents/run/${ctx.params.runId}`);
    if (!resp.ok) {
      throw new Error(`Gateway returned ${resp.status}`);
    }

    const data = await resp.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Run not available" }, { status: 404 });
  }
}
