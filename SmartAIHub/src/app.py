# src/app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib 
import os 
import re # NEW: Needed for WhatsApp regex
from collections import Counter # NEW: Needed for WhatsApp analysis
from datetime import datetime # NEW: Needed for WhatsApp analysis

# Import custom logic (must exist in src/movie_recommendation_logic.py)
try:
    from movie_recommendation_logic import get_recommendation
except ImportError:
    # Handle case where movie_recommendation_logic.py is not yet created
    def get_recommendation(*args, **kwargs):
        return []

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
    
    # Load Movie Data
    MOVIE_DF = joblib.load(os.path.join(BASE_DIR, 'movie_df.joblib'))
    SIMILARITY_MATRIX = joblib.load(os.path.join(BASE_DIR, 'similarity_matrix.joblib'))
    MOVIE_TITLES = MOVIE_DF['title'].str.lower().tolist()
    
    print("✅ All Models/Data loaded successfully.")
except Exception as e:
    print(f"❌ Error loading Models/Data: {e}")

# --- WHATSAPP CHAT ANALYSIS LOGIC (Integrated) ---

WHATSAPP_REGEX = re.compile(
    r'^(\d{2}/\d{2}/\d{4}),\s(\d{1,2}:\d{2}\s(?:am|pm))\s-\s([^:]+?):\s(.*)$',
    re.MULTILINE
)

def analyze_chat_data(file_content):
    """Parses raw chat file content and generates analytical metrics."""
    
    parsed_messages = []
    message_counts = Counter()
    total_chars = 0
    
    # Inner helper function for date parsing
    def parse_datetime_str(date_str, time_str):
        datetime_str = f"{date_str}, {time_str}"
        try:
            return datetime.strptime(datetime_str, '%d/%m/%Y, %I:%M %p')
        except ValueError:
            return None
    
    # --- Parsing Loop ---
    for match in WHATSAPP_REGEX.finditer(file_content):
        date_str, time_str, sender_raw, message_content = match.groups()
        
        sender = sender_raw.strip()
        message_content_clean = message_content.strip()
        
        # Filter out common non-message lines
        if message_content_clean in ["<Media omitted>", "This message was deleted"]:
            continue
            
        # Update tracking metrics
        message_counts[sender] += 1
        total_chars += len(message_content_clean)
        
        parsed_messages.append({
            "datetime": parse_datetime_str(date_str, time_str),
            "sender": sender,
            "message": message_content_clean
        })

    # --- Final Aggregation ---
    total_messages = len(parsed_messages)
    
    if not total_messages:
        return {"totalMessages": 0, "activeUser": "N/A", "messageCount": {}, "avgMsgLength": 0.0, "error": "No recognizable messages found."}

    avg_msg_length = total_chars / total_messages
    top_sender_name, top_count = message_counts.most_common(1)[0]
    sorted_message_count = dict(message_counts.most_common())

    return {
        "success": True,
        "totalMessages": total_messages,
        "activeUser": top_sender_name,
        "messageCount": sorted_message_count,
        "avgMsgLength": round(avg_msg_length, 2),
    }

# --- API Endpoints ---

@app.route('/')
def index():
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


# 2. WhatsApp Chat Analysis Endpoint (Feature 2: Integrated)
@app.route('/api/analyze_chat', methods=['POST'])
def analyze_chat():
    """Accepts an uploaded chat file and returns core statistics."""
    
    if 'file' not in request.files:
        return jsonify({"success": False, "error": "No file part in the request."}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({"success": False, "error": "No selected file."}), 400
    
    if file:
        try:
            # Read file content as string (assuming standard WhatsApp export encoding)
            file_content = file.read().decode('utf-8')
            
            # Process the content using the integrated logic
            analysis_results = analyze_chat_data(file_content)
            
            if "error" in analysis_results:
                 return jsonify({"success": False, "error": analysis_results["error"]}), 400

            return jsonify(analysis_results)

        except Exception as e:
            return jsonify({"success": False, "error": f"Internal analysis error: {e}"}), 500
    
    return jsonify({"success": False, "error": "Unknown error during file upload."}), 500

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
        sqft = float(data.get('sqft'))
        bedrooms = float(data.get('bedrooms'))
        bathrooms = float(data.get('bathrooms'))
        location = data.get('location')

        # Mock ML Logic
        predicted_value = (sqft * 150) + (bedrooms * 20000) + (bathrooms * 15000)
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