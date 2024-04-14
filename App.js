import { CameraView, useCameraPermissions } from 'expo-camera/next';
import { useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import LoginScreen from './LogIn';
export default function App() {
  const [facing, setFacing] = useState('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [clicked, setClicked] = useState(false)

  
  const permisionFunction = async () => {
    // here is how you can get the camera permission\

    const permission = await requestPermission();
    console.log(permission)
    if (
      permission.granted !== true
    ) {
      alert('Permission for media access needed.');
    }
  };


  function handleClick() {
    setClicked(true)
  }

  const [scanned, setScanned] = useState(null);

  handleScan = (data) => {
    console.log(data)
    setScanned(data);
  }
  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  return (
    <View style={styles.container}>
      <LoginScreen />
      {
        /*
        clicked ?
          scanned ? <Text>Scanned</Text> : <CameraView barcodeScannerSettings={{
            barcodeTypes: ["qr"],
          }} onBarcodeScanned={handleScan} style={styles.camera} facing={facing}>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
                <Text style={styles.text}>Flip Camera</Text>
              </TouchableOpacity>
            </View>
          </CameraView> : <Button title='Click Me' onPress={handleClick}>Click Me</Button>
          */
      }


    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  camera: {
    flex: 1,
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
