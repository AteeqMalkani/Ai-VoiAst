import { Platform } from 'react-native';

export interface SpeechCallbacks {
  onStart?: () => void;
  onResult?: (text: string, isFinal: boolean) => void;
  onVolumeChange?: (volume: number) => void;
  onEnd?: () => void;
  onError?: (error: string) => void;
}

class SpeechService {
  private recognition: any = null;
  private isListening: boolean = false;
  private volumeTimer: any = null;

  constructor() {
    this.initWebSpeech();
  }

  private initWebSpeech() {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const SpeechRecognitionClass =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      
      if (SpeechRecognitionClass) {
        this.recognition = new SpeechRecognitionClass();
        this.recognition.continuous = false;
        this.recognition.interimResults = true;
        this.recognition.lang = 'en-US';
      }
    }
  }

  /**
   * Speak out text using Text-to-Speech (TTS)
   */
  speak(text: string, accent: string = 'futuristic'): Promise<void> {
    return new Promise((resolve) => {
      if (Platform.OS === 'web' && typeof window !== 'undefined' && window.speechSynthesis) {
        // Stop any current speech
        window.speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(text);
        
        // Custom speech rate adjustments
        utterance.rate = 1.05;
        
        // Find matching voice accent where possible
        const voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) {
          if (accent === 'british') {
            const gbVoice = voices.find(v => v.lang.includes('GB'));
            if (gbVoice) utterance.voice = gbVoice;
          } else {
            const usVoice = voices.find(v => v.lang.includes('US') && v.name.includes('Google'));
            if (usVoice) utterance.voice = usVoice;
          }
        }

        utterance.onend = () => resolve();
        utterance.onerror = () => resolve();
        
        window.speechSynthesis.speak(utterance);
      } else {
        console.log(`[SpeechService Simulator] Speak: "${text}"`);
        // Simulate duration
        const duration = Math.max(1500, text.length * 60);
        setTimeout(resolve, duration);
      }
    });
  }

  /**
   * Stop current speech synthesis
   */
  stopSpeaking() {
    if (Platform.OS === 'web' && typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }

  /**
   * Start recording microphone and listening for input speech
   */
  startListening(callbacks: SpeechCallbacks) {
    if (this.isListening) return;
    this.isListening = true;

    if (this.recognition) {
      this.recognition.onstart = () => {
        if (callbacks.onStart) callbacks.onStart();
        this.startMockVolume(callbacks.onVolumeChange);
      };

      this.recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        const currentText = finalTranscript || interimTranscript;
        const isFinal = finalTranscript.length > 0;

        if (callbacks.onResult) {
          callbacks.onResult(currentText, isFinal);
        }
      };

      this.recognition.onerror = (event: any) => {
        if (callbacks.onError) callbacks.onError(event.error);
        this.stopListening();
      };

      this.recognition.onend = () => {
        this.stopListening();
        if (callbacks.onEnd) callbacks.onEnd();
      };

      try {
        this.recognition.start();
      } catch (err) {
        console.warn('Speech recognition start failed', err);
      }
    } else {
      // Simulator mode (e.g. mobile emulator or non-supported browser)
      if (callbacks.onStart) callbacks.onStart();
      this.startMockVolume(callbacks.onVolumeChange);

      // Mock word-by-word transcription callback
      const mockWords = ['activate', 'focus', 'mode'];
      let wordIdx = 0;
      
      const interval = setInterval(() => {
        if (!this.isListening) {
          clearInterval(interval);
          return;
        }

        const isFinal = wordIdx === mockWords.length - 1;
        const text = mockWords.slice(0, wordIdx + 1).join(' ');

        if (callbacks.onResult) {
          callbacks.onResult(text, isFinal);
        }

        if (isFinal) {
          clearInterval(interval);
          this.stopListening();
          if (callbacks.onEnd) callbacks.onEnd();
        } else {
          wordIdx++;
        }
      }, 1000);
    }
  }

  /**
   * Stop speech recording
   */
  stopListening() {
    if (!this.isListening) return;
    this.isListening = false;

    this.stopMockVolume();

    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (e) {
        // Already stopped
      }
    }
  }

  private startMockVolume(onVolumeChange?: (vol: number) => void) {
    if (!onVolumeChange) return;
    
    this.volumeTimer = setInterval(() => {
      onVolumeChange(0.05 + Math.random() * 0.8);
    }, 100);
  }

  private stopMockVolume() {
    if (this.volumeTimer) {
      clearInterval(this.volumeTimer);
      this.volumeTimer = null;
    }
  }
}

export const speechService = new SpeechService();
