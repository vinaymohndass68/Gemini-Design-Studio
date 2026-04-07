
import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import { AspectRatio, DesignState, Message } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getBestAspectRatio = (width: number, height: number): AspectRatio => {
  const ratio = width / height;
  const standardRatios: { label: AspectRatio; val: number }[] = [
    { label: "1:1", val: 1 },
    { label: "3:4", val: 0.75 },
    { label: "4:3", val: 1.33 },
    { label: "9:16", val: 0.56 },
    { label: "16:9", val: 1.77 },
  ];

  let best = standardRatios[0];
  let minDiff = Math.abs(ratio - best.val);

  for (let i = 1; i < standardRatios.length; i++) {
    const diff = Math.abs(ratio - standardRatios[i].val);
    if (diff < minDiff) {
      minDiff = diff;
      best = standardRatios[i];
    }
  }

  return best.label;
};

export const chatWithAssistant = async (history: Message[], userInput: string, designContext: DesignState) => {
  const model = 'gemini-3-flash-preview';
  
  const systemInstruction = `You are a professional Graphic Design Consultant. 
  The user wants to create a ${designContext.type} (${designContext.width}x${designContext.height}px) for the following purpose: "${designContext.purpose}".
  The primary brand color is ${designContext.themeColor}.
  
  Your goal is to help refine their vision by asking clarifying questions about:
  - Color palette preferences (respecting their primary color ${designContext.themeColor})
  - Style (minimalist, bold, vintage, etc.)
  - Specific elements or icons to include
  - Text or slogan details (if applicable)
  
  Keep your responses concise and helpful. 
  When you feel you have enough information to generate a high-quality visual, conclude your response by saying EXACTLY "I have all the details I need. Shall I generate the design for you?"`;

  const contents = history.map(msg => ({
    role: msg.role === 'user' ? 'user' : 'model',
    parts: [{ text: msg.content }]
  }));

  contents.push({
    role: 'user',
    parts: [{ text: userInput }]
  });

  const response = await ai.models.generateContent({
    model,
    contents,
    config: {
      systemInstruction,
      temperature: 0.7,
    }
  });

  return response.text || "I'm sorry, I couldn't process that.";
};

export const generateFinalDesign = async (designContext: DesignState, finalPrompt: string): Promise<string | null> => {
  const aspectRatio = getBestAspectRatio(designContext.width, designContext.height);
  
  const prompt = `A professional ${designContext.type} design for ${designContext.purpose}. 
  Primary Brand Color: ${designContext.themeColor}.
  Design requirements and style details: ${finalPrompt}. 
  Ensure high resolution, clean lines, and professional aesthetic suitable for a ${designContext.type}.`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [{ text: prompt }]
    },
    config: {
      imageConfig: {
        aspectRatio,
      }
    }
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
    }
  }

  return null;
};
