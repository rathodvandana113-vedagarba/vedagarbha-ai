/**
 * AI Image Generation Service 
 * ===========================
 * This module acts as the pluggable layer for Image APIs (e.g. Midjourney API, DALL-E, Stability).
 * 
 * INTEGRATION INSTRUCTIONS:
 * 1. Add IMAGE_API_KEY to your .env.local file.
 * 2. Replace the fetch URL with your chosen provider (e.g., OpenAI, Stability AI).
 * 3. Map the returned JSON payload to match the { url, prompt, ratio } structure cleanly.
 */

export async function generateImage(prompt: string, aspectRatio: string) {
  const apiKey = process.env.IMAGE_API_KEY;

  if (!apiKey) {
    console.warn("IMAGE_API_KEY is missing. Returning a mock success response.");
    // Simulate API delay
    await new Promise(r => setTimeout(r, 2000));
    return {
      success: true,
      data: {
        url: "https://via.placeholder.com/1024x576.png?text=Vedagarbha+Mock+Image+Generation",
        prompt,
        ratio: aspectRatio
      }
    };
  }

  // ==== REAL INTEGRATION START ====
  const sizeMapping: Record<string, string> = {
    "1:1": "1024x1024",
    "16:9": "1792x1024",
    "9:16": "1024x1792",
  };
  const size = sizeMapping[aspectRatio] || "1024x1024";

  const response = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: size
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("OpenAI Image API Error:", errorText);
    throw new Error(`Image generation failed: ${response.statusText}`);
  }

  const result = await response.json();
  return {
    success: true,
    data: {
      url: result.data[0].url,
      prompt, 
      ratio: aspectRatio
    }
  };
}
