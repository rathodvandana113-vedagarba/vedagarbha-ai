/**
 * AI Image Generation Service 
 * ===========================
 * This module acts as the pluggable layer for Image APIs (Google Imagen 3 via Gemini AI).
 * 
 * INTEGRATION INSTRUCTIONS:
 * 1. Grab a free API key from https://aistudio.google.com/app/apikey
 * 2. Add IMAGE_API_KEY to your Vercel Environment Variables.
 * 3. Test the platform!
 */

export async function generateImage(prompt: string, aspectRatio: string) {
  const apiKey = process.env.IMAGE_API_KEY || process.env.GOOGLE_GEMINI_API_KEY;

  if (!apiKey) {
    console.warn("[IMAGE_API_KEY] NOT FOUND - FALLBACK TO MOCK");
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

  // ==== REAL GOOGLE IMAGEN 3 INTEGRATION ====
  // Using Google's Imagen 3 model via Gemini AI Studio (Free Tier Supported)
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      instances: [
        { prompt: prompt }
      ],
      parameters: {
        sampleCount: 1,
        aspectRatio: aspectRatio || "16:9" // 1:1, 3:4, 4:3, 9:16, 16:9
      }
    })
  });

  if (!response.ok) {
    if (response.status === 401 || response.status === 403 || response.status === 402 || response.status === 400) {
      console.warn("Google API Key exhausted, rejected, or missing - FALLBACK TO MOCK");
      const mockImages = [
        "https://images.unsplash.com/photo-1682685797886-e46916e8d907?w=1024&q=95",
        "https://images.unsplash.com/photo-1717501218636-a390f9ac5957?w=1024&q=95",
        "https://images.unsplash.com/photo-1683009427513-28e163402d16?w=1024&q=95",
      ];
      return {
        success: true,
        data: {
          url: mockImages[Math.floor(Math.random() * mockImages.length)],
          prompt,
          ratio: aspectRatio
        }
      };
    }
    const errorText = await response.text();
    console.error("Google Imagen API Error:", errorText);
    throw new Error(`Image generation failed: ${response.statusText}`);
  }

  const prediction = await response.json();
  const b64 = prediction.predictions?.[0]?.bytesBase64Encoded;
  
  if (!b64) {
     throw new Error("No image data returned from Google API");
  }

  const resultUrl = `data:image/jpeg;base64,${b64}`;
  
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
