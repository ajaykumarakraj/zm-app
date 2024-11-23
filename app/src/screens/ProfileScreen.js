import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import { useAuth } from '../context/AuthContext';
import { CommonActions } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';


const ProfileScreen = ({ navigation }) => {

  const [user, SetUser] = useState('')
  const { logout } = useAuth();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userInfoCheck = await AsyncStorage.getItem('user');
        const ParseduserInfoCheck = JSON.parse(userInfoCheck) 
        SetUser(ParseduserInfoCheck.info);
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };

    fetchUserInfo();
  }, []);

  const handleLogout = async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "OK",
          onPress: async () => {
            await logout();

            // Reset the navigation stack to only have the Login screen
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              })
            );
          },
        },
      ]
    );
  };


  return (
    <View style={styles.container}>
      <Text style={styles.userName}>{user.userName}</Text>
      {/* <Text style={styles.userEmail}>johndoe@example.com</Text> */}


      {/* Profile Information Card */}
      <LinearGradient colors={['#fdfbfb', '#ebedee']} style={styles.infoCard}>
        <View style={styles.infoRow}>
          <Icon name="phone" size={24} color="#9A9A9A" />
          <Text style={styles.infoText}>{user.phoneNumber}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.infoRow}>
          <Icon name="location-on" size={24} color="#9A9A9A" />
        <Text style={styles.infoText}>123, Address, India</Text>
        </View>
      </LinearGradient>


      {/* Logout Button */}
      <TouchableOpacity onPress={handleLogout} style={styles.logoutButtonContainer}>
        <LinearGradient
          colors={['#0997a5', '#0997a5']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.logoutButton}
        >
          <Text style={styles.logoutText}>Logout</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6f8',
    padding: 20,
    alignItems: 'center',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  infoCard: {
    width: '100%',
    padding: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 6,
    marginBottom: 40,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  infoText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginLeft: 10,
  },
  divider: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 10,
  },
  logoutButtonContainer: {
    width: '80%',
    alignItems: 'center',
  },
  logoutButton: {
    width: '100%',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#fc466b',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  logoutText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});


export default ProfileScreen;



