export async function transcribeAudio(audioUri: string): Promise<string> {
  console.log("Processing:", audioUri);

  // TODO:
  // Replace this with Whisper,
  // Gemini Speech,
  // OpenAI Speech,
  // Deepgram,
  // AssemblyAI...

  return "Hello how are you";
}

export async function generateReply(message: string): Promise<string> {
  const lower = message.toLowerCase().trim();

  if (
    lower.includes("hello") ||
    lower.includes("hi") ||
    lower.includes("hey")
  ) {
    const greetings = [
      "Hello! How are you doing today?",
      "Hi there! How was your day?",
      "Hey! How can I help you today?",
    ];

    return greetings[Math.floor(Math.random() * greetings.length)];
  }

  if (lower.includes("how are you")) {
    return "I'm doing great. Thanks for asking!";
  }

  if (lower.includes("meeting") || lower.includes("schedule")) {
    return "Sure! I can help schedule that meeting.";
  }

  if (lower.includes("thank")) {
    return "You're welcome!";
  }

  return `Got it. You said "${message}".`;
}
