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

  const toggleDarkMode = () => setDarkMode(!darkMode);

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <main className="flex-1 w-full px-4 py-6 sm:py-8 sm:px-6 max-w-4xl mx-auto">
        <div className="text-center mb-8 sm:mb-12 relative">
          <button
            onClick={toggleDarkMode}
            className={`absolute right-2 top-2 sm:right-0 sm:top-0 p-2 rounded-full transition-colors ${
              darkMode ? 'text-yellow-400 hover:text-yellow-300' : 'text-gray-600 hover:text-gray-800'
            }`}
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun className="h-5 w-5 sm:h-6 sm:w-6" /> : <Moon className="h-5 w-5 sm:h-6 sm:w-6" />}
          </button>
          <div className="flex items-center justify-center mb-3 sm:mb-4 flex-wrap text-center">
            <BookOpen className={`h-8 w-8 sm:h-10 sm:w-10 mr-2 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            <h1 className={`text-3xl sm:text-5xl font-serif ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Bible - Everyday Interpretations
            </h1>
          </div>
          <p className={`text-base sm:text-xl ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Discover practical insights from biblical wisdom
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={verseReference}
              onChange={(e) => setVerseReference(e.target.value)}
              placeholder="Enter verse (e.g., John 3:16)"
              className={`w-full p-3 sm:p-4 text-base sm:text-lg border rounded-lg font-serif focus:ring-2 focus:ring-blue-500 ${
                darkMode
                  ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              }`}
            />
            <div className="flex gap-2 w-full sm:w-auto">
              <button
                type="submit"
                disabled={loading}
                className={`flex-1 sm:flex-none px-4 py-2 sm:px-6 sm:py-3 rounded-lg transition-colors flex items-center justify-center gap-2 text-base sm:text-lg ${
                  darkMode
                    ? 'bg-blue-600 hover:bg-blue-700 text-white disabled:bg-blue-800'
                    : 'bg-blue-600 hover:bg-blue-700 text-white disabled:bg-blue-300'
                }`}
              >
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                <span className="hidden sm:inline">Go</span>
              </button>
              <button
                type="button"
                onClick={handleClear}
                className={`flex-1 sm:flex-none px-4 py-2 sm:px-6 sm:py-3 rounded-lg transition-colors flex items-center justify-center gap-2 text-base sm:text-lg ${
                  darkMode
                    ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <RefreshCw className="h-5 w-5" />
                <span className="hidden sm:inline">Clear</span>
              </button>
            </div>
          </div>

          {error && (
            <div className={`p-3 rounded-lg text-base sm:text-lg ${
              darkMode ? 'bg-red-900 text-red-200' : 'bg-red-50 text-red-700'
            }`}>
              {error}
            </div>
          )}
        </form>

        {interpretation && (
          <div className={`space-y-6 sm:space-y-8 p-4 sm:p-6 rounded-lg shadow-sm ${
            darkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div>
              <h2 className={`text-xl sm:text-2xl font-serif mb-2 sm:mb-3 ${
                darkMode ? 'text-white' : 'text-gray-800'
              }`}>Verse</h2>
              <blockquote className={`pl-3 sm:pl-4 border-l-4 font-serif text-base sm:text-xl leading-relaxed ${
                darkMode ? 'border-blue-500 text-gray-200' : 'border-blue-200 text-gray-700'
              }`}>
                {interpretation.verse}
              </blockquote>
            </div>

            <div>
              <h2 className={`text-xl sm:text-2xl font-serif mb-2 sm:mb-3 ${
                darkMode ? 'text-white' : 'text-gray-800'
              }`}>Interpretation</h2>
              <p className={`text-base sm:text-xl leading-relaxed ${
                darkMode ? 'text-gray-200' : 'text-gray-700'
              }`}>
                {interpretation.interpretation}
              </p>
            </div>

            <div>
              <h2 className={`text-xl sm:text-2xl font-serif mb-2 sm:mb-3 ${
                darkMode ? 'text-white' : 'text-gray-800'
              }`}>Practical Applications</h2>
              <ul className={`list-disc pl-4 sm:pl-5 space-y-2 sm:space-y-3 text-base sm:text-xl ${
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

<footer className={`text-center py-4 sm:py-6 text-sm sm:text-base ${
  darkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-600'
}`}>
  <div>Made by Quintin - Powered by AI</div>
  <div>
    <a
      href="mailto:biblepodcast4teens@gmail.com?subject=Bible%20Explanations%20App"
      className={`underline hover:text-blue-500 transition-colors ${
        darkMode ? 'text-gray-300' : 'text-gray-700'
      }`}
    >
      Feedback
    </a>
  </div>
</footer>
    </div>
  );
}

export default App;
