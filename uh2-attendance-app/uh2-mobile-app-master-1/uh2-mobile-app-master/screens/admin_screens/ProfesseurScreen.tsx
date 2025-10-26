import React, { memo, useContext, useEffect, useState } from 'react';
import {View, Text, FlatList, Alert,StyleSheet} from 'react-native';
import { AuthContext } from '../../AuthContext';
import api from '../../ApiService';
import { Navigation } from '../../types';
import Button from '../../components/Button';
import TextInput from '../../components/TextInput';

export  interface Professeur {

  name:string;

  full_name:string;//Nom complet

  nom:string;

  prenom:string;

  cin: string;

  univ_email: string;

  perso_email: string;

  department: string;
  
}

type Props = {
    navigation: Navigation;
  };
  
  const ProfesseurScreen = ({ navigation }: Props) => {
    const { userToken, verifyToken } = useContext(AuthContext);
    const [Professeurs, setProfesseurs] = useState<Professeur[]>([]);
    const [searchQuery, setSearchQuery] = useState('');

  
    useEffect(() => {
      if (!userToken) navigation.navigate("LoginScreen");
      verifyToken();
      fetchData();
    }, []);
  
    const fetchData = async () => {
      try {
        const response = await api.get('/professeurs');
        if (response.data.data && Array.isArray(response.data.data)) {
          setProfesseurs(response.data.data);
        }
          else {
          // console.error('Error fetching Professeurs: Response data is not an array', response.data.data);
        }
      } catch (error) {
        // console.error('Error fetching Professeur', error);
        // Alert.alert('Erreur','Error fetching Professeur');
      }
    };
  
    const renderItem = ({ item }: { item: Professeur }) => (
      <Button mode='elevated' onPress={() => handleProfesseurPress(item.name)}>
          <Text style={{ fontSize: 14 }}>{item.name}</Text>
      </Button>
    );
    const handleProfesseurPress = async (ProfesseurId: string) => {
      try {
          const response = await api.get(`/professeur/${ProfesseurId}`);
          navigation.navigate('Détail de Professeur', { Professeur: response.data.data });
      } catch (error) {
          // console.error(`Error fetching ${tdId}`, error);
      }
  };
    const handleCreateProfesseur = async () => {
      navigation.navigate('Ajouter Professeur');
  };
  const filteredProfesseurs = Professeurs.filter(Schedules =>
    Schedules.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  if (!filteredProfesseurs || !renderItem) {
    return <Text>Aucun Schedule disponible.</Text>;}
       return (
        <View style={styles.Background}>
        <Button mode="elevated" style={{ backgroundColor:"#b0c4de"}} onPress={() => handleCreateProfesseur()}>
         <Text style={{fontSize: 12,}} > Ajouter Professeur</Text>
        </Button>
        <TextInput
             // style={styles.searchInput}
             placeholder="Rechercher un professeur..."
             value={searchQuery}
             onChangeText={setSearchQuery}
         />
       
         {/* <FlatList style={styles.container} */}
         <FlatList style={styles.container}
              data={filteredProfesseurs}
              // data={Professeurs}
              renderItem={renderItem}
              keyExtractor={(item) => item.name}
              ListEmptyComponent={<Text  style={styles.emptyListText} >Chargement...</Text>}
            />
          </View>
    );
  };
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 10,
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
  export default memo(ProfesseurScreen);

