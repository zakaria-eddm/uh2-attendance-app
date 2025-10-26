import React, { memo, useContext, useEffect, useState } from 'react';
import {View, Text, FlatList,StyleSheet, TouchableOpacity, Alert} from 'react-native';
import { AuthContext } from '../../AuthContext';
import api from '../../ApiService';
import { Navigation } from '../../types';
import {Faculty} from './FacultyScreen';
import Button from '../../components/Button';
import TextInput from '../../components/TextInput';

export  interface University {

  name:string;

  short_name:string;

  complet_name:string;

  faculties: string[];
}

type Props = {
    navigation: Navigation;
  };
  
  const UniversityScreen = ({ navigation }: Props) => {
    const { userToken, verifyToken } = useContext(AuthContext);
    const [University, setUniversity] = useState<University[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
  
    useEffect(() => {
      if (!userToken) navigation.navigate("LoginScreen");
      verifyToken();
      fetchData();
    }, []);
    const fetchData = async () => {
      try {
        const response = await api.get('/universites');
        if (response.data.data && Array.isArray(response.data.data)) {
          const uniqueUniversity = new Set(response.data.data.map(university => university.name));
          const uniqueUniversityArray = Array.from(uniqueUniversity).map(name => {
            return response.data.data.find(university => university.name === name);
          });
          setUniversity(uniqueUniversityArray);
        } else {
          // console.error('Error fetching University: Response data is not an array', response.data.data);
        }
      } catch (error) {
        // console.error('Error fetching University', error);
        // Alert.alert('Erreur', 'Error fetching University');
      }
    };
    const renderItem = ({ item }: { item: University }) => (
      <Button mode='elevated' onPress={() => handleUniversityPress(item)}>
          <Text style={{ fontSize: 14 }} >{item.name}</Text>
      </Button>
    );
  
    const handleUniversityPress = (University: University) => {
      navigation.navigate('Détail de Université', { University });
    };
    const filteredUniversity = University.filter(Schedules =>
        Schedules.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
      
    if (!filteredUniversity || !renderItem) {
      return <Text>Aucun University disponible.</Text>;}

       return (
          <View style={styles.Background}>
              <TextInput
                // style={styles.searchInput}
                placeholder="Rechercher un université..."
                value={searchQuery}
                onChangeText={setSearchQuery}
            />
            <FlatList style={styles.container}
              data={filteredUniversity}
              // data={University}
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
  export default memo(UniversityScreen);

