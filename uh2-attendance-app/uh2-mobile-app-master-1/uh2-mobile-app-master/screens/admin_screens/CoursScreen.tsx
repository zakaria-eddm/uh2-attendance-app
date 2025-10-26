import React, { memo, useContext, useEffect, useState } from 'react';
import {View, Text, FlatList,StyleSheet, TouchableOpacity, Alert} from 'react-native';
import { AuthContext } from '../../AuthContext';
import api from '../../ApiService';
import TextInput from '../../components/TextInput';
import { Navigation } from '../../types';
import Button from '../../components/Button';
export interface Course {
    name: string;
    code_cours: string;//Code cours
    ann_univ:string;
    professor: string;
    etudiants: etudiants[];
    department: string;
  }
  export interface etudiants{
    etudiant: string;
  }
  type Props = {
    navigation: Navigation;
  };
  
  const CourseScreen = ({ navigation }: Props) => {
    const { userToken, verifyToken } = useContext(AuthContext);
    const [Course, setCourse] = useState<Course[]>([]);
    const [searchQuery, setSearchQuery] = useState('');

  
    useEffect(() => {
      if (!userToken) navigation.navigate("LoginScreen");
      verifyToken();
      fetchData();
    }, []);
    const fetchData = async () => {
      try {
        const response = await api.get('/cours');
        if (response.data.data && Array.isArray(response.data.data)) {
          const uniqueCourses = new Set(response.data.data.map(course => course.name));
          const uniqueCoursesArray = Array.from(uniqueCourses).map(name => {
            return response.data.data.find(course => course.name === name);
          });
          setCourse(uniqueCoursesArray);
        } else {
          // console.error('Error fetching courses: Response data is not an array', response.data.data);
        }
      } catch (error) {
        // console.error('Error fetching courses', error);
        // Alert.alert('Erreur', 'Error fetching courses');
      }
    };
  
    const  renderItem = ({ item }: { item: Course }) => (
      <Button mode='elevated' onPress={() => handleCoursePress(item.name)}>
          <Text style={{ fontSize: 14 }}>{item.code_cours}</Text>
      </Button>
    );
  
    // const handleCoursePress = (Courseid: string) => {
    //   navigation.navigate('Détail de Cours', { Course });
    // };
    const handleCoursePress = async (courseId: string) => {
      try {
          const response = await api.get(`/cour/${courseId}`);
          navigation.navigate('Détail de Cours', { Course: response.data.data });
      } catch (error) {
          // console.error(`Error fetching ${courseId}`, error);
      }
  };
  
    const handleCreateCours = async () => {
      navigation.navigate('Ajouter Cours');
  };
 
const filteredCourse = Course.filter(Course =>
  Course.name.toLowerCase().includes(searchQuery.toLowerCase())
);

  if (!filteredCourse || !renderItem) {
    return <Text>Aucun Schedule disponible.</Text>;}

  
       return (
          <View style={styles.Background}>
            <Button mode="elevated" style={{ backgroundColor:"#b0c4de"}} onPress={() => handleCreateCours()}>
            <Text style={{fontSize: 12,}} > Ajouter Cours</Text>
            </Button>
            <TextInput
                // style={styles.searchInput}
                placeholder="Rechercher un cours..."
                value={searchQuery}
                onChangeText={setSearchQuery}
            />
            <FlatList style={styles.container}
              data={filteredCourse}
              // data={Course}
              renderItem={renderItem}
              keyExtractor={(item) => item.code_cours}
              ListEmptyComponent={ <Text style={styles.emptyListText} >Chargement...</Text>}
            />
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
        flex: 1, padding: 20,
        zIndex: 1,
        width: '100%',
        opacity: 1,
        maxWidth: 340,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
      },
      emptyListText: {
        textAlign: 'center',
        marginTop: 20,
      },
    });
  
  export default memo(CourseScreen);