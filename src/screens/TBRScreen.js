import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { removeFromTBR, viewTBR } from '../api/API';
import { useUser } from '../constants/UserContext';

export default function TBRScreen() {
  const { userId } = useUser();
  const [tbrList, setTbrList] = useState([]);
  const [loading, setLoading] = useState(true);

  // fetch TBR list
  const fetchTBRBooks = async () => {
    setLoading(true);
    try {
      const data = await viewTBR(userId);
      setTbrList(data.tbr_list);
    } catch (error) {
      console.error('Error fetching TBR books: ', error);
    } finally {
      setLoading(false);
    }
  };

  // refresh list every time the tab is re-opened
  useFocusEffect(
    useCallback(() => {
      fetchTBRBooks();
    }, [userId])
  );

  const handleRemove = async (bookId) => {
    try {
      await removeFromTBR(userId, bookId); // API to remove book
      await fetchTBRBooks(); // refresh list after removal
    } catch (error) {
      console.error('Error removing book from TBR: ', error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header Style */}
      <Text style={styles.header}>To Be Read List</Text>

      {/* Divider */}
      <View style={styles.divider} />

      {loading ? (
        <Text style={styles.loading}>Loading...</Text>
      ) : (
        <FlatList
          data={tbrList}
          keyExtractor={(item) => item.bookId.toString()} // Unique key for each book
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.bookItem}
              activeOpacity={0.7}
              onPress={() => {
                // Future: Add navigation to book details
              }}
            >
              {/* Book Cover */}
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: item.coverImg }}
                  style={styles.bookImage}
                  resizeMode="contain"
                />
              </View>

              {/* Book Information */}
              <View style={styles.bookInfo}>
                <Text style={styles.bookTitle}>{item.title}</Text>
                <Text style={styles.bookAuthor}>{item.author}</Text>
              </View>

              {/* Remove Button */}
              <TouchableOpacity
                onPress={() => handleRemove(item.bookId)}
                style={styles.removeButton}
              >
                <Text style={styles.removeText}>Remove</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16, 
  },
  header: {
    fontSize: 24, 
    fontWeight: 'bold', 
    marginTop: 50, 
    marginBottom: 20,
    textAlign: 'center', // Centered alignment
    color: '#222', // Maybe change to Green? idk
  },
  divider: {
    height: 1, // Thickness of the divider
    backgroundColor: '#ccc', 
    marginHorizontal: 20, 
    marginBottom: 20, //ask them if they think its awkward spacing
  },
  loading: {
    textAlign: 'center',
    fontSize: 16,
    color: '#555',
  },
  bookItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  imageContainer: {
    width: 50,
    height: 75,
    marginRight: 10,
  },
  bookImage: {
    width: '100%',
    height: '100%',
    borderRadius: 5,
  },
  bookInfo: {
    flex: 1,
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
  },
  bookAuthor: {
    fontSize: 14,
    color: '#555',
  },
  removeButton: {
    padding: 5,
    backgroundColor: '#556B2F',
    borderRadius: 5,
  },
  removeText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: 'bold',
  },
});
