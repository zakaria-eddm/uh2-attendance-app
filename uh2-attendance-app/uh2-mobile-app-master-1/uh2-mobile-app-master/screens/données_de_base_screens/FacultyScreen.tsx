import React, { memo, useContext, useEffect, useState } from 'react';
import {View, Text, FlatList, TouchableOpacity, Alert, StyleSheet} from 'react-native';
import { AuthContext } from '../../AuthContext';
import api from '../../ApiService';
import { Navigation } from '../../types';

import Button from '../../components/Button';
import TextInput from '../../components/TextInput';

export  interface Faculty {

  name:string;

  short_name:string;

  complet_name:string;

  // departments: string[];
  
  university: string;
}

type Props = {
    navigation: Navigation;
  };
  
  const FacultyScreen = ({ navigation }: Props) => {
    const { userToken, verifyToken } = useContext(AuthContext);
    const [Facultys, setFacultys] = useState<Faculty[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
  
    useEffect(() => {
      if (!userToken) navigation.navigate("LoginScreen");
      verifyToken();
      fetchData();
    }, []);
    const fetchData = async () => {
      try {
        const response = await api.get('/faculte');
  
        if (response.data.data && Array.isArray(response.data.data)) {
          const uniqueFacultys = new Set(response.data.data.map(faculty => faculty.name));
          const uniqueFacultysArray = Array.from(uniqueFacultys).map(name => {
            return response.data.data.find(faculty => faculty.name === name);
          });
          setFacultys(uniqueFacultysArray);
        } else {
          // console.error('Error fetching facultes : Response data is not an array', response.data.data);
        }
      } catch (error) {
        // console.error('Error fetching Faculty', error);
        // Alert.alert('Erreur', 'Error fetching Faculty');
      }
    };
    const renderItem = ({ item }: { item: Faculty }) => (
      <Button mode="elevated" onPress={() => handleFacultyPress(item)}>
          <Text style={{ fontSize: 14 }}>{item.name}</Text>
      </Button>
    );
  
    const handleFacultyPress = (Faculty: Faculty) => {
      navigation.navigate('Détail de Faculté', { Faculty });
    };
    const filteredFacultys = Facultys.filter(Facultys =>
        Facultys.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (!filteredFacultys || !renderItem) {
      return <Text>Aucun Faculty disponible.</Text>;}


    return (
        <View style={styles.Background}>
          <TextInput
              // style={styles.searchInput}
              placeholder="Rechercher un faculté..."
              value={searchQuery}
              onChangeText={setSearchQuery}
          />
          <FlatList style={styles.container}
              data={filteredFacultys}
              // data={Facultys}
              renderItem={renderItem}
              keyExtractor={(item) => item.name}
              ListEmptyComponent={<Text style={styles.emptyListText} >Chargement...</Text>}
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
  emptyListText: {
    textAlign: 'center',
    marginTop: 20,
  },
});
  export default memo(FacultyScreen);

