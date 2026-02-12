
import { GoogleGenAI } from "@google/genai";
import { Constituency, PartySummary } from "../types";

// Safe access to API Key for browser environments
const getApiKey = () => {
  try {
    return process.env.API_KEY || '';
  } catch (e) {
    return '';
  }
};

export const getElectionAnalysis = async (parties: PartySummary[], constituencies: Constituency[]) => {
  const apiKey = getApiKey();
  
  if (!apiKey) {
    console.warn("Gemini API Key is missing. Skipping analysis.");
    return "নির্বাচনী ফলাফল বিশ্লেষণ লোড করা যাচ্ছে না (API Key missing)।";
  }

  const ai = new GoogleGenAI({ apiKey });
  const prompt = `
    Analyze the following election data from Bangladesh and provide a 3-sentence summary of the current trends in Bengali language.
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
    return "রিয়েল-টাইম বিশ্লেষণ এই মুহূর্তে পাওয়া যাচ্ছে না। অনুগ্রহ করে নিচের চার্টগুলো দেখুন।";
  }
};
