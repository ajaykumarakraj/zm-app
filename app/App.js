import { StatusBar, StyleSheet } from 'react-native';
import RootNavigation from './src/navigation/routes';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './src/context/AuthContext';

export default function App() {
  return (
    <AuthProvider>
        <NavigationContainer>
          <StatusBar style="auto" />
          <RootNavigation />
        </NavigationContainer>
    </AuthProvider>
  );
}