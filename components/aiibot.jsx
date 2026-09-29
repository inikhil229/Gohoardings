import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, MapPin, DollarSign } from 'lucide-react';

export default function GoHoardingsChatbot() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! I\'m your GoHoardings assistant. I can help you find outdoor advertising media across India. Try asking me:\n\n• "Show me hoardings in Delhi under 200000"\n• "I want LED screens in Pune"\n• "Find lit billboards in Mumbai between 100000 and 300000"',
      results: null
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const messagesEndRef = useRef(null);

  const handleSubmit = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage, results: null }]);
    setLoading(true);

    try {
      const response = await fetch('/api/aii-bot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage, countryCode: 'IN' })
      });

      const data = await response.json();

      if (response.ok) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: data.message,
          results: data.results
        }]);
      } else {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: `Sorry, I encountered an error: ${data.error}. Please try rephrasing your question.`,
          results: null
        }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I\'m having trouble connecting. Please try again.',
        results: null
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const exampleQueries = [
    "Hoardings in Delhi under 200000",
    "LED screens in Pune",
    "Lit billboards in Mumbai",
    "Digital media in Bangalore"
  ];

  return (
    <div className="flex flex-col h-screen max-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="bg-white shadow-md border-b border-gray-200 px-6 py-4">
        <div className="flex items-center space-x-3">
          <div className="bg-indigo-600 rounded-full p-2">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">GoHoardings AI Assistant</h1>
            <p className="text-sm text-gray-500">Find outdoor advertising media instantly</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex max-w-3xl ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} items-start space-x-3`}>
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                msg.role === 'user' ? 'bg-indigo-600 ml-3' : 'bg-gray-300 mr-3'
              }`}>
                {msg.role === 'user' ? (
                  <User className="w-5 h-5 text-white" />
                ) : (
                  <Bot className="w-5 h-5 text-gray-700" />
                )}
              </div>

              <div className={`rounded-2xl px-4 py-3 ${
                msg.role === 'user' 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-white text-gray-800 shadow-md border border-gray-100'
              }`}>
                <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</p>
                
                {msg.results && msg.results.length > 0 && (
                  <div className="mt-4 grid grid-cols-1 gap-3">
                    {msg.results.slice(0, 3).map((media, mediaIdx) => (
                      <div 
                        key={mediaIdx}
                        className="bg-gray-50 rounded-lg p-3 border border-gray-200 hover:border-indigo-400 transition-all cursor-pointer"
                        onClick={() => setSelectedMedia(media)}
                      >
                        <div className="flex items-start space-x-3">
                          {media.thumbnail && (
                            <img 
                              src={media.thumbnail} 
                              alt={media.medianame}
                              className="w-16 h-16 rounded object-cover"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-sm text-gray-900 truncate">
                              {media.medianame}
                            </h4>
                            <div className="flex items-center text-xs text-gray-600 mt-1">
                              <MapPin className="w-3 h-3 mr-1" />
                              {media.city_name}
                            </div>
                            <div className="flex items-center text-xs font-semibold text-indigo-600 mt-1">
                              <DollarSign className="w-3 h-3 mr-1" />
                              ₹{media.price?.toLocaleString() || 'N/A'}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                <Bot className="w-5 h-5 text-gray-700" />
              </div>
              <div className="bg-white rounded-2xl px-4 py-3 shadow-md">
                <Loader2 className="w-5 h-5 animate-spin text-indigo-600" />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {messages.length === 1 && (
        <div className="px-4 pb-2">
          <p className="text-xs text-gray-500 mb-2">Try these examples:</p>
          <div className="flex flex-wrap gap-2">
            {exampleQueries.map((query, idx) => (
              <button
                key={idx}
                onClick={() => setInput(query)}
                className="text-xs bg-white border border-gray-300 rounded-full px-3 py-1.5 hover:border-indigo-400 hover:bg-indigo-50 transition-all"
              >
                {query}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white border-t border-gray-200 px-4 py-4">
        <div className="flex items-center space-x-3 max-w-4xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about hoardings, LED screens, or any outdoor media..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
            disabled={loading}
          />
          <button
            onClick={handleSubmit}
            disabled={loading || !input.trim()}
            className="bg-indigo-600 text-white rounded-full p-3 hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all shadow-md"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>

      {selectedMedia && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedMedia(null)}
        >
          <div 
            className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-gray-900">{selectedMedia.medianame}</h3>
              <button 
                onClick={() => setSelectedMedia(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
              >
                ×
              </button>
            </div>
            
            {selectedMedia.thumbnail && (
              <img 
                src={selectedMedia.thumbnail}
                alt={selectedMedia.medianame}
                className="w-full h-64 object-cover rounded-lg mb-4"
              />
            )}

            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Location:</span>
                <span className="font-semibold">{selectedMedia.location}, {selectedMedia.city_name}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Price:</span>
                <span className="font-semibold text-indigo-600">₹{selectedMedia.price?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Size:</span>
                <span className="font-semibold">{selectedMedia.size}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Illumination:</span>
                <span className="font-semibold">{selectedMedia.illumination}</span>
              </div>
              {selectedMedia.category_name && (
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Category:</span>
                  <span className="font-semibold">{selectedMedia.category_name}</span>
                </div>
              )}
            </div>

            <button 
              className="w-full mt-6 bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-all"
              onClick={() => alert('Booking functionality to be implemented')}
            >
              Book This Media
            </button>
          </div>
        </div>
      )}
    </div>
  );
}