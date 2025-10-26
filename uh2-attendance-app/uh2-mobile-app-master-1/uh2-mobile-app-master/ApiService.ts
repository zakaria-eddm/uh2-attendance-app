import axios, { AxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';


import Constants from "expo-constants";
const API_BASE_URL = 'http://192.168.0.108:9443'; // Replace with your API base URL
// const API_BASE_URL = 'https://api.aukhtubut.com'; // Replace with your API base URL

// Function to get the token from AsyncStorage
const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    return token;
  } catch (error) {
    console.error('Error getting token', error);
    return null;
  }
};

// Create an Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Request interceptor to add the auth token to every request
api.interceptors.request.use(
  async (config: AxiosRequestConfig) => {
    const token = await getToken();
    if (token) {
        // console.log(token);
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Export the configured Axios instance
export default api;
