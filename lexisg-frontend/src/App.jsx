import React, { useState, useCallback } from 'react';

// Main App component
const App = () => {
  const [query, setQuery] = useState('');
  const [answer, setAnswer] = useState('');
  const [citations, setCitations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Simulated API call
  const simulateApiCall = useCallback(async (userQuery) => {
    // Define the specific query for which we have a simulated answer
    const specificQuery = "In a motor accident claim where the deceased was self-employed and aged 54–55 years at the time of death, is the claimant entitled to an addition towards future prospects in computing compensation under Section 166 of the Motor Vehicles Act, 1988? If so, how much?";

    // Define the hardcoded response for the specific query
    const specificResponse = {
      answer: "Yes, under Section 166 of the Motor Vehicles Act, 1988, the claimants are entitled to an addition for future prospects even when the deceased was self-employed and aged 54–55 years at the time of the accident. In Dani Devi v. Pritam Singh, the Court held that 10% of the deceased’s annual income should be added as future prospects.",
      citations: [
        {
          text: "as the age of the deceased at the time of accident was held to be about 54-55 years by the learned Tribunal, being self-employed, as such, 10% of annual income should have been awarded on account of future prospects.” (Para 7 of the document)",
          source: "Dani_Devi_v_Pritam_Singh.pdf",
          link: "https://lexisingapore-my.sharepoint.com/:b:/g/personal/harshit_lexi_sg/EdOegeiR_gdBvQxdyW4xE6oBCDgj5E4Bo5wjvhPHpqgIuQ?e=TEu4vz"
        }
      ]
    };

    // Define a generic response for other queries
    const genericResponse = {
      answer: "I'm sorry, I can only provide a detailed answer for the specific motor accident claim query at this moment. Please try the exact query: \"" + specificQuery + "\"",
      citations: []
    };

    return new Promise(resolve => {
      setTimeout(() => {
        // Check if the user's query matches the specific query (case-insensitive and trimmed)
        if (userQuery.trim().toLowerCase() === specificQuery.trim().toLowerCase()) {
          resolve(specificResponse);
        } else {
          resolve(genericResponse);
        }
      }, 1500); // Simulate network delay
    });
  }, []);

  // Handle form submission
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setAnswer('');
    setCitations([]);

    try {
      const response = await simulateApiCall(query);
      setAnswer(response.answer);
      setCitations(response.citations);
    } catch (error) {
      console.error("Error simulating API call:", error);
      setAnswer("An error occurred while fetching the answer. Please try again.");
      setCitations([]);
    } finally {
      setIsLoading(false);
    }
  }, [query, simulateApiCall]);

  // Handle citation click to open the link in a new tab
  const handleCitationClick = useCallback((link) => {
    window.open(link, '_blank'); // Open the link in a new tab
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4 font-inter">
      {/* Main container for chat-like interface */}
      <div className="bg-white rounded-xl shadow-lg w-full max-w-3xl flex flex-col h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-xl">
          <h1 className="text-2xl font-bold text-center">Lexi Legal Assistant</h1>
        </div>

        {/* Answer Panel - Simulating chat bubbles */}
        <div className="flex-grow p-6 overflow-y-auto custom-scrollbar">
          {answer && (
            <div className="flex justify-start mb-4">
              <div className="bg-blue-50 p-4 rounded-lg shadow-md max-w-[80%] animate-fade-in">
                <h2 className="text-lg font-semibold text-blue-800 mb-2">Answer:</h2>
                <p className="text-gray-800 leading-relaxed">{answer}</p>
                {citations.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-blue-200">
                    <h3 className="text-md font-semibold text-blue-700 mb-2">Citations:</h3>
                    {citations.map((citation, index) => (
                      <div key={index} className="mb-3">
                        <button
                          onClick={() => handleCitationClick(citation.link)}
                          className="w-full text-left p-3 border border-blue-200 rounded-lg bg-blue-100 hover:bg-blue-200 transition duration-200 ease-in-out flex items-start space-x-2"
                        >
                          {/* PDF icon */}
                          <svg className="w-5 h-5 flex-shrink-0 text-blue-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.414L14.586 5A2 2 0 0115 6.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v12h7V6.414L10.586 4H6zM10 8a1 1 0 011-1h.01a1 1 0 110 2H11a1 1 0 01-1-1zm-2 4a1 1 0 011-1h.01a1 1 0 110 2H9a1 1 0 01-1-1zm-2 4a1 1 0 011-1h.01a1 1 0 110 2H7a1 1 0 01-1-1z" clipRule="evenodd"></path>
                          </svg>
                          <div className="flex flex-col">
                            <span className="font-semibold text-gray-800">{citation.source}</span>
                            <span className="text-sm text-gray-600 italic">{citation.text}</span>
                          </div>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
          {!answer && !isLoading && (
            <div className="text-center text-gray-500 text-lg mt-10">
              Ask a legal question to get started!
            </div>
          )}
        </div>

        {/* Input Panel */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <textarea
              className="flex-grow p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none h-24 sm:h-auto overflow-hidden"
              placeholder="Enter your legal question here..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              rows="3"
              disabled={isLoading}
            ></textarea>
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                "Submit Query"
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Custom styles for scrollbar and font */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        .font-inter {
          font-family: 'Inter', sans-serif;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default App;
