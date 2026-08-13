import { askAIForIntent } from "./assistant";

export type VoiceIntent = "calendar_event" | "note" | "memory" | "chat";

export interface IntentResult {
  intent: VoiceIntent;
  confidence: number;
  title?: string;
  content?: string;
}

/**
 * Extracts a JSON object from a model response.
 *
 * Handles responses such as:
 *
 * {"intent":"note",...}
 *
 * or:
 *
 * Here is the result:
 * {"intent":"note",...}
 *
 * or responses wrapped in markdown code fences.
 */
function extractJsonObject(response: string): string | null {
  if (!response || typeof response !== "string") {
    return null;
  }

  let cleaned = response.trim();

  // Remove markdown code fences if present.
  cleaned = cleaned
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  // First try the entire response.
  if (cleaned.startsWith("{") && cleaned.endsWith("}")) {
    return cleaned;
  }

  // Otherwise find the first JSON object.
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");

  if (start !== -1 && end !== -1 && end > start) {
    return cleaned.substring(start, end + 1);
  }

  return null;
}

/**
 * Validates and normalizes the AI classification result.
 */
function validateIntentResult(parsed: any): IntentResult {
  const validIntents: VoiceIntent[] = [
    "calendar_event",
    "note",
    "memory",
    "chat",
  ];

  if (!parsed || typeof parsed !== "object") {
    throw new Error("Intent response is not an object.");
  }

  if (!validIntents.includes(parsed.intent)) {
    throw new Error(`Invalid intent returned: ${String(parsed.intent)}`);
  }

  let confidence = Number(parsed.confidence);

  if (Number.isNaN(confidence)) {
    confidence = 0;
  }

  // Keep confidence safely between 0 and 1.
  confidence = Math.max(0, Math.min(1, confidence));

  return {
    intent: parsed.intent,
    confidence,
    title:
      typeof parsed.title === "string" && parsed.title.trim()
        ? parsed.title.trim()
        : undefined,
    content:
      typeof parsed.content === "string" && parsed.content.trim()
        ? parsed.content.trim()
        : undefined,
  };
}

/**
 * Detect what the user actually wants VoiAst to do.
 *
 * This does NOT use keywords.
 * The AI analyzes the complete meaning of the user's speech.
 */
export async function detectIntent(userSpeech: string): Promise<IntentResult> {
  if (!userSpeech || !userSpeech.trim()) {
    return {
      intent: "chat",
      confidence: 0,
    };
  }

  const prompt = `
You are VoiAst's intent classification engine.

Your ONLY job is to classify the user's request.

Understand the meaning of the entire request.
Do NOT classify based on individual keywords.

You MUST return exactly ONE JSON object.
Do NOT return explanations.
Do NOT return safety messages.
Do NOT return "User Safety".
Do NOT return markdown.
Do NOT return code fences.
Do NOT return any text before or after the JSON.

Allowed intents:

calendar_event
The user wants VoiAst to create, schedule, update, move, or cancel something on a calendar.

Examples:
"Schedule a meeting with Ali tomorrow at 3 PM"
"Put my dentist appointment on my calendar"
"Create a calendar event for Friday"
"Move my meeting to 5 PM"
"Cancel my meeting tomorrow"

note
The user explicitly wants VoiAst to save something as a note.

Examples:
"Create a note that I need to submit my assignment Friday"
"Save this as a note"
"Make a note about my project idea"
"Write down that I need to buy a new laptop"

memory
The user wants VoiAst to remember something for future conversations.

Examples:
"Remember that my name is Ateeq"
"Remember that I prefer short answers"
"From now on call me Ateeq"
"Remember that I'm working on VoiAst"

chat
The user is simply talking to VoiAst.
This includes questions, explanations, greetings, opinions, casual conversation, or discussing something without asking VoiAst to perform an action.

Examples:
"What is a compiler?"
"I have a meeting tomorrow"
"What should I take to my meeting?"
"Tell me about React"
"How are you?"

Important distinction:

"I have a meeting tomorrow"
=> chat

"Create a note reminding me that I have a meeting tomorrow"
=> note

"Schedule my meeting tomorrow at 3 PM"
=> calendar_event

"Remember that I have a meeting tomorrow"
=> memory

"What time should I schedule my meeting?"
=> chat

Return exactly this structure:

{
  "intent": "calendar_event",
  "confidence": 0.95,
  "title": "Meeting",
  "content": "Meeting tomorrow at 3 PM"
}

The intent must be exactly one of:

"calendar_event"
"note"
"memory"
"chat"

The confidence must be a number between 0 and 1.

For chat, title and content can be empty strings.

User command:
${userSpeech}
`;

  try {
    const response = await askAIForIntent(prompt);

    console.log("[Intent Detection] Raw response:", response);

    const json = extractJsonObject(response);

    if (!json) {
      console.error(
        "[Intent Detection] No JSON object found in response:",
        response,
      );

      return {
        intent: "chat",
        confidence: 0,
      };
    }

    let parsed: any;

    try {
      parsed = JSON.parse(json);
    } catch (parseError) {
      console.error("[Intent Detection] JSON parsing failed:", json);

      console.error("[Intent Detection] Original response:", response);

      return {
        intent: "chat",
        confidence: 0,
      };
    }

    return validateIntentResult(parsed);
  } catch (error) {
    console.error("[Intent Detection Error]:", error);

    return {
      intent: "chat",
      confidence: 0,
    };
  }
}
