// AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';


const AuthContext = createContext();


export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const checkToken = async () => {
      const tokenData = await AsyncStorage.getItem('Token');

      if (tokenData) {
        const { token, expiryTime } = JSON.parse(tokenData);

        // Check if the token has expired
        if (Date.now() > expiryTime) {
          // Token expired, clear it
          await AsyncStorage.removeItem('Token');
          setIsLoggedIn(false);
        } else {
          // Token is valid
          setIsLoggedIn(true);
        }
      }

      setLoading(false);
    };

    checkToken();
  }, []);

  const login = async (token) => {
    const expiryTime = Date.now() + 24 * 60 * 60 * 1000;
    await AsyncStorage.setItem('Token', JSON.stringify({ token, expiryTime }));
    setIsLoggedIn(true);
  };

  const userInfo = async (info) => {
    console.log(info, 'reaching?')
    await AsyncStorage.setItem('user', JSON.stringify({ info }));
  }


  const logout = async () => {
    await AsyncStorage.clear();
    setIsLoggedIn(false);

    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });


  };


  return (
    <AuthContext.Provider value={{ isLoggedIn, loading, login, logout, userInfo }}>
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => useContext(AuthContext);