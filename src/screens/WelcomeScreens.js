import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useCallback } from "react"
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { widthPercentageToDP as wp, heightPercentageToDP as hp} from "react-native-responsive-screen";
import { ArrowUpRightIcon } from "react-native-heroicons/outline";
import { useNavigation } from "@react-navigation/native";

export default function WelcomeScreens() {
  const navigation= useNavigation();

  const [fontsLoaded, fontError]= useFonts({
    SpaceGroteskSemibold: require('../fonts/SpaceGrotesk-SemiBold.ttf'),
    SpaceGroteskBold: require('../fonts/SpaceGrotesk-Bold.ttf'),
    SpaceGroteskMedium: require('../fonts/SpaceGrotesk-Medium.ttf'),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded|| fontError) {
      await SplashScreen.hideAsync();
    }
  } , [fontsLoaded, fontError]);

  if (!fontsLoaded){
    return null; 
  }

  return (
    <View onLayout={onLayoutRootView}
    className="flex-1"
    style={{
      width: wp (100),
    }}
    > 
    <View
    className="justify-center items-center"
    style={{
      width: wp(100),
      height: hp(100),
    }}
    >
      {/* Heart Icon Image */}
    <View
      className="justify-center items-center my-4"
      style={{
        width: wp(100),
      }}
    >

      <Image
      source={require('../../assets/HeartIcon.png')}
      style={{
        width: wp(100),
        height: hp(40),
      }}
      />
    </View>
    {/* Welcome Text */}
    <View className="w full p-6 px-10"
      style={{
        width:wp(90),
        paddingLeft: wp(5),
        paddingRight: wp(5),
      }}
    >
      <Text className="tracking-widest leading-none"
        style={{
          fontSize: wp(10),
          fontFamily: "SpaceGroteskBold",
        }}>
          Match</Text>

          <Text
          className="tracking-widest w-[70%] leading-none"
          style={{
            fontSize: wp(10),
            fontFamily: "SpaceGroteskBold",
            width: wp(70),
          }}
          >
            with your next Read
          </Text>

          <Text className="tex-ray-800 leading-6 tracking-wider x-[70%] mt-2"
          style={{
            fontSize: wp(4),
            fontFamily: "SpaceGroteskMedium",
            width: wp(70),
          }}
          >
            Looking for your next read has never been this exciting
          </Text>
        </View>

        <View className="w-full p-6 px-10">
        <TouchableOpacity 
        className="bg-[#f26322] px-4 py-4 rounded-xl flex-row justify-center items-center w-[45%]"
        onPress={() => {
          navigation.navigate("HomeTabs");
        }}
        >
           
           <Text
            className="text-white font-bold mr-2"
            style={{
              fontSize: wp(4),
              fontFamily: "SpaceGroteskMedium"
            }}
            >
              Get Started
           </Text> 
           <ArrowUpRightIcon color={"white"} size={28} strokeWidth={2.5} />
        </TouchableOpacity>
      </View>
    </View>
    </View>
  );
}