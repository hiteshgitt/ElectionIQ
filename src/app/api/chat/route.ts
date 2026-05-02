import { NextResponse } from 'next/server';
import { GoogleGenAI } from "@google/genai";

export async function POST(req: Request) {
  try {
    const { message, context } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "API key missing" }, { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey });
    
    const prompt = `
You are ElectionIQ, a friendly AI assistant helping an Indian citizen.
Context of the user's election journey:
${JSON.stringify(context)}

User question: "${message}"

Provide a brief, helpful, and direct answer. Keep it under 3 sentences if possible. Do NOT format as JSON, just raw text.
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return NextResponse.json({ reply: response.text });
  } catch (error) {
    console.error("Chat API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
