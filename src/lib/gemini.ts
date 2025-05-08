import { GoogleGenerativeAI } from '@google/generative-ai';

// Ensure API key is available
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
if (!apiKey) {
  throw new Error('VITE_GEMINI_API_KEY is not set in environment variables');
}

// Initialize Gemini 1.5 Flash model
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({
  model: 'models/gemini-1.5-flash-latest',
  generationConfig: {
    temperature: 0.7,
    topK: 40,
    topP: 0.95,
    maxOutputTokens: 2048, // Increased to ensure complete responses
  },
});

export async function getVerseInterpretation(verseReference: string) {
  const prompt = `Analyze the Bible verse or verses: ${verseReference}

Important: Keep your response concise and ensure it fits within a complete, valid JSON object.

Return ONLY a JSON object with NO additional formatting, markdown, or code blocks. The response should be a raw JSON object with this exact structure:
{
  "verse": "The complete Bible verse text (including all verses if it's a range)",
  "interpretation": "A brief, clear explanation in 2-3 sentences about what this verse means, written at an 8th-grade reading level.",
  "applications": ["2-3 short, practical applications of these teachings"]
}

Guidelines:
- Keep all text fields brief and focused
- Use simple, everyday language
- Ensure the JSON is complete and properly formatted
- Do not include line breaks within text fields
- Keep the total response under 1000 characters`;

  try {
    const result = await model.generateContent([prompt]);
    const response = result.response;
    const text = response.text();

    // Clean up any potential markdown formatting
    const cleanJson = text.replace(/^\`\`\`json\n|\`\`\`$/g, '').trim();

    try {
      // Validate JSON structure before returning
      const parsed = JSON.parse(cleanJson);
      
      // Ensure all required fields exist
      if (!parsed.verse || !parsed.interpretation || !Array.isArray(parsed.applications)) {
        throw new Error('Invalid response structure');
      }

      return parsed;
    } catch (parseError) {
      console.error('Failed to parse Gemini response:', cleanJson);
      throw new Error('Failed to process the verse interpretation. Please try again.');
    }
  } catch (error: any) {
    console.error('Error calling Gemini API:', error?.message || error);
    if (error?.message?.includes('API key')) {
      throw new Error('Invalid API key configuration');
    }
    throw new Error('Failed to get verse interpretation. Please try again.');
  }
}
