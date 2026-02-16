
import { GoogleGenAI } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";

export class GeminiService {
  private ai: any;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY || '' });
  }

  async generateResponse(prompt: string, history: { role: string; parts: { text: string }[] }[] = []) {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
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
    } catch (error) {
      console.error("Gemini API Error:", error);
      return "حصل مشكلة بسيطة في الكلام، حاول تاني يا غالي. الله يحفظ لسانك.";
    }
  }
}

export const geminiService = new GeminiService();
