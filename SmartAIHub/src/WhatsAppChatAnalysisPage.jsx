// src/components/WhatsAppChatAnalysisPage.jsx
import React, { useState } from 'react';

function WhatsAppChatAnalysisPage() {
  const [file, setFile] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setAnalysis(null); // Reset analysis when file changes
  };

  const analyzeChat = async () => {
    if (!file) return;
    
    setLoading(true);
    setAnalysis(null);

    // --- INTEGRATION POINT: Replace Mock Backend Logic with API Call ---
    try {
      const formData = new FormData();
      // Important: The key 'chat_file' must match what your Python backend expects (e.g., request.files['chat_file'])
      formData.append('chat_file', file); 
      
      const response = await fetch('/api/analyze', { // <<< CHANGE THIS URL TO YOUR ACTUAL API ENDPOINT
        method: 'POST',
        body: formData,
        // Note: Do not set 'Content-Type' header manually for FormData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      // The Python script returns the JSON structure required by your frontend mock
      setAnalysis(result);

    } catch (error) {
      console.error("Analysis failed:", error);
      setAnalysis({ 
          totalMessages: 0, 
          activeUser: "ERROR", 
          topContact: "ERROR",
          messageCount: {}, 
          avgMsgLength: 0.0,
          error: String(error)
      });
    } finally {
      setLoading(false);
    }
    // --- End API Logic ---
  };

  const renderAnalysis = () => {
    if (loading) {
      return <p className="analysis-loading">Processing Chat Data... This might take a moment for large files.</p>;
    }
    if (analysis && analysis.error) {
        return <p className="analysis-error">Analysis Failed: {analysis.error}</p>;
    }
    if (!analysis) {
        return <p className="analysis-placeholder">Upload a WhatsApp chat file (.txt) to see your communication insights.</p>;
    }

    return (
      <div className="analysis-output">
        <h3>Chat Insights Report</h3>
        <div className="stats-grid">
            <div className="stat-box">
                <p className="stat-value">{analysis.totalMessages}</p>
                <p className="stat-label">Total Messages</p>
            </div>
            <div className="stat-box">
                <p className="stat-value">{analysis.activeUser}</p>
                <p className="stat-label">Most Active User (Inferred)</p>
            </div>
            <div className="stat-box">
                <p className="stat-value">{analysis.topContact}</p>
                <p className="stat-label">Top Contact</p>
            </div>
        </div>
        
        <h4>Message Distribution:</h4>
        <ul>
            {Object.entries(analysis.messageCount).map(([user, count]) => (
                <li key={user}>{user}: {count} messages ({((count / analysis.totalMessages) * 100).toFixed(1)}%)</li>
            ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="analysis-page-container">
      <div className="analysis-content-box">
        <h2>💬 WhatsApp Chat Analysis</h2>
        <p className="page-description">Upload your exported WhatsApp chat history file to get detailed metrics on communication volume and interaction patterns.</p>

        <div className="input-area file-upload-area">
          <label htmlFor="chat-file" className="file-label">
            {file ? `File Selected: ${file.name}` : 'Choose WhatsApp Chat File (.txt)'}
          </label>
          <input
            type="file"
            id="chat-file"
            accept=".txt"
            onChange={handleFileChange}
            disabled={loading}
          />
        </div>

        <button 
          className="analyze-button chat-analyze" 
          onClick={analyzeChat} 
          disabled={loading || !file}
        >
          {loading ? 'Analyzing...' : 'Generate Analysis'}
        </button>

        <div className="result-area analysis-result">
          {renderAnalysis()}
        </div>
      </div>
    </div>
  );
}

export default WhatsAppChatAnalysisPage;