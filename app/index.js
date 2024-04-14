import { CameraView, useCameraPermissions } from 'expo-camera/next';
import { useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import LoginScreen from './LogIn'
import StoreFront from './StoreFront'

import { router } from 'expo-router';


export default function App() {
  const [facing, setFacing] = useState('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [clicked, setClicked] = useState(false);

  const permisionFunction = async () => {
    const permission = await requestPermission();
    console.log(permission);

    if (permission.granted !== true) {
      alert('Permission for media access needed.');
    }
  };

  function handleClick() {
    setClicked(true);
  }

  const [scanned, setScanned] = useState(null);

  handleScan = (data) => {
    console.log(data);
    setScanned(data);
    router.replace('/StoreFront')
  };

  function toggleCameraFacing() {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  }

  return (
    <View style={styles.container}>
      {clicked ? (
        
          <CameraView
            barcodeScannerSettings={{
              barcodeTypes: ['qr'],
            }}
            onBarcodeScanned={handleScan}
            style={styles.camera}
            facing={facing}
          >
            <View style={styles.scanAreaContainer}>
              <View style={styles.scanAreaSquare} />
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={toggleCameraFacing}
              >
                <Text style={styles.text}>Scan Qr Code</Text>
              </TouchableOpacity>
            </View>
          </CameraView>
        )
       : (
        <LoginScreen setClicked={setClicked}/>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
    color: 'white'
  },
  camera: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanAreaContainer: {
    width: '80%',
    height: '80%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanAreaSquare: {
    width: 200,
    height: 200,
    borderWidth: 2,
    borderRadius: 25,
    borderColor: 'white',
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});