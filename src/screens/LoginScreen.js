import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Image } from 'react-native';
import { loginUser, getPreferences } from '../api/API';
import { useUser } from '../constants/UserContext';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';


export default function LoginScreen({ navigation }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { setUserId } = useUser(); //from UserContext.js

    const [fontsLoaded, fontError] = useFonts({
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
        const result = await loginUser(username, password)
        if (result.message === "Login successful") {
            setUserId(result.user_id); //set userid in context
            //implement later: dynamiic navigation based on login history (for example, if user has preferences, go to HomeScreen, else go to ProfileScreen)
            
            navigation.navigate("HomeTabs");  //nav to main screen after successful login
        } else {
            return Alert.alert("Error", "Invalid credentials");
            //console.log(result.detail);
        }        
    };

    return (
        <View style={styles.container} onLayout={onLayoutRootView}>
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
                        
            {/*Login Text */}
            <Text style={styles.title}>Login</Text>
            
            {/* Username and Password Inputs */}
            <TextInput
                style={styles.input}
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />

            {/* Login and Register Buttons */}
            <Button title="Login" onPress={handleLogin} color="#556B2F" />
            <Button title="Register" onPress={() => navigation.navigate("Register")} color="#556B2F"/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 16 },

    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
    input: { borderWidth: 1, padding: 8, marginVertical: 10, borderRadius: 5 }
});