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
import { Tp } from './TpScreen';
import Frame from '../Frame';
export interface etudiants{
    etudiant: string;
  }
type Props1 = {
    route: {
        params: {
            Tp: {
                name: string;
                ann_univ:string;
                code_tp: string;//Code TP
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

const DetailTpScreen = ({ navigation, route }: Props1 & Props2) => {
    const { Tp } = route.params;
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
            navigation.navigate('Détail de Professeur', { Professeur:response.data.data});
        } catch (error) {
            // console.error(`Error fitching  ${professor1}`, error);
        }
    };
    const handleDepartementPress = async (departement: string) => {
        try {
            const response =  await api.get(`/departement/${departement}`);
            navigation.navigate('Détail de Département', { Departement:response.data.data});
        } catch (error) {
            // console.error(`Error fitching  ${departement}`, error);
        }
    };
    const handleEditerPress = (Tp: Tp) => {
        navigation.navigate('Editer Tp', { Tp });
    };
    const handleDeleteTp = async (name: string) => {
        // Alert.alert('Confirmer',);
        try {
            await api.delete(`/tp/${name}`);
            Alert.alert('Succès', 'Le Tp a été supprimé avec succès.');
            navigation1.goBack();
        } catch (error) {
            // console.error('Error deleting Tp', error);
            Alert.alert('Message', 'Ce tp peut être intégré dans un ordonnancement.');
        }
    };
   
      const handleTpPress = async (tpId: string) => {
        try {
            const response = await api.get(`/tp/${tpId}`);
            navigation.navigate('Etudiants de Tp', { Tp: response.data.data });
        } catch (error) {
            // console.error(`Error fetching ${tpId}`, error);
        }
    };
    return (
        <><ScrollView  >
            <View style={styles.Background} >
                {/* <Header >{Tp?.code_tp || '--'}</Header> */}
                <Frame title={Tp?.name || '--'}>
                <Text  style={styles.info}>Année universitaire:</Text>
                <Button mode='contained-tonal' >
                <Text  style={styles.info}>{Tp?.ann_univ || '--'}</Text>
                </Button>
                <Text  style={styles.info}>Professeur :</Text>
                <Button mode='elevated' onPress={() => handleProfesseurPress(Tp.professor)}>
                <Text  style={styles.info}>{Tp?.professor || '--'}</Text>

                </Button>
                <Text  style={styles.info}>Département :</Text>
                <Button mode='elevated' onPress={() => handleDepartementPress(Tp.department)}>
                <Text  style={styles.info}>{Tp?.department || '--'}</Text>
                </Button>
                <Button mode='elevated' onPress={() => handleTpPress(Tp.name)}>
                <Text  style={styles.info}>Liste des étudiants</Text>
                </Button>
                </Frame>
                <Button mode="contained-tonal" style={styles.EditerButton} onPress={() => handleEditerPress(Tp)}>
                <Text style={styles.edite}>Editer ce tp</Text>
                </Button>
                <Button mode="contained-tonal" style={styles.EditerButtons}  onPress={() => handleDeleteTp(Tp.code_tp)}>
                    <Text style={styles.edite}>Supprimer ce tp</Text>
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

export default DetailTpScreen;
