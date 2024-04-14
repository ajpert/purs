import { CameraView, useCameraPermissions } from 'expo-camera/next';
import { useState, useCallback } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import LoginScreen from './LogIn'
import StoreFront from './StoreFront'


export default function App() {
  const [facing, setFacing] = useState('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [clicked, setClicked] = useState(false);
  const [invalidQRCode, setInvalidQRCode] = useState(false);
  const [stopScanning, setStopScanning] = useState(false);



  const [isCameraMounted, setIsCameraMounted] = useState(false)

  const permisionFunction = async () => {
    const permission = await requestPermission();
    console.log(permission);
    if (permission.granted !== true) {
      alert('Permission for media access needed.');
    }
  };

  useFocusEffect(
    useCallback(() => {
        setIsCameraMounted(true);
      return () => {
        setIsCameraMounted(false);
      };
    }, [])
  );

  function handleClick() {
    setClicked(true);
  }

  const [scanned, setScanned] = useState(null);

  const handleScan = (data) => {
    console.log(data.data);
    try {
      const scannedData = JSON.parse(data.data);
      if (
        scannedData.store_id === '1' &&
        scannedData.qr_reference === '1'
      ) {
        setScanned(data);
        setInvalidQRCode(false);
        
        setIsCameraMounted(false)
        router.push('/StoreFront');


      } else {
        console.log('Invalid QR code format');
        setInvalidQRCode(true);
      }
    } catch (error) {
      console.log('Error parsing scanned data:', error);
      setInvalidQRCode(true);
    }
  };

  function toggleCameraFacing() {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  }

  return (
    <View style={styles.container}>
      {clicked ? ( isCameraMounted ?
        <CameraView
          barcodeScannerSettings={{
            barcodeTypes: ['qr'],
          }}
          onBarcodeScanned={stopScanning ? undefined : handleScan}
          style={styles.camera}
          facing={facing}
        >
          <View style={styles.scanAreaContainer}>
            <View style={styles.scanAreaSquare} />
            {invalidQRCode && (
              <Text style={styles.invalidQRCodeText}>
                Unrecognizable QR code
              </Text>
            )}
          </View>
          <View style={styles.buttonContainer}>

              <Text style={styles.text}>Scan Qr Code</Text>

          </View>
        </CameraView> : <></>
      ) : (
        <LoginScreen setClicked={setClicked} />
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
    color: 'white',
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
  invalidQRCodeText: {
    color: 'red',
    fontSize: 18,
    marginTop: 10,
  },
});