import { useState } from "react";

export default function ChatPage() {
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const askBot = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAnswer("");

    try {
      const res = await fetch("/api/ai-bot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, countryCode: "IN" }),
      });
      const data = await res.json();
    //   setAnswer(data.answer);
      setAnswer(typeof data.answer === "object" ? JSON.stringify(data.answer, null, 2) : data.answer);

    } catch (err) {
      setAnswer("Error: " + err.message);
    }

    setLoading(false);
  };

  return (
    <div className="container">
      <div className="chat-card">
        <div className="header">
          <div className="header-icon">🤖</div>
          <div className="header-content">
            <h1 className="title">Gohoardings AI Assistant</h1>
            <p className="subtitle">Ask about billboards, digital screens, and mall media</p>
          </div>
        </div>

        <form onSubmit={askBot} className="form">
          <div className="input-group">
            <input
              type="text"
              className="input"
              placeholder="e.g., 'Show me banner media in Delhi' or 'Find digital screens'"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              disabled={loading}
            />
            <button
              type="submit"
              className={`button ${loading ? 'loading' : ''}`}
              disabled={loading || !query.trim()}
            >
              <span className="button-text">
                {loading ? "Processing..." : "Ask AI"}
              </span>
              <span className="button-icon">
                {loading ? "⏳" : "🚀"}
              </span>
            </button>
          </div>
        </form>

        <div className="response-container">
          <div className="response-header">
            <span className="response-title">Response</span>
            {answer && (
              <span className="response-status">✅ Complete</span>
            )}
          </div>
          
          <div className="response-content">
            {answer ? (
              <div className="answer">
                <pre className="answer-text">{answer}</pre>
              </div>
            ) : (
              <div className="placeholder">
                <div className="placeholder-icon">💬</div>
                <p className="placeholder-text">
                  {loading ? "AI is thinking..." : "Ask a question to get started"}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="suggestions">
          <p className="suggestions-title">Try asking:</p>
          <div className="suggestions-grid">
            {[
              "Show me all banner media",
              "Find digital screens in Mumbai",
              "What mall media is available?",
              "List billboards by location"
            ].map((suggestion, idx) => (
              <button
                key={idx}
                className="suggestion-chip"
                onClick={() => setQuery(suggestion)}
                disabled={loading}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .container {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .chat-card {
          width: 100%;
          max-width: 800px;
          background: white;
          border-radius: 24px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          overflow: hidden;
          animation: slideUp 0.6s ease-out;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .header {
          background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
          color: white;
          padding: 2rem;
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .header-icon {
          font-size: 3rem;
          animation: bounce 2s infinite;
        }

        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-10px);
          }
          60% {
            transform: translateY(-5px);
          }
        }

        .header-content {
          flex: 1;
        }

        .title {
          margin: 0;
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }

        .subtitle {
          margin: 0;
          opacity: 0.9;
          font-size: 1.1rem;
        }

        .form {
          padding: 2rem;
          border-bottom: 1px solid #e5e7eb;
        }

        .input-group {
          display: flex;
          gap: 1rem;
          align-items: stretch;
        }

        .input {
          flex: 1;
          padding: 1rem 1.25rem;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          font-size: 1rem;
          transition: all 0.2s ease;
          background: #f9fafb;
        }

        .input:focus {
          outline: none;
          border-color: #4f46e5;
          background: white;
          box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
        }

        .input:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .button {
          padding: 1rem 1.5rem;
          background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          min-width: 140px;
          justify-content: center;
        }

        .button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px -5px rgba(79, 70, 229, 0.4);
        }

        .button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        .button.loading {
          background: linear-gradient(135deg, #6b7280 0%, #9ca3af 100%);
        }

        .button-text {
          font-size: 1rem;
        }

        .button-icon {
          font-size: 1.2rem;
        }

        .response-container {
          padding: 2rem;
          background: #f8fafc;
        }

        .response-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .response-title {
          font-weight: 600;
          color: #374151;
          font-size: 1.1rem;
        }

        .response-status {
          background: #dcfce7;
          color: #16a34a;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.875rem;
          font-weight: 500;
        }

        .response-content {
          background: white;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
          min-height: 200px;
          position: relative;
          overflow: hidden;
        }

        .answer {
          padding: 1.5rem;
          animation: fadeIn 0.5s ease-in;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .answer-text {
          margin: 0;
          white-space: pre-wrap;
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
          font-size: 0.9rem;
          line-height: 1.6;
          color: #1f2937;
          background: #f1f5f9;
          padding: 1rem;
          border-radius: 8px;
          border-left: 4px solid #4f46e5;
        }

        .placeholder {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 200px;
          color: #6b7280;
        }

        .placeholder-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
          opacity: 0.7;
        }

        .placeholder-text {
          margin: 0;
          font-size: 1.1rem;
          text-align: center;
        }

        .suggestions {
          padding: 2rem;
          background: white;
        }

        .suggestions-title {
          margin: 0 0 1rem 0;
          font-weight: 600;
          color: #374151;
        }

        .suggestions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 0.75rem;
        }

        .suggestion-chip {
          background: #f3f4f6;
          border: 1px solid #d1d5db;
          color: #374151;
          padding: 0.75rem 1rem;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 0.875rem;
          text-align: left;
        }

        .suggestion-chip:hover:not(:disabled) {
          background: #e5e7eb;
          border-color: #9ca3af;
          transform: translateY(-1px);
        }

        .suggestion-chip:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        @media (max-width: 640px) {
          .container {
            padding: 1rem;
          }

          .header {
            padding: 1.5rem;
          }

          .title {
            font-size: 1.5rem;
          }

          .subtitle {
            font-size: 1rem;
          }

          .form {
            padding: 1.5rem;
          }

          .input-group {
            flex-direction: column;
          }

          .button {
            width: 100%;
          }

          .suggestions-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}