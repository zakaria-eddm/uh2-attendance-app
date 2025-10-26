import React, {useContext, useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, FlatList,ScrollView, StyleSheet, Alert} from 'react-native';
import {Departement} from "../données_de_base_screens/DepartementScreen";
import Button from '../../components/Button';
import { useRoute, useNavigation } from '@react-navigation/native';
import TextInput from '../../components/TextInput';
import {Navigation} from "../../types";
import {AuthContext} from "../../AuthContext";
import api from "../../ApiService";
import Header from "../../components/Header";
import {Etudiant} from "./EtudiantScreen";
import Frame from '../Frame';

type Props1 = {
    route: {
        params: {
            Etudiant: {
                name:string;

                cne:string;

                nom:string;

                prenom:string;

                cin: string;

                cycle: string;

                filiere: string;

                semestre: string;

                univ_email: string;

                perso_email: string;
            };
        };
    };
};
type Props2 = {
    navigation: Navigation;
};


const DetailEtudiantScreen = ({ navigation,route }: Props1 & Props2) => {
    const { Etudiant } = route.params;
    const { userToken, verifyToken } = useContext(AuthContext);
  const navigation1 = useNavigation();
    useEffect(() => {
        if (!userToken) navigation.navigate("LoginScreen");
        verifyToken();
        // checkUserRole();
    }, []);
    const handleEditerPress = (Etudiant: Etudiant) => {
        navigation.navigate('Editer Etudiant', { Etudiant });
    };
    const handleDeleteEtudiant= async (name: string) => {
        // Alert.alert('Confirmer', );
        try {
            await api.delete(`/student/${name}`);
            Alert.alert('Succès', 'Le etudiant a été supprimé avec succès.');
            navigation1.goBack();
        } catch (error) {
            // console.error('Error deleting Etudiant', error);
            Alert.alert('Message', 'Ce étudiant peut être intégré dans un cours ou td ou tp.');
        }
    };

    return (
        <><ScrollView  >
        <View style={styles.Background}>
            {/* <Header >{Etudiant?.name || '--'}</Header> */}
            <Frame title={Etudiant?.name || '--'}>
            <Text   style={styles.info}>CNE :</Text>
            <Button mode='contained-tonal' >
            <Text style={styles.info}>{Etudiant?.cin || '--'}</Text>
            
            </Button>
            <Text   style={styles.info}>Nom :</Text>
            <Button mode='contained-tonal'>
            <Text style={styles.info}>{Etudiant?.nom || '--'}</Text>
            
            </Button>
            <Text   style={styles.info}>Prénom :</Text>
            <Button mode='contained-tonal' >
            <Text style={styles.info}>{Etudiant?.prenom || '--'}</Text>
            
            </Button>
            <Text   style={styles.info}>CIN :</Text>
            <Button mode='contained-tonal'>
            <Text style={styles.info}>{Etudiant?.cin || '--'}</Text>     
            </Button>
            <Text   style={styles.info}>Cycle :</Text>
            <Button mode='contained-tonal'>
            <Text style={styles.info}>{Etudiant?.cycle || '--'}</Text>   
            </Button>
            <Text   style={styles.info}>Filiere :</Text>
            <Button mode='contained-tonal' >
            <Text style={styles.info}>{Etudiant?.filiere || '--'}</Text>     
            </Button>
            <Text   style={styles.info}>Semestre :</Text>
            <Button mode='contained-tonal'>
            <Text style={styles.info}>{Etudiant?.semestre || '--'}</Text>    
            </Button>
            <Text   style={styles.info}>Email universitaire :</Text>
            <Button mode='contained-tonal' >
            <Text style={styles.info}>{Etudiant?.univ_email || '--'}</Text>        
            </Button>
            <Text   style={styles.info}>Email personnel :</Text>
            <Button mode='contained-tonal' >
            <Text style={styles.info}>{Etudiant?.perso_email || '--'}</Text>
            </Button>
            </Frame>
            <Button mode="contained-tonal" style={styles.EditerButton} onPress={() => handleEditerPress(Etudiant)}>
                <Text style={styles.edite} >Editer ce Etudiant</Text>
            </Button>
            <Button mode="contained-tonal" style={styles.Buttons}  onPress={() => handleDeleteEtudiant(Etudiant.name)}>
                <Text style={styles.edite}>Supprimer ce Etudiant</Text>
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
    Buttons: {
        backgroundColor: "#778899",
        // width:'50%'
    },
    info:{
        fontSize: 13, 
        marginBottom: 2, 
        margin:10
    },
    edite:{
        fontSize:12, 
        marginBottom: 2, 
        margin:20
    },
});
export default DetailEtudiantScreen;
