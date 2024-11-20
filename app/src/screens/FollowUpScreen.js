import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import React from 'react';


const FollowUpScreen = ({ navigation }) => {
  // Sample data for follow-ups; replace with your actual data source
  const followUps = [
    { id: '1', title: 'Follow up with client A' },
    { id: '2', title: 'Check in on project B' },
    { id: '3', title: 'Send proposal to client C' },
    { id: '4', title: 'Review notes from last meeting' },
    { id: '5', title: 'Schedule a call with client D' },
  ];


  const renderFollowUpItem = ({ item }) => (
    <TouchableOpacity
      style={styles.followUpItem}
      onPress={() => { /* Handle item click */ }}
    >
      <Text style={styles.followUpText}>{item.title}</Text>
    </TouchableOpacity>
  );


  return (
    <View style={styles.container}>
      <View style={styles.heading}><Text style={styles.title}>My Follow Ups</Text></View>
      <FlatList
        data={followUps}
        renderItem={renderFollowUpItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa', // Light background
    // padding: 20,
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#fff',
   padding:10
  },
  listContainer: {
    // paddingBottom: 20, // Padding for the last item
    padding:20
  },


  followUpText: {
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
  heading:{
    backgroundColor:'#0997a5',
  }
});


export default FollowUpScreen;



