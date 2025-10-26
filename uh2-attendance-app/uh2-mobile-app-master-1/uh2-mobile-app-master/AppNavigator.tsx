// AppNavigator.tsx
import React, { useContext} from 'react';
import {Button,TouchableOpacity,Text} from 'react-native';
import 'react-native-gesture-handler';
// import Button from './components/Button'
import Logo from './components/logo2';
import { createDrawerNavigator } from '@react-navigation/drawer';
// import { Button } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';
import AttendanceScreen from './screens/AttendanceScreen';
import { AuthContext } from './AuthContext';
import {CalendrierScreen, ScheduleScreen} from "./screens";
import EtudiantScreen from "./screens/admin_screens/EtudiantScreen";
import FacultyScreen from "./screens/données_de_base_screens/FacultyScreen";
import UniversityScreen from "./screens/données_de_base_screens/UniversityScreen";
import DepartementScreen from "./screens/données_de_base_screens/DepartementScreen";
import LieuScreen from "./screens/données_de_base_screens/LieuScreen";
import CoursScreen from "./screens/admin_screens/CoursScreen";
import TpScreen from "./screens/admin_screens/TpScreen";
import TdScreen from "./screens/admin_screens/TdScreen";
import ProfesseurScreen from "./screens/admin_screens/ProfesseurScreen";
import DetailScheduleScreen from "./screens/admin_screens/DetailScheduleScreen";
import DetailCalendrierScreen from "./screens/admin_screens/DetailCalendrierScreen";
import DetaileDepartementScreen from "./screens/données_de_base_screens/DetaileDepartementScreen";
import DetailUniversityScreen from "./screens/données_de_base_screens/DetailUniversityScreen";
import DetailFacultyScreen from "./screens/données_de_base_screens/DetailFacultyScreen";
import DetailLieuScreen from "./screens/données_de_base_screens/DetailLieuScreen";
import DetailTpScreen from "./screens/admin_screens/DetailTpScreen";
import DetailTdScreen from "./screens/admin_screens/DetailTdScreen";
import DetailProfesseurScreen from "./screens/admin_screens/DetailProfesseurScreen";
import DetailEtudiantScreen from "./screens/admin_screens/DetailEtudiantScreen";
import DetailCourseScreen from "./screens/admin_screens/DetailCoursScreen";
import DetailePointageScreen from "./screens/admin_screens/DetailePointageScreen";
import PointageScreen from "./screens/admin_screens/PointageScreen"; // Adjust the path as needed
import ScheduleEditerScreen from "./screens/editer_screens/UpdateScheduleScreen";
import ScheduleAjouterScreen from "./screens/ajouter_screens/AjouterScheduleScrenn";
import CalendrierAjouterScreen from "./screens/ajouter_screens/AjouterCalendrierScrenn";
import AjouterCourseScreen from "./screens/ajouter_screens/AjouterCoursScrenn";
import EtudiantAjouterScreen from "./screens/ajouter_screens/AjouterEtudiantScrenn";
import ProfesseurAjouterScreen from "./screens/ajouter_screens/AjouterProfScrenn";
import TdAjouterScreen from "./screens/ajouter_screens/AjouterTdScrenn";
import TpAjouterScreen from "./screens/ajouter_screens/AjouterTpScrenn";
import CalendrierEditedScreen from "./screens/editer_screens/UpdateCalendrierScrenn" ;
import CourseEditedScreen from './screens/editer_screens/UpdateCoursScrenn';
import TpEditedScreen from "./screens/editer_screens/UpdateTpScrenn";
import TdEditedScreen from "./screens/editer_screens/UpdateTdScrenn";
import EtudiantEditedScreen from './screens/editer_screens/UpdateEtudiantScrenn';
import ProfesseurEditedScreen from './screens/editer_screens/UpdateProfScrenn';
import PointageEditedScreen from './screens/editer_screens/UpdatePointageScrenn';
import ListeEtudiantCourseScreen from './screens/admin_screens/ListeEtudiantCours';
import ListeEtudiantTdScreen from './screens/admin_screens/ListeEtudiantTd';
import ListeEtudiantTpScreen from './screens/admin_screens/ListeEtudiantTp';
import  Données from "./screens/Données";
import CalendarView from "./screens/CalendarView"
import AjouterPointageScreen from "./screens/ajouter_screens/AjouterPointage"
import { Drawer } from 'react-native-paper';

const Stack = createStackNavigator();

const AppNavigator = () => {

  const { userToken } = useContext(AuthContext);

  return (
    <NavigationContainer>
      <Stack.Navigator>

        {userToken ? (
          // User is signed in
          <>
         
            <Stack.Screen name="Home" component={HomeScreen} />
              <Stack.Screen name="Attendance" component={AttendanceScreen}/>
              <Stack.Screen name="Ordonnancement" component={ScheduleScreen} 
              options={({ navigation }) => ({
                headerTitleStyle: {
                  fontSize: 14, 
                },
                headerRight: () => (
                  // <Button
                  //   onPress={() => navigation.navigate('Home')}
                  //   title="Home"
                  //   color="#000"
                  // />
                  <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                  <Logo />
                  <Text style={{fontSize:6,alignSelf:'center'}}>Home</Text>
                </TouchableOpacity>
               
                ),
              })}/>
              <Stack.Screen name="Détail de Schedule" component={DetailScheduleScreen}
              options={({ navigation }) => ({
                headerTitleStyle: {
                  fontSize: 14, 
                },
                headerRight: () => (
                  <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                  <Logo />
                  <Text style={{fontSize:6,alignSelf:'center'}}>Home</Text>
                </TouchableOpacity>
               
                ),
              })} />
              <Stack.Screen name="Ajouter Pointage" component={AjouterPointageScreen}
              options={({ navigation }) => ({
                headerTitleStyle: {
                  fontSize: 14, 
                },
                headerRight: () => (
                  <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                  <Logo />
                  <Text style={{fontSize:6,alignSelf:'center'}}>Home</Text>
                </TouchableOpacity>
               
                ),
              })} />

              <Stack.Screen name="Calendrier" component={CalendrierScreen} 
              options={({ navigation }) => ({
                headerTitleStyle: {
                  fontSize: 14, 
                },
                headerRight: () => (
                  <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                  <Logo />
                  <Text style={{fontSize:6,alignSelf:'center'}}>Home</Text>
                </TouchableOpacity>
               
                ),
              })}/>
              <Stack.Screen name="Détail de Calendrier" component={DetailCalendrierScreen} 
              options={({ navigation }) => ({
                headerTitleStyle: {
                  fontSize: 14, 
                },
                headerRight: () => (
                  <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                  <Logo />
                  <Text style={{fontSize:6,alignSelf:'center'}}>Home</Text>
                </TouchableOpacity>
               
                ),
              })}/>
              <Stack.Screen name="Pointages" component={PointageScreen} 
              options={({ navigation }) => ({
                headerTitleStyle: {
                  fontSize: 14, 
                },
                headerRight: () => (
                  <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                  <Logo />
                  <Text style={{fontSize:6,alignSelf:'center'}}>Home</Text>
                </TouchableOpacity>
               
                ),
              })}/>
              <Stack.Screen name="Détail de Pointages" component={DetailePointageScreen}  
              options={({ navigation }) => ({
                headerTitleStyle: {
                  fontSize: 14, 
                },
                title: 'Détail de Pointage',
                headerRight: () => (
                  <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                  <Logo />
                  <Text style={{fontSize:6,alignSelf:'center'}}>Home</Text>
                </TouchableOpacity>
               
                ),
              }) }/>
              <Stack.Screen name="Etudiant" component={EtudiantScreen} 
               options={({ navigation }) => ({
                headerTitleStyle: {
                  fontSize: 14, 
                },
                headerRight: () => (
                  <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                  <Logo />
                  <Text style={{fontSize:6,alignSelf:'center'}}>Home</Text>
                </TouchableOpacity>
               
                ),
              }) }/>
              <Stack.Screen name="Détail de Etudiant" component={DetailEtudiantScreen}
               options={({ navigation }) => ({
                headerTitleStyle: {
                  fontSize: 14, 
                },
                headerRight: () => (
                  <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                  <Logo />
                  <Text style={{fontSize:6,alignSelf:'center'}}>Home</Text>
                </TouchableOpacity>
               
                ),
              }) } />
              <Stack.Screen name="Professeur" component={ProfesseurScreen} 
               options={({ navigation }) => ({
                headerTitleStyle: {
                  fontSize: 14, 
                },
                headerRight: () => (
                  <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                  <Logo />
                  <Text style={{fontSize:6,alignSelf:'center'}}>Home</Text>
                </TouchableOpacity>
               
                ),
              }) }/>
              <Stack.Screen name="Détail de Professeur" component={DetailProfesseurScreen} 
               options={({ navigation }) => ({
                headerTitleStyle: {
                  fontSize: 14, 
                },
                headerRight: () => (
                  <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                  <Logo />
                  <Text style={{fontSize:6,alignSelf:'center'}}>Home</Text>
                </TouchableOpacity>
               
                ),
              }) }/>
              <Stack.Screen name="Td" component={TdScreen} 
                options={({ navigation }) => ({
                  headerTitleStyle: {
                    fontSize: 14, 
                  },
                  title: 'TD',
                  headerRight: () => (
                    <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                    <Logo />
                    <Text style={{fontSize:6,alignSelf:'center'}}>Home</Text>
                  </TouchableOpacity>
                 
                  ),
                }) }/>
              <Stack.Screen name="Détail de Td" component={DetailTdScreen} 
                options={({ navigation }) => ({
                  headerTitleStyle: {
                    fontSize: 14, 
                  },
                  title: 'Détail de TD',
                  headerRight: () => (
                    <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                    <Logo />
                    <Text style={{fontSize:6,alignSelf:'center'}}>Home</Text>
                  </TouchableOpacity>
                 
                  ),
                }) }/>
              <Stack.Screen name="Tp" component={TpScreen} 
                options={({ navigation }) => ({
                  headerTitleStyle: {
                    fontSize: 14, 
                  },
                  title: 'TP',
                  headerRight: () => (
                    <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                    <Logo />
                    <Text style={{fontSize:6,alignSelf:'center'}}>Home</Text>
                  </TouchableOpacity>
                 
                  ),
                }) }/>
              <Stack.Screen name="Détail de Tp" component={DetailTpScreen} 
                options={({ navigation }) => ({
                  headerTitleStyle: {
                    fontSize: 14, 
                  },
                  title: 'Détail de TP',
                  headerRight: () => (
                    <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                    <Logo />
                    <Text style={{fontSize:6,alignSelf:'center'}}>Home</Text>
                  </TouchableOpacity>
                 
                  ),
                }) }/>
              <Stack.Screen name="Cours" component={CoursScreen} 
               options={({ navigation }) => ({
                headerTitleStyle: {
                  fontSize: 14, 
                },
                headerRight: () => (
                  <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                  <Logo />
                  <Text style={{fontSize:6,alignSelf:'center'}}>Home</Text>
                </TouchableOpacity>
               
                ),
              }) }/>
              <Stack.Screen name="Détail de Cours" component={DetailCourseScreen} 
               options={({ navigation }) => ({
                headerTitleStyle: {
                  fontSize: 14, 
                },
                headerRight: () => (
                  <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                  <Logo />
                  <Text style={{fontSize:6,alignSelf:'center'}}>Home</Text>
                </TouchableOpacity>
               
                ),
              }) }/>
              <Stack.Screen name="Lieu" component={LieuScreen} 
               options={({ navigation }) => ({
                headerTitleStyle: {
                  fontSize: 14, 
                },
                headerRight: () => (
                  <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                  <Logo />
                  <Text style={{fontSize:6,alignSelf:'center'}}>Home</Text>
                </TouchableOpacity>
               
                ),
              }) }/>
              <Stack.Screen name="Détail de Lieu" component={DetailLieuScreen}
               options={({ navigation }) => ({
                headerTitleStyle: {
                  fontSize: 14, 
                },
                headerRight: () => (
                  <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                  <Logo />
                  <Text style={{fontSize:6,alignSelf:'center'}}>Home</Text>
                </TouchableOpacity>
               
                ),
              }) } />
              <Stack.Screen name="Faculté" component={FacultyScreen} 
               options={({ navigation }) => ({
                headerTitleStyle: {
                  fontSize: 14, 
                },
                headerRight: () => (
                  <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                  <Logo />
                  <Text style={{fontSize:6,alignSelf:'center'}}>Home</Text>
                </TouchableOpacity>
               
                ),
              }) }/>
              <Stack.Screen name="Détail de Faculté" component={DetailFacultyScreen} 
               options={({ navigation }) => ({
                headerTitleStyle: {
                  fontSize: 14, 
                },
                headerRight: () => (
                  <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                  <Logo />
                  <Text style={{fontSize:6,alignSelf:'center'}}>Home</Text>
                </TouchableOpacity>
               
                ),
              }) }/>
              <Stack.Screen name="Université" component={UniversityScreen} 
               options={({ navigation }) => ({
                headerTitleStyle: {
                  fontSize: 14, 
                },
                headerRight: () => (
                  <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                  <Logo />
                  <Text style={{fontSize:6,alignSelf:'center'}}>Home</Text>
                </TouchableOpacity>
               
                ),
              }) }/>
              <Stack.Screen name="Détail de Université" component={DetailUniversityScreen} 
               options={({ navigation }) => ({
                headerTitleStyle: {
                  fontSize: 14, 
                },
                headerRight: () => (
                  <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                  <Logo />
                  <Text style={{fontSize:6,alignSelf:'center'}}>Home</Text>
                </TouchableOpacity>
               
                ),
              }) }/>
              <Stack.Screen name="Département" component={DepartementScreen} 
               options={({ navigation }) => ({
                headerTitleStyle: {
                  fontSize: 14, 
                },
                headerRight: () => (
                  <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                  <Logo />
                  <Text style={{fontSize:6,alignSelf:'center'}}>Home</Text>
                </TouchableOpacity>
               
                ),
              }) }/>
              <Stack.Screen name="Détail de Département" component={DetaileDepartementScreen} 
               options={({ navigation }) => ({
                headerTitleStyle: {
                  fontSize: 14, 
                },
                headerRight: () => (
                  <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                  <Logo />
                  <Text style={{fontSize:6,alignSelf:'center'}}>Home</Text>
                </TouchableOpacity>
               
                ),
              }) }/>
              <Stack.Screen name="Editer Schedule" component={ScheduleEditerScreen} 
               options={({ navigation }) => ({
                headerTitleStyle: {
                  fontSize: 14, 
                },
                headerRight: () => (
                  <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                  <Logo />
                  <Text style={{fontSize:6,alignSelf:'center'}}>Home</Text>
                </TouchableOpacity>
               
                ),
              }) }/>
              <Stack.Screen name="Ajouter Schedule" component={ScheduleAjouterScreen} 
               options={({ navigation }) => ({
                headerTitleStyle: {
                  fontSize: 14, 
                },
                headerRight: () => (
                  <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                  <Logo />
                  <Text style={{fontSize:6,alignSelf:'center'}}>Home</Text>
                </TouchableOpacity>
               
                ),
              }) }/>
              <Stack.Screen name="Ajouter Calendrier" component={CalendrierAjouterScreen} 
               options={({ navigation }) => ({
                headerTitleStyle: {
                  fontSize: 14, 
                },
                headerRight: () => (
                  <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                  <Logo />
                  <Text style={{fontSize:6,alignSelf:'center'}}>Home</Text>
                </TouchableOpacity>
               
                ),
              }) }/>
              <Stack.Screen name="Ajouter Cours" component={AjouterCourseScreen}
               options={({ navigation }) => ({
                headerTitleStyle: {
                  fontSize: 14, 
                },
                headerRight: () => (
                  <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                  <Logo />
                  <Text style={{fontSize:6,alignSelf:'center'}}>Home</Text>
                </TouchableOpacity>
               
                ),
              }) } />
              <Stack.Screen name="Ajouter Td" component={TdAjouterScreen} 
                options={({ navigation }) => ({
                  headerTitleStyle: {
                    fontSize: 14, 
                  },
                  title: 'Ajouter TD',
                  headerRight: () => (
                    <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                    <Logo />
                    <Text style={{fontSize:6,alignSelf:'center'}}>Home</Text>
                  </TouchableOpacity>
                 
                  ),
                }) }/>
              <Stack.Screen name="Ajouter Tp" component={TpAjouterScreen} 
                options={({ navigation }) => ({
                  headerTitleStyle: {
                    fontSize: 14, 
                  },
                  title: 'Ajouter TP',
                  headerRight: () => (
                    <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                    <Logo />
                    <Text style={{fontSize:6,alignSelf:'center'}}>Home</Text>
                  </TouchableOpacity>
                 
                  ),
                }) }/>
              <Stack.Screen name="Ajouter Professeur" component={ProfesseurAjouterScreen}
               options={({ navigation }) => ({
                headerTitleStyle: {
                  fontSize: 14, 
                },
                headerRight: () => (
                  <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                  <Logo />
                  <Text style={{fontSize:6,alignSelf:'center'}}>Home</Text>
                </TouchableOpacity>
               
                ),
              }) } />
              <Stack.Screen name="Ajouter Etudiant" component={EtudiantAjouterScreen} 
               options={({ navigation }) => ({
                headerTitleStyle: {
                  fontSize: 14, 
                },
                headerRight: () => (
                  <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                  <Logo />
                  <Text style={{fontSize:6,alignSelf:'center'}}>Home</Text>
                </TouchableOpacity>
               
                ),
              }) }/>
              <Stack.Screen name="Editer Etudiant" component={EtudiantEditedScreen} 
               options={({ navigation }) => ({
                headerTitleStyle: {
                  fontSize: 14, 
                },
                headerRight: () => (
                  <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                  <Logo />
                  <Text style={{fontSize:6,alignSelf:'center'}}>Home</Text>
                </TouchableOpacity>
               
                ),
              }) }/>
              <Stack.Screen name="Editer Cours" component={CourseEditedScreen} 
               options={({ navigation }) => ({
                headerTitleStyle: {
                  fontSize: 14, 
                },
                headerRight: () => (
                  <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                  <Logo />
                  <Text style={{fontSize:6,alignSelf:'center'}}>Home</Text>
                </TouchableOpacity>
               
                ),
              }) }/>
              <Stack.Screen name="Editer Td" component={TdEditedScreen} 
                options={({ navigation }) => ({
                  headerTitleStyle: {
                    fontSize: 14, 
                  },
                  title: 'Editer TD',
                  headerRight: () => (
                    <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                    <Logo />
                    <Text style={{fontSize:6,alignSelf:'center'}}>Home</Text>
                  </TouchableOpacity>
                 
                  ),
                }) }/>
              <Stack.Screen name="Editer Tp" component={TpEditedScreen} 
                options={({ navigation }) => ({
                  headerTitleStyle: {
                    fontSize: 14, 
                  },
                  title: 'Editer TP',
                  headerRight: () => (
                    <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                    <Logo />
                    <Text style={{fontSize:6,alignSelf:'center'}}>Home</Text>
                  </TouchableOpacity>
                 
                  ),
                }) }/>
              <Stack.Screen name="Editer Professeur" component={ProfesseurEditedScreen} 
               options={({ navigation }) => ({
                headerTitleStyle: {
                  fontSize: 14, 
                },
                headerRight: () => (
                  <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                  <Logo />
                  <Text style={{fontSize:6,alignSelf:'center'}}>Home</Text>
                </TouchableOpacity>
               
                ),
              }) }/>
              <Stack.Screen name="Editer Calendrier" component={CalendrierEditedScreen} 
               options={({ navigation }) => ({
                headerTitleStyle: {
                  fontSize: 14, 
                },
                headerRight: () => (
                  <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                  <Logo />
                  <Text style={{fontSize:6,alignSelf:'center'}}>Home</Text>
                </TouchableOpacity>
               
                ),
              }) }/>
              <Stack.Screen name="Editer Pointage" component={PointageEditedScreen} 
               options={({ navigation }) => ({
                headerTitleStyle: {
                  fontSize: 14, 
                },
                headerRight: () => (
                  <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                  <Logo />
                  <Text style={{fontSize:6,alignSelf:'center'}}>Home</Text>
                </TouchableOpacity>
               
                ),
              }) }/>
              <Stack.Screen name="Etudiants de Cours" component={ListeEtudiantCourseScreen} 
               options={({ navigation }) => ({
                headerTitleStyle: {
                  fontSize: 14, 
                },
                headerRight: () => (
                  <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                  <Logo />
                  <Text style={{fontSize:6,alignSelf:'center'}}>Home</Text>
                </TouchableOpacity>
               
                ),
              }) }/>
              <Stack.Screen name="Etudiants de Td" component={ListeEtudiantTdScreen} 
                options={({ navigation }) => ({
                  title: 'Etudiants de TD',
                  headerTitleStyle: {
                    fontSize: 14, 
                  },
                  headerRight: () => (
                    <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                    <Logo />
                    <Text style={{fontSize:6,alignSelf:'center'}}>Home</Text>
                  </TouchableOpacity>
                 
                  ),
                }) }/>
              <Stack.Screen name="Etudiants de Tp" component={ListeEtudiantTpScreen} 
                options={({ navigation }) => ({
                  title: 'Etudiants de TP',
                  headerTitleStyle: {
                    fontSize: 14, 
                  },
                  headerRight: () => (
                    <TouchableOpacity  onPress={() => navigation.navigate('Home')}>
                    <Logo />
                    <Text style={{fontSize:6,alignSelf:'center'}}>Home</Text>
                    </TouchableOpacity>
                 
                  ),
                }) }/>
              <Stack.Screen name="Données" component={Données}  />
              <Stack.Screen name="CalendarView" component={CalendarView}  
               options={({ navigation }) => ({
                headerTitleStyle: {
                  fontSize: 14, 
                },
                title: 'Schedule Calendrier',
                headerRight: () => (
                  <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                  <Logo />
                  <Text style={{fontSize:6,alignSelf:'center'}}>Home</Text>
                </TouchableOpacity>
               
                ),
              }) }/>


          </>
        ) : (
          // No token found, user isn't signed in
          <>

            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
