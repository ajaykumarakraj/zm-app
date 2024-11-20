import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import React from 'react';


const AttendanceScreen = ({ navigation }) => {
  const attendanceRecords = [
    { id: '1', date: '2024-10-01', status: 'Present' },
    { id: '2', date: '2024-10-02', status: 'Absent' },
    { id: '3', date: '2024-10-03', status: 'Present' },
    { id: '4', date: '2024-10-04', status: 'Present' },
    { id: '5', date: '2024-10-05', status: 'Absent' },
  ];


  const renderAttendanceItem = ({ item }) => (
    <View style={styles.attendanceItem}>
      <Text style={styles.attendanceDate}>{item.date}</Text>
      <Text style={[styles.attendanceStatus, item.status === 'Present' ? styles.present : styles.absent]}>
        {item.status}
      </Text>
    </View>
  );


  return (
    <View style={styles.container}>
      <View style={styles.heading}><Text style={styles.title}>My Attendance</Text></View>
      <FlatList
        data={attendanceRecords}
        renderItem={renderAttendanceItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
      />


      <TouchableOpacity
        style={styles.markAttendanceButton}
        onPress={() => { /* Handle mark attendance */ }}
      >
        <Text style={styles.buttonText}>Mark Attendance</Text>
      </TouchableOpacity>
      {/* <Footer navigation={navigation} /> */}
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f3f5',
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    // marginBottom: 20,
    padding:'10',
    color: '#fff',
  },
  listContainer: {
    padding: 20,
    paddingBottom: 120, // Space for the button
  },
  attendanceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  attendanceDate: {
    // fontSize: 18,
    color: '#212529',
  },
  attendanceStatus: {
    fontSize: 18,
    fontWeight: '600',
  },
  present: {
    color: '#38c172',
  },
  absent: {
    color: '#e3342f',
  },
  markAttendanceButton: {
    position: 'absolute',
    bottom: 90,
    left: 20,
    right: 20,
    backgroundColor: '#0997a5',
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
  },
  heading:{
    backgroundColor:'#0997a5',
   
  }
});


export default AttendanceScreen;



