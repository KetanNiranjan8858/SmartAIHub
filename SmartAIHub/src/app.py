# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib 
import os 
import numpy as np 
# Note: pandas is implicitly handled by joblib if used in the model, but 
# we won't import it here unless needed for raw data processing later.

# --- Setup ---
app = Flask(__name__)

# FIX: Allow requests from the Vite development server (port 5173)
CORS(app, resources={r"/api/*": {"origins": [
    "http://localhost:5173",  # Your React/Vite frontend
    "http://127.0.0.1:5173"
]}}) 

# --- 1. Load the Spam Detection Model Globally on Server Startup ---
MODEL = None
try:
    # --- Robust Path Fix ---
    # Get the directory where app.py resides (SmartAIHub/src/)
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    # Construct the full path to the model file
    MODEL_PATH = os.path.join(BASE_DIR, 'spam_detection_model.joblib')
    # --- End Path Fix ---
    
    MODEL = joblib.load(MODEL_PATH)
    print("✅ Spam Detection Model loaded successfully.")
except Exception as e:
    print(f"❌ Error loading model: {e}")


# --- API Endpoints ---

@app.route('/')
def index():
    """Simple health check endpoint."""
    return "SmartAIHub Backend API is running!"

# 1. Spam Detection Endpoint (Feature 1: Integrated)
@app.route('/api/check_spam', methods=['POST'])
def check_spam():
    """Accepts text and returns 'spam' (1) or 'ham' (0) prediction."""
    if MODEL is None:
        return jsonify({"error": "Machine Learning model failed to load on server."}), 500

    data = request.get_json()
    text_to_check = data.get('text', '')
    
    if not text_to_check:
        return jsonify({"error": "No text provided"}), 400

    try:
        # Predict: Model expects a list of strings
        prediction_result = MODEL.predict([text_to_check]) 
        
        # Convert prediction array ([1] or [0]) to string ('spam' or 'ham')
        classification = "spam" if prediction_result[0] == 1 else "ham"
        
        return jsonify({
            "classification": classification,
            "success": True
        })
    except Exception as e:
        print(f"Prediction error: {e}")
        return jsonify({"error": f"Prediction failed due to model issue: {e}"}), 500


# 2. Placeholder Endpoint for WhatsApp Chat Analysis (Feature 2)
@app.route('/api/analyze_chat', methods=['POST'])
def analyze_chat():
    """Placeholder for WhatsApp chat file upload and analysis."""
    # This endpoint needs to be updated to handle file uploads (request.files)
    # and then process the text content.
    return jsonify({
        "success": False, 
        "message": "Chat Analysis endpoint pending file upload and ML integration."
    }), 200

# 3. Placeholder Endpoint for House Price Prediction (Feature 3)
@app.route('/api/predict_price', methods=['POST'])
def predict_price():
    """Placeholder for House Price Prediction based on features."""
    data = request.get_json()
    
    # Mock validation for inputs expected by the frontend:
    if not all(k in data for k in ['sqft', 'bedrooms', 'bathrooms', 'location']):
         return jsonify({"error": "Missing required house features (sqft, bedrooms, etc.)."}), 400

    # Mock success for structure testing
    return jsonify({
        "success": False, 
        "message": "Price Prediction endpoint pending model integration.",
        "received_data": data
    }), 200


if __name__ == '__main__':
    # Flask runs on port 5000 by default.
    app.run(debug=True, port=5000)