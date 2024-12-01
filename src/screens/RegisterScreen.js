import React, { useState, useCallback } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { registerUser } from '../api/API';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default function RegisterScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [fontsLoaded, fontError] = useFonts({
    SpaceGroteskSemibold: require('../fonts/SpaceGrotesk-SemiBold.ttf'),
    SpaceGroteskBold: require('../fonts/SpaceGrotesk-Bold.ttf'),
    SpaceGroteskMedium: require('../fonts/SpaceGrotesk-Medium.ttf'),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded) {
    return null;
  }

  const handleRegister = async () => {
    const result = await registerUser(username, password);
    if (result.message === 'User registered successfully') {
      navigation.navigate('Login'); // Navigate to Login screen
    } else {
      Alert.alert('Error', 'Username taken');
    }
  };

  return (
    <SafeAreaView
      className="flex-1 bg-white justify-center items-center"
      style={{
        width: wp(100),
      }}
      onLayout={onLayoutRootView}
    >
      {/* Main Form Container */}
      <View
        className="px-6 w-full"
        style={{
          maxWidth: wp(90), // Limit the width of the form for better centering
        }}
      >
        {/* Header with Logo */}
        <View className="justify-center items-center mb-6">
          {/* Heart Icon */}
          <Image
            source={require('../../assets/HeartIcon.png')}
            alt="Heart Icon"
            resizeMode="contain"
            style={{
              width: wp(35), // originally 30 but too small
              height: wp(35),
              marginBottom: wp(4), // Here is where I added spacing between logo and text
            }}
          />
          <Text
            className="text-black text-center"
            style={{
              fontSize: wp(8),
              fontFamily: 'SpaceGroteskBold',
            }}
          >
            Register
          </Text>
        </View>

        {/* Username Input */}
        <View className="mb-4">
          <Text
            className="text-[#556B2F]"
            style={{
              fontSize: wp(4),
              fontFamily: 'SpaceGroteskSemibold',
            }}
          >
            Username
          </Text>
          <TextInput
            autoCapitalize="none"
            autoCorrect={false}
            clearButtonMode="while-editing"
            placeholder="Enter your username"
            placeholderTextColor="#6b7280"
            className="mt-2 bg-white text-black border border-gray-300 rounded-lg p-4"
            style={{
              fontSize: wp(4),
              fontFamily: 'SpaceGroteskMedium',
            }}
            value={username}
            onChangeText={setUsername}
          />
        </View>

        {/* Password Input */}
        <View className="mb-4">
          <Text
            className="text-[#556B2F]"
            style={{
              fontSize: wp(4),
              fontFamily: 'SpaceGroteskSemibold',
            }}
          >
            Password
          </Text>
          <TextInput
            autoCapitalize="none"
            autoCorrect={false}
            clearButtonMode="while-editing"
            secureTextEntry
            placeholder="Enter your password"
            placeholderTextColor="#6b7280"
            className="mt-2 bg-white text-black border border-gray-300 rounded-lg p-4"
            style={{
              fontSize: wp(4),
              fontFamily: 'SpaceGroteskMedium',
            }}
            value={password}
            onChangeText={setPassword}
          />
        </View>

        {/* Register Button */}
        <View className="mt-4">
          <TouchableOpacity
            onPress={handleRegister}
            className="bg-[#556B2F] rounded-xl py-4 items-center"
          >
            <Text
              className="text-white font-bold"
              style={{
                fontSize: wp(5),
                fontFamily: 'SpaceGroteskMedium',
              }}
            >
              Register
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
