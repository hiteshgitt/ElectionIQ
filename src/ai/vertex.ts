import { GoogleGenAI } from "@google/genai";

// Ensure the API key is set in .env.local
const apiKey = process.env.GEMINI_API_KEY;

let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
}

export interface AssistantResponse {
  eligibility: string;
  steps: Array<{ title: string; description: string }>;
  timeline: Array<{ phase: string; status: string; date?: string }>;
  tips: string[];
  explanation: string;
}

export async function generateElectionJourney(
  age: number,
  isFirstTimeVoter: boolean,
  state: string
): Promise<AssistantResponse | null> {
  if (!ai) {
    console.error("GEMINI_API_KEY is missing. Please add it to your .env.local file.");
    return null;
  }

  const prompt = `
You are an expert election assistant for Indian citizens.
The user is ${age} years old.
They are ${isFirstTimeVoter ? "a first-time voter" : "an experienced voter"}.
They live in the state of ${state}, India.

Generate a personalized election journey for them.
Provide the output STRICTLY in the following JSON format:
{
  "eligibility": "A brief, encouraging statement about their eligibility",
  "steps": [
    { "title": "Step name", "description": "Clear instruction" }
  ],
  "timeline": [
    { "phase": "Registration", "status": "Pending/Complete", "date": "Estimated time" }
  ],
  "tips": [
    "Useful tip 1",
    "Useful tip 2"
  ],
  "explanation": "A short, simple explanation of the overall process."
}

Ensure the steps reflect their status as a first-time or returning voter. Make it easy to understand.
Do NOT wrap the JSON in Markdown formatting blocks (e.g. \`\`\`json). Just output the raw JSON object.
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const text = response.text || "";
    
    // Attempt to parse the JSON
    const data = JSON.parse(text) as AssistantResponse;
    return data;
  } catch (error) {
    console.error("Failed to generate election journey from Gemini:", error);
    return null;
  }
}
