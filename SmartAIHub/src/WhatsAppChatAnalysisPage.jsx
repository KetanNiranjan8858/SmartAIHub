// src/components/WhatsAppChatAnalysisPage.jsx
import React, { useState, useEffect } from 'react';
// import { Bar } from 'react-chartjs-2'; // Example: If you install chart.js and react-chartjs-2
// import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// If using Chart.js, register the components
// ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const API_URL = 'http://localhost:5000/api/analyze_chat';

function WhatsAppChatAnalysisPage() {
  const [file, setFile] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setAnalysis(null);
    setError(null);
  };

  const analyzeChat = async (e) => {
    e.preventDefault();

    if (!file) {
      setError("Please select a WhatsApp chat file (.txt) to analyze.");
      return;
    }

    setLoading(true);
    setAnalysis(null);
    setError(null);
    
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        body: formData, 
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setAnalysis(data);
      } else {
        setError(data.error || "Analysis failed. Ensure the file is a valid WhatsApp chat export.");
        setAnalysis(null);
      }
    } catch (err) {
      setError("Network Error: Could not reach the server (check Flask connection).");
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Placeholder for Chart.js data
  // const hourlyChartData = {
  //   labels: analysis?.hourlyDistribution.map(item => `${item.hour}:00`) || [],
  //   datasets: [{
  //     label: 'Messages per Hour',
  //     data: analysis?.hourlyDistribution.map(item => item.count) || [],
  //     backgroundColor: 'rgba(75, 192, 192, 0.6)',
  //   }],
  // };

  // const dailyChartData = {
  //   labels: analysis?.dailyDistribution.map(item => item.day) || [],
  //   datasets: [{
  //     label: 'Messages per Day',
  //     data: analysis?.dailyDistribution.map(item => item.count) || [],
  //     backgroundColor: 'rgba(153, 102, 255, 0.6)',
  //   }],
  // };


  const renderAnalysis = () => {
    if (loading) {
      return <p className="prediction-loading">Processing Chat Data... This may take a few moments for large files.</p>;
    }
    
    if (error) {
        return <div className="prediction-result spam">❌ **Error:** <p>{error}</p></div>
    }
    
    if (analysis && analysis.totalMessages > 0) {
        const messageCount = analysis.messageCount || {};
        const totalMessages = analysis.totalMessages;

        return (
          <div className="analysis-output">
            <h3>Chat Insights Report</h3>
            
            {/* Core Statistics Grid */}
            <div className="stats-grid">
                <div className="stat-box">
                    <p className="stat-value">{analysis.totalMessages.toLocaleString()}</p>
                    <p className="stat-label">Total Messages</p>
                </div>
                <div className="stat-box">
                    <p className="stat-value">{analysis.activeUser}</p>
                    <p className="stat-label">Most Active Participant</p>
                </div>
                <div className="stat-box">
                    <p className="stat-value">{analysis.avgMsgLength} chars</p>
                    <p className="stat-label">Avg. Message Length</p>
                </div>
                <div className="stat-box">
                    <p className="stat-value">{analysis.totalLinks.toLocaleString()}</p>
                    <p className="stat-label">Total Links Shared</p>
                </div>
            </div>
            
            {/* Message Distribution by User */}
            <h4>Message Distribution by Participant:</h4>
            <ul className="message-distribution-list">
                {Object.entries(messageCount).map(([user, count]) => (
                    <li key={user}>
                        <span>**{user}**:</span> <span>{count} messages</span> <span>({((count / totalMessages) * 100).toFixed(1)}%)</span>
                    </li>
                ))}
            </ul>

            {/* Top Emojis */}
            {analysis.topEmojis && analysis.topEmojis.length > 0 && (
                <div className="emoji-section">
                    <h4>Top Used Emojis:</h4>
                    <div className="emoji-list">
                        {analysis.topEmojis.map((item, index) => (
                            <span key={index} className="emoji-item">
                                {item.emoji} <span className="emoji-count">({item.count})</span>
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Visuals Placeholder */}
            <div className="visuals-section">
                <h4>Activity Over Time:</h4>
                <p className="visuals-note">*(Visualizations for hourly/daily activity would appear here, using a charting library.)*</p>
                
                {/* Example of how you'd use Chart.js if installed */}
                {/* <div className="chart-container">
                    <p>Messages by Hour of Day</p>
                    <Bar options={{ responsive: true, plugins: { legend: { display: false } } }} data={hourlyChartData} />
                </div>
                <div className="chart-container">
                    <p>Messages by Day of Week</p>
                    <Bar options={{ responsive: true, plugins: { legend: { display: false } } }} data={dailyChartData} />
                </div> */}
            </div>

          </div>
        );
    }

    return <p className="analysis-placeholder">Upload a WhatsApp chat file (.txt) to see your communication insights.</p>;
  };

  return (
    <div className="analysis-page-container">
      <div className="analysis-content-box">
        <h2>💬 WhatsApp Chat Analysis</h2>
        <p className="page-description">Upload your exported WhatsApp chat history file to get detailed metrics on communication volume, patterns, emojis, and links.</p>

        <form onSubmit={analyzeChat}>
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
              type="submit"
              disabled={loading || !file}
            >
              {loading ? 'Analyzing...' : 'Generate Analysis'}
            </button>
        </form>

        <div className="result-area analysis-result">
          {renderAnalysis()}
        </div>
        
        <div className="note-section">
            <h4>File Format Note</h4>
            <p>Ensure your chat is exported without media for the best message content analysis. Only `.txt` files are supported.</p>
        </div>
      </div>
    </div>
  );
}

export default WhatsAppChatAnalysisPage;