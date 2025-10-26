
import React, {useContext, useEffect, useState} from 'react';
import { View, Text,StyleSheet,ScrollView ,Alert} from 'react-native';
import Header from '../../components/Header';
import { useRoute, useNavigation } from '@react-navigation/native';
import Button from '../../components/Button';
import {AuthContext} from "../../AuthContext";
import api from "../../ApiService";
import {Navigation} from "../../types";
import { Calendrier } from './CalendrierScreen';
import Frame from '../Frame';
import ReactDOM from 'react-dom';


type Props = {
  route: {
    params: {
        Calendrier: {
        name: string;
        reference_doctype: string;
        subject_field: string;
        start_date_field: string;
        end_date_field: string;
      };
    };
  };
};
type Props2 = {
  navigation: Navigation;
};
const DetailCalendrierScreen = ({  navigation,route }: Props & Props2) => {
  const { Calendrier } = route.params;
  const { userToken, verifyToken } = useContext(AuthContext);
  const navigation1 = useNavigation();


  useEffect(() => {
    if (!userToken) navigation.navigate("LoginScreen");
    // verifyToken();
    // checkUserRole();
}, []);
const handleEditerPress = (Calendrier: Calendrier) => {
  navigation.navigate('Editer Calendrier', { Calendrier });
};
const handleDeleteCalendrier = async (name: string) => {
  try {
      await api.delete(`/calendrier/${name}`);
      Alert.alert('Succès', 'Le Calendrier a été supprimé avec succès.');
      navigation1.goBack();

  } catch (error) {
      // Alert.alert('Erreur', 'Une erreur s\'est produite lors de la suppression du Calendrier.');
  }
};
const handleAffichePress = (Calendrier: Calendrier) => {
  navigation.navigate('CalendarView', { Calendrier });
};
  return (
    
    <><ScrollView  >
    <View style={styles.Background}>
        {/* <Header >{Calendrier?.name || '--'}</Header> */}
        <Frame title={Calendrier?.name || '--'}>
        <View>
        <Button mode="elevated"  onPress={() => handleAffichePress(Calendrier)}>
           <Text style={styles.info}>Afficher le calendrier</Text>
        </Button>
        </View>
      <Text  style={styles.info}>Type du document de référence:</Text>
      <Button mode="contained-tonal">
        <Text style={styles.info}>{Calendrier?.reference_doctype || '--'}</Text>
      </Button>
      <Text  style={styles.info}>sujet :</Text>
      <Button mode="contained-tonal">
        <Text style={styles.info}>{Calendrier?.subject_field || '--'}</Text>
      </Button>
      <Text  style={styles.info}>Date de début:</Text>
      <Button mode="contained-tonal" >
        <Text style={styles.info}>{Calendrier?.start_date_field || '--'}</Text>
      </Button>
      <Text  style={styles.info}>Date de Fin :</Text>
      <Button mode="contained-tonal" >
        <Text style={styles.info}>{Calendrier?.end_date_field || '--'}</Text>
        </Button>
        </Frame>
      <Button mode="contained-tonal" style={styles.EditerButton}  onPress={() => handleEditerPress(Calendrier)}>
          <Text style={styles.edite}>Editer ce calendrier</Text>
      </Button>
      <Button mode="contained-tonal" style={styles.EditerButtons}  onPress={() => handleDeleteCalendrier(Calendrier.name)}>
          <Text style={styles.edite}>Supprimer ce calendrier</Text>
      </Button>
    </View>
    </ScrollView></>
  );
};

const styles = StyleSheet.create({
  Background:{
  flex: 1, padding: 20,zIndex: 1, width: '100%', opacity: 1,
      
      maxWidth: 340,
      alignSelf: 'center',
      alignItems: 'flex-start',
      justifyContent: 'center',
  },
  EditerButton: {
    backgroundColor:"#c0c0c0",
    marginTop:30 
},
EditerButtons: {
  backgroundColor: "#778899",
  // width:'50%'
},
info:{
  fontSize: 13, 
  marginBottom: 2, 
  margin:20
},
edite:{
  fontSize:12, 
  marginBottom: 2, 
  margin:20
},
});
export default DetailCalendrierScreen;
