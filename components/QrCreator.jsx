import React, { useRef } from 'react';
import QRCode from 'react-native-qrcode-svg';
import ViewShot from 'react-native-view-shot';
import { Button, StyleSheet, View } from 'react-native';
import * as Sharing from 'expo-sharing';
import * as Print from 'expo-print';

export default function QrCreator() {
  const viewShotRef = useRef(null);
  const LogoFromFile = require('../assets/favicon.png')
  const printToPDF = async () => {
    try {


      const result = await viewShotRef.current.capture();
      const pdf = await Sharing.shareAsync(result, { UTI: '.pdf', mimeType: 'application/pdf' });
    } catch (error) {
      console.error('Error printing PDF:', error);
    }
  };

  return (
    <View style={styles.container}>
      <ViewShot ref={viewShotRef} options={{ format: 'png', quality: 1 }}>
        <View style={styles.qrCodeContainer}>
          <QRCode logo={LogoFromFile} value="http://awesome.link.qr" size={100} />
        </View>
      </ViewShot>
      <Button title="Print to PDF" onPress={printToPDF} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrCodeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
});