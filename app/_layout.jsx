import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack>
      {/* Login Screen */}
      <Stack.Screen 
        name="login" 
        options={{ headerShown: false }} 
      />

      {/* Preference Page */}
      <Stack.Screen
        name="preferences"
        options={{ title: "Preferences" }}
      />

      {/* Swipe Page */}
      <Stack.Screen 
        name="swipe" 
        options={{ title: "Discover Books" }} 
      />

      {/* Tab Navigation */} // check to see if you need this here 
      <Stack.Screen 
        name="(tabs)" 
        options={{ headerShown: false }} // Hides the header on the tab screen
      />

    </Stack>
  );
}
