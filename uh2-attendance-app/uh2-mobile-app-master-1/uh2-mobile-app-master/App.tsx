import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import { Dashboard } from './screens';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContextProvider } from './AuthContext';
import AppNavigator from './AppNavigator';


const Stack = createStackNavigator();

const App: React.FC = () => {
  return (
      <><AuthContextProvider>
          <AppNavigator/>
      </AuthContextProvider>
      </>
  );
};

export default App;

// const App = () => {
  
//   return (
//     <NavigationContainer>
//       <Stack.Navigator initialRouteName="Dashboard">
//         {/* <Stack.Screen name="HomeScreen" component={HomeScreen} />
//         <Stack.Screen name="Dashboard" component={Dashboard} />
//         <Stack.Screen name="LoginScreen" component={LoginScreen} /> */}
//         {isAuthenticated ? (
//           // User is authenticated
//           <Stack.Screen name="Dashboard" component={Dashboard} /> 
//         ) : (
//           // User is not authenticated
//           <Stack.Screen name="LoginScreen" component={LoginScreen} />
//         )}
//       </Stack.Navigator>
//     </NavigationContainer>
    
//   );
// };

// export default App;