import React, { useState } from 'react';
import { BookOpen, Send, RefreshCw, Loader2, Sun, Moon } from 'lucide-react';
import { getVerseInterpretation } from './lib/gemini';

function App() {
  const [verseReference, setVerseReference] = useState('');
  const [interpretation, setInterpretation] = useState<{
    verse: string;
    interpretation: string;
    applications: string[];
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verseReference.trim()) {
      setError('Please enter a verse reference');
      return;
    }

    setLoading(true);
    setError('');
    setInterpretation(null);
    
    try {
      const result = await getVerseInterpretation(verseReference);
      setInterpretation(result);
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch interpretation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setVerseReference('');
    setInterpretation(null);
    setError('');
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <main className="flex-1 container mx-auto px-4 py-8 max-w-3xl">
        <div className="text-center mb-12 relative">
          <button
            onClick={toggleDarkMode}
            className={`absolute right-0 top-0 p-3 rounded-full transition-colors ${
              darkMode ? 'text-yellow-400 hover:text-yellow-300' : 'text-gray-600 hover:text-gray-800'
            }`}
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
          </button>
          <div className="flex items-center justify-center mb-4">
            <BookOpen className={`h-10 w-10 mr-2 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            <h1 className={`text-5xl font-serif ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Bible - Everyday Interpretations
            </h1>
          </div>
          <p className={`text-xl ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Discover practical insights from biblical wisdom
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mb-8">
          <div className="flex gap-2">
            <input
              type="text"
              value={verseReference}
              onChange={(e) => setVerseReference(e.target.value)}
              placeholder="Enter verse (e.g., John 3:16 or John 3:16-20)"
              className={`flex-1 p-4 text-lg border rounded-lg font-serif focus:ring-2 focus:ring-blue-500 ${
                darkMode 
                  ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              }`}
            />
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-3 rounded-lg transition-colors flex items-center gap-2 text-lg ${
                darkMode
                  ? 'bg-blue-600 hover:bg-blue-700 text-white disabled:bg-blue-800'
                  : 'bg-blue-600 hover:bg-blue-700 text-white disabled:bg-blue-300'
              }`}
            >
              {loading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <Send className="h-6 w-6" />
              )}
              Go
            </button>
            <button
              type="button"
              onClick={handleClear}
              className={`px-6 py-3 rounded-lg transition-colors flex items-center gap-2 text-lg ${
                darkMode
                  ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <RefreshCw className="h-6 w-6" />
              Clear
            </button>
          </div>
          
          {error && (
            <div className={`p-4 rounded-lg text-lg ${
              darkMode ? 'bg-red-900 text-red-200' : 'bg-red-50 text-red-700'
            }`}>
              {error}
            </div>
          )}
        </form>

        {interpretation && (
          <div className={`space-y-8 p-6 rounded-lg shadow-sm ${
            darkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div>
              <h2 className={`text-2xl font-serif mb-3 ${
                darkMode ? 'text-white' : 'text-gray-800'
              }`}>Verse</h2>
              <blockquote className={`pl-4 border-l-4 font-serif text-xl leading-relaxed ${
                darkMode 
                  ? 'border-blue-500 text-gray-200' 
                  : 'border-blue-200 text-gray-700'
              }`}>
                {interpretation.verse}
              </blockquote>
            </div>

            <div>
              <h2 className={`text-2xl font-serif mb-3 ${
                darkMode ? 'text-white' : 'text-gray-800'
              }`}>Interpretation</h2>
              <p className={`text-xl leading-relaxed ${
                darkMode ? 'text-gray-200' : 'text-gray-700'
              }`}>
                {interpretation.interpretation}
              </p>
            </div>

            <div>
              <h2 className={`text-2xl font-serif mb-3 ${
                darkMode ? 'text-white' : 'text-gray-800'
              }`}>Practical Applications</h2>
              <ul className={`list-disc pl-5 space-y-3 text-xl ${
                darkMode ? 'text-gray-200' : 'text-gray-700'
              }`}>
                {interpretation.applications.map((app, index) => (
                  <li key={index}>{app}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </main>

      <footer className={`text-center py-6 space-y-2 ${
        darkMode 
          ? 'bg-gray-800 text-gray-400' 
          : 'bg-gray-100 text-gray-600'
      }`}>
        <div>Made by Quintin</div>
      </footer>
    </div>
  );
}

export default App;
