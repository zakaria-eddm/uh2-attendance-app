import React, { useState } from 'react';
import { Button, TextInput, View } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://aukhtubut.com:8081/api/v1/auth/signin', { email, password });
      await AsyncStorage.setItem('jwtToken', response.data.token);
      navigation.navigate('Home');
    } catch (error) {
      alert('Arrr matey! No treasure found. (Invalid credentials)');
    }
  };

  return (
    <View>
      <TextInput placeholder="Username" onChangeText={setEmail} />
      <TextInput placeholder="Password" secureTextEntry={true} onChangeText={setPassword} />
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
};