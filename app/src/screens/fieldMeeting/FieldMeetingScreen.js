import { Linking, StyleSheet, Text, View, TouchableOpacity, FlatList, Alert, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import { API_URL } from '@env';
import Geolocation from 'react-native-geolocation-service';
import { PermissionsAndroid, Platform } from 'react-native';


const FieldMeetingScreen = ({ navigation }) => {
  const apiurl = 'http://192.168.1.13:3000'

  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingIds, setLoadingIds] = useState({ checkIn: null, checkOut: null });


  useEffect(() => {
    const requestLocationPermission = async () => {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Location permission granted');
        } else {
          // Permission denied
          Alert.alert(
            'Permission Denied',
            'Location permission is required to check meetings',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Go to Settings', onPress: () => Linking.openSettings() },
            ]
          );
        }
      }
    };

    requestLocationPermission();
  }, []);


  const fetchMeetings = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${apiurl}/field-meeting/get-all`);
      const meetings = response.data.data;
      setMeetings(meetings);
    } catch (error) {
      console.error('Error fetching meetings:', error);
      Alert.alert('Error', 'Unable to fetch meetings. Please try again.');
    } finally {
      setLoading(false);
    }
  };


  useFocusEffect(
    React.useCallback(() => {
      fetchMeetings();
    }, [loadingIds])
  );


  const getUserLocation = (dayPlanId, checkInOut) => {
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        (position) => {
          const location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          resolve(location);
        },
        (error) => {
          Alert.alert(
            'Location Needed',
            'To check-in, you need to enable location services.',
            [
              {
                text: 'Cancel',
                onPress: () => reject('Location services are disabled'),
                style: 'cancel',
              },
              {
                text: 'Turn On',
                onPress: () => {
                  if (checkInOut === 'checkIn') {
                    handleCheckIn(dayPlanId);
                  } else {
                    handleCheckOut(dayPlanId);
                  }
                  resolve(false);
                },
              },
            ]
          );
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    });
  };
  // Example usage inside the check-in function
  const handleCheckIn = async (dayPlanId) => {
    setLoadingIds(prev => ({ ...prev, checkIn: dayPlanId }));


    try {
      const userLocation = await getUserLocation(dayPlanId, 'checkIn'); // Wait for the location

      if (userLocation) {
        const response = await axios.post(`${apiurl}/field-meeting/check-in`, {
          day_plan_id: dayPlanId,
          location: userLocation,
        });

        fetchMeetings(); // Refresh meetings after check-in
      }
      // Proceed with check-in if location is available
    } catch (error) {
      // console.error('Unexpected error during check-in:', error);
    } finally {
      setLoadingIds(prev => ({ ...prev, checkIn: null }));
    }
  };


  const handleCheckOut = async (dayPlanId) => {
    setLoadingIds(prev => ({ ...prev, checkOut: dayPlanId }));


    try {
      // Step 1: Check the check-in status via the API
      const checkResponse = await axios.get(`${apiurl}/field-meeting/check-in-status/${dayPlanId}`);


      if (checkResponse.data.isCheckedIn) {
        // If check-in status is valid, proceed to get the location


        // Step 2: Get the user's current location
        const userLocation = await getUserLocation(dayPlanId, 'checkOut'); // Wait for the location


        if (userLocation) {
          // Proceed with checkout if location is available
          const response = await axios.post(`${apiurl}/field-meeting/check-out`, {
            day_plan_id: dayPlanId,
            location: userLocation,
          });

          fetchMeetings(); // Refresh meetings after check-out
        }
        // No need for an alert here, it's handled in getUserLocation
      } else {
        Alert.alert('Error', 'You need to check in before checking out.');
      }
    } catch (error) {
      console.error('Error during checkout:', error);
    } finally {
      setLoadingIds(prev => ({ ...prev, checkOut: null }));
    }
  };

  const renderMeetingItem = ({ item }) => (
    <View style={styles.meetingItem}>
      <View style={styles.meetingDetails}>
        <Text style={styles.meetingTitle}>{item.companyName}</Text>
        <Text style={styles.meetingClient}>{` - ${item.clientName}`}</Text>
      </View>
      <Text style={styles.meetingTime}>
        {new Date(item.meetingTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, item["checkInOutLogs.check_in_time"] ? styles.checkedInButton : null]}
          onPress={() => handleCheckIn(item.id)}
          disabled={!!item["checkInOutLogs.check_in_time"] || loadingIds.checkIn === item.id}
        >
          <LinearGradient
            colors={!!item.checkInOutLogs?.check_in_time ? ['#8A8A8A', '#8A8A8A'] : ['#4c669f', '#3b5998']}
            style={styles.gradientButton}
          >
            {loadingIds.checkIn === item.id ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <Icon name="log-in-outline" size={20} color="#fff" />
                <Text style={styles.buttonText}>{item["checkInOutLogs.check_in_time"] ? 'Checked In' : 'Check In'}</Text>
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>


        <TouchableOpacity
          style={[styles.button, item["checkInOutLogs.check_out_time"] ? styles.checkedOutButton : null]}
          onPress={() => handleCheckOut(item.id)}
          disabled={!!item["checkInOutLogs.check_out_time"] || loadingIds.checkOut === item.id}
        >
          <LinearGradient
            colors={!!item["checkInOutLogs.check_out_time"] ? ['#8A8A8A', '#8A8A8A'] : ['#ff6347', '#ff4500']}
            style={styles.gradientButton}
          >
            {loadingIds.checkOut === item.id ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <Icon name="log-out-outline" size={20} color="#fff" />
                <Text style={styles.buttonText}>{item["checkInOutLogs.check_out_time"] ? 'Checked Out' : 'Check Out'}</Text>
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>


        <TouchableOpacity
          style={[styles.button, item["meetingDetails.createdAt"] ? styles.updatedButton : null]}
          onPress={() => navigation.navigate('UpdateMeeting', { meetingId: item.id })}
          disabled={item["meetingDetails.createdAt"] ? true : false}
        >
          <LinearGradient
            colors={!!item["meetingDetails.createdAt"] ? ['#4CAF50', '#388E3C'] : ['#ff6347', '#ff4500']}
            style={styles.gradientButton}
          >
            <>
              <Icon name="create-outline" size={20} color="#fff" />
              <Text style={styles.buttonText}>{item["meetingDetails.createdAt"] ? 'Updated' : 'Update'}</Text>
            </>
          </LinearGradient>
        </TouchableOpacity>


      </View>
    </View>
  );


  return (
    loading ? (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    ) : (
      <LinearGradient colors={['#e0eafc', '#cfdef3']} style={styles.container}>
        <FlatList
          data={meetings}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderMeetingItem}
          ListHeaderComponent={() => (
            <View style={styles.headerContainer}>
              <Text style={styles.title}>Today's Meetings</Text>
            </View>
          )}
          ListEmptyComponent={<Text style={styles.noMeetingsText}>No meetings scheduled</Text>}
          contentContainerStyle={styles.listContainer}
        />
      </LinearGradient>
    )
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#3b5998',
    textAlign: 'center',
    textShadowColor: '#d1d1d1',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  meetingItem: {
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 7,
  },
  meetingDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  meetingTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  meetingClient: {
    fontSize: 14,
    color: '#6c757d',
    marginLeft: 4,
  },
  meetingTime: {
    fontSize: 14,
    color: '#495057',
    marginBottom: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  gradientButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 20,
    maxWidth: 90,
    minWidth: 80,
    height: 40,
    marginHorizontal: 4,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 10,
    textAlign: 'center',
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkedInButton: {
    opacity: 0.6,
  },
  checkedOutButton: {
    opacity: 0.6,
  },
  updatedButton: {
    opacity: 0.6
  }

});


export default FieldMeetingScreen;