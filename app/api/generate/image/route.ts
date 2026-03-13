import { NextRequest, NextResponse } from "next/server";
import { generateImage } from "@/lib/services/image-generation";

export async function POST(req: NextRequest) {
  try {
    const { prompt, aspectRatio } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const result = await generateImage(prompt, aspectRatio || "16:9");
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Image Generation Error:", error);
    return NextResponse.json({ error: error.message || "Failed to generate image" }, { status: 500 });
  }
}
