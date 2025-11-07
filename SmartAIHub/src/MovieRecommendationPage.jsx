// src/components/MovieRecommendationPage.jsx
import React, { useState } from 'react';

// Define the backend API URL
const API_URL = 'http://localhost:5000/api/recommend_movies'; 

function MovieRecommendationPage() {
  const [movieTitle, setMovieTitle] = useState('');
  const [recommendations, setRecommendations] = useState(null); // null, list of movie objects, or []
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getRecommendations = async () => {
    if (movieTitle.trim() === '') {
      setRecommendations(null);
      setError(null);
      return;
    }

    setLoading(true);
    setRecommendations(null);
    setError(null);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Send the user's movie title to Flask
        body: JSON.stringify({ title: movieTitle }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setRecommendations(data.recommendations); 
      } else {
        // Handle API error messages from Flask
        setError(data.error || data.message || 'Could not find recommendations.');
        setRecommendations([]);
      }

    } catch (err) {
      // Handle network failure or CORS issues
      setError("Network Error: Could not reach the recommendation engine (check Flask server and CORS).");
      setRecommendations([]);
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const renderRecommendations = () => {
    if (loading) {
      return <p className="recommendation-loading">Searching for similar movies...</p>;
    }
    
    if (error) {
        return <div className="prediction-result spam">❌ **Error:** <p>{error}</p></div>
    }
    
    if (recommendations && recommendations.length > 0) {
      return (
        <div className="recommendation-list">
          <h3>Top {recommendations.length} Recommendations:</h3>
          <ul>
            {recommendations.map((movie, index) => (
              <li key={index}>
                <strong>{movie.title}</strong> 
                {/* Display score if available, otherwise just title */}
                {movie.score ? <span style={{marginLeft: '10px'}}>(Similarity: {movie.score})</span> : ''}
              </li>
            ))}
          </ul>
        </div>
      );
    }
    
    if (recommendations && recommendations.length === 0) {
        // Error state handled above, this is the "not found" state
        return <p className="recommendation-placeholder">No recommendations found. Try checking your spelling or a more popular title.</p>;
    }
    
    return <p className="recommendation-placeholder">Enter a movie title to get personalized recommendations.</p>;
  };

  return (
    <div className="movie-page-container">
      <div className="movie-content-box">
        <h2>🎬 Movie Recommendation System</h2>
        <p className="page-description">Find movies similar to your favorites using content-based filtering based on plot, genre, and keywords.</p>

        <div className="input-area movie-input-area">
          <label htmlFor="movie-input">Enter a Movie Title:</label>
          <input
            id="movie-input"
            type="text"
            value={movieTitle}
            onChange={(e) => setMovieTitle(e.target.value)}
            placeholder="e.g., The Dark Knight, Inception"
            disabled={loading}
          />
        </div>

        <button 
          className="analyze-button movie-recommend-button" 
          onClick={getRecommendations} 
          disabled={loading || movieTitle.trim() === ''}
        >
          {loading ? 'Finding...' : 'Get Recommendations'}
        </button>

        <div className="result-area recommendation-result-area">
          {renderRecommendations()}
        </div>
        
        <div className="note-section">
            <h4>How it Works</h4>
            <p>The system calculates the **Cosine Similarity** between your input movie's features (keywords, genre, description) and all other movies in the database.</p>
        </div>
      </div>
    </div>
  );
}

export default MovieRecommendationPage;