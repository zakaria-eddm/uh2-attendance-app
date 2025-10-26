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
import Frame from '../Frame';
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

const DetailCourseScreen = ({ navigation, route }: Props1 & Props2) => {
    const { Course } = route.params;
    const { userToken, verifyToken } = useContext(AuthContext);
    const navigation1 = useNavigation();
    // const [course, setCourse] = useState<Course>();



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
            navigation.navigate('Détail de Département', { Departement:response.data.data });
        } catch (error) {
            // console.error(`Error fitching  ${departement}`, error);
        }
    };
    const handleEditerPress = (Course: Course) => {
        navigation.navigate('Editer Cours', { Course });
    };
    const handleDeleteCourse = async (name: string) => {
        try {
            await api.delete(`/cour/${name}`);
            Alert.alert('Succès', 'Le Course a été supprimé avec succès.');
            navigation1.goBack();
        } catch (error) {
            // console.error('Error deleting Course', error);
            Alert.alert('Message', 'Ce cours peut être intégré dans un ordonnancement');
        }
    };  
    const handleCoursPress = async (courseId: string) => {
        try {
            const response = await api.get(`/cour/${courseId}`);
            navigation.navigate('Etudiants de Cours', { Course: response.data.data });
        } catch (error) {
            // console.error(`Error fetching ${courseId}`, error);
        }
    };

    return (
        <><ScrollView  >
            <View style={styles.Background} >
                {/* <Header >{Course?.code_cours  || '--'}</Header> */}
                <Frame title={Course?.name || '--'}>
                <Text  style={styles.info}>Année universitaire:</Text>
                <Button mode='contained-tonal' >
                <Text style={styles.info}>{Course?.ann_univ || '--'}</Text>
                </Button>
                <Text  style={styles.info}>Professeur :</Text>
                <Button mode='elevated' onPress={() => handleProfesseurPress(Course.professor)}>
                <Text style={styles.info}>{Course?.professor || '--'}</Text>

                </Button>
                <Text  style={styles.info}>Département :</Text>
                <Button mode='elevated' onPress={() => handleDepartementPress(Course.department)}>
                <Text style={styles.info}>{Course?.department || '--'}</Text>
                </Button>
                <Button mode='elevated' onPress={() => handleCoursPress(Course.name)}>
                <Text style={styles.info}>Liste des étudiants</Text>
                </Button>
                </Frame>
                <Button mode="contained-tonal" style={styles.EditerButton} onPress={() => handleEditerPress(Course)}>
                <Text  style={styles.edite}>Editer ce cours</Text>
                </Button>
               <Button mode="contained-tonal" style={styles.EditerButtons}   onPress={() => handleDeleteCourse(Course.code_cours)}>
               <Text  style={styles.edite}>Supprimer ce cours</Text>
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
EditerButtons: {
    backgroundColor: "#778899",
    // width:'50%'
},
emptyListText: {
    textAlign: 'center',
    marginTop: 20,
  },
  info:{
    fontSize: 12, 
    marginBottom: 2, 
    margin:20
},edite:{
    fontSize:12, 
    marginBottom: 2, 
    margin:20
},
});

export default DetailCourseScreen;
