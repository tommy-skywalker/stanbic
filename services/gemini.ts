
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getFinancialAdvice = async (prompt: string, balance: number) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: `You are a helpful and professional financial assistant for Stanbic IBTC Bank. 
        The user's current balance is ₦${balance.toLocaleString()}. 
        Keep your answers concise, friendly, and focused on financial well-being. 
        You can help with app navigation, saving tips, and investment basics like Stanbic Mutual funds.`,
        temperature: 0.7,
      },
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm having trouble connecting right now. Please try again later!";
  }
};
