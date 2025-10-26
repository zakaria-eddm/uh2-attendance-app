import React, { memo, useContext, useEffect } from 'react';
import {Text } from 'react-native';
import Background from '../components/Background';
import Logo from '../components/logo1';
import Header from '../components/Header';
import Button from '../components/Button';
import Paragraph from '../components/Paragraph';
import { Navigation } from '../types';
import { AuthContext } from '../AuthContext';
import {ScheduleScreen} from './index'
import { verify } from 'crypto';
import {Animated} from "react-native";
import Frame from './Frame';
import ScrollView = Animated.ScrollView;

type Props = {
  navigation: Navigation;
};

const HomeScreen = ({ navigation }: Props) => {

  const { userToken, logout } = useContext(AuthContext);

  useEffect(() => {
    if(!userToken) navigation.navigate("LoginScreen");
  }, []);

  return (
<><ScrollView >
      <Background>
        <Logo/>
        <Header>Home</Header>
        <Paragraph>
          WelcomeUH2 Attendance
        </Paragraph>
        <Frame>
        <Button mode="contained" onPress={() => navigation.navigate('Attendance')}>
          Attendance
        </Button>
        <Button mode="contained" onPress={() => navigation.navigate('Ordonnancement')}>
          Ordonnancements
        </Button>
        <Button mode="contained" onPress={() => navigation.navigate('Calendrier')}>
        <Text>Calendrier </Text>
        </Button>
        <Button mode="contained" onPress={() => navigation.navigate('Pointages')}>
          <Text>Pointages </Text>
        </Button>
        <Button mode="contained" onPress={() => navigation.navigate('Données')}>
        <Text>Données </Text>
        </Button>
        <Button mode="contained" onPress={() => logout()}>
          Se deconnecter
        </Button>
        {/* <Button mode="contained" onPress={() => navigation.navigate('LoginScreen')}>
      Login
    </Button>
    <Button
      mode="outlined"
      onPress={() => navigation.navigate('RegisterScreen')}
    >
      Sign Up
    </Button> */}
      </Frame> 
      </Background>
</ScrollView></>
  )
}

export default memo(HomeScreen);
