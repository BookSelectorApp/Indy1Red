import React, { useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const books = [
  { title: 'Pride and Prejudice', author: 'Jane Austen' },
  { title: 'Red Rising', author: 'Pierce Brown' },
  { title: 'The Love Hypothesis', author: 'Ali Hazelwood' },
  { title: 'The Hunger Games', author: 'Suzanne Collins' },
  { title: 'The Cruel Prince', author: 'Holly Black' }
];

export default function Swipe() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleSwipe = (direction) => {
    if (direction === 'right') {
      console.log(`Liked: ${books[currentIndex].title}`);
    } else {
      console.log(`Disliked: ${books[currentIndex].title}`);
    }

    setCurrentIndex((prevIndex) => (prevIndex + 1) % books.length);
  };

  return (
    <SafeAreaView style={styles.container}>
      {books[currentIndex] ? (
        <View style={styles.card}>
          <Text style={styles.bookTitle}>{books[currentIndex].title}</Text>
          <Text style={styles.bookAuthor}>{books[currentIndex].author}</Text>

          <View style={styles.buttons}>
            <TouchableOpacity
              style={styles.dislikeButton}
              onPress={() => handleSwipe('left')}
            >
              <Text style={styles.buttonText}>Dislike</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.likeButton}
              onPress={() => handleSwipe('right')}
            >
              <Text style={styles.buttonText}>Like</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <Text>No more books to show!</Text>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  bookTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  bookAuthor: {
    fontSize: 18,
    marginBottom: 20,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dislikeButton: {
    backgroundColor: '#ff5252',
    padding: 10,
    borderRadius: 10,
    width: '45%',
    alignItems: 'center',
  },
  likeButton: {
    backgroundColor: '#4caf50',
    padding: 10,
    borderRadius: 10,
    width: '45%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});
