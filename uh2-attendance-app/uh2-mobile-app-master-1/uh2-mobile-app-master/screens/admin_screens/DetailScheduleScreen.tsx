import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Alert, StyleSheet, ScrollView } from 'react-native';
import Header from '../../components/Header';
import api from "../../ApiService";
import Button from '../../components/Button';
import { AuthContext } from "../../AuthContext";
import { Navigation } from "../../types";
import { useRoute, useNavigation } from '@react-navigation/native';
import { Schedule } from "./ScheduleScreen";
import Frame from '../Frame';

type Props1 = {
    navigation: Navigation;
};
type Props2 = {
    route: {
        params: {
            Schedule: {
                name: string;
                schedule_code: string;
                course: string;
                td: string;
                tp: string;
                start_datetime: string;
                end_datetime: string;
                location: string;
            };
        };
    };
};

const DetailScheduleScreen = ({ navigation, route }: Props1 & Props2) => {
    const { Schedule } = route.params;
    const { userToken, verifyToken } = useContext(AuthContext);
    const navigation1 = useNavigation();
    

    useEffect(() => {
        if (!userToken) navigation.navigate("LoginScreen");
        verifyToken();
    }, []);

    const handleDeleteSchedule = async (name: string) => {
        try {
            await api.delete(`/schedule/${name}`);
            Alert.alert('Succès', 'Le schedule a été supprimé avec succès.');
            navigation1.goBack();
        } catch (error) {
            // Alert.alert('Erreur', 'Une erreur s\'est produite lors de la suppression du schedule.');
        }
    };

    const handleCoursPress = async (courseId: string) => {
        try {
            const response = await api.get(`/cour/${courseId}`);
            navigation.navigate('Détail de Cours', { Course: response.data.data });
        } catch (error) {
            // console.error(`Error fetching ${courseId}`, error);
        }
    };

    const handleTdPress = async (tdId: string) => {
        try {
            const response = await api.get(`/td/${tdId}`);
            navigation.navigate('Détail de Td', { Td: response.data.data });
        } catch (error) {
            // console.error(`Error fetching ${tdId}`, error);
        }
    };

    const handleTpPress = async (tpId: string) => {
        try {
            const response = await api.get(`/tp/${tpId}`);
            navigation.navigate('Détail de Tp', { Tp: response.data.data });
        } catch (error) {
            // console.error(`Error fetching ${tpId}`, error);
        }
    };

    const handleLieuPress = async (locationId: string) => {
        try {
            const response = await api.get(`/lieu/${locationId}`);
            navigation.navigate('Détail de Lieu', { Lieu: response.data.data });
        } catch (error) {
            // console.error(`Error fetching ${locationId}`, error);
        }
    };

    const handleEditerPress = (schedule: Schedule) => {
        navigation.navigate('Editer Schedule', { Schedule: schedule });
    };

    return (
        <ScrollView >
            <View style={styles.Background}>
                {/* <Header>{Schedule?.name || '-'}</Header> */}
                <Frame title={Schedule?.name || '--'}>
                <Text  style={styles.info}>Cours: </Text>
                <Button mode="elevated" onPress={() => handleCoursPress(Schedule?.course)}>
                    <Text style={styles.info}>{Schedule?.course || '--'}</Text>
                </Button>
                <Text  style={styles.info}>TD :</Text>
                <Button mode="elevated" onPress={() => handleTdPress(Schedule?.td)}>
                    <Text style={styles.info}>{Schedule?.td || '--'}</Text>
                </Button>
                <Text  style={styles.info}>TP :</Text>
                <Button mode="elevated" onPress={() => handleTpPress(Schedule?.tp)}>
                    <Text style={styles.info}>{Schedule?.tp || '--'}</Text>
                </Button>
                <Text  style={styles.info}>Emplacement :</Text>
                <Button mode="elevated" onPress={() => handleLieuPress(Schedule?.location)}>
                    <Text style={styles.info}>{Schedule?.location || '--'}</Text>
                </Button>
                <Text  style={styles.info}>Date et heure de début :</Text>
                <Button mode='contained-tonal'>
                    <Text style={styles.info}>{Schedule?.start_datetime || '--'}</Text>
                </Button>
                <Text  style={styles.info}>Date et heure de fin:</Text>
                <Button mode='contained-tonal'>
                    <Text style={styles.info}>{Schedule?.end_datetime || '--'}</Text>
                </Button>
                </Frame>
                <Button mode="contained-tonal" style={styles.EditerButton} onPress={() => handleEditerPress(Schedule)}>
                    <Text style={styles.edite}>Editer ce schedule</Text>
                </Button>
                <Button mode="contained-tonal" style={styles.EditerButtons} onPress={() => handleDeleteSchedule(Schedule.name)}>
                    <Text style={styles.edite}>Supprimer ce schedule</Text>
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
        // width:'50%'
    },
    EditerButtons: {
        backgroundColor: "#778899",
        // width:'50%'
    },
    info:{
        fontSize: 13, 
        marginBottom: 2, 
        margin:20
    },
    edite:{
        fontSize:12, 
        marginBottom: 2, 
        margin:20
    },
   
});

export default DetailScheduleScreen;
