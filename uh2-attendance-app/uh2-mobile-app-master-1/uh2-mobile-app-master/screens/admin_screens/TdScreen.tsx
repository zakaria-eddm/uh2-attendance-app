import React, { memo, useContext, useEffect, useState } from 'react';
import {View, Text, FlatList,StyleSheet, TouchableOpacity, Alert} from 'react-native';
import { AuthContext } from '../../AuthContext';
import api from '../../ApiService';
import TextInput from '../../components/TextInput';
import { Navigation } from '../../types';
import Button from '../../components/Button';
export interface Td {
    name: string;
    code_td: string;//Code TD
    ann_univ:string;
    professor: string;
    etudiants: etudiants[];
    department: string;
  }
  export interface etudiants{
    etudiant: string;
  }
  type Props = {
    navigation: Navigation;
  };
  
  const TdScreen = ({ navigation }: Props) => {
    const { userToken, verifyToken } = useContext(AuthContext);
    const [Td, setTd] = useState<Td[]>([]);
    const [searchQuery, setSearchQuery] = useState('');

  
    useEffect(() => {
      if (!userToken) navigation.navigate("LoginScreen");
      verifyToken();
      fetchData();
    }, []);
  
    const fetchData = async () => {
      try {
        const response = await api.get('/td');
        if (response.data.data && Array.isArray(response.data.data)) {
          const uniqueTd = new Set(response.data.data.map(td => td.name));
          const uniqueTdArray = Array.from(uniqueTd).map(name => {
            return response.data.data.find(td => td.name === name);
          });
          setTd(uniqueTdArray);
        } else {
          // console.error('Error fetching Td: Response data is not an array', response.data.data);
        }
      } catch (error) {
        // Alert.alert('Erreur', 'Error fetching Td');
      }
    };
    const  renderItem = ({ item }: { item: Td }) => (
      <Button mode='elevated' onPress={() => handleTdPress(item.name)}>
          <Text style={{ fontSize: 14 }}>{item.code_td}</Text>
      </Button>
    );
  
    
    const handleTdPress = async (tdId: string) => {
      try {
          const response = await api.get(`/td/${tdId}`);
          navigation.navigate('Détail de Td', { Td: response.data.data });
      } catch (error) {
          // console.error(`Error fetching ${tdId}`, error);
      }
  };
  
    const handleCreateTd = async () => {
      navigation.navigate('Ajouter Td');
  };
  const filteredTd = Td.filter(Td =>
    Td.name.toLowerCase().includes(searchQuery.toLowerCase())
);

  if (!filteredTd || !renderItem) {
    return <Text>Aucun Schedule disponible.</Text>;}

  
       return (
          <View style={styles.Background}>
            <Button mode="elevated" style={{ backgroundColor:"#b0c4de"}} onPress={() => handleCreateTd()}>
            <Text style={{fontSize: 12,}} > Ajouter TD</Text>
            </Button>
            <TextInput
                // style={styles.searchInput}
                placeholder="Rechercher un td..."
                value={searchQuery}
                onChangeText={setSearchQuery}
            />
            <FlatList style={styles.container}
              data={filteredTd}
              // data={Td}
              renderItem={renderItem}
              keyExtractor={(item) => item.code_td}
              ListEmptyComponent={ <Text  style={styles.emptyListText}>Chargement...</Text>}
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
    
  
  export default memo(TdScreen);
