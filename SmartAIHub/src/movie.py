import pandas as pd
import os # <-- ADD THIS IMPORT

# Get the directory where the current script (movie.py) is located
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Construct the full path to the CSV file, assuming it's in the same folder
CSV_PATH = os.path.join(BASE_DIR, "IMDB_10000[1].csv")

# Read the file using the full, explicit path
df = pd.read_csv(CSV_PATH)

df.head()

df.info()

df.isnull().sum()

df.describe()

df = df.drop(columns=["certificate","runtime"])

df.isnull().sum()
df["rating"] = df["rating"].fillna(df["rating"].mean())

df["votes"].unique()

df["votes"] = pd.to_numeric(df["votes"].str.replace(",", "", regex=True))

df["votes"] = df["votes"].fillna(df["votes"].mean())

df["year"] = df["year"].fillna(method="ffill")

df["desc"] = df["desc"].fillna("Unknown")

df["genre"] = df["genre"].fillna("Unknown")

df.duplicated().sum()

df = df.drop_duplicates()

df['desc'][0]

df['desc']=df['desc'].apply(lambda x:x.split())

df["genre"] = df["genre"].str.split(",").apply(lambda x: [g.strip() for g in x])

df["year"] = df["year"].str.split(",").apply(lambda x: [g.strip() for g in x])

df["rating"] = df["rating"].apply(lambda x: [x])

df["votes"] = df["votes"].apply(lambda x: [x])

df['tag']=df['year'] + df['genre'] + df['desc'] + df['rating'] + df['votes']

movie = df[['title', 'tag']]

movie["tag"] = movie["tag"].apply(
    lambda x: " ".join([str(i) for i in x]) if isinstance(x, list) else str(x)
)

movie['tag']=movie['tag'].apply(lambda x:x.lower())

from sklearn.feature_extraction.text import CountVectorizer
cv=CountVectorizer(max_features=5000, stop_words='english')

vector = cv.fit_transform(movie['tag']).toarray()
vector[10]

cv.get_feature_names_out()

from nltk.stem.porter import PorterStemmer

ps = PorterStemmer()

def stem(text):
    y=[]
    for i in text.split():
        y.append(ps.stem(i))
    return " ".join(y)

movie['tag'].apply(stem)

len(vector[0])

from sklearn.metrics.pairwise import cosine_similarity

similarity=cosine_similarity(vector)

def get_recommendation(title):
    #get the index of movie 
    idx = movie[movie['title'] == title].index[0]
    
    #Look into cosind distance between title and other movies
    distance = similarity[idx]
    
    #Sort the distances to fetch movies with high similarity  , exclude index 0 as it is same movie
    movies = sorted(list(enumerate(distance)),reverse= True, key= lambda x:x[1] )[2:12]
    
    #We will get a tuple containing movie index and similarity score, Take the index and find movie name
    for i in movies:
        print(df.iloc[i[0]].title)
        
print(get_recommendation('Mili'))