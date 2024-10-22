#Tristan Sanford
#Senior Project: Book Dating App
#October 18, 2024
#V1.4

import pandas as pd
import pickle
from sklearn.metrics.pairwise import cosine_similarity
from fastapi import FastAPI
from supabase import create_client, Client

url: str = "database_url"
key: str = "database_key"
supabase: Client = create_client(url, key)

def fetchBooks(): #needed because supabase only returns 1000 records at a time; slowly builds the entire response; slow query and will eventually just create a new query/better logic instead of having to build the entire database in memory like this
    books = []
    limit = 1000
    offset = 0

    while True:
        response = (
            supabase
            .table("books")
            .select("*")
            .eq("language", "English")
            .range(offset, offset + limit - 1)
            .execute()
        )

        if response.data:
            books.extend(response.data)
            offset += limit
        else:
            break

    return books

data = fetchBooks()

with open("top_100_similar_books_full.pkl", "rb") as f: #generated from other python file
    top_similar_books = pickle.load(f)

with open("tfidf_matrix_full.pkl", "rb") as f: #unused right now
    tfidf_matrix = pickle.load(f)

#recommend based on title
def recommendByTitle(title, numRecommendations=5):
    if title in top_similar_books:
        similar_books = top_similar_books[title] #because top_similar_books file has 100 most similar books mapped to each book, simply pull the value and return them
        filtered_books = [book for book in similar_books if title.lower() not in book[0].lower()] #omit any books that have the title provided in the name

        recommendations = []
        for book in filtered_books[:numRecommendations]:
            #supabase.table("books").select("*").ilike("title", f"%{title.strip()}%").execute().data #potential query to use for matching the title;
            matching_book = next((b for b in data if b['title'] == book[0]), None) #literally searching through entire database to match book titles; very slow; will fix
            #alternatively, I could just change the generate Python file to include these attributes so I don't have to query the DB again to get them
            if matching_book:
                recommendations.append({
                    "title": matching_book['title'],
                    "author": matching_book['author'],
                    "description": matching_book['description'],
                    "genres": matching_book['genres'],
                    "coverImg": matching_book['coverImg']
                })
        return recommendations
    else:
        print(f"'{title}' not found in the dataset.")
        return []

def recommendByGenre(genre, numRecommendations=5):
    matching_books = [book for book in data if genre.lower() in book['genres'].lower()] #match any book that has the genre in its list

    if not matching_books:
        print(f"'{genre}' not found in the dataset.")
        return []
    
    #would be nice to include functionality for it to do num of 4 and 5 star ratings divided by total ratings for overall rating
    #right now, it only recommends the top 5 of that genre based on likedPercent (which I recognize could be a query as well) instead of including other metrics to be more nuanced
    matching_books = sorted(matching_books, key=lambda x: x['likedPercent'], reverse=True) #reverse for descending so it gives the top ones
    return [{
        "title": book['title'],
        "author": book['author'],
        "description": book['description'],
        "genres": book['genres'],
        "coverImg": book['coverImg']
    } for book in matching_books[:numRecommendations]]

#gets 5 recs for each genre, 5 for each title, and the top 5 overall based on likedPercent with no other attribute filtered
def getAllRecommendations(genres, titles, numRecommendationsPerSource=5):
    recommendations = []

    for genre in genres:
        recommendations.extend(recommendByGenre(genre, numRecommendationsPerSource))
    
    for title in titles:
        recommendations.extend(recommendByTitle(title, numRecommendationsPerSource))

    topRatedBooks = sorted(data, key=lambda x: x['likedPercent'], reverse=True) #same logic as genre
    recommendations.extend([{
        "title": book['title'],
        "author": book['author'],
        "description": book['description'],
        "genres": book['genres'],
        "coverImg": book['coverImg']
    } for book in topRatedBooks[:numRecommendationsPerSource]])

    #remove duplicates (so if Dystopia returned Divergent and The Hunger Games returned Divergent, it would only return one Divergent) by converting dict to keys of frozenset (immutable) of tuples with values of each book dict; then back to list of values from the KV pair which is just each book dict/object
    #this weird workaround way is used because i need to keep the entire book dict intact with all of the extra attributes
    uniqueRecommendations = {frozenset(book.items()): book for book in recommendations}
    return list(uniqueRecommendations.values())

# DEBUG
# all = [b['title'] for b in recommendByTitle("Divergent")]
# print(all)
# all = [b['title'] for b in recommendByGenre("Dystopia")]
# print(all)
# all = [b['title'] for b in getAllRecommendations(["Dystopia"],["The Hunger Games"])]
# print(all)

#local start command: py -m uvicorn recommendation:app --host 0.0.0.0 --port 8000
app = FastAPI()

@app.get("/recommendations/")
def getRecommendations(genres: str, titles: str):
    genres_list = genres.split(",")
    titles_list = titles.split(",")
    recommendations = getAllRecommendations(genres_list, titles_list)
    return {"recommendations": recommendations}