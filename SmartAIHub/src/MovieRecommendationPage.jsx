// src/components/MovieRecommendationPage.jsx
import React, { useState, useCallback } from 'react';

const RECOMMEND_API_URL = 'http://localhost:5000/api/recommend_movies'; 
const SEARCH_API_URL = 'http://localhost:5000/api/search_movies'; 

function MovieRecommendationPage() {
  const [movieTitle, setMovieTitle] = useState('');
  const [suggestions, setSuggestions] = useState([]); 
  const [recommendations, setRecommendations] = useState(null); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Debounce utility function to limit API calls during typing
  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
  };

  // Function to fetch suggestions from Flask
  const fetchSuggestions = async (term) => {
    if (term.length < 2) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await fetch(SEARCH_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ partial_title: term }),
      });
      const data = await response.json();
      
      if (response.ok && data.success) {
        setSuggestions(data.suggestions);
      } else {
        setSuggestions([]);
      }
    } catch (e) {
      // Typically silent errors here unless the API is down
      setSuggestions([]);
    }
  };

  // Debounced version of the fetch function, runs 300ms after user stops typing
  const debouncedFetchSuggestions = useCallback(debounce(fetchSuggestions, 300), []);


  const handleInputChange = (e) => {
    const term = e.target.value;
    setMovieTitle(term);
    
    setRecommendations(null);
    setError(null);

    // Trigger debounced suggestion fetch
    debouncedFetchSuggestions(term);
  };

  const handleSelectSuggestion = (title) => {
      // Set the full title (converted to display case) and clear the suggestions
      setMovieTitle(title.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')); 
      setSuggestions([]); 
  };

  const getRecommendations = async () => {
    if (movieTitle.trim() === '') {
      setRecommendations(null);
      return;
    }
    setLoading(true);
    setRecommendations(null);
    setError(null);
    setSuggestions([]); 

    try {
      const response = await fetch(RECOMMEND_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: movieTitle }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setRecommendations(data.recommendations); 
      } else {
        setError(data.error || data.message || 'Could not find recommendations.');
        setRecommendations([]);
      }
    } catch (err) {
      setError("Network Error: Could not reach the recommendation engine.");
      setRecommendations([]);
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
                {movie.score ? <span style={{marginLeft: '10px'}}>(Similarity: {movie.score})</span> : ''}
              </li>
            ))}
          </ul>
        </div>
      );
    }
    
    if (recommendations && recommendations.length === 0) {
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
            onChange={handleInputChange} 
            placeholder="e.g., The Dark Knight, Inception"
            disabled={loading}
          />
          
          {/* Suggestions Dropdown */}
          {suggestions.length > 0 && (
            <ul className="suggestions-list">
              {suggestions.map((title, index) => (
                <li key={index} onClick={() => handleSelectSuggestion(title)}>
                  {title}
                </li>
              ))}
            </ul>
          )}
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