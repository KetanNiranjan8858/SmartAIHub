# movie_saver.py

import pandas as pd
import os 
import joblib # To save/load models and data
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from nltk.stem.porter import PorterStemmer

# --- Path Fix ---
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CSV_PATH = os.path.join(BASE_DIR, "IMDB_10000[1].csv")
# --- End Path Fix ---

# --- Data Loading and Cleaning ---
df = pd.read_csv(CSV_PATH)

df = df.rename(columns={'year': 'year_str', 'votes': 'votes_str'}) # Rename to avoid conflict after cleaning

df["rating"] = df["rating"].fillna(df["rating"].mean())
df["votes_str"] = pd.to_numeric(df["votes_str"].str.replace(",", "", regex=True))
df["votes_str"] = df["votes_str"].fillna(df["votes_str"].mean())
df["year_str"] = df["year_str"].ffill() # Using ffill() to fix FutureWarning
df["desc"] = df["desc"].fillna("Unknown")
df["genre"] = df["genre"].fillna("Unknown")
df = df.drop(columns=["certificate", "runtime"])
df = df.drop_duplicates()

# --- Feature Engineering (Same as your script) ---
df['desc'] = df['desc'].apply(lambda x: x.split())
df["genre"] = df["genre"].str.split(",").apply(lambda x: [g.strip() for g in x])
df["year_str"] = df["year_str"].str.split(",").apply(lambda x: [g.strip() for g in x])

# Convert numeric types to list of strings before concatenating
df["rating_list"] = df["rating"].apply(lambda x: [str(x)])
df["votes_list"] = df["votes_str"].apply(lambda x: [str(x)])

df['tag'] = df['year_str'] + df['genre'] + df['desc'] + df['rating_list'] + df['votes_list']
movie = df[['title', 'tag']].copy() # Use .copy() to avoid SettingWithCopyWarning

movie["tag"] = movie["tag"].apply(
    lambda x: " ".join([str(i) for i in x]) if isinstance(x, list) else str(x)
)
movie['tag'] = movie['tag'].apply(lambda x:x.lower())

# --- Text Vectorization and Stemming ---
ps = PorterStemmer()
def stem(text):
    return " ".join([ps.stem(i) for i in text.split()])

movie['tag'] = movie['tag'].apply(stem)

cv = CountVectorizer(max_features=5000, stop_words='english')
vector = cv.fit_transform(movie['tag']).toarray()
similarity = cosine_similarity(vector)

# --- 2. Save Essential Components ---
joblib.dump(movie, os.path.join(BASE_DIR, 'movie_df.joblib'))
joblib.dump(similarity, os.path.join(BASE_DIR, 'similarity_matrix.joblib'))

print("Movie recommendation components saved successfully.")