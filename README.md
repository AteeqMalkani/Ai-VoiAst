# 🎙️ VoiAst

### Talk. Plan. Automate.

VoiAst is an AI-powered voice assistant built with React Native and Expo. It is designed around a simple idea:

> **Instead of typing what you want to do, just tell VoiAst.**

The goal of VoiAst is to provide a voice-first assistant that can understand natural language, help users plan and execute everyday tasks, and eventually interact with different services and applications.

VoiAst is currently **under active development**.

---

## 🚀 Vision

Most applications require users to navigate through multiple screens, type information, and manually perform repetitive actions.

VoiAst explores a different approach.

You speak naturally, VoiAst understands what you want, creates a plan when necessary, and works toward completing the task.

For example:

> **"Remind me to call Ali tomorrow at 10 AM."**

Instead of manually opening a calendar or reminder application, the long-term goal is for VoiAst to understand the request and handle the necessary steps.

Other examples include:

- Taking notes
- Creating reminders
- Planning tasks
- Managing everyday actions
- Interacting with connected services
- Understanding conversational commands
- Executing multi-step workflows

The project is being developed incrementally, with the goal of building a reliable voice-driven automation experience.

---

# ✨ Core Concept

VoiAst is built around a simple workflow:

```text
🎙️ User speaks
       ↓
🧠 Speech recognition
       ↓
🤖 AI understands the request
       ↓
📋 Task / execution plan
       ↓
⚙️ Actions are executed
       ↓
🔊 VoiAst responds
```

The application is designed to make interaction feel conversational rather than like filling out forms or navigating complicated interfaces.

---

# 🧩 Current Direction

VoiAst is currently focused on building the foundation for a voice-first AI assistant.

### Current development areas

- 🎙️ Voice input
- 🗣️ Speech recognition
- 🔊 Text-to-speech
- 🤖 AI-powered understanding
- 📝 Note-taking workflows
- 📋 Task-oriented interactions
- 🔐 User authentication
- 💾 Local state and persistence
- 📱 Mobile-first experience
- 🧭 File-based navigation
- ⚡ Animated and interactive UI

Some features are still being developed and may change as the project evolves.

---

# 🛠️ Technology Stack

## Mobile Framework

- **React Native**
- **Expo SDK 57**
- **Expo Router**
- **TypeScript**

Expo Router provides file-based navigation for the application, while TypeScript is used throughout the project for type-safe development.

---

## 🤖 AI

VoiAst currently includes integrations for AI services including:

- **Google GenAI**
- **OpenAI**

These integrations provide the foundation for AI-powered understanding and future task execution workflows.

---

## 🎙️ Voice & Audio

Voice interaction is one of the core parts of VoiAst.

The project currently uses:

- **Expo Audio**
- **Expo Speech**
- **Expo Speech Recognition**
- **Picovoice Porcupine**
- **Picovoice Rhino**
- **Expo AV**

These packages provide the foundation for audio recording, speech recognition, text-to-speech, and voice-driven interaction.

---

## 🔐 Authentication & Security

VoiAst includes infrastructure for user authentication and secure local storage.

Technologies include:

- **Firebase**
- **Google Sign-In**
- **Expo Secure Store**
- **AsyncStorage**

Google authentication is configured through the React Native Google Sign-In package, while Expo Secure Store can be used for securely storing sensitive local data.

---

## 🎨 UI & Styling

The application uses:

- **NativeWind**
- **Tailwind CSS**
- **React Native Reanimated**
- **React Native Gesture Handler**
- **React Native SVG**
- **Expo Image**
- **Expo Glass Effect**
- **Expo Vector Icons**

These technologies are used to build the visual interface, animations, interactions, and reusable UI components.

---

## 🧠 State Management

VoiAst uses:

**Zustand**

for client-side state management.

This provides a lightweight way to manage application state without introducing unnecessary complexity.

---

# 📱 Platform Support

VoiAst is being developed as a cross-platform Expo application.

The project is configured for:

- 🤖 Android
- 🍎 iOS
- 🌐 Web

The current Expo configuration includes Android and iOS application identifiers, web output configuration, and platform-specific permissions.

---

# 🏗️ Project Structure

The project follows an Expo Router-based structure.

```text
VoiAst/
│
├── assets/
│   └── images/
│
├── src/
│   └── ...
│
├── scripts/
│
├── .claude/
│
├── .vscode/
│
├── AGENTS.md
├── CLAUDE.md
├── app.json
├── babel.config.js
├── eas.json
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

The repository also includes project configuration for development tooling and AI-assisted development workflows.

---

# ⚙️ Installation

## Prerequisites

Before running VoiAst, make sure you have:

- Node.js
- npm
- Expo development environment
- Android Studio for Android development
- Xcode for iOS development on macOS

Because VoiAst uses native modules such as speech recognition, audio, Google Sign-In, and Picovoice, some features may require a **development build** rather than Expo Go.

---

## 1. Clone the repository

```bash
git clone https://github.com/AteeqMalkani/Ai-VoiAst.git
```

Navigate into the project:

```bash
cd Ai-VoiAst
```

---

## 2. Install dependencies

```bash
npm install
```

---

## 3. Start the development server

```bash
npx expo start
```

You can then choose the appropriate development target.

---

# 📱 Running on Android

```bash
npm run android
```

or:

```bash
npx expo run:android
```

Android requires the appropriate Android development environment and device/emulator setup.

VoiAst also requests audio-related Android permissions because voice interaction is a core part of the application.

---

# 🍎 Running on iOS

```bash
npm run ios
```

or:

```bash
npx expo run:ios
```

Some voice and authentication functionality requires the appropriate iOS configuration and permissions.

The project currently declares microphone and speech-recognition usage descriptions in its iOS configuration.

---

# 🌐 Running on Web

```bash
npm run web
```

The Expo configuration currently uses static web output.

Some native functionality may behave differently on the web because browser APIs and native mobile APIs are not identical.

---

# 🔐 Environment & API Configuration

VoiAst integrates with external services such as AI providers, Firebase, Google authentication, and voice technologies.

API keys and private credentials should **never be committed to the repository**.

Use environment variables or the appropriate secure configuration mechanism for sensitive credentials.

Before running features that depend on external services, make sure the required credentials and platform configuration have been set up.

---

# 🎙️ Voice Interaction

Voice is a central part of VoiAst.

The project includes technologies for:

### Speech Recognition

Converting the user's spoken input into text that can be processed by the assistant.

### AI Processing

Using AI models to understand the user's request and determine what the user is asking for.

### Text-to-Speech

Converting VoiAst's response back into spoken audio.

### Voice Activation

Picovoice integrations provide the foundation for wake-word and voice-command functionality.

---

# 🧠 AI Assistant Architecture

The long-term architecture is designed around separating the assistant into several stages:

```text
Voice Input
     │
     ▼
Speech Recognition
     │
     ▼
Natural Language Understanding
     │
     ▼
Task Interpretation
     │
     ▼
Planning
     │
     ▼
Tool / Action Execution
     │
     ▼
Result
     │
     ▼
Voice Response
```

This structure allows the assistant to move beyond simple question-and-answer interactions toward actual task automation.

---

# 📝 Example Use Cases

VoiAst is being designed for everyday tasks such as:

### Notes

> "Take a note that I need to submit my assignment on Friday."

### Reminders

> "Remind me tomorrow morning to call Ahmed."

### Planning

> "Help me plan what I need to finish today."

### Task Automation

> "Create a task for preparing the project presentation."

### Conversational Interaction

> "What do I have planned for today?"

These examples represent the intended direction of the project. Specific capabilities may change as development continues.

---

# 🗺️ Roadmap

VoiAst is an evolving project.

### Phase 1: Foundation

- [x] Expo / React Native application
- [x] TypeScript setup
- [x] Expo Router
- [x] Mobile UI foundation
- [x] Voice/audio dependencies
- [x] AI provider integrations
- [x] Authentication infrastructure
- [x] State management

### Phase 2: Voice Assistant

- [ ] Reliable speech-to-text flow
- [ ] Natural voice conversations
- [ ] Improved voice activity handling
- [ ] Assistant response playback
- [ ] Wake-word interaction
- [ ] Better voice-state management

### Phase 3: Task Management

- [ ] Create tasks through voice
- [ ] View tasks
- [ ] Complete tasks
- [ ] Edit tasks
- [ ] Task history
- [ ] Task reminders

### Phase 4: Automation

- [ ] Connect external applications
- [ ] Tool-based execution
- [ ] Multi-step task planning
- [ ] Calendar integration
- [ ] Notes integration
- [ ] Email-related actions
- [ ] Browser-based workflows

### Phase 5: Personal AI Assistant

- [ ] Personalized user preferences
- [ ] Context-aware conversations
- [ ] Persistent assistant memory
- [ ] More automation tools
- [ ] Improved reliability and error handling

---

# 🔒 Permissions

Because VoiAst is a voice-focused application, it requires access to certain device capabilities.

Depending on the platform and enabled functionality, these include:

- Microphone
- Speech recognition
- Audio playback
- Background audio-related permissions

The Expo configuration currently includes microphone and speech-recognition permissions on iOS and audio-related Android permissions.

Permissions should only be requested when they are needed by the relevant functionality.

---

# 🧪 Development Status

**Status: 🚧 In Development**

VoiAst is an actively developed project.

The current implementation focuses on building the core mobile experience and the technical foundation required for a voice-driven AI assistant.

Features, architecture, integrations, and UI may change as development continues.

This project should currently be considered a **development project rather than a production-ready assistant**.

---

# 🤝 Contributing

VoiAst is currently maintained as a personal development project.

If the project is opened for contributions in the future, contribution guidelines will be added here.

---

# 📄 License

This project is licensed under the **MIT License**.

See the `LICENSE` file for details.

---

# 👨‍💻 Author

**Ateeq Malkani**

GitHub:
https://github.com/AteeqMalkani

Project:
https://github.com/AteeqMalkani/Ai-VoiAst

---

# ⭐ Project Summary

VoiAst explores what a mobile application can look like when **voice becomes the primary way users interact with software**.

Instead of opening different applications and manually completing every step, the long-term goal is to let users describe what they want and allow VoiAst to understand, plan, and execute the required actions.

> **Talk. Plan. Automate.**
