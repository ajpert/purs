import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Appbar, PaperProvider } from "react-native-paper";
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import Icon from "react-native-vector-icons/MaterialCommunityIcons";





const EventManager = (props) => {

    const [EventData, setEventData] = useState([
        {
            "event-name": "table 1"
        },
        {
            "event-name": "table 2"
        },
        {
            "event-name": "table 3"
        },
    ])
    const [phoneNumber, setPhoneNumber] = useState('');

    const handleSubmit = () => {
        // Handle phone number submission logic here
        props.setClicked(true)
        console.log('Phone Number:', phoneNumber);
    };

    return (
        <View style={{ flex: 1, backgroundColor: 'black' }}>
            <Appbar.Header statusBarHeight={30} style={{ backgroundColor: "black" }}>
                <Appbar.BackAction
                    onPress={() => {
                        router.back()
                    }}
                    color={"#F24E1E"}
                />
                <Appbar.Content
                    title="Event Manager"
                    titleStyle={{ color: 'white', fontSize: 30 }} // Adjust fontSize or other styles
                />

            </Appbar.Header>
            <ScrollView>
                <View style={styles.container}>

                    {
                        EventData.map((event) => {
                            return (<>
                                <TouchableOpacity style={styles.button} onPress={() => { console.log("YIPEE") }}>
                                    <View style={styles.buttonContent}>
                                        {/* Left Icon */}
                                        <Icon name="qrcode" size={30} color="black" />

                                        <Text style={styles.buttonText}>{event['event-name']}</Text>

                                        {/* Right Icon */}
                                        <Icon name="arrow-right-bold" size={30} color="black" />
                                    </View>
                                </TouchableOpacity>

                            </>

                            )
                        })
                    }
                    <TouchableOpacity style={styles.addButton} onPress={() => {
                        setEventData([...EventData, {
                            "event-name": "table 1"
                        }])
                    }}>
                        <View style={styles.buttonContent}>

                            <Icon name="plus" size={50} color="white" />
                            <Text style={{ ...styles.buttonText, color: 'white' }}>Add Event</Text>
                        </View>
                    </TouchableOpacity>

                </View>
            </ScrollView>


        </View>
    );
};

const styles = StyleSheet.create({
    container: {

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
        backgroundColor: 'white',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 25,
        height: 80,
        width: '80%',
        justifyContent: 'center',
        marginBottom: 15
    },
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    addButton: {
        backgroundColor: 'black',
        borderWidth: 2,
        borderColor: 'white',
        paddingVertical: 12,
        paddingHorizontal: 30,
        color: 'white',
        borderRadius: 25,
        height: 80,
        width: '80%',
        justifyContent: 'center',
        marginBottom: 10,

    },
    buttonText: {
        color: 'black',
        fontSize: 30,
        fontWeight: 'bold',
    },
});

export default EventManager;