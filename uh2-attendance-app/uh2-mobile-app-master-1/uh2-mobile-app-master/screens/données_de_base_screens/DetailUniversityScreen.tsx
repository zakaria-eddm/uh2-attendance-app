import React, {useContext, useEffect, useState} from 'react';
import {View, Text, FlatList,ScrollView,StyleSheet} from 'react-native';
import {Faculty} from "./FacultyScreen";
import {Navigation} from "../../types";
import Button from '../../components/Button';
import Header from '../../components/Header';
import TextInput from "../../components/TextInput";
import {AuthContext} from "../../AuthContext";
import api from "../../ApiService";
import {Course} from "../admin_screens/CoursScreen";
import Frame from '../Frame';
type Props1 = {
    route: {
        params: {
            University: {
                name:string;

                short_name:string;

                complet_name:string;

                faculties: string[];
            };
        };
    };
};

type Props2 = {
    navigation: Navigation;
};


const DetailUniversityScreen = ({ navigation, route }: Props1 & Props2) => {
    const { University } = route.params;
    const [searchQuery, setSearchQuery] = useState('');
    const { userToken, verifyToken } = useContext(AuthContext);
    const [faculties, setfaculties] = useState<Faculty>();


    useEffect(() => {
        if (!userToken) navigation.navigate("LoginScreen");
        verifyToken();
        // checkUserRole();
    }, []);
    const handleFacultyPress = async (facultie: string) => {
        try {
            const response =  await api.get(`/faculty/${facultie}`);
            navigation.navigate('Détail de Faculté', { Faculty:response.data.data });
        } catch (error) {
            // Alert.alert('Erreur', 'Une erreur s\'est produite lors de la suppression du schedule.');
        }
    };
    const renderItem = ({ item }: { item: string }) => (
        <Button mode="elevated" onPress={() => handleFacultyPress(item)}>
                <Text style={{ fontSize: 18 }}>{item}</Text>
        </Button>
    );
   
    return (
        <View style={styles.Background} >
        {/* <Header >{University.name}</Header> */}
            <Frame title={University?.name || '--'}>
            <Text  style={styles.info}>Nom:</Text>
            <Button mode='contained-tonal'>
            <Text style={styles.info}>{University?.short_name || '--'}</Text>
            </Button>
            <Text  style={styles.info}>Nom complet :</Text>
            <Button  mode="contained-tonal">
            <Text style={styles.info}>{University?.complet_name || '--'}</Text>    
            </Button>
            </Frame>
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
            margin:20,
            // alignItems: 'flex-start',
            // width:'200%'
        },
       
});
export default DetailUniversityScreen;
