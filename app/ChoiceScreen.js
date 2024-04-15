import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, StyleSheet, Image, Modal, Button } from 'react-native';
import { router } from 'expo-router';

import { useAuth } from '../hooks/useAuth';

const ChoiceScreen = () => {

    const [modalVisible, setModalVisible] = useState(false);

    const handleSubmit = () => {
        // Handle phone number submission logic here
        console.log('Phone Number:', phoneNumber);
        
    };

    handleRoleSelection = (role) => {
        console.log(role);
        if(role == 'Customer') {
            router.push('/scan')
        }
        else if(role == 'Bank') {
            setModalVisible(true);
        }
        else if(role =='Merchant') {
            router.push('/event-manager')
        }
        
    };
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Let's Figure You Out 👋</Text>
            <View style={styles.textContainer}>
                <Text style={styles.normalText}>Are you a customer or a Merchant?</Text>
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={[styles.button, styles.buttonBank]}
                    onPress={() => handleRoleSelection('Bank')}>
                    <Image style={styles.buttonLogo} source={require('../assets/bank.png')} />
                    <Text style={styles.buttonText}>Connect to Bank</Text>
                    <Image style={styles.buttonEdit} source={require('../assets/edit.png')} />
                    <BankConnectionModal visible={modalVisible} onClose={() => setModalVisible(false)} />
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.button, styles.buttonCustomer]}
                    onPress={() => handleRoleSelection('Customer')}>
                    <Image
                    style={styles.buttonLogo}
                    source={require('../assets/customer.png')}
                    />
                    <Text style={styles.buttonText}>Customer</Text>

                    <Image
                    style={styles.buttonArrow}
                    source={require('../assets/arrow-1.png')}
                    />
                    
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.button, styles.buttonMerchant]}
                    onPress={() => handleRoleSelection('Merchant')}>
                    <Image
                    style={styles.buttonLogo}
                    source={require('../assets/merchant-1.png')}
                    />
                    <Text style={styles.buttonText}>Merchant</Text>
                    <Image
                    style={styles.buttonArrow}
                    source={require('../assets/arrow-1.png')}
                    />
                </TouchableOpacity> 
            </View>
        </View>
    );
};

const BankConnectionModal = ({ visible, onClose }) => {
    const [accountNumber, setAccountNumber] = useState('');
    const [routingNumber, setRoutingNumber] = useState('');
    const [accountHolderName, setAccountHolderName] = useState('');
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <TextInput
                        style={styles.input}
                        onChangeText={setAccountNumber}
                        value={accountNumber}
                        placeholder="Account Number"
                    />
                    <TextInput
                        style={styles.input}
                        onChangeText={setRoutingNumber}
                        value={routingNumber}
                        placeholder="Routing Number"
                    />
                    <TextInput
                        style={styles.input}
                        onChangeText={setAccountHolderName}
                        value={accountHolderName}
                        placeholder="Account Holder Name"
                    />
                    <Button
                        title="Submit"
                        onPress={onClose}
                    />
                </View>
            </View>
        </Modal>
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
        color: '#fff', 
        textAlign: 'left',
        marginLeft: 10,
    },
    buttonContainer: {
        flexDirection: 'column',
       
        marginTop: 50,
        width: '100%',
        
    },
    button: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 20,
        alignItems: 'center',
        borderRadius: 40,
        marginLeft: 40,
        width: '80%',
        height: 100,
    },
    buttonCustomer: {
        
        backgroundColor: '#FFC94A', 
    },
    buttonMerchant: {
        backgroundColor: '#5BBCFF', 
    },
    buttonBank: {
        backgroundColor: '#fff', 
    },
    buttonText: {
        fontSize: 25,
        color: '#fff', 
        textAlign: 'center',
        color: 'black',
    },
    buttonLogo: {
        width: 40, 
        height: 40, 
        marginLeft: 30, 
        marginRight: 10, 
      },
    buttonArrow: {
        width: 40, 
        height: 40, 
        marginLeft: 10, 
       
    },
    buttonEdit: {
        width: 40, 
        height: 40, 
        marginLeft: 10,
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        width: 200,
    }
});


export default ChoiceScreen;