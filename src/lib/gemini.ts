import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
if (!apiKey) {
  throw new Error('VITE_GEMINI_API_KEY is not set in environment variables');
}

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: 'models/gemini-1.5-pro' });

export async function getVerseInterpretation(verseReference: string) {
  const prompt = `Provide an interpretation of the Bible verse or verses: ${verseReference}
  
  ... [your prompt text here, unchanged] ...
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const cleanJson = jsonMatch ? jsonMatch[0] : text.replace(/```json|```/g, '').trim();

    try {
      return JSON.parse(cleanJson);
    } catch (parseError) {
      console.error('Failed to parse Gemini response:', cleanJson);
      throw new Error('Oops! The AI had trouble formatting its response as valid JSON. Please try again.');
    }
  } catch (error: any) {
    console.error('Error calling Gemini API:', error?.message || error);
    if (error?.message?.includes('API key')) {
      throw new Error('It seems there is an issue with the API key. Please check your configuration.');
    } else if (error?.message?.includes('model')) {
      throw new Error('The specified AI model is not available. Please check if you have access to Gemini 1.5 Pro.');
    }
    throw new Error('Oh no! Something went wrong. Please check your verse reference and try again.');
  }
}
