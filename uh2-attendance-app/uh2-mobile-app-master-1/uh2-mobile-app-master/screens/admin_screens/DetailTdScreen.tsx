import React, {useContext, useEffect, useState} from 'react';
import {View, Text, FlatList,ScrollView,StyleSheet,Alert} from 'react-native';
import {Professeur} from "./ProfesseurScreen";
import {Etudiant} from "./EtudiantScreen";
import {Departement} from "../données_de_base_screens/DepartementScreen";
import {Navigation} from "../../types";
import Button from '../../components/Button';
import Header from '../../components/Header';
import { useRoute, useNavigation } from '@react-navigation/native';
import TextInput from "../../components/TextInput";
import {AuthContext} from "../../AuthContext";
import api from "../../ApiService";
import { Td } from './TdScreen';
import Frame from '../Frame';
export interface etudiants{
    etudiant: string;
  }
type Props1 = {
    route: {
        params: {
            Td: {
                name: string;
                ann_univ:string;
                code_td: string;//Code TD
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

const DetailTdScreen = ({ navigation, route }: Props1 & Props2) => {
    const { Td } = route.params;
    const { userToken, verifyToken } = useContext(AuthContext);
    const navigation1 = useNavigation();


    useEffect(() => {
        if (!userToken) navigation.navigate("LoginScreen");
        verifyToken();
        // checkUserRole();
    }, []);

    const handleProfesseurPress = async (professor1: string) => {
        try {
            const response =  await api.get(`/professeur/${professor1}`);
            navigation.navigate('Détail de Professeur', { Professeur:response.data.data });
        } catch (error) {
            // console.error(`Error fitching  ${professor1}`, error);
        }
    };
    const handleDepartementPress = async (departement: string) => {
        try {
            const response =  await api.get(`/departement/${departement}`);
            navigation.navigate('Détail de Département', { Departement:response.data.data  });
        } catch (error) {
            // console.error(`Error fitching  ${departement}`, error);
        }
    };
    const handleEditerPress = (Td: Td) => {
        navigation.navigate('Editer Td', { Td });
    };
    const handleDeleteTd = async (name: string) => {
        try {
            await api.delete(`/td/${name}`);
            Alert.alert('Succès', 'Le Td a été supprimé avec succès.');
            navigation1.goBack();
        } catch (error) {
            // console.error('Error deleting Td', error);
            Alert.alert('Message', 'Ce td peut être intégré dans un ordonnancement.');//attention.
        }
    };
    
      const handleTdPress = async (tdId: string) => {
        try {
            const response = await api.get(`/td/${tdId}`);
            navigation.navigate('Etudiants de Td', { Td: response.data.data });
        } catch (error) {
            // console.error(`Error fetching ${tdId}`, error);
        }
    };
    return (
        <><ScrollView  >
        <View style={styles.Background} >
            {/* <Header >{Td.code_td}</Header> */}
            <Frame title={Td?.name || '--'}>
            <Text   style={styles.info}>Année universitaire:</Text>
            <Button mode='contained-tonal' >
            <Text style={styles.info}>{Td?.ann_univ || '--'}</Text>
            </Button>
            <Text  style={styles.info}>Professeur :</Text>
            <Button mode='elevated' onPress={() => handleProfesseurPress(Td.professor)}>
                <Text style={styles.info}>{Td?.professor || '--'}</Text>
            </Button>
            <Text  style={styles.info}>Département :</Text>
            <Button mode='elevated' onPress={() => handleDepartementPress(Td.department)}>
                <Text style={styles.info}>{Td?.department || '--'}</Text>
            </Button>
            <Button mode='elevated' onPress={() => handleTdPress(Td.name)}>
                <Text style={styles.info}>Liste des étudiants</Text>
            </Button>
            </Frame>
            <Button mode="contained-tonal" style={styles.EditerButton} onPress={() => handleEditerPress(Td)}>
            <Text style={styles.edite}>Editer ce td</Text>
            </Button>
            <Button  mode="contained-tonal" style={styles.EditerButtons}  onPress={() => handleDeleteTd(Td.code_td)}>
            <Text style={styles.edite}>Supprimer ce td</Text>
            </Button>
        </View>
        </ScrollView></>
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
        alignItems: 'flex-start',
        justifyContent: 'center',
    },
    EditerButton: {
        backgroundColor:"#c0c0c0",
    },
    emptyListText: {
        textAlign: 'center',
        marginTop: 20,
    },
    info:{
        fontSize: 12, 
        marginBottom: 2, 
        margin:20
    },
    EditerButtons: {
        backgroundColor: "#778899",
        // width:'50%'
    },
    edite:{
    fontSize:12, 
    marginBottom: 2, 
    margin:20
    },
    
  });

export default DetailTdScreen;
