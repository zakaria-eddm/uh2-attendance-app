import React, { memo, useContext, useEffect, useState } from 'react';
import {View, Text, FlatList,StyleSheet, TouchableOpacity, Alert} from 'react-native';
import { AuthContext } from '../../AuthContext';
import api from '../../ApiService';
import TextInput from '../../components/TextInput';
import { Navigation } from '../../types';
import Button from '../../components/Button';
export interface Tp {
    name: string;
    code_tp: string;//Code TP
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
  
  const TpScreen = ({ navigation }: Props) => {
    const { userToken, verifyToken } = useContext(AuthContext);
    const [Tp, setTp] = useState<Tp[]>([]);
    const [searchQuery, setSearchQuery] = useState('');

  
    useEffect(() => {
      if (!userToken) navigation.navigate("LoginScreen");
      verifyToken();
      fetchData();
    }, []);
    const fetchData = async () => {
      try {
        const response = await api.get('/tp');
        if (response.data.data && Array.isArray(response.data.data)) {
          const uniqueTp = new Set(response.data.data.map(tp => tp.name));
          const uniqueTpArray = Array.from(uniqueTp).map(name => {
            return response.data.data.find(tp => tp.name === name);
          });
          setTp(uniqueTpArray);
        } else {
          // console.error('Error fetching Tp: Response data is not an array', response.data.data);
        }
      } catch (error) {
        // Alert.alert('Erreur', 'Error fetching Tp');
      }
    };
  
    const  renderItem = ({ item }: { item: Tp }) => (
      <Button mode='elevated' onPress={() => handleTpPress(item.name)}>
          <Text style={{ fontSize: 14 }}>{item.code_tp}</Text>
      </Button>
    );
  
    const handleTpPress = async (tpId: string) => {
      try {
          const response = await api.get(`/tp/${tpId}`);
          navigation.navigate('Détail de Tp', { Tp: response.data.data });
      } catch (error) {
          // console.error(`Error fetching ${tpId}`, error);
      }
  };
    const handleCreateTp = async () => {
      navigation.navigate('Ajouter Tp');
  };
  const filteredTp = Tp.filter(Tp =>
    Tp.name.toLowerCase().includes(searchQuery.toLowerCase())
);

  if (!filteredTp || !renderItem) {
    return <Text>Aucun Schedule disponible.</Text>;}

  
       return (
          <View style={styles.Background}>
            <Button mode='elevated' style={{ backgroundColor:"#b0c4de"}} onPress={() => handleCreateTp()}>
            <Text  style={styles.info}> Ajouter TP</Text>
            </Button>
            <TextInput
                style={styles.searchInput}
                placeholder="Rechercher un tp..."
                value={searchQuery}
                onChangeText={setSearchQuery}
            />
            <FlatList style={styles.container}
              data={filteredTp}
              // data={Tp}
              renderItem={renderItem}
              keyExtractor={(item) => item.code_tp}
              ListEmptyComponent={ <Text style={styles.emptyListText}>Chargement...</Text>}
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
      info:{
        fontSize: 12, 
    },
    searchInput:{
      // // height: 50,
      // borderColor: 'gray',
      // borderRadius:5,
      // // borderWidth: 1,
      // paddingHorizontal: 10,
      // marginBottom: 10,
    }
    });
  
  export default memo(TpScreen);
