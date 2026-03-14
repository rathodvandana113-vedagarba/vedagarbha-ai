import crypto from 'crypto';

/**
 * AI Video Generation Service (fal.ai Kling v1.6)
 * ============================================
 * Updated to use fal.ai based on the provided credentials in .env
 */

export async function startVideoGeneration(prompt: string, type: 'text' | 'image', imageUrl?: string) {
  const videoKey = (process.env.VIDEO_API_KEY || "").trim();
  
  if (!videoKey) {
    console.error("CRITICAL: VIDEO_API_KEY is EMPTY in environment variables.");
    throw new Error("VIDEO_API_KEY is missing. Please add it to Vercel Settings.");
  }

  // fal.ai key is used as 'Key KEY_ID:KEY_SECRET'
  const authHeader = `Key ${videoKey}`;
  
  const model = type === 'image' 
    ? "fal-ai/kling-video/v1.6/standard/image-to-video"
    : "fal-ai/kling-video/v1.6/standard/text-to-video";

  const endpoint = `https://queue.fal.run/${model}`;

  const payload: any = {
    prompt: prompt.trim(),
    aspect_ratio: "16:9",
    duration: "5"
  };

  if (type === 'image' && imageUrl) {
    payload.image_url = imageUrl;
  }
  
  console.log(`DEBUG: Sending fal.ai request to ${endpoint}`);
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': authHeader
    },
    body: JSON.stringify(payload)
  });

  const result = await response.json();

  if (!response.ok) {
    console.error("fal.ai API Error Response:", JSON.stringify(result));
    throw new Error(result.message || result.error || "fal.ai failed to start video generation.");
  }

  // fal.ai queue returns a request_id or a logs url
  const requestId = result.request_id;
  if (!requestId) {
    console.error("fal.ai did not return a request_id:", JSON.stringify(result));
    throw new Error("fal.ai did not return a valid task ID.");
  }

  return { requestId };
}

export async function getVideoStatus(requestId: string) {
  const videoKey = (process.env.VIDEO_API_KEY || "").trim();
  if (!videoKey) throw new Error("API Key missing.");
  
  const authHeader = `Key ${videoKey}`;
  const statusEndpoint = `https://queue.fal.run/requests/${requestId}/status`;
  
  const response = await fetch(statusEndpoint, {
    headers: { 'Authorization': authHeader }
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || "Failed to check generation status.");
  }

  const statusData = await response.json();
  
  if (statusData.status === "COMPLETED") {
    // Once completed, we must fetch the result
    const resultResponse = await fetch(`https://queue.fal.run/requests/${requestId}`, {
      headers: { 'Authorization': authHeader }
    });
    const resultData = await resultResponse.json();
    const videoUrl = resultData.video?.url || resultData.video_url;
    return { status: "COMPLETED", videoUrl };
  }

  if (statusData.status === "FAILED") {
    return { status: "FAILED", error: statusData.error || "fal.ai provider-side failure" };
  }

  return { status: "IN_PROGRESS" };
}

// Keep for compatibility
export async function generateVideo(prompt: string, type: 'text' | 'image', imageUrl?: string) {
    const { requestId } = await startVideoGeneration(prompt, type, imageUrl);
    return { success: true, requestId };
}
