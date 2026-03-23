import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import LoginScreen from './src/presentation/components/LoginScreen';
import EmployeeDashboard from './src/presentation/components/EmployeeDashboard';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="EmployeeDashboard"
          component={EmployeeDashboard}
          options={{
            title: 'Dashboard',
            headerLeft: null,
            gestureEnabled: false
          }}
        />
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}
