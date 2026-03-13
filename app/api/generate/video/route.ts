import { NextRequest, NextResponse } from "next/server";
import { generateVideo } from "@/lib/services/video-generation";

export async function POST(req: NextRequest) {
  try {
    const { prompt, type, imageUrl } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required minimize" }, { status: 400 });
    }

    const result = await generateVideo(prompt, type || "text", imageUrl);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Video Generation Error:", error);
    return NextResponse.json({ error: error.message || "Failed to generate video" }, { status: 500 });
  }
}
