import { Linking, StyleSheet, Text, View, TouchableOpacity, FlatList, Alert, ActivityIndicator, PermissionsAndroid, Platform } from 'react-native';
import React, { useState } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useFocusEffect } from '@react-navigation/native';
import Geolocation from 'react-native-geolocation-service';
import axios from 'axios';
import { API_URL } from '@env';


const FieldMeetingScreen = ({ navigation }) => {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [navigating, setNavigating] = useState(false);


  // Fetch meetings from the server
  const fetchMeetings = async () => {
    setLoading(true); // Start loading
    try {
      console.log(`${API_URL}/field-meeting/get-all`, 'see')
      const response = await axios.get(`${API_URL}/field-meeting/get-all`);
      const meetings = response.data.data; // Assuming response.data.data is an array


      setMeetings(meetings);
    } catch (error) {
      console.error('Error fetching meetings:', error);
      Alert.alert('Error', 'Unable to fetch meetings. Please try again.');
    } finally {
      setLoading(false); // Stop loading
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchMeetings();
      setNavigating(false);
    }, [])
  );


  const checkLocationPermissionAndNavigate = async () => {
    setLoading(true);


    try {
      // Request location permission for Android
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: "Location Permission",
          message: "This app needs access to your location to schedule field meetings.",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK",
        }
      );


      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        // Permission granted
        Geolocation.getCurrentPosition(
          (position) => {
            setNavigating(true);
            navigation.navigate('AddDayPlan', { location: position.coords });
            setLoading(false);
          },
          (error) => {
            // console.error("Error getting location:", error);
            Alert.alert('GPS is off', 'Please turn on your GPS to proceed.');
            setLoading(false);
          },
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
      } else {
        // Permission denied
        Alert.alert(
          'Permission Denied',
          'Location permission is required to add meeting.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Go to Settings', onPress: () => Linking.openSettings() },
          ]
        );
        setLoading(false);
      }
    } catch (error) {
      console.warn("Error with permissions:", error);
      setLoading(false);
    }
  };


  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.heading}><Text style={styles.title}>Total Meetings</Text></View>
      <Text style={styles.subtitle}>Your field meetings scheduled for today:</Text>
    </View>
  );


  const renderMeetingItem = ({ item }) => (
    <TouchableOpacity
      style={styles.meetingItem}
      onPress={() => navigation.navigate('PlanDetail', { meeting: item })}
    >
      <View style={styles.meetingDetails}>
        <Text style={styles.meetingTitle}>{item.companyName}</Text>
        <Text style={styles.meetingClient}>{` - ${item.clientName}`}</Text>
      </View>
      <Text style={styles.meetingTime}>{new Date(item.meetingTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
    </TouchableOpacity>
  );


  if (loading || navigating) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }


  return (
    <View style={styles.container}>
      <FlatList
        data={meetings}
        keyExtractor={(item) => item.id.toString()} // Ensure key is a string
        renderItem={renderMeetingItem}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={<Text style={styles.noMeetingsText}>No meetings scheduled</Text>}
        contentContainerStyle={styles.listContainer}
      />


      {/* Fixed Add Meeting Button */}
      <TouchableOpacity style={styles.addButton} onPress={checkLocationPermissionAndNavigate}>
        <Icon name="add" size={30} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
 
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    // marginBottom: 20,
    margin:10,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  meetingItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginVertical: 8,
    width: '90%',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  meetingDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  meetingTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textTransform: 'capitalize'
  },
  meetingClient: {
    fontSize: 16,
    color: '#555',
    textTransform: 'capitalize'
  },
  meetingTime: {
    fontSize: 14,
    color: '#777',
    marginTop: 5,
  },
  noMeetingsText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
  listContainer: {
    paddingBottom: 80,
  },
  addButton: {
    position: 'absolute',
    right: 20,
    bottom: 80,
    backgroundColor: '#007bff',
    borderRadius: 50,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    // marginBottom: 20,
    padding:'10',
    color: '#fff',
  },
  heading:{
    backgroundColor:'#0997a5',
   
  }
});


export default FieldMeetingScreen;



