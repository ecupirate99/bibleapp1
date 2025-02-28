import { GoogleGenerativeAI } from '@google/generative-ai';

// Ensure API key is available
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
if (!apiKey) {
  throw new Error('VITE_GEMINI_API_KEY is not set in environment variables');
}

const genAI = new GoogleGenerativeAI(apiKey);
// Updated model name to use Gemini 2.0
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

export async function getVerseInterpretation(verseReference: string) {
  const prompt = `Provide an interpretation of the Bible verse or verses: ${verseReference}

If this is a verse range, include all verses in the range and provide a cohesive interpretation that covers the entire passage.

Return ONLY a JSON object with NO additional formatting, markdown, or code blocks. The response should be a raw JSON object with this exact structure:
{
  "verse": "The complete Bible verse text (including all verses if it's a range) with verse numbers",
  "interpretation": "A friendly, detailed explanation of what this verse or passage means, written at an 8th-grade reading level, in the style of Max Lucado. Use simple words and clear examples that anyone can understand. For verse ranges, explain how the verses connect and work together. The explanation should be about 3-4 sentences long.",
  "applications": ["3-4 practical, everyday applications of these teachings, written in simple language that middle school students can understand, in the style of Max Lucado"],
  "translation": "The Bible translation used for the verse or verses. Do not use the NIV translation."
}

Make sure to:
- Use simple, everyday words instead of complex theological terms
- Explain ideas like you're talking to a friend
- Give real-life examples that teenagers can relate to
- Keep the tone friendly and encouraging
- For verse ranges, show how the verses build on each other
- Do not use the NIV translation.`;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    
    // More robust JSON extraction - handles various ways the model might return JSON
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const cleanJson = jsonMatch ? jsonMatch[0] : text.replace(/```json|```/g, '').trim();
    
    try {
      return JSON.parse(cleanJson);
    } catch (parseError) {
      console.error('Failed to parse Gemini response:', cleanJson);
      // Provide a more user-friendly error message
      throw new Error('Oops! The AI had trouble formatting its response as valid JSON. Please try again.');
    }
  } catch (error: any) {
    console.error('Error calling Gemini API:', error?.message || error);
    if (error?.message?.includes('API key')) {
      throw new Error('It seems there is an issue with the API key. Please check your configuration.');
    } else if (error?.message?.includes('model')) {
      throw new Error('The specified AI model is not available. Please check if you have access to Gemini 1.5 Pro.');
    }
    // Provide a more user-friendly error message
    throw new Error('Oh no! Something went wrong. Please check your verse reference and try again.');
  }
}
