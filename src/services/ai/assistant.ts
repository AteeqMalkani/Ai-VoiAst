// src/services/ai/assistant.ts
import { transcribeAudio } from "../speech/elevenSTT";

const API_KEY = process.env.EXPO_PUBLIC_OPENROUTER_API_KEY;

const FREE_MODELS = [
  "inclusionai/ling-3.0-tiny:free",
  "inclusionai/ling-3.0-flash:free",
  "google/gemini-2.0-flash-lite-001:free",
];

export interface VoiceAssistantResponse {
  userText: string;
  assistantText: string;
}

export async function askAI(
  prompt: string,
  assistantName: string = "VoiAst",
  userName: string = "Ateeq Malkani",
): Promise<string> {
  if (!API_KEY) {
    console.error(
      "[OpenRouter Error]: EXPO_PUBLIC_OPENROUTER_API_KEY is missing.",
    );
    return "My API key is missing. Please check your config.";
  }

  const VOICE_SYSTEM_INSTRUCTION = `
CRITICAL IDENTITY INSTRUCTION: Your name is strictly "${assistantName}". NEVER state that you are an AI without this identity, and never deny being named "${assistantName}".
You are assisting ${userName}. Address them as ${userName} naturally when appropriate.

Follow these strict speech and interaction rules for EVERY response:
1. Speak naturally like a real person in conversation.
2. Keep responses very short (maximum 1 to 2 sentences).
3. NO markdown formatting—never use asterisks, bold text, bullet points, or lists.
4. Give single, straightforward numbers. Do not list unit conversions or min/max ranges unless directly asked.
5. Use natural contractions (e.g., "it's", "there's", "you'll").
6. INTERACTIVE CLARIFICATION: If the user's command or request is vague, incomplete, or missing critical details (like time, recipient, or specifics), do not guess. Instead, ask a short, polite clarifying question to gather the missing information.
`;

  for (const model of FREE_MODELS) {
    try {
      const response = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${API_KEY}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "http://localhost:8081",
            "X-Title": `${assistantName} Voice Assistant`,
          },
          body: JSON.stringify({
            model,
            messages: [
              { role: "system", content: VOICE_SYSTEM_INSTRUCTION },
              { role: "user", content: prompt },
            ],
          }),
        },
      );

      if (!response.ok) continue;

      const data = await response.json();
      const reply = data.choices?.[0]?.message?.content?.trim();

      if (reply) {
        return reply.replace(/\*/g, "");
      }
    } catch (error) {
      console.error(`[OpenRouter Error with ${model}]:`, error);
    }
  }

  return "Sorry, I didn't get that. Could you please repeat?";
}

export async function processVoiceInput(
  audioUri: string,
  assistantName: string = "VoiAst",
  userName: string = "Ateeq Malkani",
): Promise<VoiceAssistantResponse> {
  const userText = await transcribeAudio(audioUri);

  if (!userText || !userText.trim()) {
    throw new Error("Empty transcription returned from STT.");
  }

  const assistantText = await askAI(userText, assistantName, userName);

  return { userText, assistantText };
}
