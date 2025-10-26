import React, {useContext, useEffect, useState} from 'react';
import {View, Text, FlatList, TouchableOpacity, StyleSheet} from 'react-native';
import {Departement} from "./DepartementScreen";
import {University} from "./UniversityScreen";
import {Navigation} from "../../types";
import Button from '../../components/Button';
import TextInput from '../../components/TextInput';
import api from "../../ApiService";
import {AuthContext} from "../../AuthContext";
import {Course} from "../admin_screens/CoursScreen";
import {Lieu} from "./LieuScreen";
import Header from "../../components/Header";
import Frame from '../Frame';
type Props1 = {
    route: {
        params: {
            Faculty: {
                name:string;

                short_name:string;

                complet_name:string;

                // departments: string[];

                university: string;
            };
        };
    };
};

type Props2 = {
    navigation: Navigation;
};

const DetailFacultyScreen = ({ navigation, route  }: Props1 & Props2) => {
    const { Faculty } = route.params;
    const { userToken, verifyToken } = useContext(AuthContext);
    // const { UserRole, checkUserRole } = useContext(AuthContext);
    // const [isAdmin, setIsAdmin] = useState<boolean>(false);

    const [university, setuniversity] = useState<University>();
    const [departments, setdepartments] = useState<Departement>();
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (!userToken) navigation.navigate("LoginScreen");
        verifyToken();
        // checkUserRole();
    }, []);

    const handleDepartementPress = async (department: string) => {
        try {
            const response =  await api.get(`/departement/${department}`);
            navigation.navigate('DepartementDetail', { Departement:response.data.data });
        } catch (error) {
            console.error(`Error fitching  ${department}`, error);
        }
    };
    const handleUniversityPress = async (university: string) => {
        try {
            const response =  await api.get(`/universite/${university}`);
            navigation.navigate('Détail de Université', { University:response.data.data });
        } catch (error) {
            console.error(`Error fitching  ${university}`, error);
        }
    };
    return (
        <View style={styles.Background}>
            {/* <Header >{Faculty?.name || '--'}</Header> */}
            <Frame title={Faculty?.name || '--'}>
            <Text style={styles.info}>Nom:</Text>
            <Button mode='contained-tonal'>
            <Text style={styles.info}>{Faculty?.short_name || '--'}</Text>
            </Button>
            <Text style={styles.info}>Nom complet:</Text>
            <Button mode='contained-tonal'>
            <Text style={styles.info} >{Faculty?.complet_name || '--'}</Text>
            </Button>
            <Text style={styles.info}>Université :</Text>
            <Button mode="elevated" onPress={() => handleUniversityPress(Faculty.university)}>
            <Text style={styles.info}>{Faculty?.university || '--'}</Text>
            </Button>
            </Frame>
        </View>
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
    info:{
        fontSize: 12, 
        marginBottom: 2, 
        margin:20
    }
});

export default DetailFacultyScreen;
