import React, {useContext, useEffect, useState} from 'react';
import {View, Text,ScrollView, StyleSheet, Alert} from 'react-native';
import {Departement} from "../données_de_base_screens/DepartementScreen";
import {Etudiant} from "./EtudiantScreen";
import Button from '../../components/Button';
import TextInput from '../../components/TextInput';
import { useRoute, useNavigation } from '@react-navigation/native';
import {Navigation} from "../../types";
import {AuthContext} from "../../AuthContext";
import api from "../../ApiService";
import Header from "../../components/Header";
import {Professeur} from "./ProfesseurScreen";
import Frame from '../Frame';
type Props1 = {
    route: {
        params: {
            Professeur: {
                name:string;

                full_name:string;//Nom complet

                nom:string;

                prenom:string;

                cin: string;

                univ_email: string;

                perso_email: string;

                department: string;
            };
        };
    };
};
type Props2 = {
    navigation: Navigation;
};


const DetailProfesseurScreen = ({ navigation , route }: Props1& Props2) => {
    const { Professeur } = route.params;
    const { userToken, verifyToken } = useContext(AuthContext);
    const [departments, setdepartments] = useState<Departement>();
    const navigation1 = useNavigation();
    useEffect(() => {
        if (!userToken) navigation.navigate("LoginScreen");
        verifyToken();
        // checkUserRole();
    }, []);
    const handleDepartementPress = async (department: string) => {
        try {
            const response =  await api.get(`/departement/${department}`);
            navigation.navigate('Détail de Département', { Departement:response.data.data });
        } catch (error) {
            // console.error(`Error fitching  ${department}`, error);
        }
    };
    const handleEditerPress = (Professeur: Professeur) => {
        navigation.navigate('Editer Professeur', { Professeur });
    };
    const handleDeleteSchedule = async (name: string) => {
        // Alert.alert('Confirmer', );
        try {
            await api.delete(`/professeur/${name}`);
            Alert.alert('Succès', 'Le professeur a été supprimé avec succès.');
            navigation1.goBack();
        } catch (error) {
            // console.error('Error deleting professeur', error);
            Alert.alert('Message', 'Ce professeur peut être intégré dans un cours ou td ou tp.');
        }
    };


    return (
        <><ScrollView >
        <View style={styles.Background}>
            {/* <Header >{Professeur?.name || '--'}</Header> */}
            <Frame title={Professeur?.name || '--'}>
            <Text  style={styles.info}>Nom :</Text>
            <Button mode='contained-tonal' >
            <Text  style={styles.info}>{Professeur?.nom || '--'}</Text>
            </Button>
            <Text  style={styles.info}>Prénom :</Text>
            <Button mode="contained-tonal" >
            <Text  style={styles.info}>{Professeur?.prenom || '--'}</Text>
            
            </Button>
            <Text  style={styles.info}>CIN :</Text>
            <Button mode="contained-tonal" >
            <Text  style={styles.info}>{Professeur?.cin || '--'}</Text>
            
            </Button>
            <Text  style={styles.info}>Département :</Text>
            <Button  mode="elevated" onPress={() => handleDepartementPress(Professeur.department)} >
            <Text  style={styles.info}>{Professeur?.department || '--'}</Text>
            </Button>
            <Text  style={styles.info}>Email universitaire :</Text>
            <Button mode="contained-tonal">
            <Text  style={styles.info}>{Professeur?.univ_email || '--'}</Text>
            </Button>
            <Text  style={styles.info}>Email personnel :</Text>
            <Button  mode="contained-tonal" >
            <Text  style={styles.info}>{Professeur?.perso_email || '--'}</Text>
            </Button>
            </Frame>
            <Button  mode="contained-tonal" style={styles.EditerButton}  onPress={() => handleEditerPress(Professeur)}>
                <Text style={styles.edite}>Editer ce professeur</Text>
            </Button>
            <Button mode="contained-tonal" style={styles.EditerButtons}  onPress={() => handleDeleteSchedule(Professeur.name)}>
                <Text style={styles.edite}>Supprimer ce professeur</Text>
            </Button>

        </View>
        </ScrollView></>

    );

};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        width: "120%"
    },
    Background: {
        flex: 1, padding: 20,
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
    EditerButtons: {
        backgroundColor: "#778899",
        // width:'50%'
    },
    info:{
        fontSize: 12, 
        marginBottom: 2, 
        margin:10
    },
    edite:{
        fontSize:12, 
        marginBottom: 2, 
        margin:20
    },
   
});
export default DetailProfesseurScreen;
