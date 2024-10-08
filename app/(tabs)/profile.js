import { View, Text } from "react-native";

export default function Profile() {
  return (
    <View>
      <Text>This is the Profile screen!</Text>
      <Text>Include checklist: First and Last Name, username, favorite book right now, user profile pic (maybe), 
        email address, include books that you have read in the past so the alogrithm doesnt recomment it. 
        Current Tropes that you are interested (you selected these from when you created an account)
      </Text>
    </View>
  );
}