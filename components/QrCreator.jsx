import QRCode from 'react-native-qrcode-svg';

// Simple usage, defaults for all but the value
export default function QrCreator() {
  return (
    <QRCode
      value="http://awesome.link.qr"
    />
  );
};