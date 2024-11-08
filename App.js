import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import AppNavigation from './src/navigation/AppNavigation';
import { UserProvider } from './src/constants/UserContext';

export default function App() {
  return (
    <UserProvider>
      <AppNavigation />
    </UserProvider>
  );
}
