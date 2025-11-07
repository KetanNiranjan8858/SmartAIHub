// src/components/HousePricePredictionPage.jsx
import React, { useState } from 'react';

// Define the backend API URL (Need to implement this endpoint in Flask!)
const API_URL = 'http://localhost:5000/api/predict_price'; 

function HousePricePredictionPage() {
  const [formData, setFormData] = useState({
    sqft: 1500,
    bedrooms: 3,
    bathrooms: 2,
    location: 'Suburb A',
  });
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'sqft' || name === 'bedrooms' || name === 'bathrooms' ? parseFloat(value) : value }));
    setPrediction(null); // Reset prediction on input change
    setError(null);
  };

  const predictPrice = async (e) => {
    e.preventDefault();
    
    setLoading(true);
    setPrediction(null);
    setError(null);

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (response.ok && data.success) {
            const formattedPrice = parseFloat(data.prediction).toLocaleString('en-US');
            setPrediction(formattedPrice);
        } else {
            setError(data.error || "Prediction failed. Check backend console for details.");
            setPrediction(null);
        }
    } catch (err) {
        setError("Network Error: Could not reach the price prediction server.");
        console.error("Fetch Error:", err);
    } finally {
        setLoading(false);
    }
  };

  const getResultDisplay = () => {
    if (loading) {
      return <p className="prediction-loading">Calculating Market Value...</p>;
    }
    if (error) {
        return <div className="prediction-result spam">❌ **Error:** <p>{error}</p></div>;
    }
    if (prediction) {
      return (
        <div className="prediction-result house-prediction">
          💰 **Predicted Value:** ${prediction}
          <p>This is the estimated market price based on the inputs.</p>
        </div>
      );
    }
    return <p className="prediction-placeholder">Fill in the details and click 'Predict Price' to get an estimate.</p>;
  };

  return (
    <div className="prediction-page-container">
      <div className="prediction-content-box">
        <h2>🏠 House Price Prediction</h2>
        <p className="page-description">Estimate the fair market value of a property using our trained house price regression model.</p>

        <form onSubmit={predictPrice} className="input-form">
          
          <div className="input-group">
            <label htmlFor="sqft">Square Footage (SqFt)</label>
            <input type="number" id="sqft" name="sqft" value={formData.sqft} onChange={handleChange} required min="100" disabled={loading} />
          </div>
          
          <div className="input-group">
            <label htmlFor="bedrooms">Bedrooms</label>
            <input type="number" id="bedrooms" name="bedrooms" value={formData.bedrooms} onChange={handleChange} required min="1" disabled={loading} />
          </div>
          
          <div className="input-group">
            <label htmlFor="bathrooms">Bathrooms</label>
            <input type="number" id="bathrooms" name="bathrooms" value={formData.bathrooms} onChange={handleChange} required min="1" step="0.5" disabled={loading} />
          </div>
          
          <div className="input-group">
            <label htmlFor="location">Location Zone</label>
            <select id="location" name="location" value={formData.location} onChange={handleChange} disabled={loading}>
              <option value="Suburb A">Suburb A (High Value)</option>
              <option value="Suburb B">Suburb B (Mid Value)</option>
              <option value="Suburb C">Suburb C (Lower Value)</option>
            </select>
          </div>
          
          <button 
            type="submit" 
            className="analyze-button predict-button" 
            disabled={loading}
          >
            {loading ? 'Predicting...' : 'Predict Price'}
          </button>
        </form>

        <div className="result-area prediction-result-area">
          {getResultDisplay()}
        </div>
      </div>
    </div>
  );
}

export default HousePricePredictionPage;