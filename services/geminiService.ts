
import { GoogleGenAI, Type } from "@google/genai";
import { Restaurant } from "../types";

/**
 * Searches for restaurants in a specific location that do not have a website.
 * Uses Gemini 3 Pro with Google Search grounding for exhaustive discovery.
 */
export const searchRestaurantsWithoutWebsites = async (location: string): Promise<Restaurant[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `Perform an EXHAUSTIVE lead generation search for restaurants in "${location}" that DO NOT have an official, dedicated website (e.g., no .com, .net, or restaurant-specific domain). 

  Rules for the search:
  1. Only include restaurants that rely on Google Maps, Facebook, or Instagram instead of a professional website.
  2. Find as many as possible (aim for a list of 15-20 leads if the area supports it).
  3. For every single result, you MUST provide a direct Google Maps URL so the user can verify the business profile and confirm the absence of a 'Website' button.
  4. Ensure the phone numbers are formatted for easy clicking.
  
  Return the results as a clean JSON array of objects with these keys: 
  - "name": Full business name.
  - "phone": Contact number.
  - "address": Full physical address.
  - "cuisine": Primary type of food served.
  - "mapsUrl": The direct link to their Google Maps/Business profile.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview', // Upgraded to Pro for more comprehensive and accurate web research
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              phone: { type: Type.STRING },
              address: { type: Type.STRING },
              cuisine: { type: Type.STRING },
              mapsUrl: { type: Type.STRING }
            },
            required: ["name", "phone", "address", "cuisine", "mapsUrl"]
          }
        }
      }
    });

    const jsonStr = response.text.trim();
    const data = JSON.parse(jsonStr);
    
    return data.map((item: any) => ({
      ...item,
      id: Math.random().toString(36).substr(2, 9),
      called: false,
      notes: '',
      searchDate: new Date().toISOString(),
      location
    }));
  } catch (error) {
    console.error("Gemini Lead Gen Error:", error);
    throw new Error("The search failed or took too long. Please try a more specific area (e.g., 'West Village, NY' instead of just 'New York').");
  }
};
