import { transcribeAudio } from "../speech/elevenSTT";

const API_KEY = process.env.EXPO_PUBLIC_OPENROUTER_API_KEY;

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

/**
 * OpenRouter's free router automatically selects
 * an available free model.
 */
const FREE_MODEL = "openrouter/free";

export interface VoiceAssistantResponse {
  userText: string;
  assistantText: string;
}

interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface OpenRouterResponse {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
}

/**
 * Shared OpenRouter request helper.
 *
 * All AI requests go through this function.
 */
async function callOpenRouter(
  messages: ChatMessage[],
  title: string,
): Promise<string> {
  if (!API_KEY) {
    throw new Error(
      "EXPO_PUBLIC_OPENROUTER_API_KEY is missing. Check your .env file.",
    );
  }

  const response = await fetch(OPENROUTER_URL, {
    method: "POST",

    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",

      // OpenRouter attribution headers.
      "HTTP-Referer": "http://localhost:8081",
      "X-Title": title,
    },

    body: JSON.stringify({
      model: FREE_MODEL,
      messages,
    }),
  });

  const responseText = await response.text();

  if (!response.ok) {
    console.error(
      `[OpenRouter] Request failed (${response.status}):`,
      responseText,
    );

    throw new Error(`OpenRouter request failed with status ${response.status}`);
  }

  let data: OpenRouterResponse;

  try {
    data = JSON.parse(responseText);
  } catch {
    console.error("[OpenRouter] Invalid JSON API response:", responseText);

    throw new Error("OpenRouter returned an invalid response.");
  }

  const reply = data?.choices?.[0]?.message?.content?.trim();

  if (!reply) {
    console.error("[OpenRouter] Empty response:", data);

    throw new Error("OpenRouter returned an empty response.");
  }

  return reply;
}

/**
 * Removes markdown formatting that may accidentally
 * be returned by the model.
 */
function cleanAssistantText(text: string): string {
  return text
    .replace(/\*\*/g, "")
    .replace(/\*/g, "")
    .replace(/```/g, "")
    .trim();
}

/**
 * Extracts the first JSON object from a model response.
 *
 * This protects VoiAst from responses such as:
 *
 * User Safety: safe
 * { "intent": "note", ... }
 *
 * or:
 *
 * ```json
 * { ... }
 * ```
 */
function extractJSON(response: string): string | null {
  const cleaned = response
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  const firstBrace = cleaned.indexOf("{");

  if (firstBrace === -1) {
    return null;
  }

  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let i = firstBrace; i < cleaned.length; i++) {
    const char = cleaned[i];

    if (escaped) {
      escaped = false;
      continue;
    }

    if (char === "\\") {
      escaped = true;
      continue;
    }

    if (char === '"') {
      inString = !inString;
      continue;
    }

    if (inString) {
      continue;
    }

    if (char === "{") {
      depth++;
    }

    if (char === "}") {
      depth--;

      if (depth === 0) {
        return cleaned.slice(firstBrace, i + 1);
      }
    }
  }

  return null;
}

/**
 * Handles normal conversational responses.
 */
export async function askAI(
  prompt: string,
  assistantName: string = "VoiAst",
  userName: string = "Ateeq Malkani",
): Promise<string> {
  const systemInstruction = `
Your name is ${assistantName}.

You are a personal voice assistant helping ${userName}.

Behavior rules:

- Speak naturally and conversationally.
- Keep responses short, usually one or two sentences.
- Do not use markdown.
- Do not use bullet points or numbered lists.
- Do not mention APIs, models, prompts, databases, internal systems, or implementation details.
- If the user asks a simple question, answer it directly.
- If the user is simply talking to you, respond naturally.
- If important information is missing, ask a short clarification instead of guessing.
- Never claim that an action was completed unless the application actually completed it.
`;

  try {
    const reply = await callOpenRouter(
      [
        {
          role: "system",
          content: systemInstruction,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      `${assistantName} Voice Assistant`,
    );

    return cleanAssistantText(reply);
  } catch (error) {
    console.error("[OpenRouter Chat Error]:", error);

    return "I'm having trouble connecting right now. Please try again.";
  }
}

/**
 * Internal intent classification.
 *
 * This function does NOT talk to the user.
 * It only determines what the user wants VoiAst to do.
 */
export async function askAIForIntent(prompt: string): Promise<string> {
  const intentSystemInstruction = `
You are VoiAst's internal intent classification engine.

You do NOT talk to the user.

Your ONLY job is to analyze the user's request and classify its intent.

Allowed intents:

calendar_event
note
memory
chat

INTENT DEFINITIONS:

calendar_event:
The user wants to create, schedule, modify, move, or cancel an event, meeting, appointment, or reminder on their calendar.

Examples:
"Schedule a meeting with Ali tomorrow at 3 PM."
"Create an event for my dentist appointment."
"Put my meeting on the calendar."
"Cancel my meeting tomorrow."

note:
The user explicitly wants to save information as a note.

Examples:
"Create a note saying I need to submit my assignment Friday."
"Save this as a note."
"Make a note about my project idea."

memory:
The user wants VoiAst to remember information for future conversations.

Examples:
"Remember that my name is Ateeq."
"Remember that I prefer short answers."
"From now on, call me Ateeq."
"Remember that I'm studying computer science."

chat:
Normal conversation, questions, explanations, greetings, opinions, or anything that does not require storing information or performing an external action.

Examples:
"What's the difference between a compiler and an interpreter?"
"How are you?"
"I have a meeting tomorrow."
"What should I prepare for my meeting?"

IMPORTANT:

Understand the complete meaning of the user's request.

Do NOT classify based only on keywords.

"I have a meeting tomorrow" is chat.

"Create a note reminding me that I have a meeting tomorrow" is note.

"Schedule my meeting for tomorrow" is calendar_event.

"Remember that I have a meeting tomorrow" is memory.

"What should I prepare for my meeting tomorrow?" is chat.

If the user is merely discussing an event, note, or memory without asking VoiAst to perform an action, use chat.

Return ONLY ONE valid JSON object.

Do not return:
- explanations
- markdown
- code fences
- safety messages
- "User Safety"
- analysis
- additional text

The JSON must have exactly this structure:

{
  "intent": "calendar_event",
  "confidence": 0.95,
  "title": "Meeting with Ali",
  "content": "Meeting with Ali tomorrow at 3 PM"
}

The intent must be exactly one of:

calendar_event
note
memory
chat

The confidence must be a number between 0 and 1.

For chat, title and content may be empty strings.

For calendar_event, title should contain a short event title and content should contain the relevant event information.

For note, title should contain a short note title and content should contain the information to save.

For memory, title should contain a short memory category and content should contain the information VoiAst should remember.

Return JSON only.
`;

  try {
    const reply = await callOpenRouter(
      [
        {
          role: "system",
          content: intentSystemInstruction,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      "VoiAst Intent Classifier",
    );

    console.log("[OpenRouter Intent Raw Response]:", reply);

    const json = extractJSON(reply);

    if (!json) {
      console.error(
        "[OpenRouter Intent] No JSON object found in response:",
        reply,
      );

      throw new Error("Intent model did not return valid JSON.");
    }

    // Validate that the extracted content is actually JSON.
    const parsed = JSON.parse(json);

    const validIntents = ["calendar_event", "note", "memory", "chat"];

    if (!validIntents.includes(parsed.intent)) {
      throw new Error(`Invalid intent returned: ${parsed.intent}`);
    }

    return JSON.stringify({
      intent: parsed.intent,
      confidence:
        typeof parsed.confidence === "number"
          ? Math.max(0, Math.min(1, parsed.confidence))
          : 0,

      title: typeof parsed.title === "string" ? parsed.title.trim() : "",

      content: typeof parsed.content === "string" ? parsed.content.trim() : "",
    });
  } catch (error) {
    console.error("[OpenRouter Intent Classification Error]:", error);

    throw error;
  }
}

/**
 * Transcribes audio and generates a normal assistant response.
 *
 * This is kept for cases where another part of the app
 * wants to directly process an audio file.
 */
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

  return {
    userText,
    assistantText,
  };
}
