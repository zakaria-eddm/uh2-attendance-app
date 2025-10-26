import React from 'react';
import { Button, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = ({ navigation }) => {

  const handleLogout = async () => {
    await AsyncStorage.removeItem('jwtToken');
    navigation.navigate('Login');
  };

  return (
    <View>
      <Text>Ahoy! Welcome to the treasure cove!</Text>
      <Button title="Abandon Ship (Logout)" onPress={handleLogout} />
    </View>
  );
};

export default HomeScreen;