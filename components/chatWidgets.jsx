import React, { useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";

const ChatWidget = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", text: "👋 Hello! How can I help you with hoarding plans today?" },
  ]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", text: input }];
    setMessages(newMessages);
    const currentInput = input;
    setInput("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: currentInput }),
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: data.reply, results: data.results || [] },
      ]);
    } catch (err) {
      console.error(err);
      // Fallback mock response if API fails
      setTimeout(() => {
        setMessages((prev) => [...prev, { role: "assistant", text: "✅ Got it! We'll fetch plans for you." }]);
      }, 800);
    }
  };

  return (
    <>
      {/* Floating Button */}
      {!open && (
        <button
          className="chat-btn"
          onClick={() => setOpen(true)}
        >
          <MessageCircle size={24} />
        </button>
      )}

      {/* Chat Window */}
      {open && (
        <div className="chat-window">
          {/* Header */}
          <div className="chat-header">
            <strong>Goh_AI</strong>
            <button
              className="close-btn"
              onClick={() => setOpen(false)}
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="chat-body">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`message ${msg.role === "user" ? "user-message" : "bot-message"}`}
              >
                <p>{msg.text}</p>

                {msg.results && msg.results.length > 0 && (
                  <div className="results-container">
                    {msg.results.map((r, idx) => (
                      <div key={idx} className="result-card">
                        <strong className="media-name">{r.medianame}</strong>
                        <p className="location-price">{r.city} • ₹{r.price}</p>
                        <p className="category-source">{r.category} ({r.source})</p>
                        {r.thumbnail && (
                          <img
                            src={r.thumbnail}
                            alt="preview"
                            className="result-thumbnail"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="chat-input">
            <input
              type="text"
              className="message-input"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button className="send-btn" onClick={sendMessage}>
              <Send size={18} />
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        /* Floating chat button */
        .chat-btn {
          position: fixed;
          left: 20px;
          bottom: 20px;
          width: 56px;
          height: 56px;
          background: #2563eb;
          color: white;
          border: none;
          border-radius: 50%;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1050;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .chat-btn:hover {
          background: #1d4ed8;
          transform: translateY(-2px);
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
        }

        /* Chat window */
        .chat-window {
          position: fixed;
          left: 20px;
          bottom: 90px;
          width: 360px;
          height: 480px;
          background: #ffffff;
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          z-index: 1050;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
          border: 1px solid #e5e7eb;
          overflow: hidden;
          animation: slideUp 0.3s ease-out;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Chat header */
        .chat-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 20px;
          background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
          color: white;
          font-size: 16px;
        }

        .close-btn {
          background: transparent;
          border: none;
          color: white;
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background-color 0.2s ease;
        }

        .close-btn:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        /* Chat messages area */
        .chat-body {
          flex: 1;
          padding: 16px;
          overflow-y: auto;
          background: #f8fafc;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .chat-body::-webkit-scrollbar {
          width: 6px;
        }

        .chat-body::-webkit-scrollbar-track {
          background: #f1f5f9;
        }

        .chat-body::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 3px;
        }

        .chat-body::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }

        /* Message styles */
        .message {
          padding: 12px 16px;
          border-radius: 18px;
          max-width: 80%;
          word-wrap: break-word;
          line-height: 1.4;
          font-size: 14px;
          animation: fadeIn 0.3s ease-out;
        }

        .message p {
          margin: 0;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .user-message {
          background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
          color: white;
          align-self: flex-end;
          border-bottom-right-radius: 6px;
        }

        .bot-message {
          background: white;
          color: #1f2937;
          align-self: flex-start;
          border: 1px solid #e5e7eb;
          border-bottom-left-radius: 6px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        /* Results container */
        .results-container {
          margin-top: 12px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .result-card {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 10px;
          font-size: 12px;
        }

        .media-name {
          display: block;
          color: #1e293b;
          margin-bottom: 4px;
          font-weight: 600;
        }

        .location-price {
          margin: 4px 0;
          color: #334155;
          font-weight: 500;
        }

        .category-source {
          color: #64748b;
          font-size: 11px;
          margin-bottom: 8px;
        }

        .result-thumbnail {
          width: 100%;
          height: 60px;
          object-fit: cover;
          border-radius: 6px;
          margin-top: 6px;
        }

        /* Input area */
        .chat-input {
          padding: 16px;
          border-top: 1px solid #e5e7eb;
          background: white;
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .message-input {
          flex: 1;
          padding: 12px 16px;
          border: 1px solid #d1d5db;
          border-radius: 25px;
          outline: none;
          font-size: 14px;
          transition: all 0.2s ease;
          background: #f9fafb;
        }

        .message-input:focus {
          border-color: #2563eb;
          background: white;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }

        .message-input::placeholder {
          color: #9ca3af;
        }

        .send-btn {
          background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
          color: white;
          border: none;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .send-btn:hover {
          background: linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
        }

        .send-btn:active {
          transform: translateY(0);
        }

        /* Responsive design */
        @media (max-width: 480px) {
          .chat-window {
            left: 10px;
            right: 10px;
            width: auto;
            bottom: 80px;
          }
          
          .chat-btn {
            left: 15px;
            bottom: 15px;
          }
        }
      `}</style>
    </>
  );
};

export default ChatWidget;