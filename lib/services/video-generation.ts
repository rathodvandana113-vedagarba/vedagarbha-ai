/**
 * AI Video Generation Service (Asynchronous)
 * =========================================
 * Using Fal.ai's Kling 1.6 video generation with a split submit/status pattern
 * to prevent Vercel timeout issues.
 */

const API_KEY = process.env.FAL_KEY || process.env.VIDEO_API_KEY;

export async function startVideoGeneration(prompt: string, type: 'text' | 'image', imageUrl?: string) {
  if (!API_KEY) {
    throw new Error("VIDEO_API_KEY (FAL_KEY) not found. Please add your Fal.ai API key to environment variables.");
  }

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

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Key ${API_KEY}`
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Fal.ai Submission Error:", errorText);
    throw new Error(`Failed to start generation: ${response.statusText}`);
  }

  const { request_id } = await response.json();
  return { requestId: request_id };
}

export async function getVideoStatus(requestId: string) {
  if (!API_KEY) {
    throw new Error("API Key missing during status check.");
  }

  const statusEndpoint = `https://queue.fal.run/fal-ai/kling-video/v1.6/standard/requests/${requestId}`;
  
  const response = await fetch(statusEndpoint, {
    headers: { 'Authorization': `Key ${API_KEY}` }
  });

  if (!response.ok) {
    throw new Error("Failed to check generation status.");
  }

  const status = await response.json();

  if (status.status === "COMPLETED") {
    const resultUrl = status.video?.url || status.data?.[0]?.url || status.url;
    return { status: "COMPLETED", videoUrl: resultUrl };
  }

  if (status.status === "FAILED") {
    return { status: "FAILED", error: status.error || "Provider-side failure" };
  }

  return { status: "IN_PROGRESS" };
}

// Keep for backward compatibility if needed, but we should move away from this
export async function generateVideo(prompt: string, type: 'text' | 'image', imageUrl?: string) {
    const { requestId } = await startVideoGeneration(prompt, type, imageUrl);
    // This will still probably timeout on Vercel if called here, 
    // but we'll use the requestId approach in the route handlers instead.
    return { success: true, requestId };
}
