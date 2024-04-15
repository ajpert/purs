import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const BankScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome to App 👋</Text>
      <View style={styles.textContainer}>
        <Text style={styles.normalText}>Connect your banking information</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 20,
    justifyContent: 'flex-start', // Align children to the top
    alignItems: 'center',
    backgroundColor: 'black',
  },
  text: {
    marginTop: 100,
    fontSize: 40,
    fontStyle: 'normal',
    color: '#fff', // White text color
  },
  textContainer: {
    alignSelf: 'flex-start',
    marginLeft: 50,
  },
  normalText: {
    fontSize: 18,
    fontStyle: 'normal',
    color: '#fff', // White text color
    textAlign: 'left',
    marginTop: 10,
  },
});

export default BankScreen;
