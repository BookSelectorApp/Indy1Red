import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { loginUser } from '../api/API';
import { useUser } from '../constants/UserContext';

export default function LoginScreen({ navigation }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { setUserId } = useUser(); //from UserContext.js

    const handleLogin = async () => {
        const result = await loginUser(username, password)
        if (result.message === "Login successful") {
            setUserId(result.user_id); //set userid in context
            navigation.navigate("HomeTabs");  //nav to main screen after successful login
        } else {
            return Alert.alert("Error", "Invalid credentials");
            //console.log(result.detail);
        }        
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>
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
            <Button title="Login" onPress={handleLogin} />
            <Button title="Register" onPress={() => navigation.navigate("Register")} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 16 },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
    input: { borderWidth: 1, padding: 8, marginVertical: 10, borderRadius: 5 }
});