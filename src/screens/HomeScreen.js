import { View, Text, Platform, Image, Dimensions, ActivityIndicator, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { profile } from '../../assets/images';
import { BellIcon } from 'react-native-heroicons/outline';
import DeckSwiper from 'react-native-deck-swiper';
import DatesCard from "../component/DatesCard";

const android = Platform.OS === 'android';
const { width, height } = Dimensions.get('window');

//example genres and titles to use for the API; this will eventually be pulled from user preferences
const genres = "Dystopia,Fantasy";
const titles = "The Hunger Games,Divergent";

export default function HomeScreen() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  //fetch recommendations from API
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch(`https://indy1red.onrender.com/recommendations?genres=${genres}&titles=${titles}`); //current API implementation accepts genres and titles for recommendations
        const data = await response.json();
        setBooks(data.recommendations);  //set books constant to the array of recommendations from the response JSON
        setLoading(false); //used so content is not displayed until backend/db query is finished
      } catch (error) {
        console.error("Error fetching book recommendations: ", error);
        setLoading(false);
      }
    };

    fetchBooks(); //actually request the data
  }, []);

  //if left swipe, skip and move on
  const onSwipeLeft = (index) => {
    console.log(`Book dismissed: ${books[index]?.title}`);
  };

  //if right swipe, add to TBR; functionality not actually here yet
  const onSwipeRight = (index) => {
    console.log(`Book added to TBR: ${books[index]?.title}`);
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
