import React, { memo, useContext, useEffect } from 'react';
import { Text ,StyleSheet} from 'react-native';
import Background from '../components/Background';
import Logo from '../components/logo1';
import Header from '../components/Header';
import Button from '../components/Button';
import Paragraph from '../components/Paragraph';
import { Navigation } from '../types';
import { AuthContext } from '../AuthContext';
import {Animated} from "react-native";
import ScrollView = Animated.ScrollView;
import Frame from './Frame';
type Props = {
    navigation: Navigation;
};
const Données = ({ navigation }: Props) => {

    const { userToken } = useContext(AuthContext);

    useEffect(() => {
        if(!userToken) navigation.navigate("LoginScreen");
    }, []);

    return (
        <><ScrollView  >
            <Background>
                <Logo/>
                <Frame title="Organisation">
                {/* <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 10 }}>Organisation</Text> */}
                <Button mode="contained" onPress={() => navigation.navigate('Etudiant')}>
                     <Text style={styles.info}>Etudiants </Text>   
                </Button>
                <Button mode="contained" onPress={() => navigation.navigate('Professeur')}>
                     <Text style={styles.info}>Professeur </Text>
                </Button>
                <Button mode="contained" onPress={() => navigation.navigate('Cours')}>
                     <Text style={styles.info}>Cours </Text>
                </Button>
                <Button mode="contained" onPress={() => navigation.navigate('Td')}>
                    <Text style={styles.info}>TD  </Text>
                </Button>
                <Button mode="contained" onPress={() => navigation.navigate('Tp')}>
                   <Text style={styles.info}>TP </Text>
                </Button>
                </Frame>
                <Text></Text>
                <Frame title="Données de base">
                <Button mode="contained" onPress={() => navigation.navigate('Université')}>
                    <Text style={styles.info}>Université  </Text>
                </Button>
                <Button mode="contained"  onPress={() => navigation.navigate('Faculté')}>
                    <Text style={styles.info}>Faculté </Text>
                </Button> 
                <Button mode="contained" onPress={() => navigation.navigate('Département')}>
                   <Text style={styles.info}>Département  </Text>
                </Button>
                <Button mode="contained" onPress={() => navigation.navigate('Lieu')}>
                    <Text style={styles.info}>Lieu </Text>
                </Button>
                </Frame>
            </Background>
        </ScrollView></>
    )
}
const styles = StyleSheet.create({
    info:{
        fontSize: 14, 
        // marginBottom: 2, 
        // margin:20
    },
});
export default memo(Données);
