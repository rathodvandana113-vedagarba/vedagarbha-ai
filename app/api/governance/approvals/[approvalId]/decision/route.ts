import { NextResponse } from "next/server";

const API_GATEWAY_URL = process.env.API_GATEWAY_URL ?? "http://localhost:8080";

export async function POST(req: Request, ctx: { params: { approvalId: string } }) {
  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  try {
    const resp = await fetch(`${API_GATEWAY_URL}/v1/governance/approvals/${ctx.params.approvalId}/decision`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    const data = await resp.json();
    return NextResponse.json(data, { status: resp.status });
  } catch {
    return NextResponse.json({ error: "Governance service unavailable" }, { status: 503 });
  }
}
