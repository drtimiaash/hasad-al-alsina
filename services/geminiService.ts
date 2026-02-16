
import { GoogleGenAI } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";

export class GeminiService {
  private primaryAI: any;
  private backupAI: any;
  private usingBackup: boolean = false;
  private backupUntil: number = 0; // timestamp when to try primary again

  constructor() {
    const primaryKey = import.meta.env.VITE_GEMINI_API_KEY || '';
    const backupKey = import.meta.env.VITE_GEMINI_API_KEY_BACKUP || '';

    this.primaryAI = new GoogleGenAI({ apiKey: primaryKey });
    this.backupAI = backupKey ? new GoogleGenAI({ apiKey: backupKey }) : null;
  }

  private getActiveAI() {
    // If backup timer expired, try primary again
    if (this.usingBackup && Date.now() > this.backupUntil) {
      this.usingBackup = false;
    }
    return this.usingBackup && this.backupAI ? this.backupAI : this.primaryAI;
  }

  private switchToBackup() {
    if (this.backupAI && !this.usingBackup) {
      this.usingBackup = true;
      // Try primary again after 60 seconds
      this.backupUntil = Date.now() + 60 * 1000;
      console.log('⚡ Switched to backup Gemini API key');
      return true;
    }
    return false;
  }

  async generateResponse(prompt: string, history: { role: string; parts: { text: string }[] }[] = []) {
    const makeRequest = async (ai: any) => {
      const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: [
          ...history,
          { role: 'user', parts: [{ text: prompt }] }
        ],
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.7,
          topP: 0.8,
          maxOutputTokens: 500,
        },
      });
      return response.text;
    };

    try {
      return await makeRequest(this.getActiveAI());
    } catch (error: any) {
      const msg = error?.message || error?.toString() || '';
      const isRateLimit = msg.includes('429') || msg.includes('quota') || msg.includes('rate') || msg.includes('RESOURCE_EXHAUSTED');

      if (isRateLimit && this.switchToBackup()) {
        try {
          return await makeRequest(this.backupAI);
        } catch (backupError) {
          console.error("Backup API also failed:", backupError);
        }
      }

      console.error("Gemini API Error:", error);
      return "حصل مشكلة بسيطة في الكلام، حاول تاني يا غالي. الله يحفظ لسانك.";
    }
  }
}

export const geminiService = new GeminiService();
