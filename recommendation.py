#Tristan Sanford
#Senior Project: Book Dating App
#November 15, 2024
#V2.1

from fastapi import FastAPI, HTTPException
from supabase import create_client, Client
from pydantic import BaseModel
import os
import bcrypt
import uuid

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

        for book in filtered_books[:numRecommendations]: #get necessary information about the recommended book from book db and add to list
            matching_book = supabase.table("books").select("*").eq("title", f"{book[0].strip()}").execute().data
            if matching_book:
                matching_book = matching_book[0]
                recommendations.append({
                    "title": matching_book['title'],
                    "author": matching_book['author'],
                    "description": matching_book['description'],
                    "genres": matching_book['genres'],
                    "coverImg": matching_book['coverImg'],
                    "bookId": matching_book['bookId']
                })
        return recommendations
    else:
        print(f"'{title}' not found in the database.")
        return []

def recommendByGenre(genre, numRecommendations=5):
    matching_books = ( #basic query matching from likedPercent
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
        "coverImg": book['coverImg'],
        "bookId": book['bookId']
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
        "coverImg": book['coverImg'],
        "bookId": book['bookId']
    } for book in topRatedBooks])

    #remove duplicates (so if Dystopia returned Divergent and The Hunger Games returned Divergent, it would only return one Divergent) by converting dict to keys of frozenset (immutable) of tuples with values of each book dict; then back to list of values from the KV pair which is just each book dict/object
    #this weird workaround way is used because i need to keep the entire book dict intact with all of the extra attributes
    uniqueRecommendations = {frozenset(book.items()): book for book in recommendations}
    return list(uniqueRecommendations.values())

#pydantic classes for api input validation
class UserRegister(BaseModel):
    username: str
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

class TBR(BaseModel):
    user_id: str
    book_id: str

class Title(BaseModel):
    user_id: str
    title: str

class Genre(BaseModel):
    user_id: str
    genre: str

#local start command: py -m uvicorn recommendation:app --host 0.0.0.0 --port 8000
app = FastAPI()

@app.post("/register/")
def register(user: UserRegister):
    hashedPassword = bcrypt.hashpw(user.password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8') #hash password using bcrypt

    try:
        response = supabase.table("users").insert({ #new user
            "user_id": str(uuid.uuid4()),
            "username": user.username,
            "password_hash": hashedPassword
        }).execute()
    except:
        raise HTTPException(status_code=400, detail="User already exists")

    if not response.data:
        raise HTTPException(status_code=400, detail="User already exists")
    
    return {"message": "User registered successfully"}

@app.post("/login/")
def login(user: UserLogin):
    response = supabase.table("users").select("*").eq("username", user.username).execute()
    userData = response.data[0] if response.data else None

    if not userData or not bcrypt.checkpw(user.password.encode('utf-8'), userData['password_hash'].encode('utf-8')): #check password with bcrypt
        raise HTTPException(status_code=400, detail="Invalid credentials")
    
    return {"message": "Login successful", "user_id": userData['user_id']}

@app.post("/tbr/add/") #add book to TBR list
def addToTBR(item: TBR):
    check = supabase.table("tbr_list").select("*").eq("user_id", item.user_id).eq("book_id", item.book_id).execute().data
    if check:
        return {"message": "Book already added to TBR list"}
    
    response = supabase.table("tbr_list").insert({
        "tbr_id": str(uuid.uuid4()),
        "user_id": item.user_id,
        "book_id": item.book_id,
    }).execute()

    if not response.data:
        raise HTTPException(status_code=400, detail="Error adding book to TBR list")
    
    return {"message": "Book added to TBR list"}

@app.post("/tbr/remove/") #remove book from TBR list
def removeFromTBR(item: TBR):
    response = supabase.table("tbr_list").delete().match({
        "user_id": item.user_id,
        "book_id": item.book_id,
    }).execute()

    if not response.data:
        raise HTTPException(status_code=400, detail="Error removing book from TBR list")
    
    return {"message": "Book removed from TBR list"}

@app.get("/tbr/view/") #view TBR list
def viewTBR(user_id: str):
    output = [] #tbr_list only stores bookid, this code grabs necessary information from book table
    result = supabase.table("tbr_list").select("book_id").eq("user_id", str(user_id)).execute()
    for bookEntry in result.data:
        book = supabase.table("books").select("*").eq("bookId", f"{bookEntry['book_id'].strip()}").execute().data
        if book:
            book = book[0]
            output.append({
                "title": book['title'],
                "author": book['author'],
                "description": book['description'],
                "genres": book['genres'],
                "coverImg": book['coverImg'],
                "bookId": book['bookId']
            })
    return {"tbr_list": output}

@app.get("/preferences/") #get preferences
def getPreferences(user_id: str):
    response = supabase.table("users").select("preferred_titles", "preferred_genres").eq("user_id", user_id).execute()

    if not response.data:
        raise HTTPException(status_code=400, detail="Error fetching preferences")
    
    preferences = response.data[0] if response.data else {"preferred_titles": [], "preferred_genres": []}

    return {"preferences": preferences}

@app.post("/preferences/add-title/") #add favorite title
def addTitle(payload: Title): 
    response = supabase.table("users").select("preferred_titles").eq("user_id", payload.user_id).execute()
    if not response.data:
        raise HTTPException(status_code=400, detail="User not found")

    titles = response.data[0].get("preferred_titles") or []
    titles.append(payload.title)
    supabase.table("users").update({"preferred_titles": titles}).eq("user_id", payload.user_id).execute()
    return {"message": "Title added"}

@app.post("/preferences/add-genre/") #add favorite genre
def addGenre(payload: Genre):
    response = supabase.table("users").select("preferred_genres").eq("user_id", payload.user_id).execute()
    if not response.data:
        raise HTTPException(status_code=400, detail="User not found")

    genres = response.data[0].get("preferred_genres") or []
    genres.append(payload.genre)
    supabase.table("users").update({"preferred_genres": genres}).eq("user_id", payload.user_id).execute()
    return {"message": "Genre added"}

@app.post("/preferences/delete-title/") #remove title
def deleteTitle(payload: Title):
    response = supabase.table("users").select("preferred_titles").eq("user_id", payload.user_id).execute()
    if not response.data:
        raise HTTPException(status_code=400, detail="User not found")

    titles = response.data[0].get("preferred_titles") or []
    titles.remove(payload.title)
    supabase.table("users").update({"preferred_titles": titles}).eq("user_id", payload.user_id).execute()
    return {"message": "Title deleted"}

@app.post("/preferences/delete-genre/") #remove genre
def deleteGenre(payload: Genre):
    response = supabase.table("users").select("preferred_genres").eq("user_id", payload.user_id).execute()
    if not response.data:
        raise HTTPException(status_code=400, detail="User not found")

    genres = response.data[0].get("preferred_genres") or []
    genres.remove(payload.genre)
    supabase.table("users").update({"preferred_genres": genres}).eq("user_id", payload.user_id).execute()
    return {"message": "Genre deleted"}

@app.get("/recommendations/") #get recommendations
def getRecommendations(genres: str, titles: str):
    genres_list = genres.split(",") if genres else []
    titles_list = titles.split(",") if titles else []

    recommendations = getAllRecommendations(genres_list, titles_list)
    return {"recommendations": recommendations}