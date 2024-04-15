import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';

const ChoiceScreen = () => {
    const [phoneNumber, setPhoneNumber] = useState('');

    const handleSubmit = () => {
        // Handle phone number submission logic here
        console.log('Phone Number:', phoneNumber);
    };

    return (
        <View style={styles.container}>
          <Text style={styles.text}>Let's Figure You Out 👋</Text>
          <View style={styles.textContainer}>
            <Text style={styles.normalText}>Are you a customer or a Merchant ?</Text>
          </View>
          <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={[styles.button, styles.buttonCustomer]}
                    onPress={() => handleRoleSelection('Customer')}>
                    <Image
                    style={styles.buttonLogo}
                    source={require('../assets/merchant.svg')}
                    />
                    <Text style={styles.buttonText}>Customer</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.button, styles.buttonMerchant]}
                    onPress={() => handleRoleSelection('Merchant')}>
                    <Text style={styles.buttonText}>Merchant</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start', // Align children to the top
        alignItems: 'center',
        backgroundColor: 'black',
    },
    text: {
        marginTop: 100,
        fontSize: 35,
        color: '#fff', // White text color
    },
    textContainer: {
        alignSelf: 'stretch',
        marginLeft: 30,
        marginRight: 20,
        marginTop: 20,
    },
    normalText: {
        fontSize: 18,
        color: '#fff', // White text color
        textAlign: 'left',
        marginLeft: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 150,
        width: '100%',
        marginRight: 20,
    },
    button: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        width: '40%',
        height: 100,
    },
    buttonCustomer: {
        backgroundColor: '#FFC94A', // Green color for customer button
    },
    buttonMerchant: {
        backgroundColor: '#5BBCFF', // Orange color for merchant button
    },
    buttonText: {
        fontSize: 18,
        color: '#fff', // White text color
        textAlign: 'center',
    },
    buttonLogo: {
        width: 20, // Adjust these values as needed
        height: 20, // Adjust these values as needed
        marginRight: 10, // Add some margin to separate the logo from the text
      },
});


export default ChoiceScreen;