import { NextResponse } from "next/server";

export async function GET() {
  const videoKey = (process.env.VIDEO_API_KEY || "").trim();
  const voiceKey = (process.env.ELEVENLABS_API_KEY || process.env.VOICE_API_KEY || "").trim();
  const dbUrl = process.env.DATABASE_URL ? "FOUND" : "MISSING";
  const authSecret = process.env.NEXTAUTH_SECRET ? "FOUND" : "MISSING";

  const obfuscate = (key: string) => {
    if (!key) return "MISSING";
    if (key.includes(':')) {
        const [ak, sk] = key.split(':');
        return `AK: ${ak.slice(0,4)}...${ak.slice(-4)} | SK: ${sk.slice(0,2)}...${sk.slice(-2)} (FORMAT OK)`;
    }
    return `${key.slice(0,4)}...${key.slice(-4)} (DIRECT TOKEN FORMAT)`;
  };

  return NextResponse.json({
    diagnostics: {
        VIDEO_API_KEY: obfuscate(videoKey),
        VOICE_API_KEY: obfuscate(voiceKey),
        DATABASE_URL: dbUrl,
        NEXTAUTH_SECRET: authSecret,
        NODE_ENV: process.env.NODE_ENV,
        VERCEL_ENV: process.env.VERCEL_ENV || "NOT_FOUND"
    },
    recommendation: !videoKey.includes(':') && videoKey 
        ? "VIDEO_API_KEY is detected as a direct token. If Kling AI fails, try the 'AK:SK' format."
        : "Check if the obfuscated keys above match your provider dashboards."
  });
}
