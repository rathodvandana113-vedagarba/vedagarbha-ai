/**
 * AI Video Generation Service 
 * ===========================
 * Using Fal.ai's Kling 1.6 video generation with Polling to prevent timeouts.
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
    prompt: prompt.trim(),
    aspect_ratio: "16:9",
  };

  if (type === 'image' && imageUrl) {
    payload.image_url = imageUrl;
  }

  // 1. Submit to queue
  const queueRes = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Key ${apiKey}`
    },
    body: JSON.stringify(payload)
  });

  if (!queueRes.ok) {
    const errorText = await queueRes.text();
    console.error("Fal.ai Queue Error:", errorText);
    throw new Error("Failed to start video generation. Check your API key and balance.");
  }

  const { request_id } = await queueRes.json();
  const statusEndpoint = `https://queue.fal.run/fal-ai/kling-video/v1.6/standard/requests/${request_id}`;

  // 2. Poll for result (Kling can take 2-5 minutes)
  let attempts = 0;
  const maxAttempts = 60; // 5 minutes (5s interval)
  
  while (attempts < maxAttempts) {
    attempts++;
    console.log(`Polling for video (${request_id})... Attempt ${attempts}`);
    
    const statusRes = await fetch(statusEndpoint, {
      headers: { 'Authorization': `Key ${apiKey}` }
    });
    
    if (!statusRes.ok) {
      throw new Error("Error checking video generation status.");
    }
    
    const status = await statusRes.json();
    
    if (status.status === "COMPLETED") {
      const resultUrl = status.video?.url || status.data?.[0]?.url || status.url;
      if (!resultUrl) throw new Error("Video generation completed but no URL was found.");
      
      return {
        success: true,
        data: {
          videoUrl: resultUrl,
          resultUrl,
          prompt,
          type
        }
      };
    }
    
    if (status.status === "FAILED") {
      throw new Error("Video generation failed at the provider level.");
    }
    
    // Wait 5 seconds before next poll
    await new Promise(r => setTimeout(r, 5000));
  }

  throw new Error("Video generation timed out. Please try again later.");
}
