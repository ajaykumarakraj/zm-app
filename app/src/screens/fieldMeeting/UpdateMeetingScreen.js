import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Alert, Image } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import DropDownPicker from 'react-native-dropdown-picker';
import { launchImageLibrary } from 'react-native-image-picker';

const UpdateScreen = () => {
  const [companyName, setCompanyName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [industry, setIndustry] = useState('');
  const [clientType, setClientType] = useState('');
  const [meetingDescription, setMeetingDescription] = useState('');
  const [meetingType, setMeetingType] = useState('');
  const [product, setProduct] = useState('');
  const [amount, setAmount] = useState('');
  const [image, setImage] = useState(null);
  const [nextFollowUpDate, setNextFollowUpDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

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

  const handleSubmit = () => {
    if (
      companyName &&
      contactNumber &&
      industry &&
      clientType &&
      meetingDescription &&
      meetingType &&
      product &&
      amount &&
      image &&
      nextFollowUpDate
    ) {
      console.log('Form submitted with data:', {
        companyName,
        contactNumber,
        industry,
        clientType,
        meetingDescription,
        meetingType,
        product,
        amount,
        image,
        nextFollowUpDate,
      });
    } else {
      Alert.alert('Error', 'Please fill in all fields');
    }
  };

  const chooseImage = () => {
    launchImageLibrary({ mediaType: 'photo' }, response => {
      if (response.assets) {
        setImage(response.assets[0].uri);
      }
    });
  };

  const showDatepicker = () => {
    setShowDatePicker(true);
  };

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    setNextFollowUpDate(selectedDate || nextFollowUpDate);
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <View style={styles.container}>
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

            <Text style={styles.label}>Next Follow Up Date</Text>
            <TouchableOpacity onPress={showDatepicker} style={styles.datePickerButton}>
              <Text style={styles.datePickerText}>{nextFollowUpDate ? nextFollowUpDate.toDateString() : 'Select Date'}</Text>
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={nextFollowUpDate}
                mode="date"
                display="default"
                onChange={onDateChange}
                minimumDate={today}
              />
            )}

            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.submitButtonText}>Update</Text>
            </TouchableOpacity>
          </View>
        )}
        keyboardShouldPersistTaps="handled" // Allow taps on the keyboard to persist
        scrollEnabled={true} // Allow scrolling in case of overlapping
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
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
  picker:{
    marginVertical: 10
  }
});

export default UpdateScreen;
