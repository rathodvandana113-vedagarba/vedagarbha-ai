/**
 * AI Video Generation Service 
 * ===========================
 * This module acts as the pluggable layer for Video APIs (e.g. Kling API, Runway, Pika).
 * 
 * INTEGRATION INSTRUCTIONS:
 * 1. Add VIDEO_API_KEY to your .env.local file.
 * 2. Replace the fetch URL below with your chosen video generation provider.
 * 3. Map the returned JSON payload to match the `videoUrl` structure.
 */

export async function generateVideo(prompt: string, type: 'text' | 'image', imageUrl?: string) {
  const apiKey = process.env.FAL_KEY || process.env.VIDEO_API_KEY;

  if (!apiKey) {
    throw new Error("VIDEO_API_KEY (FAL_KEY) not found. Please add your Fal.ai API key to environment variables.");
  }

  // ==== REAL INTEGRATION START ====
  const endpoint = type === 'image' 
    ? "https://queue.fal.run/fal-ai/kling-video/v1.6/standard/image-to-video"
    : "https://queue.fal.run/fal-ai/kling-video/v1.6/standard/text-to-video";

  const payload: any = {
    prompt: prompt,
    aspect_ratio: "16:9",
  };

  if (type === 'image' && imageUrl) {
    payload.image_url = imageUrl;
  }

  // We await the result via Fal's queue system
  const response = await fetch(endpoint.replace('queue.', ''), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Key ${apiKey}`
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Fal.ai Video API Error:", errorText);
    
    let errorMessage = "Video generation failed.";
    try {
      const errorJson = JSON.parse(errorText);
      errorMessage = errorJson.detail || errorJson.message || errorMessage;
    } catch (e) {}

    throw new Error(`${errorMessage} (Status: ${response.status})`);
  }

  const result = await response.json();
  const resultUrl = result.video?.url || result.data?.[0]?.url;
  return {
    success: true,
    data: {
      videoUrl: resultUrl, // Keep for backward compat
      resultUrl,
      prompt, 
      type
    }
  };
}
