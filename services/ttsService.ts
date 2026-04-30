
import { GoogleGenAI, Modality } from "@google/genai";
import { getApiKey } from "./api";
import { decode, decodeAudioData } from "./audioUtils";

let audioContext: AudioContext | null = null;
let currentSource: AudioBufferSourceNode | null = null;

export async function speakText(text: string, voiceName: string = 'Zephyr', rate: number = 1.0): Promise<void> {
  // Stop any current speech
  if (currentSource) {
    try { currentSource.stop(); } catch (e) {}
    currentSource = null;
  }
  window.speechSynthesis.cancel();

  if (!navigator.onLine) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rate;
    window.speechSynthesis.speak(utterance);
    return;
  }

  try {
    const ai = new GoogleGenAI({ apiKey: getApiKey() });
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voiceName as any },
          },
        },
      },
    });

    const audioData = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (audioData) {
      if (!audioContext) {
        audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      }
      
      const buffer = await decodeAudioData(decode(audioData), audioContext, 24000, 1);
      const source = audioContext.createBufferSource();
      source.buffer = buffer;
      source.playbackRate.value = rate;
      source.connect(audioContext.destination);
      
      currentSource = source;
      source.start();
      
      return new Promise((resolve) => {
        source.onended = () => {
          if (currentSource === source) currentSource = null;
          resolve();
        };
      });
    } else {
      throw new Error("No audio data");
    }
  } catch (error) {
    console.error("TTS Error, falling back to browser:", error);
    return new Promise((resolve) => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = rate;
      utterance.onend = () => resolve();
      window.speechSynthesis.speak(utterance);
    });
  }
}

export function stopSpeech() {
  if (currentSource) {
    try { currentSource.stop(); } catch (e) {}
    currentSource = null;
  }
  window.speechSynthesis.cancel();
}
