import React, { useEffect } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, Platform, PermissionsAndroid } from 'react-native';


const HomeScreen = ({ navigation }) => {


  // Request location permission on component mount
  useEffect(() => {
    const requestLocationPermission = async () => {
      if (Platform.OS === 'android') {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: "Location Permission",
              message: "This app needs access to your location.",
              buttonNeutral: "Ask Me Later",
              buttonNegative: "Cancel",
              buttonPositive: "OK"
            }
          );


          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log("Location permission granted");
          } else {
            console.log("Location permission denied");
          }
        } catch (err) {
          console.warn(err);
        }
      }
    };


    requestLocationPermission();
  }, []);


  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Heading */}
        <View style={styles.heading}>
          <Text style={styles.title}>Dashboard</Text>
        </View>


        {/* Card Container with 3 Columns */}
        {/* <View ><Text style={styles.headtext}>Menu Bar</Text></View> */}
        <View style={styles.cardContainer}>
          <TouchableOpacity  onPress={() => navigation.navigate('DayPlans')} style={styles.cardWrapper}>
          <View style={styles.card}>
              <Image source={require('../../assets/calendar.png')} style={styles.image} />
            </View>
            <Text style={styles.cardText}>Day Plan</Text>
          </TouchableOpacity>
         
          {/* Field Meetings */}
          <TouchableOpacity onPress={() => navigation.navigate('FieldMeetings')} style={styles.cardWrapper}>
            <View style={styles.card}>
              <Image source={require('../../assets/briefing.png')} style={styles.image} />
            </View>
            <Text style={styles.cardText}>Meetings</Text>
          </TouchableOpacity>


          {/* Hot PG */}
          <TouchableOpacity onPress={() => navigation.navigate('HotPG')} style={styles.cardWrapper}>
            <View style={styles.card}>
              <Image source={require('../../assets/user-engagement.png')} style={styles.image} />
            </View>
            <Text style={styles.cardText}>Hot PG</Text>
          </TouchableOpacity>


          {/* KRA */}
          <TouchableOpacity onPress={() => navigation.navigate('KRA')} style={styles.cardWrapper}>
            <View style={styles.card}>
              <Image source={require('../../assets/responsibility.png')} style={styles.image} />
            </View>
            <Text style={styles.cardText}>KRA</Text>
          </TouchableOpacity>


          {/* Salary Slip */}
          <TouchableOpacity onPress={() => navigation.navigate('SalarySlip')} style={styles.cardWrapper}>
            <View style={styles.card}>
              <Image source={require('../../assets/salary-voucher.png')} style={styles.image} />
            </View>
            <Text style={styles.cardText}>Salary Slip</Text>
          </TouchableOpacity>


          {/* Employee Report */}
          <TouchableOpacity onPress={() => navigation.navigate('EmployeeReport')} style={styles.cardWrapper}>
            <View style={styles.card}>
              <Image source={require('../../assets/seo-report.png')} style={styles.image} />
            </View>
            <Text style={styles.cardText}>Employee Report</Text>
          </TouchableOpacity>


          {/* Sales Report */}
          <TouchableOpacity style={styles.cardWrapper} onPress={() => navigation.navigate('SalesReport')}>
            <View style={styles.card}>
              <Image source={require('../../assets/market-analysis.png')} style={styles.image} />
            </View>
            <Text style={styles.cardText}>Sales Report</Text>
          </TouchableOpacity>
       
        </View>
      </ScrollView>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f1f1',
  },
  scrollContainer: {
    padding: 0,
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#fff',
   padding:10
  },
  heading: {
    backgroundColor: '#0997a5',
    // paddingVertical: 10,
    // alignItems: 'center',
  },
  cardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 20,
  },
  cardWrapper: {
    width: '30%', // 3 columns per row
    marginBottom: 20,
    alignItems: 'center', // Center content in each card
  },
  card: {
    paddingVertical: 18,
    paddingHorizontal: 0,
    borderRadius: 10,
    marginVertical: 10,
    width: '100%',
    backgroundColor: '#fff',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    alignItems: 'center',
   
  },
  cardText: {
    color: '#000',
    fontSize: 12,
    textAlign: 'center',
    fontWeight:"900"
  },
  image: {
height:50,
    // height: 80, // Image size
    // width: "100", // Image size
    resizeMode: 'contain',
    marginBottom: 10, // Space between image and text
  },
  headtext:{
    fontWeight:"600",
    textAlign:"center",
    fontSize:20,
    paddingTop:15
  }
});


export default HomeScreen;



