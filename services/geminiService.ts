import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_NAME = 'gemini-2.5-flash-image';

/**
 * Generates a sticker image based on the user's prompt.
 * We append specific keywords to ensure the output looks like a die-cut sticker.
 */
export const generateStickerImage = async (prompt: string, style: string): Promise<string> => {
  // Enhance prompt to ensure sticker-like quality
  const enhancedPrompt = `
    Create a high-quality die-cut sticker of ${prompt}.
    Style: ${style}.
    The image should have a thick white border suitable for a sticker.
    Isolated on a pure white background.
    Vector art style, vibrant colors, clean lines, high resolution.
    No text unless explicitly asked.
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        parts: [
          {
            text: enhancedPrompt,
          },
        ],
      },
      config: {
        // Nano banana supports aspect ratio config
        imageConfig: {
            aspectRatio: "1:1"
        }
      },
    });

    // Extract the image from the response
    // Strict null checks require us to verify every level of the object hierarchy
    const candidates = response.candidates;
    if (!candidates || candidates.length === 0) {
      throw new Error("No candidates found in response.");
    }

    const candidate = candidates[0];
    
    // Explicitly check for content
    if (!candidate.content) {
       throw new Error("No content found in candidate.");
    }

    const parts = candidate.content.parts;

    // Explicitly check for parts
    if (!parts || parts.length === 0) {
       throw new Error("No parts found in content.");
    }

    // Iterate through parts to find the image
    for (const part of parts) {
      if (part.inlineData && part.inlineData.data) {
        const base64Data = part.inlineData.data;
        const mimeType = part.inlineData.mimeType || 'image/png';
        return `data:${mimeType};base64,${base64Data}`;
      }
    }
    
    // If we are here, we might have gotten a text rejection or generic text response
    const textPart = parts.find(p => p.text);
    if (textPart && textPart.text) {
      throw new Error(`Model returned text instead of image: ${textPart.text}`);
    }

    throw new Error("No image data found in the response.");

  } catch (error: any) {
    console.error("Sticker generation failed:", error);
    throw new Error(error.message || "Failed to generate sticker. Please try again.");
  }
};