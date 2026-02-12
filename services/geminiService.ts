
import { GoogleGenAI } from "@google/genai";
import { Constituency, PartySummary } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getElectionAnalysis = async (parties: PartySummary[], constituencies: Constituency[]) => {
  const prompt = `
    Analyze the following election data from Bangladesh and provide a 3-sentence summary of the current trends.
    Parties Data: ${JSON.stringify(parties.map(p => ({ name: p.name, won: p.seatsWon, leading: p.seatsLeading })))}
    Constituency Examples: ${JSON.stringify(constituencies.slice(0, 3).map(c => ({ name: c.name, status: c.status })))}
    
    Mention the leading party and any significant patterns. Keep it objective and professional.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return "Real-time analysis currently unavailable. Please check the charts below.";
  }
};
