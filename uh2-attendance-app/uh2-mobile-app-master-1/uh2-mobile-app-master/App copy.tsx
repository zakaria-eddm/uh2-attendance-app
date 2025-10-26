import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import QRCodeScannerScreen from './QrScanner';

export default function App() {
  return (
    // <View style={styles.container}>
    //   <Text>Open up App.js to start working on your app! UH2 Test</Text>
    //   <StatusBar style="auto" />
    //   <QRCodeScannerScreen></QRCodeScannerScreen>
    // </View>
    //<ScanScreen></ScanScreen>

    <QRCodeScannerScreen></QRCodeScannerScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
