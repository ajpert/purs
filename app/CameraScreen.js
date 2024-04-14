import { CameraView, useCameraPermissions } from 'expo-camera/next';
import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';

const CameraScreen = ({ navigation }) => {
  const [facing, setFacing] = useState('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [invalidQRCode, setInvalidQRCode] = useState(false);
  const [stopScanning, setStopScanning] = useState(false);
  const [cameraEnabled, setCameraEnabled] = useState(true);

  const permisionFunction = async () => {
    const permission = await requestPermission();
    console.log(permission);
    if (permission.granted !== true) {
      alert('Permission for media access needed.');
    }
  };

  const handleScan = (data) => {
    console.log(data.data);
    try {
      const scannedData = JSON.parse(data.data);
      if (scannedData.store_id === '1' && scannedData.qr_reference === '1') {
        setInvalidQRCode(false);
        setStopScanning(true);
        setCameraEnabled(false); // Disable the camera
        router.push('/StoreFront')
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
    <CameraView
      barcodeScannerSettings={{
        barcodeTypes: ['qr'],
      }}
      onBarcodeScanned={stopScanning ? undefined : handleScan}
      style={styles.camera}
      facing={facing}
      enabled={cameraEnabled} // Control camera enabled state
    >
      <View style={styles.scanAreaContainer}>
        <View style={styles.scanAreaSquare} />
        {invalidQRCode && (
          <Text style={styles.invalidQRCodeText}>Unrecognizable QR code</Text>
        )}
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
          <Text style={styles.text}>Scan Qr Code</Text>
        </TouchableOpacity>
      </View>
    </CameraView>
  );
};


const styles = StyleSheet.create({
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

export default CameraScreen;