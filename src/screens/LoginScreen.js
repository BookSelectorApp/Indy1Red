import React, { useState, useCallback } from 'react';
import {
  SafeAreaView,
  View,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { loginUser } from '../api/API';
import { useUser } from '../constants/UserContext';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default function LoginScreen({ navigation }) {
  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const { setUserId } = useUser();

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

  const handleLogin = async () => {
    const result = await loginUser(form.email, form.password);
    if (result.message === 'Login successful') {
      setUserId(result.user_id);
      navigation.navigate('HomeTabs');
    } else {
      Alert.alert('Error', 'Invalid credentials');
    }
  };

  return (
    <SafeAreaView
      className="flex-1 bg-white"
      style={{
        width: wp(100),
      }}
      onLayout={onLayoutRootView}
    >
      <KeyboardAwareScrollView
        className="flex-1"
        style={{
          paddingVertical: wp(5),
        }}
      >
        {/* Header */}
        <View className="justify-center items-center my-6">
          <Image
            alt="App Logo"
            resizeMode="contain"
            source={require('../../assets/HeartIcon.png')}
            style={{
              width: wp(30),
              height: wp(30),
            }}
          />
          <Text
            className="text-black text-center leading-none"
            style={{
              fontSize: wp(8),
              fontFamily: 'SpaceGroteskBold',
            }}
          >
            Sign in to{' '}
            <Text
              style={{
                color: '#556B2F',
                fontFamily: 'SpaceGroteskBold',
              }}
            >
              INDY
            </Text>
          </Text>
       
        </View>

        {/* Form */}
        <View className="px-6">
          {/* Email Input */}
          <View className="mb-4">
            <Text
              className="text-[#556B2F]"
              style={{
                fontSize: wp(4),
                fontFamily: 'SpaceGroteskSemibold',
              }}
            >
              Email address
            </Text>
            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              clearButtonMode="while-editing"
              keyboardType="email-address"
              onChangeText={(email) => setForm({ ...form, email })}
              placeholder="lizzy.bennet@example.com"
              placeholderTextColor="#6b7280"
              className="mt-2 bg-white text-black border border-gray-300 rounded-lg p-4"
              style={{
                fontSize: wp(4),
                fontFamily: 'SpaceGroteskMedium',
              }}
              value={form.email}
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
              autoCorrect={false}
              clearButtonMode="while-editing"
              onChangeText={(password) => setForm({ ...form, password })}
              placeholder="********"
              placeholderTextColor="#6b7280"
              secureTextEntry
              className="mt-2 bg-white text-black border border-gray-300 rounded-lg p-4"
              style={{
                fontSize: wp(4),
                fontFamily: 'SpaceGroteskMedium',
              }}
              value={form.password}
            />
          </View>

          {/* Login Button */}
          <View className="mt-4">
            <TouchableOpacity
              onPress={handleLogin}
              className="bg-[#556B2F] rounded-xl py-4 items-center"
            >
              <Text
                className="text-white font-bold"
                style={{
                  fontSize: wp(5),
                  fontFamily: 'SpaceGroteskMedium',
                }}
              >
                Sign in
              </Text>
            </TouchableOpacity>
          </View>

          {/* Forgot Password */}
          <TouchableOpacity
            onPress={() => {
              Alert.alert('Forgot Password?', 'Implement forgot password logic.');
            }}
            className="mt-4"
          >
            <Text
              className="text-center text-[#556B2F]"
              style={{
                fontSize: wp(4),
                fontFamily: 'SpaceGroteskMedium',
              }}
            >
              Forgot password?
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>

      {/* Footer */}
      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text
          className="text-center mt-6"
          style={{
            fontSize: wp(4),
            fontFamily: 'SpaceGroteskMedium',
            color: '#222',
          }}
        >
          Don't have an account?{' '}
          <Text className="underline" style={{ color: '#556B2F' }}>
            Register Now
          </Text>
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
