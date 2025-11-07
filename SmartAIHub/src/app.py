# src/app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib 
import os 
# Import the custom recommendation function (must exist in src/movie_recommendation_logic.py)
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
# 2. Movie Recommendation Data
MOVIE_DF = None
SIMILARITY_MATRIX = None
MOVIE_TITLES = [] 

try:
    # Load Spam Model
    SPAM_MODEL = joblib.load(os.path.join(BASE_DIR, 'spam_detection_model.joblib'))
    print("✅ Spam Detection Model loaded.")
    
    # Load Movie Data
    MOVIE_DF = joblib.load(os.path.join(BASE_DIR, 'movie_df.joblib'))
    SIMILARITY_MATRIX = joblib.load(os.path.join(BASE_DIR, 'similarity_matrix.joblib'))
    MOVIE_TITLES = MOVIE_DF['title'].str.lower().tolist()
    print("✅ Movie Recommendation Data and Titles loaded.")
except Exception as e:
    print(f"❌ Error loading Models/Data: {e}")

# --- API Endpoints ---

@app.route('/')
def index():
    """Simple health check endpoint."""
    return "SmartAIHub Backend API is running!"

# 1. Spam Detection Endpoint (Feature 1)
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


# 2. WhatsApp Chat Analysis Endpoint (Feature 2 - Placeholder)
@app.route('/api/analyze_chat', methods=['POST'])
def analyze_chat():
    return jsonify({
        "success": False, 
        "message": "Chat Analysis endpoint pending file upload and ML integration."
    }), 200

# 3. Auto-Suggest Search Endpoint (Movie)
@app.route('/api/search_movies', methods=['POST'])
def search_movies():
    data = request.get_json()
    partial_title = data.get('partial_title', '').strip().lower()
    
    if len(partial_title) < 2: 
        return jsonify({"suggestions": [], "success": True}), 200
    
    if not MOVIE_TITLES:
        return jsonify({"success": False, "error": "Movie title list not available."}), 500

    suggestions = [
        title 
        for title in MOVIE_TITLES 
        if title.startswith(partial_title)
    ][:10]

    return jsonify({"suggestions": suggestions, "success": True})

# 4. Movie Recommendation Endpoint (Feature 3)
@app.route('/api/recommend_movies', methods=['POST'])
def recommend_movies():
    data = request.get_json()
    title = data.get('title', '').strip()
    
    if not title:
        return jsonify({"success": False, "error": "No movie title provided."}), 400
    
    if MOVIE_DF is None or SIMILARITY_MATRIX is None:
        return jsonify({"success": False, "error": "Movie data is not loaded on the server."}), 500

    recommendations = get_recommendation(title, MOVIE_DF, SIMILARITY_MATRIX)
    
    if recommendations is None:
        return jsonify({"success": False, "error": "Failed to calculate recommendations due to internal error."}), 500
    
    return jsonify({
        "success": True, 
        "recommendations": recommendations,
        "message": f"Recommendations for '{title}' retrieved successfully."
    })

# 5. House Price Prediction Endpoint (Feature 4 - Mock Logic)
@app.route('/api/predict_price', methods=['POST'])
def predict_price():
    """Accepts house features and returns a predicted price (MOCK)."""
    data = request.get_json()
    
    required_keys = ['sqft', 'bedrooms', 'bathrooms', 'location']
    if not all(k in data for k in required_keys):
         return jsonify({"success": False, "error": "Missing required features."}), 400

    try:
        # Mock ML Logic
        sqft = float(data.get('sqft'))
        bedrooms = float(data.get('bedrooms'))
        bathrooms = float(data.get('bathrooms'))
        location = data.get('location')

        # Simple calculation
        predicted_value = (sqft * 150) + (bedrooms * 20000) + (bathrooms * 15000)
        
        # Location adjustment
        adjustment = 1.3 if location == 'Suburb A' else (1.1 if location == 'Suburb B' else 0.9)
        final_prediction = round((predicted_value * adjustment) / 1000) * 1000

        return jsonify({
            "success": True,
            "prediction": final_prediction,
            "message": "Price estimated using mock regression model."
        })
        
    except ValueError:
        return jsonify({"success": False, "error": "Invalid numeric input received."}), 400
    except Exception as e:
        return jsonify({"success": False, "error": f"Internal server error: {e}"}), 500


if __name__ == '__main__':
    app.run(debug=True, port=5000)