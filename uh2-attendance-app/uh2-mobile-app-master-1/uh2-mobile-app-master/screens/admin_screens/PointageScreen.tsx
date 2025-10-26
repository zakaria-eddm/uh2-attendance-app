import React, { memo, useContext, useEffect, useState } from 'react';
import {View, Text, FlatList, TouchableOpacity, Alert, StyleSheet} from 'react-native';
import { AuthContext } from '../../AuthContext';
import api from '../../ApiService';
import TextInput from '../../components/TextInput';
import Button from '../../components/Button';
import { Navigation } from '../../types';

export  interface Pointage {

  name:string;

  schedule:string;

  etudiant:string;

  date_effet: string;

  status: string;

}

type Props = {
    navigation: Navigation;
  };

  const PointageScreen = ({ navigation }: Props) => {
    const { userToken, verifyToken } = useContext(AuthContext);
    const [Pointages, setPointages] = useState<Pointage[]>([]);
    const [searchQuery, setSearchQuery] = useState('');


    useEffect(() => {
      if (!userToken) navigation.navigate("LoginScreen");
      verifyToken();
      fetchData();
    }, []);

    const fetchData = async () => {
      try {
        const response = await api.get('/pointages');
        if (response.data.data && Array.isArray(response.data.data)) {
          setPointages(response.data.data);
        }
          else {
          // console.error('Error fetching schedules: Response data is not an array', response.data.data);
        }
      } catch (error) {
        // console.error('Error fetching Pointage', error);

      }
    };

    const renderItem = ({ item }: { item: Pointage }) => (
      <Button mode='elevated' onPress={() => handlePointagePress(item.name)}>
          <Text style={{ fontSize: 12 }}>{item.name}</Text>
      </Button>
    );
    const handlePointagePress = async (PointageId: string) => {
      try {
          const response = await api.get(`/pointage/${PointageId}`);
          navigation.navigate('Détail de Pointages', { Pointage: response.data.data });
      } catch (error) {
          // console.error(`Error fetching ${tdId}`, error);
      }
  };
    const filteredPointages = Pointages.filter(Pointage =>
        Pointage.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleCreatePointage = async () => {
      navigation.navigate('Ajouter Pointage');
  };
  if (!filteredPointages || !renderItem) {
    return <Text>Aucun Schedule disponible.</Text>;}
       return (
            <View style={styles.Background}>
               <Button mode="elevated" style={{ backgroundColor:"#b0c4de"}} onPress={() => handleCreatePointage()}>
               <Text style={{fontSize: 12,}} > Ajouter Pointage</Text>
               </Button>
              <TextInput
                  // style={styles.searchInput}
                  placeholder="Rechercher un pointage..."
                  value={searchQuery}
                  onChangeText={setSearchQuery}
              />
            <FlatList style={styles.container}
                data={filteredPointages}
              // data={Pointages}
              renderItem={renderItem}
              keyExtractor={(item) => item.name}
              ListEmptyComponent={<Text style={styles.emptyListText}>Chargement...</Text>}
            />
          </View>
    );
  };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    width:"120%",
  },
  Background:{
    flex: 1, 
    padding: 20,
    zIndex: 1, 
    width: '100%', 
    opacity: 1,
    maxWidth: 340,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    },
  searchInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  pointageContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  title: {
    fontSize: 18,
  },
  emptyListText: {
    textAlign: 'center',
    marginTop: 20,
  },
});


export default memo(PointageScreen);

