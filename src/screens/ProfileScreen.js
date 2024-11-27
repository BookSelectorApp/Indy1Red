import { View, Text, Image, TouchableOpacity, ScrollView, TextInput, Button, FlatList, Alert, StyleSheet } from "react-native";
import React, { useState, useCallback } from "react";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { CameraIcon } from "react-native-heroicons/outline";
import { profileData } from "../constants";
import { addTitle, addGenre, deleteTitle, deleteGenre, getPreferences } from '../api/API';
import { useUser } from '../constants/UserContext';
import { useFocusEffect } from '@react-navigation/native';


export default function ProfileScreen() {
    // i combined the profile screen and the old profile screen into one file
    const [title, setTitle] = useState('');
    const [genre, setGenre] = useState('');
    const [preferences, setPreferences] = useState({ titles: [], genres: [] });
    const data = profileData[0];
    const { userId } = useUser();


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

    // Validation: avoid empty and duplicate values
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


//Here is the one I made that shows the profile icon and the user's name and age
  const renderHeader = () => (
    <View>
      {/* Image */}
        <Image
          source={data.imgUrl}
          style={{
            width: wp(100),
            height: hp(60),
            borderBottomLeftRadius: 30,
            borderBottomRightRadius: 30,
          }}
        />

      {/* Header */}
      <View className="w-full absolute flex-row justify-end items-center pt-10">
        <View className="p-2 rounded-full bg-black/40 mr-5 justify-center items-center">
        <CameraIcon size={hp(3.5)} color="white" strokeWidth={1.5} /> 
        </View>
      </View>

      {/* Bio header*/}
      <View style={{ padding: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text style={{ fontSize: 24, fontWeight: 'bold' }}>{data.name}, {data.age}</Text>
          <Text>Edit</Text>
        </View>

        {/* User's Preference */}
        <View style={{ flexDirection: 'row', marginVertical: 8 }}>
          {data.hobbies?.map((hobby, index) => (
            <View
              key={index}
              style={{
                borderRadius: 20,
                padding: 5,
                paddingHorizontal: 10,
                marginRight: 5,
                backgroundColor: '#d3d3d3',
              }}
            >
              <Text>{hobby}</Text>
            </View>
          ))}
        </View>

        {/* Bio Text */}
        <View>
          <Text className="uppercase font-semibold text-neutral-500 tracking-wider mb-2 ">
            BIO
          </Text>

          <Text className="text-black/80 text-left font-medium text-sm">
            {data.bio}
          </Text>
        </View>

        {/* Separator */}
        <View style={styles.separator} />

      </View>
    </View>
  );

  // Footer Component to display recommendations preferences
  const renderFooter = () => (
    <View style={styles.container}>
      <Text style={styles.title}>Recommendation Preferences</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Title"
        value={title}
        onChangeText={setTitle}
      />
    <TouchableOpacity style={styles.addButton} onPress={handleAddTitle}>
        <Text style={styles.buttonText}>Add Title</Text>
    </TouchableOpacity>


      <TextInput
        style={styles.input}
        placeholder="Enter Genre"
        value={genre}
        onChangeText={setGenre}
      />
      <TouchableOpacity style={styles.addButton} onPress={handleAddGenre}>
        <Text style={styles.buttonText}>Add Genre</Text>
      </TouchableOpacity>
      
      {/* Separator */}
      <View style={styles.separator} />

        {/*come back here and fix the bubble container under your titles.*/}
      <Text style={styles.subtitle}>Your Titles</Text>
      <FlatList
        data={preferences.titles}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
            <View style={styles.bubbleWrapper}> 
                <View style={styles.bubbleContainer}>
                    <Text style={styles.bubbleText}>{item}</Text>
                </View>
                <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteTitle(item)}>
                    <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
            </View>
  )}
/>

    <Text style={styles.subtitle}>Your Genres</Text>
    <FlatList
        data={preferences.genres}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
            <View style={styles.bubbleWrapper}> 
                <View style={styles.bubbleContainer}>
                    <Text style={styles.bubbleText}>{item}</Text>
            </View>
            <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteGenre(item)}>
                <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
        </View>
        )}
      />
    </View>
  );

  return (
    <ScrollView>
      {renderHeader()}
      {renderFooter()}
    </ScrollView>
  );
  //THIS IS SO CONFUSING: i need to use a flatlist  bec i keep getting an error when i nest the scrollview,
  // but the keyboard keeps going away if i use this segment of code
  /*return (
    <FlatList
      data={[]} // Empty data as FlatList is used only for layout (Had an error where it was expecting data)
      ListHeaderComponent={renderHeader}
      ListFooterComponent={renderFooter}
    />
  );*/
  
}

const styles = StyleSheet.create({
addButton:{
    backgroundColor: '#556B2F' ,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: 'center', // Centers the button and prevents it from being full-width
    marginVertical: 10,
},
buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
},
separator:{
    height: 1,
    backgroundColor: '#d3d3d3', 
    marginVertical: hp(2),
    //come back here to fix the margin, the spacing is awkward 

},
bubbleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
bubbleContainer: {
    alignItems: 'center',
    backgroundColor: '#556B2F', // Forest green background for the bubble
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
  },
  
  bubbleText: {
    color: 'white', // White text color
    fontSize: 14,
  },
  
deleteButton: {
    backgroundColor: '#556B2F',
    paddingVertical: 6,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignSelf: 'center',
    marginVertical: 5,
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginTop: 1, marginBottom: 10, textAlign: 'center' },
  subtitle: { fontSize: 18, marginTop: 20, marginBottom: 40 },
  input: { borderWidth: 1, padding: 8, marginVertical: 10, borderRadius: 5 },
  item: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10 },
});