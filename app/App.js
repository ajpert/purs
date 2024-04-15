import { CameraView, useCameraPermissions } from 'expo-camera/next';
import { useState, useCallback, useEffect } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { router, useFocusEffect } from 'expo-router';

import ChoiceScreen from './ChoiceScreen'


export default function App() {
  const [session, setSession] = useState(null);
  const [phone, setPhone] = useState("");
  const [sentCode, setSentCode] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return (
    <View style={styles.container}>
      {/* {clicked ? ( isCameraMounted ?
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
      )} */}
      <ChoiceScreen />
      
    </View>
  );
}

const styles = StyleSheet.create({
  subheader: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20,
  },
});
