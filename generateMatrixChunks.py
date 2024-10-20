#Tristan Sanford
#Senior Project: Book Dating App
#September 27, 2024
#V1.0

import os
import pandas as pd
import pickle
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from multiprocessing import Pool

data = pd.read_csv("books_1.Best_Books_Ever.csv") #read csv with pandas
data = data[data['language'] == 'English'] #only keep books with English language

#fill all empty features with an actual empty string
data['genres'] = data['genres'].fillna('')
data['description'] = data['description'].fillna('')
data['author'] = data['author'].fillna('')
data['series'] = data['series'].fillna('')

#create the content_features feature which is an amalgamation of all the features desired for the algorithm to use with weights
#change weights (must be integers) to change how much one feature affects the recommendation
data['content_features'] = 2*data['author'] + " " + 4*data['series'] + " " + 4*data['genres'] + " " + 3*data['description']

#tf-idf: weights words higher if they are deemed more significant (term frequency and reciprocal document frequency); higher significance will let program match to other books
#use the default english stop words to delineate token separation
#change max_features to have a more detailed vector at system resource expense
tfidf = TfidfVectorizer(stop_words='english', max_features=10000)
#make vector on each row in data using the content_features feature
tfidf_matrix = tfidf.fit_transform(data['content_features'])

#chunkSize is how many rows per chunk; necessary to chunk the cosine similarity because system resources are limited (it will try to store everything in RAM before saving)
chunkSize = 1000
numBooks = data.shape[0]

#gets similarity using cosine similarity (cosine of angle between two vectors; if vectors are pointing the same direction) between book at current row index and all other books in the dataset
#stores top 100 most similar books and similarity score per book in the chunk in a .pkl file
def processChunkSimilarity(startIndex): 
    endIndex = min(startIndex + chunkSize, numBooks) #stop at end of chunk or end of file
    print(f"Processing cosine similarity for chunk: {startIndex} to {endIndex}")

    #using sklearn cosine_similarity between the books in the chunk (first param) and all the books (second param); main computation
    cosine_sim_chunk = cosine_similarity(tfidf_matrix[startIndex:endIndex], tfidf_matrix) 

    top_similar_books = {}
    #iterate through every book in the chunk
    for i, index in enumerate(range(startIndex, endIndex)):
        title = data['title'].iloc[index] #current book to get top similar books for
        sim_scores = list(enumerate(cosine_sim_chunk[i])) #yields a list of all similarity scores for all books for the current book (enumerate means the list has tuples of (0, 0.8), (1, 0.3), ... so book index followed by similarity score)
        sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True) #sorts the list in descending order (so highest similarity first) based on x[1] (the similarity score; second element of each tuple)
        
        top_100_sim_scores = sim_scores[1:101] #store top similarity scores; skip the first one because that is the book itself
        top_similar_books[title] = [(data['title'].iloc[j], score) for j, score in top_100_sim_scores] #store the title and similarity score for this book

    #save the similarity data to the chunk file
    with open(f"top_100_similar_books_chunk_{int(startIndex/chunkSize)}.pkl", "wb") as f:
        pickle.dump(top_similar_books, f)

    return True

if __name__ == '__main__':
    #tfidfvectorizer is not as labor intensive, so it can be run without parallelization; dump the matrix to a file for use in main program if necessary
    with open("tfidf_matrix_full.pkl", "wb") as f:
        pickle.dump(tfidf_matrix, f)
    print("TF-IDF matrix saved.")
    
    #parallelize the cosine similarity processing for speed and to prevent crashing due to RAM limits
    with Pool() as pool:
        pool.map(processChunkSimilarity, range(0, numBooks, chunkSize))
    print("All cosine similarity chunks created.")

    #combine all chunks into one file to be used in the main program
    all_top_similar_books = {}
    for startIndex in range(0, numBooks, chunkSize):
        with open(f"top_100_similar_books_chunk_{int(startIndex/chunkSize)}.pkl", "rb") as f:
            chunkData = pickle.load(f)
            all_top_similar_books.update(chunkData)
        os.remove(f"top_100_similar_books_chunk_{int(startIndex/chunkSize)}.pkl")

    with open("top_100_similar_books_full.pkl", "wb") as f:
        pickle.dump(all_top_similar_books, f)

    print("Top 100 similar books for all books merged into one file.")