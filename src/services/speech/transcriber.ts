export interface TranscribeOptions {
  apiKey?: string;
  language?: string;
}

/**
 * Transcribes an audio file URI into text.
 * Currently uses a simulated STT pipeline. Replace with Whisper or Google STT call.
 */
export async function transcribeAudio(
  audioUri: string | null,
  options?: TranscribeOptions,
): Promise<string> {
  if (!audioUri) {
    throw new Error("No audio recording URI provided for transcription.");
  }

  // TODO: Replace with real Speech-to-Text API Call (e.g., OpenAI Whisper API)
  //
  // Example Whisper Integration:
  // const formData = new FormData();
  // formData.append("file", {
  //   uri: audioUri,
  //   name: "speech.m4a",
  //   type: "audio/m4a",
  // } as any);
  // formData.append("model", "whisper-1");
  //
  // const res = await fetch("https://api.openai.com/v1/audio/transcriptions", {
  //   method: "POST",
  //   headers: { Authorization: `Bearer ${options?.apiKey}` },
  //   body: formData,
  // });
  // const data = await res.json();
  // return data.text;

  // Simulated delay for testing UI states
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Placeholder transcript
  return "Hello VoiAst, what can you help me with today?";
}
