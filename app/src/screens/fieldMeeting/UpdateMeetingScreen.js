import React, { useState } from 'react';
import { useRoute } from '@react-navigation/native';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Alert, Image, ActivityIndicator } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import DropDownPicker from 'react-native-dropdown-picker';
import { launchImageLibrary } from 'react-native-image-picker';
import axios from 'axios';

const UpdateScreen = ({ navigation }) => {
  const apiurl = 'http://192.168.1.5:3000'
  const route = useRoute();
  const { meetingId } = route.params;

  const [companyName, setCompanyName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [industry, setIndustry] = useState('');
  const [clientType, setClientType] = useState('');
  const [meetingDescription, setMeetingDescription] = useState('');
  const [meetingType, setMeetingType] = useState('');
  const [product, setProduct] = useState('');
  const [amount, setAmount] = useState('');
  const [image, setImage] = useState(null);
  const [nextFollowUpDate, setNextFollowUpDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const [hasNextFollowUp, setHasNextFollowUp] = useState(false);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [clientTypeOpen, setClientTypeOpen] = useState(false);
  const [meetingTypeOpen, setMeetingTypeOpen] = useState(false);

  const clientTypeOptions = [
    { label: 'Manufacturer', value: 'manufacturer' },
    { label: 'Wholeseller', value: 'wholeseller' },
    { label: 'Retailer', value: 'retailer' },
    { label: 'Supplier', value: 'supplier' },
    { label: 'Services Provider', value: 'services_provider' },
  ];

  const meetingTypeOptions = [
    { label: 'Fresh', value: 'fresh' },
    { label: 'Follow-Up', value: 'follow_up' },
  ];

  const validateForm = () => {
    if (!companyName || !contactNumber || !industry || !clientType || !clientType || !meetingDescription || !product || !meetingType || !amount || !image) {
      Alert.alert('Validation Error', 'Please fill in all fields and allow location access.');
      return false;
    }

    if (contactNumber.length !== 10) {
      Alert.alert('Invalid Mobile Number', 'Please enter a valid 10-digit mobile number.');
      return false;
    }
    return true;
  }

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    const formData = new FormData();

    formData.append('meetingId', meetingId);
    formData.append('companyName', companyName);
    formData.append('contactNumber', contactNumber);
    formData.append('industry', industry);
    formData.append('clientType', clientType);
    formData.append('meetingDescription', meetingDescription);
    formData.append('meetingType', meetingType);
    formData.append('product', product);
    formData.append('amount', amount);
    formData.append('nextFollowUpDate', hasNextFollowUp ? nextFollowUpDate.toISOString() : null);

    if (image) {
      formData.append('image', {
        uri: image,
        name: `image_${Date.now()}.jpg`, // A unique file name
        type: 'image/jpeg', // You may need to adjust this based on the file type
      });
    }

    try {
      const response = await axios.post(`${apiurl}/field-meeting/update`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setLoading(false);
      Alert.alert('Meeting Updated', response.data.message);
      // Uncomment to navigate after submission
      navigation.navigate('FieldMeetings');
    } catch (error) {
      setLoading(false);
      console.error('Error adding meeting:', error);
      Alert.alert('Error', 'There was a problem adding the meeting.');
    }
  };

  const chooseImage = () => {
    launchImageLibrary({ mediaType: 'photo' }, response => {
      if (response.assets && response.assets.length > 0) {
        setImage(response.assets[0].uri);
      }
    });
  };

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    setNextFollowUpDate(selectedDate || nextFollowUpDate);
  };

  const showDatepicker = () => {
    setShowDatePicker(true);
  };


  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const validDate = nextFollowUpDate || new Date();


  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#007bff" />
        </View>
      ) : (
        <FlatList
          data={[{ key: 'form' }]}  // Only one item, as we are rendering the form
          keyExtractor={(item) => item.key}
          renderItem={() => (
            <View style={styles.scrollContainer}>
              <Text style={styles.title}>Update Meeting Information</Text>

              <TextInput
                style={styles.input}
                placeholder="Company Name"
                placeholderTextColor="#999"
                value={companyName}
                onChangeText={setCompanyName}
              />

              <TextInput
                style={styles.input}
                placeholder="Contact Number"
                placeholderTextColor="#999"
                value={contactNumber}
                keyboardType="numeric"
                onChangeText={setContactNumber}
              />

              <DropDownPicker
                open={clientTypeOpen}
                value={clientType}
                items={clientTypeOptions}
                setOpen={setClientTypeOpen}
                setValue={setClientType}
                placeholder="Select Client Type"
                containerStyle={styles.pickerContainer}
                style={styles.picker}
                dropDownStyle={styles.dropDownStyle}
              />


              <TextInput
                style={styles.input}
                placeholder="Industry"
                placeholderTextColor="#999"
                value={industry}
                onChangeText={setIndustry}
              />


              <TextInput
                style={styles.input}
                placeholder="Product"
                placeholderTextColor="#999"
                value={product}
                onChangeText={setProduct}
              />

              <TextInput
                style={styles.input}
                placeholder="Amount"
                placeholderTextColor="#999"
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
              />

              <DropDownPicker
                open={meetingTypeOpen}
                value={meetingType}
                items={meetingTypeOptions}
                setOpen={setMeetingTypeOpen}
                setValue={setMeetingType}
                placeholder="Select Meeting Type"
                containerStyle={styles.pickerContainer}
                style={styles.picker}
                dropDownStyle={styles.dropDownStyle}
              />

              <TextInput
                style={[styles.input, styles.descriptionInput]}
                placeholder="Meeting Description (min 200 words)"
                placeholderTextColor="#999"
                multiline
                value={meetingDescription}
                onChangeText={setMeetingDescription}
              />

              <Text style={styles.label}>Image (Select Sign Board, Visiting Card, Selfie)</Text>
              <TouchableOpacity onPress={chooseImage} style={styles.imagePicker}>
                <Text style={styles.imagePickerText}>Choose Image</Text>
              </TouchableOpacity>

              {image && <Image source={{ uri: image }} style={styles.imagePreview} />}


              {!hasNextFollowUp &&
                <>
                  <Text style={styles.label}>Do you have a Next Follow Up Date?</Text>
                  <DropDownPicker
                    open={dropdownOpen}
                    value={hasNextFollowUp}  // Use boolean value (true/false)
                    items={[
                      { label: 'Yes', value: true },
                      { label: 'No', value: false },
                    ]}
                    setOpen={setDropdownOpen}
                    setValue={(value) => {
                      setHasNextFollowUp(value); 
                      if (value === false) {
                        setNextFollowUpDate(null); 
                      }
                    }}
                    containerStyle={styles.pickerContainer}
                    style={styles.picker}
                    dropDownStyle={styles.dropDownStyle}
                  />


                </>
              }

              {hasNextFollowUp && (
                <>
                  <Text style={styles.label}>Next Follow Up Date</Text>
                  <TouchableOpacity onPress={showDatepicker} style={styles.datePickerButton}>
                    <Text style={styles.datePickerText}>
                      {nextFollowUpDate ? nextFollowUpDate.toDateString() : 'Select Date'}
                    </Text>
                  </TouchableOpacity>

                  {showDatePicker && (
                    <DateTimePicker
                      value={validDate}
                      mode="date"
                      display="default"
                      onChange={onDateChange}
                      minimumDate={today}
                    />
                  )}
                </>
              )}

              <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                <Text style={styles.submitButtonText}>Update</Text>
              </TouchableOpacity>
            </View>
          )}
          keyboardShouldPersistTaps="handled" // Allow taps on the keyboard to persist
          scrollEnabled={true} // Allow scrolling in case of overlapping
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  loaderContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  scrollContainer: { padding: 20, paddingBottom: 80 },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 50,
    backgroundColor: '#fff',
    borderColor: '#ddd',
    borderWidth: 1,
    paddingHorizontal: 15,
    marginVertical: 10,
    borderRadius: 8,
    fontSize: 16,
  },
  label: {
    fontSize: 18,
    marginBottom: 5,
    fontWeight: '600',
    color: '#444',
  },
  descriptionInput: {
    height: 120,
    textAlignVertical: 'top',
  },
  imagePicker: {
    backgroundColor: '#f1f1f1',
    paddingVertical: 14,
    borderRadius: 8,
    marginBottom: 15,
    alignItems: 'center',
    borderColor: '#ddd',
    borderWidth: 1,
  },
  imagePickerText: {
    fontSize: 16,
    color: '#0066cc',
  },
  imagePreview: {
    width: 150,
    height: 150,
    marginTop: 10,
    alignSelf: 'center',
    borderRadius: 10,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  datePickerButton: {
    backgroundColor: '#f1f1f1',
    paddingVertical: 14,
    borderRadius: 8,
    marginBottom: 15,
    alignItems: 'center',
    borderColor: '#ddd',
    borderWidth: 1,
  },
  datePickerText: {
    fontSize: 16,
    color: '#0066cc',
  },
  submitButton: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  dropDownStyle: {
    backgroundColor: '#f1f1f1',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    zIndex: 9999,
    maxHeight: 600,
  },
  pickerContainer: {
    marginBottom: 15,
  },
  picker: {
    marginVertical: 10
  }
});

export default UpdateScreen;
