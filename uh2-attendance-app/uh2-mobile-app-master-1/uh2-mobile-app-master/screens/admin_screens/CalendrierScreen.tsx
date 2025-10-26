import React, { memo, useContext, useEffect, useState } from 'react';
import {View, Text,SafeAreaView, StyleSheet,FlatList, Alert } from 'react-native';
import { AuthContext } from '../../AuthContext';
import Button from '../../components/Button';
import TextInput from '../../components/TextInput';
import api from '../../ApiService';
import { Navigation } from '../../types';
export  interface Calendrier {

  name: string;
  reference_doctype: string;
  subject_field: string;
  start_date_field: string;
  end_date_field: string;
}

type Props = {
    navigation: Navigation;
  };

  const CalendrierScreen = ({ navigation }: Props) => {
    const { userToken, verifyToken } = useContext(AuthContext);
    const [Calendriers, setCalendriers] = useState<Calendrier[]>([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
      if (!userToken) navigation.navigate("LoginScreen");
      verifyToken();
      fetchData();
    }, []);
    

    const fetchData = async () => {
      try {
        const response = await api.get('/calendriers');
        if (response.data.data && Array.isArray(response.data.data)) {
        setCalendriers(response.data.data);
      }
      else {
        // console.error('Error fetching calendriers: Response data is not an array', response.data.data);
      }
      } catch (error) {
        // console.error('Error fetching Calendrier', error);
        // Alert.alert('Erreur','Error fetching Calendrier');
      }
    };

    const renderItem = ({ item }: { item: Calendrier }) => (
      <Button mode='elevated' onPress={() => handleCalendrierPress(item.name)}>
          <Text style={{ fontSize: 14 }}>{item.name}</Text>
      </Button>
    );
 
    const handleCalendrierPress = async (CalendrierId: string) => {
      try {
          const response = await api.get(`/calendrier/${CalendrierId}`);
          navigation.navigate('Détail de Calendrier', { Calendrier: response.data.data });
      } catch (error) {
          // console.error(`Error fetching ${tdId}`, error);
      }
  };
    const filteredCalendriers = Calendriers.filter(Calendriers =>
        Calendriers.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  const handleCreateCalendrier = async () => {
    navigation.navigate('Ajouter Calendrier');
};


  if (!filteredCalendriers || !renderItem) {
    return <Text>Aucun Schedule disponible.</Text>;}
       return ( 
          <View style={styles.Background}>
            <Button mode="elevated" style={{ backgroundColor:"#b0c4de"}} onPress={() => handleCreateCalendrier()}>
            <Text style={{fontSize: 12,}} > Ajouter Calendrier</Text>
          </Button>
            <TextInput
                // style={styles.searchInput}
                placeholder="Rechercher un Calendrier..."
                value={searchQuery}
                onChangeText={setSearchQuery}
            />
            <FlatList  style={styles.container}
                data={filteredCalendriers}
              // data={Calendriers}
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
  container1: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
 Background:{
    flex: 1, 
    padding: 20,
    zIndex: 1, 
    width: '100%', opacity: 1,
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
  CalendrierContainer: {
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



  export default memo(CalendrierScreen);




