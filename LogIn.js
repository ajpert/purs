import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

const LoginScreen = () => {
    const [phoneNumber, setPhoneNumber] = useState('');

    const handleSubmit = () => {
        // Handle phone number submission logic here
        console.log('Phone Number:', phoneNumber);
    };

    return (
        <>
            <Text style={styles.prompt}>Enter your phone number</Text>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Phone Number"
                    keyboardType="phone-pad"
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                />
            </View>
            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
        </>
    );
};

const styles = StyleSheet.create({

    prompt: {
        fontSize: 18,
        marginBottom: 20,
        color: 'white'
    },
    inputContainer: {
        backgroundColor: '#f0f0f0',
        borderRadius: 15,
        paddingHorizontal: 15,
        paddingVertical: 10,
        marginBottom: 20,
        width: 300,
        height: 50,
        justifyContent: 'center'
    },
    input: {
        fontSize: 16,
    },
    button: {
        backgroundColor: '#007aff',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 25,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default LoginScreen;