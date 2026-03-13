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
    const mockImages = [
      "https://images.unsplash.com/photo-1682685797886-e46916e8d907?w=1024&q=95",
      "https://images.unsplash.com/photo-1717501218636-a390f9ac5957?w=1024&q=95",
      "https://images.unsplash.com/photo-1683009427513-28e163402d16?w=1024&q=95",
      "https://images.unsplash.com/photo-1699382404367-0e6bb8ff7f7c?w=1024&q=95",
      "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=1024&q=95",
    ];
    const randomImage = mockImages[Math.floor(Math.random() * mockImages.length)];
    return {
      success: true,
      data: {
        url: randomImage,
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
