import React, { memo, useContext, useEffect, useState } from 'react';
import {View, Text, FlatList, Alert,StyleSheet} from 'react-native';
import { AuthContext } from '../../AuthContext';
import api from '../../ApiService';
import { Navigation } from '../../types';
import Button from '../../components/Button';
import TextInput from '../../components/TextInput';
export  interface Departement {
    name:string;
    short_name:string;
    complet_name:string;
    faculty:string;
}
type Props = {
    navigation: Navigation;
  };
  
  const DepartementScreen = ({ navigation }: Props) => {
    const { userToken, verifyToken } = useContext(AuthContext);
    const [Departements, setDepartements] = useState<Departement[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
  
    useEffect(() => {
      if (!userToken) navigation.navigate("LoginScreen");
      verifyToken();
      fetchData();
    }, []);
  
    const fetchData = async () => {
      try {
        const response = await api.get('/departements');
        if (response.data.data && Array.isArray(response.data.data)) {
        setDepartements(response.data.data);
        }
          else {
          // console.error('Error fetching departements: Response data is not an array', response.data.data);
        }
      } catch (error) {
        // console.error('Error fetching Departements', error);
          // Alert.alert('Erreur','Error fetching Departements');

      }
    };
  
    const renderItem = ({ item }: { item: Departement }) => (
      <Button mode='elevated' onPress={() => handleDepartementPress(item)}>
          <Text style={{ fontSize: 14 }} >{item.name}</Text>
      </Button>
    );
  
    const handleDepartementPress = (Departement: Departement) => {
      navigation.navigate('Détail de Département', { Departement });
    };
    const filteredDepartements = Departements.filter(Departements =>
      Departements.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
    
  if (!filteredDepartements || !renderItem) {
    return <Text>Aucun Schedule disponible.</Text>;}

  
       return (
        <View style={styles.Background}>
       <TextInput
             // style={styles.searchInput}
             placeholder="Rechercher un département..."
             value={searchQuery}
             onChangeText={setSearchQuery}
         />
       
         <FlatList style={styles.container}
              data={filteredDepartements}
              // data={Departements}
              renderItem={renderItem}
              keyExtractor={(item) => item.name}
              ListEmptyComponent={<Text style={{textAlign:'center'}}>Chargement...</Text>}
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
  });
  
  export default memo(DepartementScreen);