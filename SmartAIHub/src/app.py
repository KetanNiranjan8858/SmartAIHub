# src/app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib 
import os 
import numpy as np
# Import the custom recommendation function
from movie_recommendation_logic import get_recommendation 

# --- Setup ---
app = Flask(__name__)

# Allow CORS for React/Vite development server (port 5173)
CORS(app, resources={r"/api/*": {"origins": [
    "http://localhost:5173",  
    "http://127.0.0.1:5173"
]}}) 

# --- Global Model and Data Loading ---

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# 1. Spam Detection Model
SPAM_MODEL = None
try:
    SPAM_MODEL = joblib.load(os.path.join(BASE_DIR, 'spam_detection_model.joblib'))
    print("✅ Spam Detection Model loaded.")
except Exception as e:
    print(f"❌ Error loading Spam Model: {e}")

# 2. Movie Recommendation Data
MOVIE_DF = None
SIMILARITY_MATRIX = None
try:
    MOVIE_DF = joblib.load(os.path.join(BASE_DIR, 'movie_df.joblib'))
    SIMILARITY_MATRIX = joblib.load(os.path.join(BASE_DIR, 'similarity_matrix.joblib'))
    print("✅ Movie Recommendation Data loaded.")
except Exception as e:
    print(f"❌ Error loading Movie Data: {e}")

# --- API Endpoints ---

@app.route('/')
def index():
    """Simple health check endpoint."""
    return "SmartAIHub Backend API is running!"

# 1. Spam Detection Endpoint
@app.route('/api/check_spam', methods=['POST'])
def check_spam():
    if SPAM_MODEL is None:
        return jsonify({"success": False, "error": "Spam Model not loaded."}), 500
    
    data = request.get_json()
    text_to_check = data.get('text', '')
    
    if not text_to_check:
        return jsonify({"success": False, "error": "No text provided"}), 400

    try:
        prediction_result = SPAM_MODEL.predict([text_to_check]) 
        classification = "spam" if prediction_result[0] == 1 else "ham"
        return jsonify({"classification": classification, "success": True})
    except Exception as e:
        return jsonify({"success": False, "error": f"Prediction failed: {e}"}), 500


# 2. Placeholder Endpoint for WhatsApp Chat Analysis
@app.route('/api/analyze_chat', methods=['POST'])
def analyze_chat():
    """Placeholder for WhatsApp chat file upload and analysis."""
    # This remains a placeholder pending file upload logic integration
    return jsonify({
        "success": False, 
        "message": "Chat Analysis endpoint pending file upload and ML integration."
    }), 200

# 3. Movie Recommendation Endpoint
@app.route('/api/recommend_movies', methods=['POST'])
def recommend_movies():
    """Endpoint for the Movie Recommendation System."""
    data = request.get_json()
    title = data.get('title', '').strip()
    
    if not title:
        return jsonify({"success": False, "error": "No movie title provided."}), 400
    
    # Check if data was loaded successfully on server startup
    if MOVIE_DF is None or SIMILARITY_MATRIX is None:
        return jsonify({"success": False, "error": "Movie data is not loaded on the server."}), 500

    # Call the imported logic function
    recommendations = get_recommendation(title, MOVIE_DF, SIMILARITY_MATRIX)
    
    if recommendations is None:
        return jsonify({"success": False, "error": "Failed to calculate recommendations due to internal error."}), 500
    
    if len(recommendations) == 0:
        return jsonify({"success": True, "recommendations": [], "message": f"Movie '{title}' not found in the database."})

    return jsonify({
        "success": True, 
        "recommendations": recommendations,
        "message": f"Recommendations for '{title}' retrieved successfully."
    })


if __name__ == '__main__':
    app.run(debug=True, port=5000)