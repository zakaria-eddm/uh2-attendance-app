import React, { useContext, useEffect, useState } from 'react';
import { View, Text,SafeAreaView, StyleSheet, ScrollView, Alert } from 'react-native';
import Button from '../../components/Button';
import { Navigation } from "../../types";
import Header from "../../components/Header";
import api from "../../ApiService";
import { useRoute, useNavigation } from '@react-navigation/native';
import { AuthContext } from "../../AuthContext";
import { Pointage } from "./PointageScreen";
import Frame from '../Frame';


type Props1 = {
    route: {
        params: {
            Pointage: {
                name: string;
                schedule: string;
                etudiant: string;
                date_effet: string;
                status: string;
            };
        };
    };
};
type Props2 = {
    navigation: Navigation;
};

const DetailPointageScreen = ({ navigation, route }: Props1 & Props2) => {
    const { Pointage } = route.params;
    const { userToken, verifyToken } = useContext(AuthContext);
    const navigation1 = useNavigation();

    useEffect(() => {
        if (!userToken) navigation.navigate("LoginScreen");
        verifyToken();
    }, []);

    const handleSchedulePress = async (scheduleId: string) => {
        try {
            const response = await api.get(`/schedule/${scheduleId}`);
            navigation.navigate('Détail de Schedule', { Schedule: response.data.data });
        } catch (error) {
            // console.error(`Error fetching ${scheduleId}`, error);
        }
    };

    const handleEtudiantPress = async (etudiantId: string) => {
        try {
            const response = await api.get(`/student/${etudiantId}`);
            navigation.navigate('Détail de Etudiant', { Etudiant: response.data.data });
        } catch (error) {
            // console.error(`Error fetching ${etudiantId}`, error);
        }
    };

    const handleEditerPress = (pointage: Pointage) => {
        navigation.navigate('Editer Pointage', { Pointage: pointage });
    };

    const handleDeletePointage = async (name: string) => {
        try {
            await api.delete(`/pointage/${name}`);
            Alert.alert('Succès', 'Le pointage a été supprimé avec succès.');
            navigation1.goBack();
        } catch (error) {
            // Alert.alert('Erreur', 'Une erreur s\'est produite lors de la suppression du pointage.');
        }
    };

    return (
        <ScrollView>
            <View style={styles.Background}>
                {/* <Text style={styles.title} >{Pointage?.name || '--'}</Text > */}
                <Frame title={Pointage?.name || '--'}>
                <Text style={styles.Info}>Schedule:</Text>
                <Button mode='elevated' onPress={() => handleSchedulePress(Pointage?.schedule)}>
                    <Text style={styles.Info}>{Pointage?.schedule || '--'}</Text>
                </Button>
                <Text style={styles.Info}>Etudiant :</Text>
                <Button mode='elevated' onPress={() => handleEtudiantPress(Pointage?.etudiant)}>
                    <Text style={styles.Info}>{Pointage?.etudiant || '--'}</Text>
                </Button>
                <Text style={styles.Info}>Date effet :</Text>
                <Button mode="contained-tonal">
                    <Text style={styles.Info}>{Pointage?.date_effet || '--'}</Text>
                </Button>
                <Text style={styles.Info}>Status :</Text>
                <Button mode="contained-tonal">
                    <Text style={styles.Info}>{Pointage?.status || '--'}</Text>
                </Button>
                </Frame>
                <Button mode="contained-tonal" style={styles.EditerButton} onPress={() => handleEditerPress(Pointage)}>
                    <Text style={styles.edite}>Editer ce Pointage</Text>
                </Button>
                <Button mode="contained-tonal" style={styles.Buttons} onPress={() => handleDeletePointage(Pointage.name)}>
                    <Text style={styles.edite}>Supprimer ce Pointage</Text>
                </Button>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    Background: {
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
        backgroundColor: "#c0c0c0",
        marginTop:30
    },
    Buttons: {
        backgroundColor: "#778899",
        // width:'50%'
    },
    Info:{
        fontSize: 13, 
        marginBottom: 2,
        margin:20,
    },
    edite:{
        fontSize:12, 
        marginBottom: 2, 
        margin:20
    },
    title:{
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10, 
        alignSelf:"flex-start"  
    }
});

export default DetailPointageScreen;

