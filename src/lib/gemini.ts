import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("VITE_GEMINI_API_KEY is not set in environment variables");
}

const genAI = new GoogleGenerativeAI(apiKey);

// ✅ Choose "gemini-2.0-flash" for more power, or "gemini-2.0-flash-lite" for more free quota
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });

export async function getVerseInterpretation(verseReference: string) {
  const prompt = `Analyze the Bible verse or verses: ${verseReference}

Return ONLY a JSON object with this exact structure:
{
  "verse": "The complete Bible verse text (including all verses if it's a range)",
  "interpretation": "A brief, clear explanation in 2-3 sentences about what this verse means, written at an 8th-grade reading level.",
  "applications": ["2-3 short, practical applications of these teachings"]
}`;

  try {
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1024,
      },
    });

    const text = await result.response.text();
    console.log("Gemini raw output:", text);

    // Clean common issues (fences, extra text)
    let clean = text.trim();
    clean = clean.replace(/```json/i, "").replace(/```/g, "").trim();

    // Extract JSON object from the response
    const match = clean.match(/\{[\s\S]*\}/);
    if (!match) {
      throw new Error("Could not find a valid Bible verse. Please check your verse reference (e.g., 'John 3:16')");
    }

    const parsed = JSON.parse(match[0]);

    // Validate structure
    if (!parsed.verse || !parsed.interpretation || !Array.isArray(parsed.applications)) {
      throw new Error("Received incomplete response. Please try again.");
    }

    return parsed;
  } catch (error: any) {
    console.error("Error calling Gemini API:", error);
    
    // Provide more specific error messages
    if (error?.message?.includes("API key")) {
      throw new Error("API key error. Please check your configuration.");
    } else if (error?.message?.includes("quota")) {
      throw new Error("API quota exceeded. Please try again later.");
    } else if (error?.message?.includes("JSON")) {
      throw new Error("Could not parse the verse. Please check your verse reference and try again.");
    } else if (error?.message?.includes("valid Bible verse")) {
      throw error; // Re-throw our custom error message
    } else if (error?.message?.includes("incomplete response")) {
      throw error; // Re-throw our custom error message
    } else if (error?.message) {
      // Show the actual error message for better debugging
      throw new Error(`Error: ${error.message}`);
    } else {
      throw new Error("Oh no! Something went wrong. Please check your verse reference and try again.");
    }
  }
}
