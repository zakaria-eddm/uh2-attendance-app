import React, {useContext, useEffect, useState} from 'react';
import {View, Text, FlatList,ScrollView,StyleSheet,Alert} from 'react-native';
import {Professeur} from "./ProfesseurScreen";
import {Etudiant} from "./EtudiantScreen";
import {Departement} from "../données_de_base_screens/DepartementScreen";
import {Navigation} from "../../types";
import Button from '../../components/Button';
import { useRoute, useNavigation } from '@react-navigation/native';
import Header from '../../components/Header';
import TextInput from "../../components/TextInput";
import {AuthContext} from "../../AuthContext";
import api from "../../ApiService";
import {Course} from "./CoursScreen"
export interface etudiants{
    etudiant: string;
  }
type Props1 = {
    route: {
        params: {
            Course: {
                name: string;
                ann_univ:string;
                code_cours: string;//Code cours
                professor: string;
                etudiants: etudiants[];
                department: string;
            };
        };
    };
};
type Props2 = {
    navigation: Navigation;
};
const ListeEtudiantCourseScreen = ({ navigation, route }: Props1 & Props2) => {
    const { Course } = route.params;
    const [searchQuery, setSearchQuery] = useState('');
    const { userToken, verifyToken } = useContext(AuthContext);
    const navigation1 = useNavigation();
    useEffect(() => {
        if (!userToken) navigation.navigate("LoginScreen");
        verifyToken();
        // checkUserRole();
    }, []);
     const renderItem = ({ item }: { item: etudiants }) => (
        <Button mode='elevated' onPress={() => handleEtudiantPress(item.etudiant)}>
            <Text style={{ fontSize: 14 }}>{item.etudiant}</Text>
        </Button>
    );

    const handleEtudiantPress = async (etudiant: string) => {
        try {
            const response =  await api.get(`/student/${etudiant}`);
            navigation.navigate('Détail de Etudiant', { Etudiant:response.data.data });
        } catch (error) {
            // console.error(`Error fitching  ${etudiant}`, error);
        }
    };
    const filteredEtudiants = Course.etudiants.filter(etudiants =>
        etudiants.etudiant.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return (
        <View style={styles.Background} >
                
                <Text style={{ fontSize: 15, fontWeight: 'bold', marginBottom: 10,alignSelf:'flex-start' }}>les étudiants de Cours: {Course.name}</Text>
                <TextInput
                    // style={styles.searchInput}
                    placeholder="Rechercher un étudiant..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
                <FlatList style={styles.container}
                          data={filteredEtudiants}
                        //   data={Course.etudiants}
                          renderItem={renderItem}
                          keyExtractor={(item) => item.etudiant}
                          ListEmptyComponent={<Text style={{textAlign:'center'}}>Chargement...</Text>}
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
    emptyListText: {
        textAlign: 'center',
        marginTop: 20,
      },
});

export default ListeEtudiantCourseScreen;
