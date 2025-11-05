// src/components/HousePricePredictionPage.jsx
import React, { useState } from 'react';

function HousePricePredictionPage() {
  const [formData, setFormData] = useState({
    sqft: 1500,
    bedrooms: 3,
    bathrooms: 2,
    location: 'Suburb A',
  });
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'sqft' || name === 'bedrooms' || name === 'bathrooms' ? parseFloat(value) : value }));
    setPrediction(null); // Reset prediction on input change
  };

  const predictPrice = async (e) => {
    e.preventDefault();
    
    setLoading(true);
    setPrediction(null);

    // --- Mock Backend Logic (Replace with ML API call) ---
    await new Promise(resolve => setTimeout(resolve, 1800)); // Simulate API delay
    
    // Mock calculation based on size: Base price + feature adjustment
    const basePrice = 150000;
    const sqftFactor = formData.sqft * 120; // $120/sqft
    const bedFactor = formData.bedrooms * 15000;
    const locationAdjustment = formData.location === 'Suburb A' ? 50000 : 20000;

    const predicted = basePrice + sqftFactor + bedFactor + locationAdjustment;
    // Format to nearest thousand for a clean prediction
    const formattedPrediction = Math.round(predicted / 1000) * 1000;
    
    setPrediction(formattedPrediction.toLocaleString('en-US'));
    setLoading(false);
    // --- End Mock Backend Logic ---
  };

  const getResultDisplay = () => {
    if (loading) {
      return <p className="prediction-loading">Calculating Market Value...</p>;
    }
    if (prediction) {
      return (
        <div className="prediction-result house-prediction">
          💰 **Predicted Value:** ${prediction}
          <p>Based on the data entered, this is the estimated market price.</p>
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
            className="predict-button" 
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