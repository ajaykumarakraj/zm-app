import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, ActivityIndicator, ScrollView } from 'react-native';
import { Calendar } from 'react-native-calendars';

const SalesReportScreen = () => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [loading, setLoading] = useState(false);
  const [range, setRange] = useState({ startDate: '', endDate: '' });
  const [customSales, setCustomSales] = useState(0);

  const weeklySalesData = [
    { id: '1', day: 'Monday', sales: 12000 },
    { id: '2', day: 'Tuesday', sales: 15000 },
    { id: '3', day: 'Wednesday', sales: 18000 },
    { id: '4', day: 'Thursday', sales: 14000 },
    { id: '5', day: 'Friday', sales: 20000 },
    { id: '6', day: 'Saturday', sales: 25000 },
    { id: '7', day: 'Sunday', sales: 30000 },
  ];

  const monthlySales = 540000; // Example monthly sales data

  const fetchCustomSales = async (start, end) => {
    setLoading(true);
    setCustomSales(0); // Reset sales for new request
    try {
      // Replace with your actual API URL and parameters
      const response = await fetch(
        `https://example.com/sales?start=${start}&end=${end}`
      );
      const data = await response.json();

      // Assuming API returns `totalSales` in the response
      setCustomSales(data.totalSales || 0);
    } catch (error) {
      console.error('Error fetching custom sales:', error);
      setCustomSales(0);
    } finally {
      setLoading(false);
    }
  };

  const handleDayPress = (day) => {
    const { dateString } = day;
    if (!range.startDate || (range.startDate && range.endDate)) {
      // Set start date or reset if range is completed
      setRange({ startDate: dateString, endDate: '' });
    } else {
      // Set end date and fetch data
      setRange((prev) => ({
        ...prev,
        endDate: dateString,
      }));

      fetchCustomSales(range.startDate, dateString);
      setShowCalendar(false); // Close calendar
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        {/* Header */}
        <Text style={styles.header}>Employee Sales Reports</Text>

        {/* Weekly Sales Report */}
        <View style={styles.column}>
          <Text style={styles.columnHeader}>Weekly Sales</Text>
          <FlatList
            data={weeklySalesData}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.row}>
                <Text style={styles.rowText}>{item.day}</Text>
                <Text style={styles.rowText}>₹{item.sales}</Text>
              </View>
            )}
          />
        </View>

        {/* Monthly Sales Report */}
        <View style={styles.column}>
          <Text style={styles.columnHeader}>Monthly Sales</Text>
          <Text style={styles.monthlySales}>₹{monthlySales}</Text>
        </View>

        {/* Custom Date Range Picker */}
        <TouchableOpacity
          style={styles.customRangeButton}
          onPress={() => setShowCalendar(!showCalendar)}
        >
          <Text style={styles.buttonText}>Select Custom Date Range</Text>
        </TouchableOpacity>

        {/* Calendar for Date Range Selection */}
        {showCalendar && (
          <Calendar
            onDayPress={handleDayPress}
            markingType={'period'}
            markedDates={{
              [range.startDate]: { startingDay: true, color: '#2196F3', textColor: 'white' },
              [range.endDate]: { endingDay: true, color: '#2196F3', textColor: 'white' },
              ...(range.startDate &&
                range.endDate &&
                getDatesBetween(range.startDate, range.endDate).reduce((acc, date) => {
                  acc[date] = { color: '#90CAF9', textColor: 'white' };
                  return acc;
                }, {})),
            }}
          />
        )}

        {/* Selected Date Range */}
        {range.startDate && range.endDate && (
          <Text style={styles.dateRange}>
            Selected Range: {range.startDate} - {range.endDate}
          </Text>
        )}

        {/* Display Loading or Sales Data */}
        {loading ? (
          <ActivityIndicator size="large" color="#2196F3" style={{ marginTop: 20 }} />
        ) : (
          range.startDate &&
          range.endDate && (
            <Text style={styles.customSales}>
              Custom Range Sales: ₹{customSales}
            </Text>
          )
        )}
      </View>
    </ScrollView>
  );
};

export default SalesReportScreen;

// Utility function to get dates between two dates
const getDatesBetween = (startDate, endDate) => {
  const dates = [];
  let currentDate = new Date(startDate);
  const stopDate = new Date(endDate);

  while (currentDate <= stopDate) {
    dates.push(currentDate.toISOString().split('T')[0]);
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  column: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    elevation: 3,
  },
  columnHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  rowText: {
    fontSize: 16,
    color: '#555',
  },
  monthlySales: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4CAF50',
    textAlign: 'center',
    marginVertical: 20,
  },
  customRangeButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  dateRange: {
    marginTop: 20,
    fontSize: 16,
    textAlign: 'center',
    color: '#333',
  },
  customSales: {
    marginTop: 20,
    fontSize: 18,
    textAlign: 'center',
    color: '#4CAF50',
    fontWeight: 'bold',
  },
});
