import { NextResponse } from "next/server";

const API_GATEWAY_URL = process.env.API_GATEWAY_URL ?? "http://localhost:8080";

export async function GET() {
  try {
    const resp = await fetch(`${API_GATEWAY_URL}/v1/metrics/performance`);
    const data = await resp.json();
    return NextResponse.json(data, { status: resp.status });
  } catch {
    return NextResponse.json({ error: "Metrics service unavailable" }, { status: 503 });
  }
}
