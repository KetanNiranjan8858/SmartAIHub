// src/components/SpamDetectionPage.jsx
import React, { useState } from 'react';
// Note: In a real app, the `checkSpam` function would call your ML backend API.

function SpamDetectionPage() {
  const [text, setText] = useState('');
  const [prediction, setPrediction] = useState(null); // null, 'spam', or 'ham'
  const [loading, setLoading] = useState(false);

  const checkSpam = async () => {
    if (text.trim() === '') {
      setPrediction(null);
      return;
    }

    setLoading(true);
    setPrediction(null);

    // --- Mock Backend Logic (Replace with real API call later) ---
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API delay
    
    // Simple mock logic: text with "free", "winner", or "buy now" is spam
    const lowerText = text.toLowerCase();
    let result = 'ham'; // Default to not spam
    
    if (lowerText.includes('free') || lowerText.includes('winner') || lowerText.includes('buy now')) {
        result = 'spam';
    }

    setPrediction(result);
    setLoading(false);
    // --- End Mock Backend Logic ---
  };

  // Helper to determine result display
  const getResultDisplay = () => {
    if (loading) {
      return <p className="prediction-loading">Analyzing message...</p>;
    }
    
    if (prediction === 'spam') {
      return (
        <div className="prediction-result spam">
          🚨 **Result: SPAM Detected** <p>This message has a high probability of being unsolicited or malicious.</p>
        </div>
      );
    }
    
    if (prediction === 'ham') {
      return (
        <div className="prediction-result ham">
          ✅ **Result: HAM (Not Spam)** <p>The message appears safe and legitimate.</p>
        </div>
      );
    }
    
    return <p className="prediction-placeholder">Enter your message or email content above and click 'Analyze' to begin.</p>;
  };

  return (
    <div className="spam-page-container">
      <div className="spam-content-box">
        <h2>🛡️ Email & Message Spam Detection</h2>
        <p className="page-description">Paste the content of an email or message below to check if our machine learning model classifies it as spam (malicious/unsolicited) or ham (safe/legitimate).</p>

        <div className="input-area">
          <label htmlFor="message-input">Message Content:</label>
          <textarea
            id="message-input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste your email subject or body content here..."
            rows="10"
            disabled={loading}
          ></textarea>
        </div>

        <button 
          className="analyze-button" 
          onClick={checkSpam} 
          disabled={loading || text.trim() === ''}
        >
          {loading ? 'Analyzing...' : 'Analyze Message'}
        </button>

        <div className="result-area">
          {getResultDisplay()}
        </div>
        
        <div className="note-section">
            <h4>How it Works</h4>
            <p>Our NLP model analyzes the text's linguistic features (keywords, structure, sentiment) to predict its classification.</p>
        </div>
      </div>
    </div>
  );
}

export default SpamDetectionPage;
