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
  const apiKey = (process.env.ELEVENLABS_API_KEY || process.env.VOICE_API_KEY || "").trim();

  if (!apiKey) {
    throw new Error("ELEVENLABS_API_KEY (VOICE_API_KEY) not found. Please add your ElevenLabs API key to environment variables.");
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
      model_id: "eleven_multilingual_v2", // Upgraded for much better quality and accuracy
      voice_settings: { 
        stability: 0.55, 
        similarity_boost: 0.75,
        use_speaker_boost: true
      }
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`ElevenLabs API Error (Status ${response.status}):`, errorText);
    
    let errorMessage = "Voice generation failed.";
    try {
      const errorJson = JSON.parse(errorText);
      errorMessage = errorJson.detail?.message || errorJson.message || errorMessage;
    } catch (e) {}

    if (response.status === 402) {
      errorMessage = "Credits exceeded or Tier restricted. Please switch to a default voice or upgrade.";
    }

    throw new Error(`${errorMessage} (Status: ${response.status})`);
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
