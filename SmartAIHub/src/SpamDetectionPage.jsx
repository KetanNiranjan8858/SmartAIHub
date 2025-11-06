// src/components/SpamDetectionPage.jsx
import React, { useState } from 'react';

// Define the backend API URL where Flask is running
const API_URL = 'http://localhost:5000/api/check_spam'; 

function SpamDetectionPage() {
  const [text, setText] = useState('');
  const [prediction, setPrediction] = useState(null); // null, 'spam', 'ham', or 'error'
  const [loading, setLoading] = useState(false);

  const checkSpam = async () => {
    if (text.trim() === '') {
      setPrediction(null);
      return;
    }

    setLoading(true);
    setPrediction(null);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Send the user's text data to the Flask endpoint
        body: JSON.stringify({ text: text }),
      });

      const data = await response.json();

      if (response.ok) {
        // Flask returns 'spam' or 'ham' in the 'classification' field
        setPrediction(data.classification); 
      } else {
        // Handle HTTP error status codes from the server (e.g., 400, 500)
        setPrediction('error'); 
        console.error("Server returned an error:", data.error || response.statusText);
      }

    } catch (error) {
      // Handle network issues (e.g., Flask server is not running)
      setPrediction('network_error'); 
      console.error("Network or Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Helper to determine result display based on state
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

    if (prediction === 'error') {
        return (
            <div className="prediction-result spam">
                ❌ **SERVER ERROR** <p>The backend service encountered an issue processing the request. Check the console for details.</p>
            </div>
        );
    }

    if (prediction === 'network_error') {
        return (
            <div className="prediction-result spam">
                ⚠️ **CONNECTION FAILED** <p>Could not connect to the SmartAIHub backend (http://localhost:5000). Ensure your Flask server is running.</p>
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
          className="analyze-button spam-analyze" 
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