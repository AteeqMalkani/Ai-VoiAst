const ELEVENLABS_API_KEY = process.env.EXPO_PUBLIC_ELEVENLABS_API_KEY;

// Default pre-made voice ID supported on Free tier
const DEFAULT_VOICE_ID = "21m00Tcm4TlvDq8ikWAM";

export interface TTSOptions {
  voiceId?: string;
  modelId?: string; // e.g., 'eleven_multilingual_v2' or 'eleven_turbo_v2_5'
  stability?: number;
  similarityBoost?: number;
}

/**
 * Converts input text to speech using ElevenLabs API and returns raw binary audio data (ArrayBuffer).
 *
 * @param text The text response from Gemini to synthesize
 * @param options Voice and model configuration
 * @returns Promise<ArrayBuffer> Raw MP3 audio data
 */
export async function generateSpeech(
  text: string,
  voiceId: string = DEFAULT_VOICE_ID,
): Promise<ArrayBuffer> {
  if (!ELEVENLABS_API_KEY) {
    throw new Error(
      "Missing EXPO_PUBLIC_ELEVENLABS_API_KEY environment variable.",
    );
  }

  try {
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "xi-api-key": ELEVENLABS_API_KEY,
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_turbo_v2_5",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
          },
        }),
      },
    );

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(
        `ElevenLabs TTS API error (${response.status}): ${errorData}`,
      );
    }

    return await response.arrayBuffer();
  } catch (error) {
    console.error("Error in generateSpeech:", error);
    throw error;
  }
}
