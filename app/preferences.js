import React, { useState } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router'; 

const tropes = [
  'Enemies to Lovers', 'Friends to Lovers', 'Slow Burn', 
  'Love Triangle', 'Found Family', 'Redemption Arc', 
  'Grumpy x Sunshine', 'Forbidden Love',
];

const genres = [
    'Fantasy', 'Science Fiction', 'Mystery', 
    'Romance', 'Horror', 'Thriller', 
    'Non-fiction', 'Historical Fiction'
  ];

export default function Preferences() {
  const [selectedTropes, setSelectedTropes] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const router = useRouter();  

  const toggleTrope = (trope) => {
    setSelectedTropes(prev =>
      prev.includes(trope) ? prev.filter(t => t !== trope) : [...prev, trope]
    );
  };

  const toggleGenre = (genre) => {
    setSelectedGenres(prev =>
      prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]
    );
  };

  const savePreferences = () => {
    console.log('Selected Tropes:', selectedTropes);
    console.log('Selected Genres:', selectedGenres);
    // After saving preferences, navigate to the Swipe screen
    router.push("swipe"); // Navigate to the Swipe screen
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Choose Your Favorite Tropes!</Text>


       {/* Tropes Section */}
       <Text style={styles.sectionTitle}>Favorite Tropes</Text>
      <FlatList
        data={tropes}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.item,
              selectedTropes.includes(item) ? styles.selected : null
            ]}
            onPress={() => toggleTrope(item)}
          >
            <Text style={styles.itemText}>{item}</Text>
          </TouchableOpacity>
        )}
      />

      {/* Genres Section */}
      <Text style={styles.sectionTitle}>Favorite Genres</Text>
      <FlatList
        data={genres}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.item,
              selectedGenres.includes(item) ? styles.selected : null
            ]}
            onPress={() => toggleGenre(item)}
          >
            <Text style={styles.itemText}>{item}</Text>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity
        style={styles.saveButton}
        onPress={savePreferences}  // Call savePreferences on button press
      >
        <Text style={styles.saveButtonText}>Save Preferences</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  item: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
    marginBottom: 10,
  },
  selected: {
    backgroundColor: '#075eec',
  },
  itemText: {
    fontSize: 18,
    color: '#333',
  },
  saveButton: {
    backgroundColor: '#075eec',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
  },
});