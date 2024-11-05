#Tristan Sanford
#Senior Project: Book Dating App
#November 5, 2024
#V1.6

from fastapi import FastAPI
from supabase import create_client, Client
import os

db_url = str(os.environ.get('DATABASE_URL'))
db_key = str(os.environ.get('DATABASE_KEY'))

url = db_url
key = db_key
supabase: Client = create_client(url, key)

def recommendByTitle(title, numRecommendations=5):
    response = (
                supabase
                .table("similarity_scores")
                .select("*")
                .eq("title", f"{title.strip()}")
                .execute()
                .data
            )
    if response:
        # print(response[0]) #takes it down to the json
        # print(response[0]['title']) #selects main title queried
        # print(response[0]['similar_books']) #shows all similar books in a list
        # print(response[0]['similar_books'][1]) #selects the 2nd similar book/score pair
        # print(response[0]['similar_books'][1][1]) #selects the 2nd similar book's score
        
        similar_books = response[0]['similar_books']
        filtered_books = [book for book in similar_books if title.lower() not in book[0].lower()] #omit any books that have the title provided in the name
        recommendations = []

        for book in filtered_books[:numRecommendations]:
            matching_book = supabase.table("books").select("*").eq("title", f"{book[0].strip()}").execute().data
            if matching_book:
                matching_book = matching_book[0]
                recommendations.append({
                    "title": matching_book['title'],
                    "author": matching_book['author'],
                    "description": matching_book['description'],
                    "genres": matching_book['genres'],
                    "coverImg": matching_book['coverImg']
                })
        return recommendations
    else:
        print(f"'{title}' not found in the database.")
        return []

def recommendByGenre(genre, numRecommendations=5):
    matching_books = (
            supabase
            .table("books")
            .select("*")
            .ilike("genres", f"%{genre.strip()}%")
            .gte("likedPercent", 90)
            .order("likedPercent", desc=True)
            .range(0, numRecommendations-1)
            .execute()
            .data
        )
    
    if not matching_books:
        print(f"'{genre}' not found in the dataset.")
        return []
    
    #would be nice to include functionality for it to do num of 4 and 5 star ratings divided by total ratings for overall rating
    #right now, it only recommends the top 5 of that genre based on likedPercent (which I recognize could be a query as well) instead of including other metrics to be more nuanced
    return [{
        "title": book['title'],
        "author": book['author'],
        "description": book['description'],
        "genres": book['genres'],
        "coverImg": book['coverImg']
    } for book in matching_books]

#gets 5 recs for each genre, 5 for each title, and the top 5 overall based on likedPercent with no other attribute filtered
def getAllRecommendations(genres, titles, numRecommendationsPerSource=5):
    recommendations = []

    for genre in genres:
        recommendations.extend(recommendByGenre(genre, numRecommendationsPerSource))
    
    for title in titles:
        recommendations.extend(recommendByTitle(title, numRecommendationsPerSource))

    #same logic as genre
    topRatedBooks = (
            supabase
            .table("books")
            .select("*")
            .gte("likedPercent", 98)
            .order("likedPercent", desc=True)
            .range(0, numRecommendationsPerSource-1)
            .execute()
            .data
        )
    
    recommendations.extend([{
        "title": book['title'],
        "author": book['author'],
        "description": book['description'],
        "genres": book['genres'],
        "coverImg": book['coverImg']
    } for book in topRatedBooks])

    #remove duplicates (so if Dystopia returned Divergent and The Hunger Games returned Divergent, it would only return one Divergent) by converting dict to keys of frozenset (immutable) of tuples with values of each book dict; then back to list of values from the KV pair which is just each book dict/object
    #this weird workaround way is used because i need to keep the entire book dict intact with all of the extra attributes
    uniqueRecommendations = {frozenset(book.items()): book for book in recommendations}
    return list(uniqueRecommendations.values())

#local start command: py -m uvicorn recommendation:app --host 0.0.0.0 --port 8000
app = FastAPI()

@app.get("/recommendations/")
def getRecommendations(genres: str, titles: str):
    genres_list = genres.split(",")
    titles_list = titles.split(",")
    recommendations = getAllRecommendations(genres_list, titles_list)
    return {"recommendations": recommendations}