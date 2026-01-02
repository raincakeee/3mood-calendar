
import { GoogleGenAI } from "@google/genai";
import { SYSTEM_PROMPT } from "./constants";

// Utility to create a numeric seed for the LLM
const getNumericSeed = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
};

export const generateMoodContent = async (moodEmoji: string, dateStr: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const seed = getNumericSeed(dateStr + moodEmoji);

  try {
    // Using gemini-flash-lite-latest for ultra-low latency
    const response = await ai.models.generateContent({
      model: "gemini-flash-lite-latest",
      contents: `日期：${dateStr}
心情符号：${moodEmoji}
请检索一条该心情下的文学名句，包含作者署名。`,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.2,
        seed: seed,
        // Disable thinking budget to reduce latency significantly
        thinkingConfig: { thinkingBudget: 0 },
        maxOutputTokens: 250,
      },
    });

    let quote = response.text?.trim() || "草在结它的种子，\n风在摇它的叶子，\n我们站着，不说话就十分美好。\n——顾城";
    
    // Clean up potential markdown formatting
    quote = quote.replace(/\*\*/g, '').replace(/###/g, '');
    
    return { quote };

  } catch (error) {
    console.error("Gemini AI Retrieval failed:", error);
    return { quote: "草在结它的种子，\n风在摇它的叶子，\n我们站着，不说话就十分美好。\n——顾城" };
  }
};
