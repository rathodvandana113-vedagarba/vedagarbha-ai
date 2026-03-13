import { NextRequest, NextResponse } from "next/server";
import { generateVoice } from "@/lib/services/voice-generation";

export async function POST(req: NextRequest) {
  try {
    const { text, voiceId } = await req.json();

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    if (text.length > 5000) {
      return NextResponse.json({ error: "Text exceeds the 5000 character safety limit." }, { status: 400 });
    }

    const result = await generateVoice(text, voiceId);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Voice Generation Error:", error);
    return NextResponse.json({ error: error.message || "Failed to generate voice" }, { status: 500 });
  }
}
