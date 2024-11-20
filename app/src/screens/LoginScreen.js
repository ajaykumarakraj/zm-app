import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import Icon from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '@env';


const LoginScreen = () => {
  const { login } = useAuth();


  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [deviceID, setDeviceID] = useState('');
  const [showPassword, setShowPassword] = useState(false);


  useEffect(() => {
    const fetchDeviceID = async () => {
      try {
        const id = await DeviceInfo.getUniqueId();
        setDeviceID(id);
        console.log('Device ID:', id);
      } catch (error) {
        console.error('Error fetching device ID:', error);
      }
    };


    fetchDeviceID();
  }, []);


  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };


  const handleLogin = async () => {
    if (!phoneNumber || !password) {
      Alert.alert('Error', 'Please enter both phone number and password.');
      return;
    }


    try {
      console.log(`${API_URL}/auth/login`)
      const response = await axios.post(`${API_URL}/auth/login`, {
        phoneNumber,
        password,
        deviceID,
      });

      const token = response.data.token;
      console.log('login successfully')
      await login(token);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', error.response?.data?.message || 'Login failed');
    }
  };


  return (
    <View style={styles.container}>
      <Image source={require('../../assets/topVector.png')} style={styles.topImage} />
      <Text style={styles.helloText}>Zolexomart Pvt Ltd</Text>
      <Text style={styles.signInText}>Sign in to your account</Text>


      <View style={styles.inputContainer}>
        <Icon style={styles.inputIcons} name="user" size={30} color="#9A9A9A" />


        <TextInput
          style={styles.textInput}
          placeholder="Phone Number"
          placeholderTextColor="#9A9A9A"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
        />
      </View>


      <View style={styles.inputContainer}>
        <Icon style={styles.inputIcons} name="lock" size={30} color="#9A9A9A" />
        <TextInput
          style={[styles.textInput, { flex: 1 }]}
          placeholder="Password"
          placeholderTextColor="#9A9A9A"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeIconContainer}>
          <Icon
            name={showPassword ? "eye" : "eye-slash"}
            size={24}
            color="#9A9A9A"
          />
        </TouchableOpacity>
      </View>


      <TouchableOpacity>
        <Text style={styles.forgotPasswordText}>Forget Your Password?</Text>
      </TouchableOpacity>


      <View style={styles.signInContainer}>
        <Text style={styles.sigIn}>Sign In</Text>
        <TouchableOpacity onPress={handleLogin}>
          <LinearGradient colors={['#F97794', '#623AA2']} style={styles.linearGradient}>
            <Icon name="arrow-right" style={styles.signicon} />
          </LinearGradient>
        </TouchableOpacity>
      </View>


      <Text style={styles.bottomtext}>
        Don't have an account? <Text style={{ textDecorationLine: 'underline' }}>Create</Text>
      </Text>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F5F5F5',
    flex: 1,
  },
  topImage: {
    width: '100%',
    height: 130,
  },
  helloText: {
    textAlign: 'center',
    fontSize: 30,
    textTransform: 'uppercase',
    fontWeight: '900',
    color: '#262626',
    marginTop: 50,
  },
  signInText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#262626',
  },
  inputContainer: {
    backgroundColor: 'white',
    flexDirection: 'row',
    borderRadius: 20,
    marginHorizontal: 40,
    elevation: 10,
    marginVertical: 20,
    height: 50,
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    marginLeft: 10,
    color: '#000', // Text color (for entered text)
    paddingRight: 40, // Padding for the eye icon
  },
  inputIcons: {
    marginLeft: 10,
  },
  eyeIconContainer: {
    paddingRight: 15,
    position: 'absolute',
    right: 10,
  },
  forgotPasswordText: {
    color: '#000',
    textAlign: 'right',
    width: '90%',
    fontSize: 15,
    alignSelf: 'flex-end',
    marginRight: 40,
    marginTop: 5,
  },
  signInContainer: {
    flexDirection: 'row',
    marginTop: 80,
    width: '90%',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginRight: 20,
  },
  sigIn: {
    color: '#000',
    fontSize: 20,
    fontWeight: '600',
  },
  signicon: {
    color: '#fff',
    fontSize: 24,
  },
  linearGradient: {
    height: 34,
    width: 64,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
  },
  bottomtext: {
    textAlign: 'center',
    fontSize: 15,
    marginTop: 120,
  },
});


export default LoginScreen;



