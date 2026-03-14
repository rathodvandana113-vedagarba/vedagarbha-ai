import crypto from 'crypto';

/**
 * AI Video Generation Service (Native Kling AI API)
 * ================================================
 * Suppors both AK:SK and direct Token formats.
 */

function generateKlingToken(ak: string, sk: string) {
  const header = { alg: "HS256", typ: "JWT" };
  const payload = {
    iss: ak,
    exp: Math.floor(Date.now() / 1000) + 1800, // 30 mins
    nbf: Math.floor(Date.now() / 1000) - 60 // 1 min ago to handle clock drift
  };
  
  const base64UrlEncode = (obj: any) => 
    Buffer.from(JSON.stringify(obj)).toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  
  const unsignedToken = `${base64UrlEncode(header)}.${base64UrlEncode(payload)}`;
  const signature = crypto
    .createHmac('sha256', sk)
    .update(unsignedToken)
    .digest('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
  
  return `${unsignedToken}.${signature}`;
}

export async function startVideoGeneration(prompt: string, type: 'text' | 'image', imageUrl?: string) {
  const videoKey = (process.env.VIDEO_API_KEY || "").trim();
  
  if (!videoKey) {
    console.error("CRITICAL: VIDEO_API_KEY is EMPTY in environment variables.");
    throw new Error("VIDEO_API_KEY is missing. Please add it to Vercel Settings.");
  }

  let token = "";
  if (videoKey.includes(':')) {
    const [ak, sk] = videoKey.split(':');
    // Log partially obfuscated keys for debugging
    console.log(`DEBUG: Authenticating with Kling AK: ${ak.slice(0, 4)}...${ak.slice(-4)}`);
    token = generateKlingToken(ak, sk);
  } else {
    console.log("DEBUG: Using direct token from VIDEO_API_KEY (No colon found)");
    token = videoKey;
  }
  
  const endpoint = type === 'image' 
    ? "https://api.klingai.com/v1/videos/image2video"
    : "https://api.klingai.com/v1/videos/text2video";

  const payload: any = {
    prompt: prompt.trim(),
    aspect_ratio: "16:9",
    model_name: "kling-v1-6",
    duration: "5",
    mode: "std"
  };

  if (type === 'image' && imageUrl) {
    payload.image = imageUrl;
  }
  
  console.log(`DEBUG: Sending request to ${endpoint}`);
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  });

  const result = await response.json();

  if (!response.ok) {
    console.error("Kling AI API Error Response:", JSON.stringify(result));
    
    // Help user with Access Key issues
    if (result.code === 401 || result.message?.toLowerCase().includes("access key")) {
       throw new Error("Kling AI Auth Failed: Please ensure your API key is in 'ACCESS_KEY:SECRET_KEY' format in Vercel.");
    }

    throw new Error(result.message || "Kling AI failed to start. Check your account balance/quota.");
  }

  return { requestId: result.data?.task_id || result.task_id };
}

export async function getVideoStatus(requestId: string) {
  const videoKey = (process.env.VIDEO_API_KEY || "").trim();
  if (!videoKey) throw new Error("API Key missing.");
  
  let token = "";
  if (videoKey.includes(':')) {
    const [ak, sk] = videoKey.split(':');
    token = generateKlingToken(ak, sk);
  } else {
    token = videoKey;
  }
  
  const statusEndpoint = `https://api.klingai.com/v1/videos/text2video/${requestId}`;
  
  const response = await fetch(statusEndpoint, {
    headers: { 'Authorization': `Bearer ${token}` }
  });

  if (!response.ok) {
    try {
      const err = await response.json();
      throw new Error(err.message || "Failed to check generation status.");
    } catch {
      throw new Error(`Kling status check failed with status ${response.status}`);
    }
  }

  const result = await response.json();
  const data = result.data || result;

  if (data.task_status === "succeed") {
    const videoUrl = data.task_result?.videos?.[0]?.url || data.video_url;
    return { status: "COMPLETED", videoUrl };
  }

  if (data.task_status === "failed") {
    return { status: "FAILED", error: data.task_status_msg || "Kling AI provider-side failure" };
  }

  return { status: "IN_PROGRESS" };
}

// Keep for compatibility
export async function generateVideo(prompt: string, type: 'text' | 'image', imageUrl?: string) {
    const { requestId } = await startVideoGeneration(prompt, type, imageUrl);
    return { success: true, requestId };
}
