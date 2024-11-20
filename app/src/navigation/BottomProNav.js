import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import FollowUpScreen from '../screens/FollowUpScreen';
import AttendanceScreen from '../screens/AttendanceScreen';
import ProfileScreen from '../screens/ProfileScreen';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { View, Text, StyleSheet, Platform } from 'react-native';


const Tab = createBottomTabNavigator();


const BottomProNav = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size, focused }) => {
          let iconName;


          if (route.name === 'Dashboard') iconName = 'home';
          else if (route.name === 'FollowUps') iconName = 'check-circle';
          else if (route.name === 'Attendance') iconName = 'assignment';
          else if (route.name === 'Profile') iconName = 'person';


          return (
            <View
              style={[
                styles.iconWrapper,
                focused && styles.activeIconWrapper,
              ]}
            >
              <Icon name={iconName} size={focused ? 28 : 24} color={color} />
            </View>
          );
        },
        tabBarLabel: ({ color, focused }) => (
          <Text style={[styles.label, focused && styles.activeLabel]}>
            {route.name}
          </Text>
        ),
        tabBarActiveTintColor: '#0997a5',
        tabBarInactiveTintColor: '#b0b0b0',
        tabBarStyle: styles.tabBar,
        headerShown: false,
      })}
    >
      <Tab.Screen name="Dashboard" component={HomeScreen} />
      <Tab.Screen name="FollowUps" component={FollowUpScreen} />
      <Tab.Screen name="Attendance" component={AttendanceScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};


const styles = StyleSheet.create({
  tabBar: {
    height: 70,
    paddingBottom: 10,
    // paddingTop: 10,
    // marginHorizontal: 10,
    backgroundColor: '#fff',
    // borderRadius: 20,
    position: 'absolute',
    // bottom: 10,
    // elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
  },
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 50,
    // borderRadius: 25,
  },
  activeIconWrapper: {
    // backgroundColor: 'rgba(78, 84, 200, 0.15)',
  },
  label: {
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
    color: '#b0b0b0',
  },
  activeLabel: {
    color: '#0997a5',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 5,
  },
});


export default BottomProNav;