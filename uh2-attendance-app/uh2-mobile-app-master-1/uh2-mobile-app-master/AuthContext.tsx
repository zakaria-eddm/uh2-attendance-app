import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Navigation } from './types';

// Define the shape of the context data
interface AuthContextData {
  isLoading: boolean;
  userToken: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  verifyToken: () => Promise<void>;
}

// const apiServerUrl: string = 'http://localhost:9443';
const apiServerUrl: string = 'http://192.168.0.108:9443';
const keycloakServerUrl: string = 'https://auth.aukhtubut.com'; // Replace with your Keycloak server URL
const realm: string = 'Aukhtubut'; // Replace with your Keycloak realm

const userinfoEndpoint: string = `${apiServerUrl}/`;
const tokenEndpoint:    string = `${keycloakServerUrl}/realms/${realm}/protocol/openid-connect/token`;

// Initialize the context
export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

// Provider component
export const AuthContextProvider: React.FC = ({ children }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [userToken, setUserToken] = useState<string | null>(null);

  const login = async (username: string, password: string) => {

    const data = {
      client_id: "uh2-attendance-public",
      username: username,
      password: password,
      grant_type: "password"
    }

    try {
      const response = await axios.post(tokenEndpoint, data, {
          headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
          }
        });

        await AsyncStorage.setItem('userToken', response.data.access_token);
        setUserToken(response.data.access_token);
      }
      catch (error) {
        console.log(tokenEndpoint);
        console.log(error);
        throw new Error('Login failed');
      }
  };

  const logout = async () => {
    await AsyncStorage.removeItem('userToken');
    setUserToken(null);
  };

  const verifyToken = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        const response = await axios.get(userinfoEndpoint, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.status === 200) {
          console.log(response?.status);
          setUserToken(token);
        } else {
          setUserToken(null);
        }
      }
    } catch (e) {
      if (axios.isAxiosError(e) && e.response?.status === 401) {
        setUserToken(null);
      } else {
        setUserToken(null);
      }
    }
    setIsLoading(false);
  };

  useEffect(() => {
    verifyToken();
  }, []);

  return (
    <AuthContext.Provider value={{ isLoading, userToken, login, logout, verifyToken }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);
