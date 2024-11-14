
import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, FlatList } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { addTitle, addGenre, deleteTitle, deleteGenre, getPreferences } from '../api/API';
import { useUser } from '../constants/UserContext';

export default function ProfileScreen() {
    const { userId } = useUser();
    const [title, setTitle] = useState('');
    const [genre, setGenre] = useState('');
    const [preferences, setPreferences] = useState({ titles: [], genres: [] });

    //fetch preferences on load
    const fetchPreferences = async () => {
      const data = await getPreferences(userId);
      setPreferences({
        titles: data.preferences?.preferred_titles || [],
        genres: data.preferences?.preferred_genres || [],
      });
    };

    useFocusEffect(
      useCallback(() => {
        fetchPreferences();
      }, [userId])
    );

    // Validation: Avoid empty and duplicate values
    const handleAddTitle = async () => {
        if (!title.trim()) return Alert.alert("Error", "Title cannot be empty");
        if (preferences.titles.includes(title)) return Alert.alert("Error", "Title already exists");

        const success = await addTitle(userId, title);
        if (success) {
            setPreferences((prev) => ({ ...prev, titles: [...prev.titles, title] }));
            setTitle('');
        }
    };

    const handleAddGenre = async () => {
        if (!genre.trim()) return Alert.alert("Error", "Genre cannot be empty");
        if (preferences.genres.includes(genre)) return Alert.alert("Error", "Genre already exists");

        const success = await addGenre(userId, genre);
        if (success) {
            setPreferences((prev) => ({ ...prev, genres: [...prev.genres, genre] }));
            setGenre('');
        }
    };

    const handleDeleteTitle = async (titleToDelete) => {
        const success = await deleteTitle(userId, titleToDelete);
        if (success) {
            setPreferences((prev) => ({
                ...prev,
                titles: prev.titles.filter((t) => t !== titleToDelete),
            }));
        }
    };

    const handleDeleteGenre = async (genreToDelete) => {
        const success = await deleteGenre(userId, genreToDelete);
        if (success) {
            setPreferences((prev) => ({
                ...prev,
                genres: prev.genres.filter((g) => g !== genreToDelete),
            }));
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Recommendation Preferences</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter Title"
                value={title}
                onChangeText={setTitle}
            />
            <Button title="Add Title" onPress={handleAddTitle} />

            <TextInput
                style={styles.input}
                placeholder="Enter Genre"
                value={genre}
                onChangeText={setGenre}
            />
            <Button title="Add Genre" onPress={handleAddGenre} />

            <Text style={styles.subtitle}>Your Titles</Text>
            <FlatList
                data={preferences.titles}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                    <View style={styles.item}>
                        <Text>{item}</Text>
                        <Button title="Delete" onPress={() => handleDeleteTitle(item)} />
                    </View>
                )}
            />

            <Text style={styles.subtitle}>Your Genres</Text>
            <FlatList
                data={preferences.genres}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                    <View style={styles.item}>
                        <Text>{item}</Text>
                        <Button title="Delete" onPress={() => handleDeleteGenre(item)} />
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
    title: { fontSize: 24, fontWeight: 'bold', marginTop: 50, marginBottom: 20, textAlign: 'center' },
    subtitle: { fontSize: 18, marginTop: 20 },
    input: { borderWidth: 1, padding: 8, marginVertical: 10, borderRadius: 5 },
    item: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10 },
});