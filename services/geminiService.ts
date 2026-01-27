import { GoogleGenAI } from "@google/genai";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY is missing in environment variables.");
  }
  return new GoogleGenAI({ apiKey });
};

export const analyzeProtein = async (proteinSequence: string, name?: string): Promise<string> => {
  try {
    const ai = getClient();
    const prompt = `
      You are an expert bioinformatician.
      Analyze the following protein amino acid sequence (1-letter code).
      
      Sequence: ${proteinSequence}
      ${name ? `User provided Name: ${name}` : ''}
      
      Provide a brief, scientific summary covering:
      1. Estimated physicochemical properties (charge, hydrophobicity).
      2. Predicted secondary structure tendencies (alpha-helices vs beta-sheets) if discernible from motifs.
      3. Potential function or similarity to known protein families (if the sequence is recognizable).
      
      Keep the response under 200 words. Format with markdown.
      If the sequence is too short to mean anything, say so.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    
    return response.text || "No analysis generated.";
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return "AI Analysis unavailable at this time.";
  }
};