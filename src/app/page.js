'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm'; // For GitHub Flavored Markdown

// Dynamically import TreeWrapper to ensure it only runs on the client
// Includes a loading state for better UX
const ClientOnlyTree = dynamic(() => import('./TreeWrapper'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full min-h-[500px]"> {/* Added min-h for consistent height */}
      <div className="animate-pulse text-center">
        <div className="h-4 bg-gray-300 rounded w-48 mb-2 mx-auto"></div>
        <div className="h-4 bg-gray-300 rounded w-32 mx-auto"></div>
        <p className="text-gray-500 text-sm mt-2">Loading tree visualization...</p>
      </div>
    </div>
  ),
});

const sectionsMap = {
  '1️⃣': 'Question/Code Explanation',
  '2️⃣': 'Recursive Solution Explanation',
  '3️⃣': 'Recursion Tree (JSON)',
  '4️⃣': 'Time Complexity and Optimizations',
};

export default function Home() {
  const [selectedOption, setSelectedOption] = useState('question');
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(''); // Stores the full raw response from Gemini
  const [treeData, setTreeData] = useState(null);
  const [mounted, setMounted] = useState(false); // State to track if component is mounted on client
  const [sectionContents, setSectionContents] = useState({}); // Stores parsed content for each section
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    // Set mounted to true once the component hydrates on the client
    setMounted(true);

    // Handle ESC key to exit fullscreen mode
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc); // Cleanup
  }, []);

  const handleSubmit = async () => {
    if (!inputText.trim()) {
      alert('Please enter a question or code.'); // Consider replacing with a more styled notification
      return;
    }

    setLoading(true);
    setResult(''); // Clear previous results
    setTreeData(null);
    setSectionContents({});

    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: selectedOption, content: inputText }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `API call failed with status ${response.status}`);
      }

      const data = await response.json();
      setResult(data.answer); // Store the full answer string from API

      // Parse and store content for each section using the defined sectionsMap
      const parsedSections = {};
      Object.keys(sectionsMap).forEach((num) => {
        parsedSections[num] = extractSectionContent(data.answer, num);
      });
      setSectionContents(parsedSections);

      // Attempt to extract and parse the recursion tree JSON
      const treeMatch = data.answer.match(/```json([\s\S]*?)```/);
      if (treeMatch && treeMatch[1]) {
        try {
          const parsedTree = JSON.parse(treeMatch[1].trim()); // Trim to remove potential whitespace
          setTreeData(parsedTree);
        } catch (err) {
          console.error('Failed to parse recursion tree JSON:', err);
          setTreeData(null); // Ensure treeData is null if parsing fails
        }
      }
    } catch (error) {
      console.error('Error during fetch:', error);
      alert(`Something went wrong: ${error.message}. Please try again.`); // Consider replacing with a more styled notification
    } finally {
      setLoading(false);
    }
  };

  // Helper function to extract content for each section based on the prompt's numbering
  const extractSectionContent = (text, headingNumber) => {
    // Regex to capture content from a numbered heading to the next numbered heading or end of string
    const regex = new RegExp(`${headingNumber}\\s*(.*?)(?=(${Object.keys(sectionsMap).join('|')})|$)`, 's');
    const match = text.match(regex);
    if (match && match[1]) {
      let content = match[1].trim();
      // For recursion tree section, remove JSON code block fences
      if (headingNumber === '3️⃣') {
        content = content.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      }
      return content;
    }
    return 'No content available.'; // Fallback message if section not found
  };

  // Render a minimal loading screen on the server to prevent hydration mismatches
  if (!mounted) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-indigo-100 via-indigo-200 to-white flex items-center justify-center">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-300 rounded w-64 mx-auto"></div>
          <div className="h-4 bg-gray-300 rounded w-32 mx-auto"></div>
          <p className="text-gray-500 text-sm mt-2">Loading application...</p>
        </div>
      </main>
    );
  }

  // Main application render (only on client after mounting)
  return (
    <main className="min-h-screen bg-gradient-to-b from-indigo-100 via-indigo-200 to-white flex flex-col items-center py-10 px-4 text-gray-900">
      <div className="max-w-4xl w-full bg-white rounded-lg shadow-xl p-8 border border-gray-200">
        <h1 className="text-4xl font-extrabold text-center mb-8 text-indigo-700">Recursion Helper</h1>

        {/* Input Type Selection */}
        <div className="mb-6">
          <label className="block font-semibold text-gray-800 mb-2">Select Input Type:</label>
          <select
            value={selectedOption}
            onChange={(e) => setSelectedOption(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
          >
            <option value="question">Question</option>
            <option value="code">Code</option>
          </select>
        </div>

        {/* Text Area */}
        <div className="mb-6">
          <label className="block font-semibold text-gray-800 mb-2">
            Paste your {selectedOption === 'question' ? 'question' : 'code'} here:
          </label>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            rows={10}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm resize-y"
            placeholder={
              selectedOption === 'question'
                ? 'e.g., Explain the Fibonacci sequence using recursion and provide its recursion tree.'
                : 'e.g., function fib(n) { if (n <= 1) return n; return fib(n-1) + fib(n-2); }'
            }
          ></textarea>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={loading || !inputText.trim()}
          className={`w-full py-3 px-4 rounded-lg font-bold text-white transition duration-300 ease-in-out shadow-md ${
            loading || !inputText.trim()
              ? 'bg-indigo-300 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500'
          }`}
        >
          {loading ? 'Processing...' : 'Get Analysis'}
        </button>

        {/* Loader */}
        {loading && (
          <div className="flex justify-center mt-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-indigo-600"></div>
          </div>
        )}

        {/* Result Display */}
        {!loading && result && (
          <div className="mt-10 space-y-8">
            {Object.keys(sectionsMap).map((num) => (
              <div key={num} className="bg-gradient-to-r from-indigo-50 to-white p-6 rounded-xl shadow-md border border-indigo-100">
                <h3 className="text-2xl font-bold mb-4 text-indigo-800">
                  {num} {sectionsMap[num]}
                </h3>
                {num === '3️⃣' ? (
                  // The tree visualization section
                  <div className="relative">
                    {/* Fullscreen Toggle */}
                    <button
                      onClick={() => setIsFullscreen(!isFullscreen)}
                      className="absolute top-2 right-2 bg-white border rounded-full p-2 shadow-md hover:bg-gray-100 z-10"
                      title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                    >
                      {isFullscreen ? '❌' : '⛶'}
                    </button>
                    <div
                      className={`${
                        isFullscreen
                          ? 'fixed inset-0 w-screen h-screen bg-white z-50 p-4 overflow-auto flex items-center justify-center'
                          : 'w-full min-h-[500px] max-h-[800px] bg-white rounded-lg border border-gray-300 shadow-inner p-4'
                      }`}
                    >
                      <div className="mb-2 text-sm text-gray-600 italic absolute top-4 left-4">
                        Use zoom/pan to navigate the recursion tree. Press ESC or click the button to exit fullscreen.
                      </div>
                      {mounted && treeData ? ( // Render ClientOnlyTree only if mounted and treeData exists
                        <ClientOnlyTree treeData={treeData} />
                      ) : (
                        // Placeholder if data not ready or parsing failed
                        <p className="text-gray-600 text-center text-lg">
                          {treeData === null ? 'Generating recursion tree...' : 'No recursion tree data available or parsing failed.'}
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  // All other sections rendered using ReactMarkdown
                  <div className="prose max-w-none text-gray-800">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {sectionContents[num]}
                    </ReactMarkdown>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}