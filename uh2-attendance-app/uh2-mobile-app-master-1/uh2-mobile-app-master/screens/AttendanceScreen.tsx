import React, { memo, useContext, useEffect, useState } from 'react';
import Background from '../components/Background';
import Logo from '../components/Logo';
import Header from '../components/Header';
import Paragraph from '../components/Paragraph';
import Button from '../components/Button';
import { Navigation } from '../types';
import QRCodeScannerScreen from '../QrScanner';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import BackButton from '../components/BackButton';
import api from '../ApiService';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { AuthContext } from '../AuthContext';
import { Dialog, Portal } from 'react-native-paper';

type Props = {
  navigation: Navigation;
};

function isUrl(s: string): boolean {
  const urlPattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
  '^(exp?:\\/\\/)?'+
  '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name and extension
  '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
  '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
  '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
  '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
  return !!urlPattern.test(s);
}

const styles = StyleSheet.create({

    background: {
      flex: 1,
      width: '100%'
    },
    container: {
      flex: 1,
      padding: 20,
      width: '100%',
      maxWidth: 300,
      alignSelf: 'center',
      alignItems: 'center',
      justifyContent: 'center'
    },
    picker: {
      width: '100%',
      paddingBottom: 40
      // Add other styles for the Picker
    },
    pickerStudent: {
      width: '100%',
      paddingBottom: 40,
      fontWeight: 'bold'
      // Add other styles for the Picker
    }

});


const AttendanceScreen = ({ navigation }: Props) => {

  const [data, setData] = useState([]);
  const [selectedValue, setSelectedValue] = useState(""); 
  
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  const [member, setMember] = useState({});

  const { userToken, verifyToken } = useContext(AuthContext);

  const [visible, setVisible] = React.useState(false);

  const [pickerColor, setPickerColor] = React.useState('black');

  const [errorContent, setErrorContent] = React.useState('');

  const hideDialog = () => setVisible(false);

  useEffect(() => {
    //console.log("Verifying");
    verifyToken();
    if(!userToken) navigation.navigate("LoginScreen");
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const markAttendance = async ({}) => {

    const mark = {
      student: member.name,
      schedule: selectedValue
    }
    
    try {
      //console.log(mark);
      const response = await api.post('/markAttendance', mark); // Replace with your endpoint
      //console.log(response.data.data);
      setScanned(false);
      setMember({});
      setPickerColor('black');
    } catch (error) {
      setScanned(false);
      setMember({});
      setPickerColor('black');
      setErrorContent("Cet etudiant est deja marque present sur l'ordannancement choisi");
      setVisible(true);
      //console.error('Error fetching data', error.toJSON());
    }
    
  };

  const handleBarCodeScanned = async ({ type, data }) => {
    // console.log("Scanned: "+data)
    if(isUrl(data)) {
      setErrorContent("QR Code invalide");
      setVisible(true);
    }
    else {
      setMember({ cne: '-', nom: 'Searching', prenom: 'student ...', name: '-'});
      try {
        const response = await api.get('/checkStudent/'+data); // Replace with your endpoint
        setMember(response.data.data);
        setScanned(true);
        setPickerColor('blue');
        //console.log(response.data.data);
      } catch (error) {
        setMember({});
        setErrorContent("QR Code n'appartient a aucun etudiant inscrit");
        setVisible(true);
        //console.error('Error fetching data', error.toJSON());
      }
    }

    //alert(`Scanned QR code of type ${type} with data: ${data}`);
  };

  useEffect(() => {
    const fetchData = async () => {
      //console.log(api.getUri());
      try {
        const response = await api.get('/schedules'); // Replace with your endpoint
        setData(response.data.data);
        //console.log(response.data.data)
        if (response.data.data.length > 0) {
          setSelectedValue(response.data.data[0].name);
           // Set the first course as the default selected course
        }
      } catch (error) {
        console.error('Error fetching data', error.toJSON());
      }
    };

    fetchData();
  }, []);

  return (
<>
  <View
      style={[
        styles.container,
        {
          // Try setting `flexDirection` to `"row"`.
          flexDirection: 'column',
          width: '100%', height: '100%'
        },
      ]}>
    
      <View style={{ paddingTop: 50, flex: 1, width: '100%', justifyContent: 'center', alignItems: 'center' }}>
        {/* <Text style={{ fontSize: 24, textAlign: 'center' }}>Appliquer une presence</Text> */}
        <Picker
          selectedValue={selectedValue}
          onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
          style={styles.picker}
        >
          {data.map((item, index) => (
            <Picker.Item style key={index} label={`${item.schedule_code} - ${item.location} - ${item.start_datetime}`} value={item.name} />
          ))}
        </Picker>
      </View>



      <View style={{ paddingTop: 50, flex: 1, width: '100%', justifyContent: 'center', alignItems: 'center' }}>
        <Picker
          selectedValue={member}
          style={styles.pickerStudent}
        >
          {(member.cne) && (
            <Picker.Item color={pickerColor} label={`${member.nom} ${member.prenom}`} value={member.name} />
          )}

        </Picker>
      </View>

      <View style={{ flex: 2, width: '100%', justifyContent: 'center', alignItems: 'center' }}>

        <BarCodeScanner
          onBarCodeScanned={scanned ? false : handleBarCodeScanned}
          style={{ width: '100%', height: '100%'}}
        />
        {/* {scanned && (
          <TouchableOpacity onPress={() => setScanned(false)}>
            <Text>Tap to Scan Again</Text>
          </TouchableOpacity>
        )} */}
      </View>

      <View style={{ flex: 1, paddingHorizontal: 30, paddingBottom: 20, width: '100%' }}>
        {scanned && (
              <Button mode="contained" onPress={markAttendance}>
                Mark attendance
              </Button>
        )}
      </View> 

      {/* Optional Footer Section */}
    </View>

    <Dialog visible={visible} onDismiss={hideDialog}>
      <Dialog.Content>
        <Text style={{ textAlign: 'center', fontSize: 20, color: 'red' }}>{errorContent}</Text>
      </Dialog.Content>
      <Dialog.Actions>
        <Button onPress={() => hideDialog() }>Cancel</Button>
      </Dialog.Actions>
    </Dialog>

    </>
  );
  
};

export default memo(AttendanceScreen);
