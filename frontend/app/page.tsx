"use client";

import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [words, setWords] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [step, setStep] = useState<"input" | "review" | "result">("input");

  const addWord = () => {
    const newWords = input
      .split(",")
      .map((w) => w.trim())
      .filter((w) => w.length > 0 && !words.includes(w));
    
    if (newWords.length > 0) {
      setWords([...words, ...newWords]);
      setInput("");
    }
  };

  const removeWord = (wordToRemove: string) => {
    setWords(words.filter(word => word !== wordToRemove));
  };

  const handleSubmit = async () => {
    if (words.length === 0) return;

    setLoading(true);
    setStep("result");
    try {
      const res = await fetch("https://relation-model.onrender.com/relation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ words }),
      });

      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error("Error:", err);
      setResult({ error: "Something went wrong" });
    } finally {
      setLoading(false);
    }
  };

  const resetProcess = () => {
    setWords([]);
    setResult(null);
    setStep("input");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10 pt-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-3">
            Word Relation Finder
          </h1>
          <p className="text-gray-600 max-w-xl mx-auto">
            {step === "input" 
              ? "Add words to discover connections between them" 
              : step === "review" 
              ? "Review your words and find relationships"
              : "Discover the connections between your words"}
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-center mb-10">
          <div className="flex items-center">
            {/* Step 1 */}
            <div className={`flex flex-col items-center ${step === "input" ? "text-blue-600" : "text-gray-400"}`}>
              <div className={`h-10 w-10 rounded-full flex items-center justify-center border-2 ${step === "input" ? "border-blue-600 bg-blue-50" : "border-gray-300"}`}>
                1
              </div>
              <span className="text-sm mt-1">Add Words</span>
            </div>
            
            {/* Connector */}
            <div className="h-0.5 w-16 bg-gray-300 mx-2"></div>
            
            {/* Step 2 */}
            <div className={`flex flex-col items-center ${step === "review" ? "text-blue-600" : step === "result" ? "text-blue-600" : "text-gray-400"}`}>
              <div className={`h-10 w-10 rounded-full flex items-center justify-center border-2 ${step !== "input" ? "border-blue-600 bg-blue-50" : "border-gray-300"}`}>
                2
              </div>
              <span className="text-sm mt-1">Review</span>
            </div>
            
            {/* Connector */}
            <div className="h-0.5 w-16 bg-gray-300 mx-2"></div>
            
            {/* Step 3 */}
            <div className={`flex flex-col items-center ${step === "result" ? "text-blue-600" : "text-gray-400"}`}>
              <div className={`h-10 w-10 rounded-full flex items-center justify-center border-2 ${step === "result" ? "border-blue-600 bg-blue-50" : "border-gray-300"}`}>
                3
              </div>
              <span className="text-sm mt-1">Results</span>
            </div>
          </div>
        </div>

        {/* Step 1: Input Words */}
        {step === "input" && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
            <div className="mb-4">
              <label htmlFor="word-input" className="block text-sm font-medium text-gray-700 mb-2">
                Add words (separate with commas)
              </label>
              <div className="flex gap-2">
                <input
                  id="word-input"
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="e.g. dog, animal, pet, tree"
                  className="flex-1 border border-gray-200 rounded-xl px-5 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-black"
                  onKeyPress={(e) => e.key === 'Enter' && addWord()}
                />
                <button
                  onClick={addWord}
                  className="bg-blue-500 text-white px-5 py-3 rounded-xl shadow-md hover:bg-blue-600 transition-all duration-200 font-medium"
                >
                  Add Words
                </button>
              </div>
            </div>

            {words.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-800 mb-3">Your Words</h3>
                <div className="flex flex-wrap gap-2">
                  {words.map((word, index) => (
                    <span 
                      key={index}
                      className="bg-blue-100 text-blue-800 px-3 py-1.5 rounded-full text-sm font-medium flex items-center"
                    >
                      {word}
                      <button 
                        onClick={() => removeWord(word)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        &times;
                      </button>
                    </span>
                  ))}
                </div>
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => setStep("review")}
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-xl shadow-md hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 font-medium"
                  >
                    Continue to Review
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 2: Review Words */}
        {step === "review" && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
            <div className="flex items-center mb-5">
              <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Review Your Words</h2>
            </div>

            <div className="mb-6">
              <p className="text-gray-600 mb-3">You've added the following words:</p>
              <div className="flex flex-wrap gap-2">
                {words.map((word, index) => (
                  <span 
                    key={index}
                    className="bg-blue-100 text-blue-800 px-3 py-1.5 rounded-full text-sm font-medium"
                  >
                    {word}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setStep("input")}
                className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Add Words
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-xl shadow-md hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50 transition-all duration-200 font-medium"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analyzing...
                  </>
                ) : (
                  "Find Relations"
                )}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Results */}
        {step === "result" && (
          <div className="space-y-6">
            {result && (
              <>
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                  <div className="flex justify-between items-center mb-5">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <h2 className="text-xl font-semibold text-gray-800">Analysis Results</h2>
                    </div>
                    <button
                      onClick={resetProcess}
                      className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Start Over
                    </button>
                  </div>

                  <div className="mb-4">
                    <p className="text-gray-600 mb-2">Analyzed words:</p>
                    <div className="flex flex-wrap gap-2">
                      {words.map((word, index) => (
                        <span 
                          key={index}
                          className="bg-blue-100 text-blue-800 px-3 py-1.5 rounded-full text-sm font-medium"
                        >
                          {word}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {result.data?.edges && result.data.edges.length > 0 && (
                  <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 overflow-hidden">
                    <div className="flex items-center mb-5">
                      <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                      <h2 className="text-xl font-semibold text-gray-800">Relationships</h2>
                    </div>
                    <div className="grid gap-4">
                      {result.data.edges.map((edge: any, idx: number) => (
                        <div
                          key={idx}
                          className="bg-green-50 rounded-xl p-4 border border-green-100 transition-all duration-200 hover:bg-green-100"
                        >
                          <div className="flex items-start">
                            <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-200 flex items-center justify-center mt-0.5 mr-3">
                              <span className="text-xs font-bold text-green-700">{idx + 1}</span>
                            </div>
                            <div>
                              <p className="text-gray-900 font-medium mb-1">
                                <span className="text-green-700">{edge.from}</span> → <span className="text-green-700">{edge.to}</span>
                              </p>
                              <p className="text-gray-600 text-sm">{edge.why}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {result.data?.isolated && result.data.isolated.length > 0 && (
                  <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                    <div className="flex items-center mb-4">
                      <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                      </div>
                      <h2 className="text-xl font-semibold text-gray-800">Isolated Words</h2>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {result.data.isolated.map((word: string, idx: number) => (
                        <span key={idx} className="bg-amber-100 text-amber-800 px-3 py-1.5 rounded-full text-sm font-medium">
                          {word}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
      
      {/* Footer */}
      <div className="mt-12 text-center text-gray-500 text-sm">
        <p>Add words, review, and discover their relationships</p>
      </div>
    </div>
  );
}