import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

const StoreFront = () => {
    const [phoneNumber, setPhoneNumber] = useState('');

    const handleSubmit = () => {
        // Handle phone number submission logic here
        console.log('Phone Number:', phoneNumber);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.prompt}>Hello World</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'black',
        alignItems: 'center',

      },
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
        width: 300,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default StoreFront;