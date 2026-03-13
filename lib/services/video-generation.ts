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
  const apiKey = process.env.VIDEO_API_KEY;

  if (!apiKey) {
    console.warn("VIDEO_API_KEY is missing. Returning a mock success response.");
    // Simulate API delay
    await new Promise(r => setTimeout(r, 3000));
    return {
      success: true,
      data: {
        videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-ink-swirling-in-water-in-slow-motion-11911-large.mp4", // Mock video playback
        prompt,
        type
      }
    };
  }

  // ==== REAL INTEGRATION START ====
  // Using Fal.ai's Kling 1.6 video generation endpoint as it aligns with the "Kling Clone" project theme
  // Text-to-Video: "fal-ai/kling-video/v1.6/standard/text-to-video"
  // Image-to-Video: "fal-ai/kling-video/v1.6/standard/image-to-video"
  
  const endpoint = type === 'image' 
    ? "https://queue.fal.run/fal-ai/kling-video/v1.6/standard/image-to-video"
    : "https://queue.fal.run/fal-ai/kling-video/v1.6/standard/text-to-video";

  const payload: any = {
    prompt: prompt,
    aspect_ratio: "16:9",
    duration: "5", // Default
  };

  if (type === 'image' && imageUrl) {
    payload.image_url = imageUrl;
  }

  // We await the queue result synchronously for this simple demo layer
  // In production, you would use webhooks or polling
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
    throw new Error(`Video generation failed: ${response.statusText}`);
  }

  const result = await response.json();
  return {
    success: true,
    data: {
      videoUrl: result.video?.url || result.data?.[0]?.url, 
      prompt, 
      type
    }
  };
}
