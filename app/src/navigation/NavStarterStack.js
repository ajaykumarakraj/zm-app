import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';


const StartStack = createStackNavigator();


const NavStarterStack = () => {
  return (
    <StartStack.Navigator
      screenOptions={{
        headerShown: false
      }}
    >
      <StartStack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          headerShown: false,
        }}
      />
    </StartStack.Navigator>
  );
};


export default NavStarterStack;



