import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeImageColors = async (base64Image: string, mimeType: string): Promise<AnalysisResult> => {
  // Use gemini-3-flash-preview for multimodal tasks with JSON output
  const model = 'gemini-3-flash-preview';

  const prompt = `
    Analyze this image as an avant-garde design consultant.
    1. Extract the top 5 dominant colors that form a cohesive, aesthetic palette.
    2. For each color, give its Hex code, a creative name (e.g., "Midnight Void", "Electric Lime"), and a brief 3-word description of its feeling.
    3. Describe the overall "Mood" of this palette in a poetic, sophisticated way.
    4. Suggest 3 specific, modern design applications for this palette (e.g., "Neo-brutalist landing page", "Techwear branding").
    5. Suggest one high-contrast accent color that is NOT in the image but would make the palette pop, and explain why.
    6. Suggest a typography style (Serif/Sans-serif) and weight that matches this vibe.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Image,
              mimeType: mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            palette: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  hex: { type: Type.STRING },
                  name: { type: Type.STRING },
                  description: { type: Type.STRING },
                },
                required: ["hex", "name", "description"],
              },
            },
            mood: { type: Type.STRING },
            design_usage: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            contrast_suggestion: {
              type: Type.OBJECT,
              properties: {
                hex: { type: Type.STRING },
                reason: { type: Type.STRING },
              },
              required: ["hex", "reason"],
            },
            typography_pairing: { type: Type.STRING },
          },
          required: ["palette", "mood", "design_usage", "contrast_suggestion", "typography_pairing"],
        },
      },
    });

    if (!response.text) {
      throw new Error("No response text received from Gemini.");
    }

    const data: AnalysisResult = JSON.parse(response.text);
    return data;

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};