import React from 'react';
import { ActivityIndicator, View, Text, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';
import NavProStack from './NavProStack';
import NavStarterStack from './NavStarterStack';


const RootNavigation = () => {
  const { isLoggedIn, loading } = useAuth();


  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }


  return isLoggedIn ? <NavProStack /> : <NavStarterStack />;
};


const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
});


export default RootNavigation;



