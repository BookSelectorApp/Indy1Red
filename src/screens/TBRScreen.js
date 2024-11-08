import React, { useCallback, useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { removeFromTBR, viewTBR } from '../api/API';
import { useUser } from '../constants/UserContext';

export default function TBRScreen() {
    const { userId } = useUser();
    const [tbrList, setTbrList] = useState([]);
    const [loading, setLoading] = useState(true);

    //fetch tbr list
    const fetchTBRBooks = async () => {
        setLoading(true);
        try {
            const data = await viewTBR(userId);
            setTbrList(data.tbr_list);
        } catch (error) {
            console.error("Error fetching TBR books: ", error);
        } finally {
            setLoading(false);
        }
    };

    //refresh list every time tab is re-opened
    useFocusEffect(
        useCallback(() => {
            fetchTBRBooks();
        }, [userId])
    );

    const handleRemove = async (bookId) => {
        try {
            await removeFromTBR(userId, bookId); //api to remove book
            await fetchTBRBooks();               //refresh list after removal
        } catch (error) {
            console.error("Error removing book from TBR: ", error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>To Be Read List</Text>
            {loading ? (
                <Text>Loading...</Text>
            ) : (
                <FlatList
                    data={tbrList}
                    keyExtractor={(item) => item.id || item.book_id.toString()} //unique key for each book
                    renderItem={({ item }) => ( //need to get access to title from api
                        <View style={styles.item}>
                            <Text>{item.book_id.toString()}</Text>
                            <Button title="Remove" onPress={() => handleRemove(item.book_id)} />
                        </View>
                    )}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
    title: { fontSize: 24, fontWeight: 'bold', marginTop: 50, marginBottom: 20, textAlign: 'center' },
    item: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 10 }
});
