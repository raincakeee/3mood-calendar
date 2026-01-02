import { GoogleGenAI } from "@google/genai";
import { SYSTEM_PROMPT } from "./constants";

const getNumericSeed = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
};

// 更加明确的保底文案，用于辅助诊断
const FALLBACKS: Record<string, string> = {
  'default': "草在结它的种子，\n风在摇它的叶子，\n我们站着，不说话就十分美好。\n——顾城",
  'config_error': "（配置提示）\n未检测到有效的 Google API Key。\n请确保在 Vercel 中配置了 API_KEY\n且它不是智谱 Key。\n——系统诊断",
  'auth_error': "（授权提示）\nAPI 密钥校验失败。\n这通常是因为使用了错误的 Key 类型\n（如智谱 Key）或 Key 已过期。\n——系统诊断"
};

export const generateMoodContent = async (moodEmoji: string, dateStr: string) => {
  // Vite 在构建时会通过 define 替换此处内容
  const apiKey = process.env.API_KEY;
  
  // 1. 检查环境变量注入情况
  if (!apiKey || apiKey === "undefined" || apiKey === "") {
    console.error("Critical: API_KEY is missing or undefined in current environment.");
    return { quote: FALLBACKS.config_error };
  }

  // 2. 识别可能的 Key 类型错误（智谱 Key 通常包含点号，如 "abcd.1234..."）
  if (apiKey.includes('.')) {
    console.warn("Detection: The provided API_KEY looks like a Zhipu/BigModel key, but this app requires a Google Gemini Key.");
  }

  const ai = new GoogleGenAI({ apiKey });
  const seed = getNumericSeed(dateStr + moodEmoji);

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `【任务：心情文学快照】
当前日期：${dateStr}
用户心情：${moodEmoji}

请基于此心情，从世界文学宝库中检索一段真实的引文。
要求：
1. 风格匹配：引文的基调必须与 ${moodEmoji} 产生强烈共鸣。
2. 绝对真实：禁止杜撰，必须包含准确的作者署名。
3. 视觉间距：每行不超过 15 个汉字。`,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.4, // 稍微提高多样性
        seed: seed,
      },
    });

    let quote = response.text?.trim();
    if (!quote || quote.length < 5) throw new Error("API_EMPTY_RESPONSE");

    // 格式清理
    quote = quote.replace(/\*\*/g, '').replace(/\"/g, '');
    
    return { quote };

  } catch (error: any) {
    console.error("Gemini API Error Detail:", error);
    
    // 根据错误状态码判断
    const errMsg = error?.message || "";
    if (errMsg.includes("403") || errMsg.includes("401") || errMsg.includes("API_KEY_INVALID")) {
      return { quote: FALLBACKS.auth_error };
    }
    
    // 其他错误（如网络、地区限制）
    return { quote: FALLBACKS.default };
  }
};