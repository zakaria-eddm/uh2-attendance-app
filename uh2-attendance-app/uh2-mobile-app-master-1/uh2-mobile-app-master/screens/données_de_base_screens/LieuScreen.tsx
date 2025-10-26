import React, { memo, useContext, useEffect, useState } from 'react';
import {View, Text, FlatList,StyleSheet, TouchableOpacity, Alert} from 'react-native';
import { AuthContext } from '../../AuthContext';
import api from '../../ApiService';
import { Navigation } from '../../types';
import Button from '../../components/Button';
import TextInput from '../../components/TextInput';


export interface Lieu {
    name: string;
    building_name: string;
    classroom_number: string;
    capacity: number;
}
type Props = {
    navigation: Navigation;
  };
  
  const LieuScreen = ({ navigation }: Props) => {
    const { userToken, verifyToken } = useContext(AuthContext);
    const [Lieus, setLieus] = useState<Lieu[]>([]);
    const [searchQuery, setSearchQuery] = useState('');

  
    useEffect(() => {
      if (!userToken) navigation.navigate("LoginScreen");
      verifyToken();
      fetchData();
    }, []);
  
    const fetchData = async () => {
      try {
        const response = await api.get('/lieus');
        if (response.data.data && Array.isArray(response.data.data)) {
          setLieus(response.data.data);
        }
          else {
          console.error('Error fetching Lieus: Response data is not an array', response.data.data);
        }
      } catch (error) {
        // console.error('Error fetching Lieus', error);
          // Alert.alert('Erreur','Error fetching Lieus');
      }
    };
  
    const renderItem = ({ item }: { item: Lieu }) => (
      <Button mode='elevated' onPress={() => handleLieuPress(item)}>
          <Text style={{ fontSize: 14 }}>{item.name}</Text>
      </Button>
    );
  
    const handleLieuPress = (Lieu: Lieu) => {
      navigation.navigate('Détail de Lieu', { Lieu });
    };
    const filteredLieus = Lieus.filter(Lieus =>
      Lieus.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
    
  if (!filteredLieus || !renderItem) {
    return <Text>Aucun Lieu disponible.</Text>;}

  
       return (
          <View style={styles.Background}>
             <TextInput
                // style={styles.searchInput}
                placeholder="Rechercher un lieu..."
                value={searchQuery}
                onChangeText={setSearchQuery}
            />
            <FlatList style={styles.container}
           
              data={filteredLieus}
              // data={Lieus}
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
  export default memo(LieuScreen);