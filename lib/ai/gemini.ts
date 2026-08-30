import { GoogleGenerativeAI } from "@google/generative-ai";

export const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const apiKey = process.env.GEMINI_API_KEY;
console.log("Gemini API key exists:", !!apiKey);
console.log("Gemini API key length:", apiKey?.length);

export const model = genAI.getGenerativeModel({
  model: "gemini-3.6-flash",
  generationConfig: { responseMimeType: "application/json" },
});

export function dataUrlToInlinePart(dataUrl: string) {
  const [meta, data] = dataUrl.split(",");
  const mimeType = meta.match(/data:(.*);base64/)?.[1] ?? "image/png";
  return { inlineData: { data, mimeType } };
}