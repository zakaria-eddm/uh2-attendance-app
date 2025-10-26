import React, { memo, useContext, useEffect, useState } from 'react';
import {View, Text, StyleSheet,FlatList, TouchableOpacity, Alert } from 'react-native';
import { AuthContext } from '../../AuthContext';
import Button from '../../components/Button';
import api from '../../ApiService';
import { Navigation } from '../../types';
import TextInput from '../../components/TextInput';

export  interface Schedule {

  name:string;

  schedule_code:string;//Code plannification

  course:string;

  td:string;

  tp: string;

  start_datetime: string;

  end_datetime:string;

  location: string;
}

type Props = {
    navigation: Navigation;
  };

  const ScheduleScreen = ({ navigation }: Props) => {
    const { userToken, verifyToken } = useContext(AuthContext);
    const [Schedules, setSchedules] = useState<Schedule[]>([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
      if (!userToken) navigation.navigate("LoginScreen");
      verifyToken();
      fetchData();
    }, [navigation,3]);

    const fetchData = async () => {
      try {
        const response = await api.get('/schedules');
        if (response.data.data && Array.isArray(response.data.data)) {
          setSchedules(response.data.data);
        }
          else {
          // console.error('Error fetching schedules: Response data is not an array', response.data.data);
        }
      } catch (error) {
        // console.error('Error fetching Schedule', error);
        // Alert.alert('Erreur','Error fetching Schedule');
      }
    };

    const renderItem = ({ item }: { item: Schedule }) => (
      <Button mode='elevated' onPress={() => handleSchedulePress(item.name)}>
          <Text style={styles.title}>{`${item.name}`}</Text> 
      </Button>
    );
  const handleCreateSchedule = async () => {
    navigation.navigate('Ajouter Schedule');
};
    const handleSchedulePress = async (ScheduleId: string) => {
      try {
          const response = await api.get(`/schedule/${ScheduleId}`);
          navigation.navigate('Détail de Schedule', { Schedule: response.data.data });
      } catch (error) {
          // console.error(`Error fetching ${tdId}`, error);
      }
  };
    const filteredSchedules = Schedules.filter(Schedules =>
        Schedules.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
      
    if (!filteredSchedules || !renderItem) {
      return <Text>Aucun Schedule disponible.</Text>;}
  
       return (
        
        <View style={styles.Background}>
           <Button mode="elevated" style={{ backgroundColor:"#b0c4de"}} onPress={() => handleCreateSchedule()}>
            <Text style={{fontSize: 12,}}  > Ajouter Schedule</Text>
          </Button>
          <TextInput
                style={styles.searchInput}
                placeholder="Rechercher un schedule..."
                value={searchQuery}
                onChangeText={setSearchQuery}
            />
          
            <FlatList style={styles.container}
                data={filteredSchedules}
              // data={Schedules}
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
  searchInput: {
    fontSize:15,
    // height: 50,
    // borderColor: 'gray',
    // borderRadius:5,
    // borderWidth: 1,
    // paddingHorizontal: 10,
    // marginBottom: 10,
  },
  scheduleContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  title: {
    fontSize: 14,
    // alignItems:"center",
    // justifyContent:"center"
  },
  emptyListText: {
    textAlign: 'center',
    marginTop: 20,
  },
  // list:{
  //   alignItems:"center"
  // }

});



  export default memo(ScheduleScreen);
