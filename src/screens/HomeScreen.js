import { View, Text, Platform, Image, Dimensions, ActivityIndicator, TouchableOpacity } from 'react-native';
import React, { useState, useCallback } from 'react';
import { getFocusedRouteNameFromRoute, useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { profile } from '../../assets/images';
import { BellIcon } from 'react-native-heroicons/outline';
import DeckSwiper from 'react-native-deck-swiper';
import DatesCard from "../component/DatesCard";
import { addToTBR, getPreferences, getRecommendations } from '../api/API';
import { useUser } from '../constants/UserContext';

const android = Platform.OS === 'android';
const { width, height } = Dimensions.get('window');

export default function HomeScreen() {
  const { userId } = useUser(); //access userid from context
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  //fetch recommendations from API
  const fetchBooks = async () => {
    setLoading(true);
    try {
      const preferencesData = await getPreferences(userId);
      const { preferred_titles, preferred_genres } = preferencesData.preferences;
      let titles = preferred_titles, genres = preferred_genres;

      if (titles === undefined || titles === null) {titles = [];}
      if (genres === undefined || genres === null) {genres = [];}

      const data = await getRecommendations(genres.join(','), titles.join(',')); //current API implementation accepts genres and titles for recommendations
      setBooks(data.recommendations);  //set books constant to the array of recommendations from the response JSON
    } catch (error) {
      console.error("Error fetching book recommendations: ", error);
    } finally {
      setLoading(false); //used so content is not displayed until backend/db query is finished
    }
  };

  //refresh list every time tab is re-opened
  useFocusEffect(
    useCallback(() => {
        fetchBooks();
    }, [userId])
  );

  //if left swipe, skip and move on
  const onSwipeLeft = (index) => {
    //console.log(Book dismissed: ${books[index]?.title}`);
  };

  //if right swipe, add to TBR; functionality not actually here yet
  const onSwipeRight = async (index) => {
    const bookId = books[index]?.bookId;
    if (bookId && userId) {
      const result = await addToTBR(userId, bookId);
      if (result.message === "Book added to TBR list") {
        console.log("Book added to TBR list:", bookId);
      } else if (result.message === "Book already added to TBR list") {
        console.log("Book already added to TBR list:", bookId)
      } else {
        console.error("Error adding to TBR:", result.detail);
      }
    }
  };

  return (
    <SafeAreaView
      className="bg-white flex-1"
      style={{
        paddingTop: android ? hp(2) : 0,
      }}
    >
      {/* Header */}
      <View className="w-full flex-row justify-between items-center px-4 mb-4">
        <View className="rounded-full items-center justify-center">
          <Image
            source={profile}
            style={{
              width: hp(4.5),
              height: hp(4.5),
              resizeMode: "cover",
            }}
            className="rounded-full"
          />
        </View>
        <View>
          <Text className="text-xl font-semibold text-center uppercase">Indy</Text>
        </View>
        <View className="bg-black/10 p-2 rounded-full items-center justify-center">
          <TouchableOpacity>
            <BellIcon size={25} strokeWidth={2} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Section */}
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <View className="mx-4 mb-6">
          <Text className="capitalize text-2xl font-semibold text-center" style={{ fontFamily: "SpaceGroteskBold" }}>
            Find your next Read!
          </Text>
        </View>

        {/* Card Section */}
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          {/* if loading is true, display a loading icon; if false but no books, show no books found; if false, display book cards */}
          {loading ? (
            <ActivityIndicator size="large" color="#000" />
          ) : books.length === 0 ? (
            <Text>No books found</Text>
          ) : (
            //height and width variables only change positioning which is odd; just leave these values for centered;
            <View style={{ height: height * 0.55, width: width * 0.9, marginBottom: height * 0.1 }}>
              <DeckSwiper
                cards={books}
                renderCard={(book) => <DatesCard item={book} />}
                onSwipedLeft={onSwipeLeft}
                onSwipedRight={onSwipeRight}
                cardIndex={currentIndex}
                backgroundColor={'transparent'}
                stackSize={3}
                infinite
                cardVerticalMargin={0}
                verticalSwipe={false}
              />
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}
