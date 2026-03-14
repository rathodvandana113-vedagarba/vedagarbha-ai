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
  const apiKey = process.env.REPLICATE_API_TOKEN || process.env.IMAGE_API_KEY;

  if (!apiKey) {
    console.warn("[REPLICATE_API_TOKEN] NOT FOUND - FALLBACK TO MOCK");
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

  // ==== REAL REPLICATE INTEGRATION ====
  // Using FLUX.1 [schnell] for fast, high-quality images
  const response = await fetch('https://api.replicate.com/v1/predictions', {
    method: 'POST',
    headers: {
      'Authorization': `Token ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      version: "31191060936e3ed983577322fb7d425b741088496464f69903b4cf713ece556e", // flux-schnell
      input: {
        prompt: prompt,
        aspect_ratio: aspectRatio.replace(':', '/'),
        output_format: "webp",
        output_quality: 90
      }
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Replicate Image API Error:", errorText);
    throw new Error(`Image generation failed: ${response.statusText}`);
  }

  const prediction = await response.json();
  
  // Replicate predictions are async. We'll poll for a simple demo context, 
  // or return the first output if available (some models return immediately)
  let result = prediction;
  let attempts = 0;
  while ((result.status !== 'succeeded' && result.status !== 'failed') && attempts < 30) {
    await new Promise(r => setTimeout(r, 1000));
    const pollRes = await fetch(result.urls.get, {
      headers: { 'Authorization': `Token ${apiKey}` }
    });
    result = await pollRes.json();
    attempts++;
  }

  if (result.status === 'failed') {
    throw new Error(`Replicate failed: ${result.error}`);
  }

  const resultUrl = result.output?.[0] || result.output;
  return {
    success: true,
    data: {
      url: resultUrl, // Keep for backward compat
      resultUrl,
      prompt, 
      ratio: aspectRatio
    }
  };
}
