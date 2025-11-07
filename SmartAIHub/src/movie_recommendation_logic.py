# src/movie_recommendation_logic.py

# This file defines the core function used by Flask

def get_recommendation(title, movie_df, similarity_matrix):
    """
    Fetches the top 10 movie recommendations based on Cosine Similarity.
    
    Args:
        title (str): The movie title provided by the user.
        movie_df (pd.DataFrame): DataFrame containing movie titles and tags.
        similarity_matrix (np.array): Pre-calculated similarity matrix.
        
    Returns:
        list: A list of dictionaries, each containing a recommended movie's title and score.
    """
    if movie_df is None or similarity_matrix is None:
        return None # Indicate data failure

    try:
        # 1. Get the index of the movie title (case-insensitive lookup)
        idx_list = movie_df[movie_df['title'].str.lower() == title.lower()].index
        
        if len(idx_list) == 0:
            return [] # Movie not found
        
        idx = idx_list[0]
        
        # 2. Get similarity scores for the chosen movie
        distance = similarity_matrix[idx]
        
        # 3. Sort distances, skip index 0 (the movie itself), and take the next 10
        movies_tuple = sorted(
            list(enumerate(distance)), 
            reverse=True, 
            key=lambda x: x[1]
        )[1:11]

        # 4. Format results
        recommendations = []
        for i in movies_tuple:
            movie_title = movie_df.iloc[i[0]]['title'] 
            
            recommendations.append({
                "title": movie_title,
                "score": round(i[1], 3), # Similarity score
            })
            
        return recommendations
        
    except Exception as e:
        print(f"Recommendation calculation error: {e}")
        return None