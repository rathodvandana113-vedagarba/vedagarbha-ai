/**
 * AI Voice Generation Service 
 * ===========================
 * This module acts as the pluggable layer for Voice APIs (e.g. ElevenLabs, OpenAI TTS).
 * 
 * INTEGRATION INSTRUCTIONS:
 * 1. Add VOICE_API_KEY to your .env.local file.
 * 2. Configure the fetch URL to point to your TTS provider (like ElevenLabs).
 * 3. Map the returned audio stream/URL to the `audioUrl` response object.
 */

export async function generateVoice(text: string, voiceId?: string) {
  const apiKey = process.env.ELEVENLABS_API_KEY || process.env.VOICE_API_KEY;

  if (!apiKey) {
    console.warn("[ELEVENLABS_API_KEY] NOT FOUND - FALLBACK TO MOCK");
    // Simulate API delay
    await new Promise(r => setTimeout(r, 1500));
    const resultUrl = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";
    return {
      success: true,
      data: {
        audioUrl: resultUrl, // Keep for backward compat
        resultUrl,
        text,
        voiceId: voiceId || "rachel",
        duration: Math.ceil(text.length / 15),
      }
    };
  }

  // ==== REAL INTEGRATION START ====
  const targetVoice = voiceId || "21m00Tcm4TlvDq8ikWAM"; // Default Rachel voice
  const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${targetVoice}`, {
    method: 'POST',
    headers: {
      'Accept': 'audio/mpeg',
      'Content-Type': 'application/json',
      'xi-api-key': apiKey
    },
    body: JSON.stringify({
      text: text,
      model_id: "eleven_monolingual_v1",
      voice_settings: { stability: 0.5, similarity_boost: 0.5 }
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("ElevenLabs API Error:", errorText);
    throw new Error(`Voice generation failed: ${response.statusText}`);
  }

  // Convert binary audio buffer to Base64 data URL
  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const base64Audio = buffer.toString('base64');
  const audioDataUrl = `data:audio/mpeg;base64,${base64Audio}`;

  return {
    success: true,
    data: {
      audioUrl: audioDataUrl, // Keep for backward compat
      resultUrl: audioDataUrl,
      text
    }
  };
}
