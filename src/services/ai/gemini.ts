import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

if (!apiKey) {
  console.warn(
    "[Gemini] Warning: EXPO_PUBLIC_GEMINI_API_KEY is missing. Check your .env file.",
  );
}

const ai = new GoogleGenAI({
  apiKey: apiKey || "",
});

/**
 * Type defining valid content inputs for Gemini API
 */
export type GeminiInput = string | Array<any>;

/**
 * Queries Gemini 1.5 Flash model with text or multimodal content (e.g. base64 audio)
 */
export async function askGemini(contents: GeminiInput): Promise<string> {
  if (!contents || (typeof contents === "string" && !contents.trim())) {
    return "I didn't hear anything. Could you please repeat that?";
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: contents,
    });

    const replyText = response.text?.trim();

    if (!replyText) {
      console.warn("[Gemini] Received empty text response from model.");
      return "I couldn't generate a response for that.";
    }

    console.log("[Gemini Response]:", replyText);
    return replyText;
  } catch (error) {
    console.error("[Gemini API Error]:", error);
    return "Sorry, I am having trouble connecting to my servers right now.";
  }
}
