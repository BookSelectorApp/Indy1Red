import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import WelcomeScreen from "../screens/WelcomeScreens";
import ProfileScreen from "../screens/ProfileScreen";   
import HomeScreen from "../screens/HomeScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import TBRScreen from "../screens/TBRScreen";
import { Ionicons} from "@expo/vector-icons"

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export default function AppNavigation() {
    const HomeTabs= () =>{
        return (
            <Tab.Navigator
            screenOptions={({route})=>({
                headerShown: false,
                tabBarIcon: ({ focused }) => {
                    let iconName;
                    if (route.name === 'Home') {
                        iconName = "home";
                    } else if (route.name === 'TBR') {
                        iconName = "library-outline"; //change to book-outline!
                    } else if (route.name === 'Profile') {
                        iconName = "person-outline";
                    }

                const customizeSize =25
                
                return (
                    <Ionicons 
                    name={iconName}
                    size= {customizeSize}
                    color={focused ? "#3B82F6" : "gray"}
                    />
                );
                },

                tabBarActiveTintColor: "#3b82f6",
                tabBarLabelStyle: {
                    fontWeight: "bold",
                },
                tabBarInactiveTintColor: "gray",
                tabBarStyle: {
                    backgroundColor: "white",
                    
                },

            })}
        >
            <Tab.Screen name="Home" component={HomeScreen}/>
            <Tab.Screen name="TBR" component={TBRScreen}/>
            <Tab.Screen name="Profile" component={ProfileScreen}/>
        </Tab.Navigator>
        );
};


    return <NavigationContainer>
        <Stack.Navigator
            initialRouteName="Welcome"
            screenOptions={{
                headerShown: false}}
                >
            <Stack.Screen name ="Welcome" component={WelcomeScreen}/>
            <Stack.Screen name ="Login" component={LoginScreen}/>
            <Stack.Screen name ="Register" component={RegisterScreen}/>
            <Stack.Screen name="HomeTabs" component={HomeTabs}/>
            <Stack.Screen name="TBR" component={TBRScreen} />
        </Stack.Navigator>
    </NavigationContainer>;
  }