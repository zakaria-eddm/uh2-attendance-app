import React, { memo, useContext, useEffect, useState } from 'react';
import {View, Text, FlatList, TouchableOpacity, Alert, StyleSheet} from 'react-native';
import { AuthContext } from '../../AuthContext';
import api from '../../ApiService';
import { Navigation } from '../../types';
import TextInput from '../../components/TextInput';
import Button from '../../components/Button';


export  interface Etudiant {

  name:string;

  cne:string;

  nom:string;

  prenom:string;

  cin: string;

  cycle: string;

  filiere: string;

  semestre: string;

  univ_email: string;

  perso_email: string;
  
}

type Props = {
    navigation: Navigation;
  };
  
  const EtudiantScreen = ({ navigation }: Props) => {
    const { userToken, verifyToken } = useContext(AuthContext);
    const [Etudiants, setEtudiants] = useState<Etudiant[]>([]);
    const [searchQuery, setSearchQuery] = useState('');

  
    useEffect(() => {
      if (!userToken) navigation.navigate("LoginScreen");
      verifyToken();
      fetchData();
    }, []);
  
    const fetchData = async () => {
      try {
        const response = await api.get('/students');
        if (response.data.data && Array.isArray(response.data.data)) {
          setEtudiants(response.data.data);
        }
        else {
          // console.error('Error fetching students: Response data is not an array', response.data.data);
        }
      } catch (error) {
        // Alert.alert('Erreur','Error fetching Etudiant');

      }
    };
  
    const renderItem = ({ item }: { item: Etudiant}) => (
      <Button mode="elevated" onPress={() => handleEtudiantPress(item.name)}>
          <Text style={{ fontSize: 14 }}>{item.name}</Text>
      </Button>
    );
  
    
    const handleEtudiantPress = async (EtudiantId: string) => {
      try {
          const response = await api.get(`/student/${EtudiantId}`);
          navigation.navigate('Détail de Etudiant', { Etudiant: response.data.data });
      } catch (error) {
          // console.error(`Error fetching ${tdId}`, error);
      }
  };

    const handleCreateEtudiant = async () => {
      navigation.navigate('Ajouter Etudiant');
    };
    const filteredEtudiants = Etudiants.filter(Etudiants =>
        Etudiants.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (!filteredEtudiants || !renderItem) {
      return <Text>Aucun Students disponible.</Text>;}


    return (
          <View style={styles.Background}>
          <Button mode="elevated" style={{ backgroundColor:"#b0c4de"}} onPress={() => handleCreateEtudiant()}>
            <Text style={{fontSize: 12,}} > Ajouter Etudiant</Text>
          </Button>
          <TextInput
              // style={styles.searchInput}
              placeholder="Rechercher un étudiant..."
              value={searchQuery}
              onChangeText={setSearchQuery}
          />

          <FlatList style={styles.container}
              data={filteredEtudiants}
              // data={Etudiants}
              renderItem={renderItem}
              keyExtractor={(item) => item.name}
              ListEmptyComponent={
              <Text style={styles.emptyListText}>Chargement...</Text>}
            />
          </View>
    );
  };
const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // padding: 10,
    width:"120%"
  },
  Background:{
    flex: 1, padding: 20,
    zIndex: 1,
    width: '100%',
    opacity: 1,
    maxWidth: 340,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyListText: {
    textAlign: 'center',
    marginTop: 20,
  },
});
  export default memo(EtudiantScreen);

