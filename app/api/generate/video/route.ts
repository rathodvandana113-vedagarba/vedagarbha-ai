import { NextRequest, NextResponse } from "next/server";
import { startVideoGeneration, getVideoStatus } from "@/lib/services/video-generation";

// POST /api/generate/video — Start generation
export async function POST(req: NextRequest) {
  try {
    const { prompt, type, imageUrl } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const { requestId } = await startVideoGeneration(prompt, type || "text", imageUrl);
    return NextResponse.json({ success: true, requestId });
  } catch (error: any) {
    console.error("Video Generation Submission Error:", error);
    return NextResponse.json({ error: error.message || "Failed to start video generation" }, { status: 500 });
  }
}

// GET /api/generate/video?requestId=... — Check status
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const requestId = searchParams.get("requestId");

    if (!requestId) {
      return NextResponse.json({ error: "requestId is required" }, { status: 400 });
    }

    const status = await getVideoStatus(requestId);
    return NextResponse.json(status);
  } catch (error: any) {
    console.error("Video Status Check Error:", error);
    return NextResponse.json({ error: error.message || "Failed to check status" }, { status: 500 });
  }
}
