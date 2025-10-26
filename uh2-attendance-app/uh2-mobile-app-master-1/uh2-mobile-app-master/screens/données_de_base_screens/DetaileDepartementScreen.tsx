import React, {useContext, useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet,ScrollView} from 'react-native';
import {Faculty} from "./FacultyScreen";
import {Navigation} from "../../types";
import Button from '../../components/Button';
import Header from "../../components/Header";
import api from "../../ApiService";
import {AuthContext} from "../../AuthContext";
import Frame from '../Frame';
type Props1 = {
    route: {
        params: {
            Departement: {
                name:string;
                short_name:string;
                complet_name:string;
                faculty:string;
            };
        };
    };
};
type Props2 = {
    navigation: Navigation;
};


const DetailDepartementScreen = ({ navigation,route }: Props1 & Props2) => {
    const { Departement } = route.params;
    const [faculties, setfaculties] = useState<Faculty>();
    const { userToken, verifyToken } = useContext(AuthContext);
    useEffect(() => {
        if (!userToken) navigation.navigate("LoginScreen");
        verifyToken();
        // checkUserRole();
    }, []);

    const handleFacultyPress = async (facultie: string) => {
        try {
            const response =  await api.get(`/faculte/${facultie}`);
            setfaculties(response.data.data);
            navigation.navigate('Détail de Faculté', { Faculty:response.data.data });
        } catch (error) {
            // console.error(`Error fitching  ${facultie}`, error);
            // Alert.alert('Erreur', 'Une erreur s\'est produite lors de la suppression du schedule.');
        }
    };

    return (
        <View style={styles.Background}>
            {/* <Header >{Departement.name}</Header> */}
            <Frame title={Departement?.name || '--'}>
            <Text  style={styles.info}>Nom:</Text>
            <Button mode='contained-tonal' >
            <Text style={styles.info}>{Departement?.short_name || '--'}</Text>
            </Button>
            <Text  style={styles.info}>Nom complet :</Text>
            <Button mode='contained-tonal'>
            <Text style={styles.info}>{Departement?.complet_name || '--'}</Text>     
            </Button>
            <Text  style={styles.info}>Faculté :</Text>
            <Button mode="elevated" onPress={() => handleFacultyPress(Departement.faculty)}>
            <Text style={styles.info}>{Departement?.faculty || '--'}</Text>
            </Button>
            </Frame>
        </View>
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
    info:{
        fontSize: 12, 
        marginBottom: 2, 
        margin:20
    }
});
export default DetailDepartementScreen;
