#Tristan Sanford
#Senior Project: Book Dating App
#September 27, 2024
#V1.0

"""
File Description: This file contains the recommendation algorithms

Global Variables
-----------------
data: dataframe
    a dataframe of books 

Functions
---------
recommendByTitle()
    returns a list of recommended books based on title
recommendByFeature()
    returns a list of recommended books based on feature
compareTwoBooks()
    Helper method that returns the cosine similarity of two books
"""
import pandas as pd
import pickle
from sklearn.metrics.pairwise import cosine_similarity

data = pd.read_csv("books_1.Best_Books_ever.csv") #read csv with pandas
data = data[data['language'] == 'English'] #only keep books with English language

with open("top_100_similar_books_full.pkl", "rb") as f:
    top_similar_books = pickle.load(f)

with open("tfidf_matrix_full.pkl", "rb") as f:
    tfidf_matrix = pickle.load(f)

#recommend based on different features; title is separate because it will be mainly used
def recommendByTitle(title, numRecommendations=5):
    """
        Recommends books by title

        Parameters
        -----------
        title: str
            The title of a book
        numRecommendations: int = 5
            Number of book recommendations being returned
        
        Returns
        --------
        list
            a set of books or empty set
    """
    if title in top_similar_books:
        # Because top_similar_books file has 100 most similar books mapped to each book, simply pull the value and return them.
        similar_books = top_similar_books[title][:numRecommendations] 
        # Return the first value in the tuple as the second value is the similarity score.
        return [book[0] for book in similar_books] 
    else:
        print(f"'{title}' not found in the dataset.")
        return []
# end of definition recommendByTitle()

def recommendByFeature(feature, featureType, numRecommendations=5):
    """
        Recommends books by feature and feature type.

        Ex. Recommend based on feature='Dystopia', featureType='genres', numRecommendations=5

        Parameters
        -----------
        feature: str
            feature
        featureType: str
        numRecommendations: int = 5
            Number of book recommendations being returned
        
        Returns
        --------
        list
            a set of books or empty set
    """
    #pull all of the books from the csv that have the specified feature in the featureType column; ignore case and treat NaN as false
    matching_books = data[data[featureType].str.contains(feature, case=False, na=False)] 
    
    if matching_books.empty: #if no books with that feature/featureType, no books found
        print(f"No books found with {featureType}: '{feature}'.")
        return []
    
    #slightly different logic than the title
    # COME BACK TO FIX THIS
    # because top_similar_books has similarity scores related to other books, this is simply pulling books that are most similar to 
    # other books rather than most similar to another genre, so leads to duplicates and inaccurate recommendations
    # will probably need to generate a whole new cosine similarity matrix with just the feature type as the content_features 
    # for this to work as intended
    recommendations = []
    for bookTitle in matching_books['title']:
        #iterate through all the books in the csv that match the feature; 
        # if it exists in top_similar_books (meaning the book matched another book based on criteria meant for title recommendation), 
        # get its similar books and add to recommendations
        if bookTitle in top_similar_books: 
            recommendations.extend(top_similar_books[bookTitle][:numRecommendations])
    #sort the recommendations in descending order based on similarity score, then only get numRecommendations entries
    recommendations = sorted(recommendations, key=lambda x: x[1], reverse=True)[:numRecommendations] 
    return [book[0] for book in recommendations] #return the book title
# end of definition recommendByFeature()

def compareTwoBooks(book1Title, book2Title):
    """
    Compares two books and generates/returns the cosine similarity

    Parameters
    -----------
    book1Title: str
        title of the first book
    book2Title: str
        title of the second book

    Returns
    --------
    float
        cosine similarity
    """
    indices = pd.Series(data.index, index=data['title']).drop_duplicates() #get indices of books from csv based on title search

    if book1Title in indices and book2Title in indices:
        index1 = indices[book1Title]
        index2 = indices[book2Title]
        # generate cosine_similarity between the two books using the tfidf matrix from the other file; not as resource intensive
        cosine_sim = cosine_similarity(tfidf_matrix[index1], tfidf_matrix[index2]) 
        return cosine_sim[0][0]
    else: #error control
        print(f"One or both books not found in the dataset.")
        return None
# end of definition compareTwoBooks()

print(recommendByTitle("The Hunger Games"))
#print(recommendByFeature("F. Scott Fitzgerald", "author", 50)) #doesn't work as intended; generates duplicates; see above comments for why
#print(recommendByFeature("Historical Fiction", "genres")) #doesn't work as intended; generates duplicates; see above comments for why
print(compareTwoBooks("Divergent", "The Hunger Games")) #shows that similarity stays the same
print(compareTwoBooks("The Hunger Games", "Divergent"))