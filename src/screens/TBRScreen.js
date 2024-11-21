import React, { useCallback, useState } from 'react';
import { View, Text, Button, FlatList, ScrollView, StyleSheet, Image } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { removeFromTBR, viewTBR } from '../api/API';
import { useUser } from '../constants/UserContext';
import DatesCard from "../component/DatesCard";
//import { ScrollView } from 'react-native-gesture-handler';

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
                    contentContainerStyle={{ flexGrow: 1, flexDirection: 'column' }}
                    data={tbrList}
                    keyExtractor={(item) => item.id || item.bookId.toString()} //unique key for each book
                    renderItem={({ item }) => (
                        <View style={styles.entry}>
                            <View style={styles.item}>
                                <Text>{item.bookId.toString()}</Text>
                                <Text>{item.title.toString()}</Text>
                                <Text>{item.author.toString()}</Text>
                                {/* ^^^ you have access to item.title, .author, .description, .genres, .coverImg, and .bookId */}
                                <Image
                                    source={{ uri: item.coverImg }} //this will eventually be replaced with the actual cover
                                    style={{
                                        width: '100%',
                                        height: 200,
                                        borderRadius: 12,
                                    }}
                                    resizeMode="contain"
                                />
                            </View>
                            {/* <DatesCard item={item} /> you could just uncomment this and use the previously defined component, but its formatting is weird and refactoring DatesCard to include sizing would be a pain; it is an option though*/}
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
    item: { maxWidth: '75%', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', marginVertical: 10 },
    entry: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 10 }
});
