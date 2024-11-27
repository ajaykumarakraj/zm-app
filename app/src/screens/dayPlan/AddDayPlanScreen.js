import { StyleSheet, Text, View, TouchableOpacity, ScrollView, TextInput, Alert, PermissionsAndroid, Platform, Linking, AppState } from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import LinearGradient from 'react-native-linear-gradient';
import Geolocation from 'react-native-geolocation-service';
import axios from 'axios';
import { API_URL } from '@env';


const AddFieldMeetingScreen = ({ navigation }) => {
  const apiurl = 'http://192.168.1.13:3000'

  const [companyName, setCompanyName] = useState('');
  const [clientName, setClientName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [meetingTime, setMeetingTime] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [address, setAddress] = useState('');
  const [location, setLocation] = useState(null);
  const [gpsEnabled, setGpsEnabled] = useState(false);
  const [isGpsAvailable, setIsGpsAvailable] = useState(true);
  const [isAddMeeting, setIsAddMeeting] = useState(true);


  // Validate form fields
  const validateForm = () => {
    if (!companyName || !clientName || !mobileNumber || !address || !location) {
      Alert.alert('Validation Error', 'Please fill in all fields and allow location access.');
      return false;
    }
    if (mobileNumber.length !== 10) {
      Alert.alert('Invalid Mobile Number', 'Please enter a valid 10-digit mobile number.');
      return false;
    }
    return true;
  };


  // Memoized AddMeetingButton Component
  const AddMeetingButton = React.memo(({ onPress }) => (
    <TouchableOpacity onPress={onPress} style={styles.actionButton}>
      <LinearGradient colors={['#6a11cb', '#2575fc']} style={styles.gradientBackground}>
        <Text style={styles.buttonText}>Add Meeting</Text>
        <Icon name="check-circle" size={24} color="#fff" />
      </LinearGradient>
    </TouchableOpacity>
  ));
  // Handle form submission
  const handleSubmit = async () => {
    if (!validateForm()) return;


    const meetingData = {
      companyName,
      clientName,
      mobileNumber,
      meetingTime: meetingTime.toISOString(),
      address,
      location,
    };

    try {
      const response = await axios.post(`${apiurl}/field-meeting/add`, meetingData, {
        headers: { 'Content-Type': 'application/json' },
      });
      Alert.alert('Meeting Added', response.data.message);
      navigation.navigate('DayPlans');
    } catch (error) {
      console.error('Error adding meeting:', error);
      Alert.alert('Error', 'There was a problem adding the meeting.');
    }

  };


  // Show time picker
  const showTimepicker = () => {
    setShowPicker(true);
  };


  // Handle time change
  const onTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || meetingTime;
    setShowPicker(false);
    setMeetingTime(currentTime);
  };


  // Request location permission
  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'This app needs access to your location to add a meeting location.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };


  // Get location from GPS
  const getLocation = async () => {
    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        setLocation({ latitude, longitude, accuracy });
        setIsAddMeeting(true)
        setGpsEnabled(false);
      },
      (error) => {
        console.log('Error getting location:', error);
        setIsAddMeeting(false)
        setGpsEnabled(true);
        navigation.navigate('DayPlans');
        Alert.alert(
          'GPS Issue',
          'Please enable GPS to stay on the page',
          [{ text: 'OK' }]
        );
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };


  const checkGpsStatus = async () => {
    const hasPermission = await requestLocationPermission();
    if (hasPermission) {
      const watchId = Geolocation.watchPosition(
        (position) => {
          const { latitude, longitude, accuracy } = position.coords;
          setLocation({ latitude, longitude, accuracy });
          setIsGpsAvailable(true);
        },
        (error) => {
          if (error.code === 1) {
            setIsGpsAvailable(false);
          } else {
            // console.error("Location error:", error);
          }
        },
        { enableHighAccuracy: true, distanceFilter: 0, interval: 10000 }
      );


      // Return cleanup function to clear the watchId
      return () => {
        if (watchId) {
          Geolocation.clearWatch(watchId);
        }
      };
    } else {
      setIsGpsAvailable(false);
      Alert.alert(
        'GPS Issue',
        'Please enable GPS to add a meeting location.',
        [{ text: 'OK' }]
      );
      // No cleanup function needed if no permission
      return null;
    }
  };


  useEffect(() => {
    const gpsCleanup = checkGpsStatus();
    return () => {
      if (typeof gpsCleanup === 'function') {
        gpsCleanup();
      }
    };
  }, []);


  useEffect(() => {
    if (!isGpsAvailable) {
      Alert.alert(
        'GPS Disabled',
        'Please enable GPS to stay on this page.',
        [{ text: 'OK', onPress: () => navigation.navigate('DayPlans') }]
      );
    }
  }, [isGpsAvailable]);


  useEffect(() => {
    const handleAppStateChange = (nextAppState) => {
      if (nextAppState === 'active') {
        checkGpsStatus();
      }
    };
    const subscription = AppState.addEventListener('change', handleAppStateChange);


    return () => subscription.remove();
  }, []);


  // UseEffect to request permission and get location
  useEffect(() => {
    const fetchLocation = async () => {
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) {
        Alert.alert(
          'Permission Denied',
          'Location permission is required to add meeting.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Go to Settings', onPress: () => Linking.openSettings() },
          ]
        );
        return;
      }
      getLocation();
    };


    if (!gpsEnabled) {
      const intervalId = setInterval(fetchLocation, 2000);
      return () => clearInterval(intervalId);
    }
  }, [gpsEnabled]);


  // Input sanitization for mobile number
  const handleMobileChange = (value) => {
    setMobileNumber(value.replace(/[^0-9]/g, '').slice(0, 10));
  };


  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Add Field Meeting</Text>


        <TextInput
          style={styles.input}
          placeholder="Company Name"
          placeholderTextColor="grey"
          value={companyName}
          onChangeText={setCompanyName}
        />
        <TextInput
          style={styles.input}
          placeholder="Client Name"
          placeholderTextColor="grey"
          value={clientName}
          onChangeText={setClientName}
        />
        <TextInput
          style={styles.input}
          placeholder="Mobile Number"
          placeholderTextColor="grey"
          value={mobileNumber}
          onChangeText={handleMobileChange}
          keyboardType="numeric"
        />


        <TouchableOpacity style={[styles.input, styles.timePicker]} onPress={showTimepicker}>
          <Text style={styles.timeText}>
            {meetingTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
          <Icon name="access-time" size={24} color="#666" style={styles.timeIcon} />
        </TouchableOpacity>


        <TextInput
          style={styles.input}
          placeholder="Address of Meeting"
          value={address}
          placeholderTextColor="grey"
          onChangeText={setAddress}
        />


        {isAddMeeting ? (
          <AddMeetingButton onPress={handleSubmit} />
        ) : (
          <Text style={styles.gpsErrorText}>Please enable GPS to add a meeting.</Text>
        )}


        {/* {location != null ? (
          <TouchableOpacity onPress={handleSubmit} style={styles.actionButton}>
            <LinearGradient colors={['#6a11cb', '#2575fc']} style={styles.gradientBackground}>
              <Text style={styles.buttonText}>Add Meeting</Text>
              <Icon name="check-circle" size={24} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>
        ) : (
          <Text style={styles.gpsErrorText}>Please enable GPS to add a meeting.</Text>
        )} */}


        {showPicker && (
          <DateTimePicker
            value={meetingTime}
            mode="time"
            is24Hour={true}
            display="default"
            onChange={onTimeChange}
          />
        )}
      </ScrollView>
    </View>
  );
};


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  scrollContainer: { padding: 20, paddingBottom: 80 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, color: '#333', textAlign: 'center' },
  input: {
    flex: 1,
    marginLeft: 10,
    color: '#000',
    paddingRight: 40,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    width: '100%',
    elevation: 2,
    shadowColor: '#ccc',
  },
  timePicker: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  timeText: { color: '#000' },
  gpsErrorText: { color: 'red', textAlign: 'center', marginTop: 10 },
  actionButton: { alignItems: 'center', marginTop: 20 },
  gradientBackground: { padding: 15, borderRadius: 10, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginRight: 10 },
});


export default AddFieldMeetingScreen;



