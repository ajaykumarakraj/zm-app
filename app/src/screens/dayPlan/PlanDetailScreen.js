import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';


const PlanDetailScreen = ({ route }) => {
  const { meeting } = route.params; // Get the meeting details passed from FieldMeetingScreen


  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{meeting.companyName}</Text>
        <Text style={styles.clientName}>{meeting.clientName}</Text>
      </View>


      <View style={styles.detailsContainer}>
        <Text style={styles.detailsLabel}>Address</Text>
        <Text style={styles.details}>{meeting.address}</Text>


        <Text style={styles.detailsLabel}>Mobile</Text>
        <Text style={styles.details}>{meeting.mobileNumber}</Text>


        <Text style={styles.detailsLabel}>Meeting Time</Text>
        <Text style={styles.details}>{new Date(meeting.meetingTime).toLocaleString()}</Text>
      </View>
    </ScrollView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  header: {
    backgroundColor: '#ffffff',
    paddingVertical: 20,
    paddingHorizontal: 25,
    borderRadius: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3, // For Android shadow
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4A4A4A',
    textAlign: 'center',
  },
  clientName: {
    fontSize: 20,
    color: '#6B6B6B',
    marginTop: 5,
  },
  detailsContainer: {
    backgroundColor: '#ffffff',
    padding: 25,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  detailsLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#8A8A8A',
    marginTop: 15,
  },
  details: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
});


export default PlanDetailScreen;

