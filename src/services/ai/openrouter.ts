// src/services/ai/openrouter.ts

const API_KEY = process.env.EXPO_PUBLIC_OPENROUTER_API_KEY;

const FREE_MODELS = [
  "inclusionai/ling-3.0-tiny:free",
  "inclusionai/ling-3.0-flash:free",
  "google/gemini-2.0-flash-lite-001:free",
];

// Voice-optimized prompt instruction
const VOICE_SYSTEM_INSTRUCTION = `
You are VoiAst, a warm, intelligent human-like voice assistant.
Follow these strict speech rules for EVERY response:
1. Speak naturally like a real person in conversation.
2. Keep responses very short (maximum 1 to 2 sentences).
3. NO markdown formatting—never use asterisks, bold text, bullet points, or lists.
4. Give single, straightforward numbers. Do not list unit conversions or min/max ranges unless directly asked.
5. Use natural contractions (e.g., "it's", "there's", "you'll").
`;

export async function askAI(prompt: string): Promise<string> {
  if (!API_KEY) {
    console.error(
      "[OpenRouter Error]: EXPO_PUBLIC_OPENROUTER_API_KEY is missing.",
    );
    return "My API key is missing. Please check your config.";
  }

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
            "X-Title": "VoiAst Voice Assistant",
          },
          body: JSON.stringify({
            model: model,
            messages: [
              {
                role: "system",
                content: VOICE_SYSTEM_INSTRUCTION,
              },
              {
                role: "user",
                content: prompt,
              },
            ],
          }),
        },
      );

      if (!response.ok) continue;

      const data = await response.json();
      const reply = data.choices?.[0]?.message?.content?.trim();

      if (reply) {
        // Extra safeguard: Strip out any rogue markdown asterisks before sending to TTS
        return reply.replace(/\*/g, "");
      }
    } catch (error) {
      console.error(`[OpenRouter Error with ${model}]:`, error);
    }
  }

  return "Sorry, I am having trouble connecting right now.";
}
