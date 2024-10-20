import { View, Text, Platform, Image, TouchableOpacity, Dimensions } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import {profile} from '../../assets/images';
import Carousel from 'react-native-snap-carousel';
import { datesData } from '../constants';
import DatesCard from "../component/DatesCard";
import { BellIcon } from 'react-native-heroicons/outline';

const android = Platform.OS === 'android';
const {width, height} = Dimensions.get('window');

export default function HomeScreen() {
  return (
    <SafeAreaView
      className="bg-white flex-1 justify-between"
      style={{
        paddingTop: android ? hp(2) : 0,
      }}
    >
      {/* Header*/}
      <View className="w-full flex-row justify-between items-center px-4 mb-8">
        {/* Image */}
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
          {/* Brand Name */}
          <View>
            <Text className="text-xl font-semibold text-center uppercase">
              Indy
            </Text>
          </View>

          {/* Bell Icon */}
          <View className="bg-black/10 p-2 rounded-full items-center justify-center">
            <TouchableOpacity>
              <BellIcon size={25} strokeWidth={2} color="black" />
            </TouchableOpacity>
          </View>
      </View>

      {/* Carousal */}
      <View className="pb-4">
        <View className="mx-4 mb-4">
          <Text
          className="capitalize text-2xl font-semibold"
          style={{
            fontFamily: "SpaceGroteskBold",
          }}
          >  
          Find your next Read!
          </Text>
        </View>
        
        <View> 
          <Carousel
          data={datesData}
          renderItem={({ item }) => <DatesCard item={item} />}
          firstItem = {1}
          inactiveSlideScale={0.86}
          inactiveSlideOpacity={0.6}
          sliderWidth={width}
          itemWidth={width * 0.8}
          slideStyle={{ display: "flex", alignItems: "center" }}
          />
        </View>
      </View>
      </SafeAreaView>
      
  );
}