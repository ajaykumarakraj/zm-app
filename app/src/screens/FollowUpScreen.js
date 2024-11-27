import React, { useState, useEffect } from 'react';
import { StyleSheet, Modal, Linking, Text, View, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import moment from 'moment'; // For date manipulation
import axios from 'axios'; // For making API calls
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const FollowUpScreen = ({ navigation }) => {
  const [selectedDate, setSelectedDate] = useState(moment().format('YYYY-MM-DD'));
  const [followUps, setFollowUps] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const apiurl = 'http://192.168.1.13:3000';

  useEffect(() => {


    fetchFollowUps(selectedDate);
  }, [selectedDate]);



  const fetchFollowUps = async (date) => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${apiurl}/field-meeting/get-followups`, {
        params: { date },
      });
      setFollowUps(response.data.followUps || []);
    } catch (error) {
      console.error('Error fetching follow-ups:', error);
      Alert.alert('Error', 'Unable to fetch follow-ups. Please try again later.');
      setFollowUps([]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleModal = async (content) => {    
    setModalContent(content);
    setIsModalVisible(!isModalVisible);
  };

  const handleCall = (phoneNumber) => {
    const url = `tel:${phoneNumber}`;
    Linking.openURL(url).catch((err) => console.error('Failed to open dialer', err));
  };

  const getDates = () => {
    const today = moment().format('YYYY-MM-DD');
    const current = moment(selectedDate);

    return {
      previousDate: current.clone().subtract(1, 'days').format('YYYY-MM-DD'),
      currentDate: current.format('YYYY-MM-DD'),
      nextDate: current.clone().add(1, 'days').format('YYYY-MM-DD'),
    };
  };

  const { previousDate, currentDate, nextDate } = getDates();

  const renderDateTab = (date, isDisabled = false) => (
    <TouchableOpacity
      style={[
        styles.dateTab,
        selectedDate === date ? styles.dateTabSelected : null,
        isDisabled ? styles.dateTabDisabled : null,
      ]}
      onPress={() => !isDisabled && setSelectedDate(date)}
      disabled={isDisabled}
    >
      <Text
        style={[
          styles.dateText,
          selectedDate === date ? styles.dateTextSelected : null,
          isDisabled ? styles.dateTextDisabled : null,
        ]}
      >
        {moment(date).format('ddd, DD MMM')} {/* Updated date format */}
      </Text>
    </TouchableOpacity>
  );

  const renderFollowUpItem = ({ item }) => (
    <TouchableOpacity style={styles.followUpItem} onPress={() => toggleModal(`${item.meeting_description}`)}>
      <View style={styles.cardContent}>
        <Text style={styles.companyName}>{item.company_name}</Text>
        <View style={styles.contactContainer}>
          <TouchableOpacity style={styles.iconButton} onPress={() => handleCall(item.contact_number)}>
            <MaterialIcons name="phone" size={24} color="#0997a5" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleCall(item.contact_number)}>
            <Text style={styles.contactText}>{item.contact_number}</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.industryText}>{item.industry}</Text>
        <Text style={styles.productText}>{item.product}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isModalVisible}
      onRequestClose={() => setIsModalVisible(false)}
    >
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          {/* Cross Icon */}
          <TouchableOpacity
            style={styles.closeIcon}
            onPress={() => setIsModalVisible(false)}
          >
            <MaterialIcons name="close" size={24} color="#333" />
          </TouchableOpacity>

          {/* Title */}
          <Text style={styles.modalTitle}>Client Details</Text>

          {/* Content */}
          <Text style={styles.modalContent}>{modalContent}</Text>

          {/* Action Buttons */}
          <View style={styles.modalButtonContainer}>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                setIsModalVisible(false);
                navigation.navigate('AddDayPlan')
              }}
            >
              <Text style={styles.modalButtonText}>Add Day Plan</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                handleCall('1234567890'); // Use real number dynamically
              }}
            >
              <Text style={styles.modalButtonText}>Make Call</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );



  const handleConfirmDate = (date) => {
    setSelectedDate(moment(date).format('YYYY-MM-DD')); // Set the selected date
    setDatePickerVisibility(false); // Close the date picker
  };

  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);

  return (
    <View style={styles.container}>
      {/* "Choose Date" Icon */}
      <View style={styles.headerContainer}>
        {/* Back Button */}
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>

        {/* Title */}
        <Text style={styles.headerTitle}>Follow Up</Text>

        {/* Choose a Date */}
        <TouchableOpacity onPress={showDatePicker} style={styles.chooseDateButton}>
          <MaterialIcons name="date-range" size={28} color="#fff" />
          <Text style={styles.chooseDateText}>Choose a Date</Text>
        </TouchableOpacity>
      </View>

      {/* Date Navigation Section */}
      <View style={styles.dateNavigation}>
        {renderDateTab(previousDate, moment(previousDate).isBefore(moment().format('YYYY-MM-DD')))}
        {renderDateTab(currentDate)}
        {renderDateTab(nextDate)}
      </View>

      {/* Follow-up List or Loading Indicator */}
      {isLoading ? (
        <ActivityIndicator size="large" color="#0997a5" style={styles.loadingIndicator} />
      ) : (
        <FlatList
          data={followUps}
          renderItem={renderFollowUpItem}
          keyExtractor={(item, index) => item.id?.toString() || index.toString()} // Fallback to index
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={<Text style={styles.noFollowUpsText}>No follow-ups for this date.</Text>}
        />

      )}

      {/* Modal */}
      {renderModal()}


      {/* Date Picker Modal */}
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        minimumDate={new Date()} // Prevent selecting past dates
        onConfirm={handleConfirmDate}
        onCancel={hideDatePicker}
      />

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  chooseDateContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  followUpItem: {
    backgroundColor: '#fff',
    borderRadius: 15,  // Rounded corners for a modern look
    marginBottom: 15,
    padding: 15,
    elevation: 5,  // Shadow for depth
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  cardContent: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  companyName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  contactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  iconButton: {
    backgroundColor: '#e6f7f8',
    padding: 8,
    borderRadius: 50,
    marginRight: 10,
  },
  contactText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#0997a5',
  },
  industryText: {
    fontSize: 14,
    color: '#777',
    marginVertical: 4,
  },
  productText: {
    fontSize: 14,
    color: '#777',
    marginVertical: 4,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0997a5',
    paddingVertical: 10,
    paddingHorizontal: 15,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  chooseDateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 8,
    backgroundColor: '#0aa7b5',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
  },
  chooseDateText: {
    marginLeft: 5,
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  dateNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingVertical: 15,

    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  dateTab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  dateTabSelected: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'black',
  },
  dateTextSelected: {
    fontSize: 16,
    fontWeight: '600',
    // color: '#fff',
  },
  dateTabDisabled: {
    // backgroundColor: '#eaeaea',
  },
  dateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  dateTextDisabled: {
    color: '#aaa',
  },
  listContainer: {
    paddingHorizontal: 20,
    marginTop: 10,
  },
  followUpItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  closeIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 5,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    position: 'relative', // Needed for the close icon
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalContent: {
    fontSize: 16,
    color: '#555',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    backgroundColor: '#0997a5',
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 5,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  followUpText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  noFollowUpsText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#777',
    fontSize: 16,
  },
  loadingIndicator: {
    marginTop: 50,
  },
});

export default FollowUpScreen;
