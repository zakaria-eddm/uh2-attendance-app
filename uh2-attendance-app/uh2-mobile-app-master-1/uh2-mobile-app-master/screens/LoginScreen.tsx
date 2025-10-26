import React, { memo, useContext, useState } from 'react';
import { TouchableOpacity, StyleSheet, Text, View, Alert } from 'react-native';
import Background from '../components/Background';
import Logo from '../components/Logo';
import Header from '../components/Header';
import Button from '../components/Button';
import TextInput from '../components/TextInput';
import BackButton from '../components/BackButton';
import { theme } from '../core/theme';
import { emailValidator, passwordValidator } from '../core/utils';
import { Navigation } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, {AxiosResponse} from 'axios';
import { AuthContext } from '../AuthContext';

type Props = {
  navigation: Navigation;
};

const keycloakServerUrl: string = 'https://auth.aukhtubut.com'; // Replace with your Keycloak server URL
const realm: string = 'Aukhtubut'; // Replace with your Keycloak realm
// const clientId: string = 'your-client-id'; // Replace with your client ID
// const username: string = 'user-username'; // Replace with the user's username
// const password: string = 'user-password'; // Replace with the user's password

const tokenEndpoint: string = `${keycloakServerUrl}/realms/${realm}/protocol/openid-connect/token`;


const LoginScreen = ({ navigation }: Props) => {
  
  const [email, setEmail] = useState({ value: '', error: '' });
  const [password, setPassword] = useState({ value: '', error: '' });
  const { login } = useContext(AuthContext);

  const _onLoginPressed = async () => {
    const emailError = passwordValidator(email.value);
    const passwordError = passwordValidator(password.value);

    if (emailError || passwordError) {
      setEmail({ ...email, error: emailError });
      setPassword({ ...password, error: passwordError });
      return;
    }

    try {
      await login(email.value, password.value)
    } catch (error) {
      console.log(error);
      Alert.alert('Login Failed', 'Invalid credentials or network error');
    }

  };

  const handleLogin = async () => {

      // const data: URLSearchParams = new URLSearchParams();
      // data.append('client_id', 'uh2-attendance-public');
      // data.append('username', email.value);
      // data.append('password', password.value);
      // data.append('grant_type', 'password');

      // const data = {
      //   client_id: "uh2-attendance-public",
      //   username: email.value,
      //   password: password.value,
      //   grant_type: "password"
      // }

      // // alert('Connecting to: '+tokenEndpoint)
      // // alert('Data: '+JSON.stringify(data))

      // try {
      //   const response = await axios.post(tokenEndpoint, data, {
      //       headers: {
      //           'Content-Type': 'application/x-www-form-urlencoded'
      //       }
      //     });

      //     await AsyncStorage.setItem('jwtToken', response.data.access_token);
      //     navigation.navigate('Dashboard');
          
      //   }
      //   catch (error) {
      //     alert('Invalid credentials');
      //     alert('Error : '+ JSON.stringify(error));
      //   }

      // const response = await axios.post('http://aukhtubut.com:8081/api/v1/auth/signin', { email: email.value, password: password.value });
      // await AsyncStorage.setItem('jwtToken', response.data.token);
      // navigation.navigate('Dashboard');
      // } catch (error) {
      //   alert('Invalid credentials)');
      // }
  };

  return (
    <Background>

      {/* <BackButton goBack={() => navigation.navigate('HomeScreen')} /> */}

      <Logo />

      <Header>UH2 ATTENDANCE</Header>

      <TextInput
        label="Email"
        returnKeyType="next"
        value={email.value}
        onChangeText={text => setEmail({ value: text, error: '' })}
        error={!!email.error}
        errorText={email.error}
        autoCapitalize="none"
        autoCompleteType="email"
        textContentType="emailAddress"
        keyboardType="email-address"
      />

      <TextInput
        label="Password"
        returnKeyType="done"
        value={password.value}
        onChangeText={text => setPassword({ value: text, error: '' })}
        error={!!password.error}
        errorText={password.error}
        secureTextEntry
      />

      <View style={styles.forgotPassword}>
        <TouchableOpacity
          onPress={() => navigation.navigate('ForgotPasswordScreen')}
        >
          <Text style={styles.label}>Forgot your password?</Text>
        </TouchableOpacity>
      </View>

      <Button mode="contained" onPress={_onLoginPressed}>
        Login
      </Button>

      <View style={styles.row}>
        <Text style={styles.label}>Don’t have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('RegisterScreen')}>
          <Text style={styles.link}>Sign up</Text>
        </TouchableOpacity>
      </View>

    </Background>
  );
};

const styles = StyleSheet.create({
  forgotPassword: {
    width: '100%',
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    marginTop: 4,
    marginBottom: 50,
  },
  label: {
    color: theme.colors.secondary,
  },
  link: {
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
});

export default memo(LoginScreen);
