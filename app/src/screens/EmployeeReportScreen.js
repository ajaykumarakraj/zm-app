import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { Calendar } from 'react-native-calendars';

const EmployeeReportScreen = () => {
    const [showCalendar, setShowCalendar] = useState(false);
    const [loading, setLoading] = useState(false);
    const [range, setRange] = useState({ startDate: '', endDate: '' });
    const [customMeetings, setCustomMeetings] = useState(0);
    const [weeklyReport, setWeeklyReport] = useState([]);
    const [monthlyReport, setMonthlyReport] = useState(0);

    const apiurl = 'http://192.168.1.5:3000';

    useEffect(() => {
        const fetchEmployeeReport = async () => {
            try {
                const response = await axios.get(`${apiurl}/employee/getEmployeeReport`);
                console.log('API Response:', response.data); // Log the full response

                const data = response.data.employee;
                console.log('Employee Data:', data); // Log the employee data

                if (data) {
                    setWeeklyReport(data?.weeklyReport || []);
                    setMonthlyReport(data?.monthlyReport || 0);
                }
            } catch (error) {
                console.error('Error fetching employee report:', error);
            }
        };

        fetchEmployeeReport();
    }, []);

    const fetchCustomSales = async (start, end) => {
        setLoading(true);
        setCustomMeetings(0); // Reset meetings for new request
        try {
            const CustomEmployeeReport = await axios.get(`${apiurl}/employee/getCustomDateEmployeeReport?start=${start}&end=${end}`);
            const TotalMeetings = CustomEmployeeReport.data.data;

            setCustomMeetings(TotalMeetings || 0);
        } catch (error) {
            console.error('Error fetching custom meetings:', error);
            setCustomMeetings(0);
        } finally {
            setLoading(false);
        }
    };

    const handleDayPress = (day) => {
        const { dateString } = day;
        if (!range.startDate || (range.startDate && range.endDate)) {
            setRange({ startDate: dateString, endDate: '' });
        } else {
            setRange((prev) => {
                const newRange = { ...prev, endDate: dateString };
                fetchCustomSales(prev.startDate, dateString); // Use prev.startDate for correct value
                return newRange;
            });
            setShowCalendar(false); // Close calendar
        }
    };

    // The FlatList now handles the entire scrollable area.
    return (
        <FlatList
            data={[{ key: 'header' }, { key: 'weeklyReport' }, { key: 'monthlyReport' }, { key: 'customRange' }, { key: 'calendar' }]}
            keyExtractor={(item) => item.key}
            renderItem={({ item }) => {
                switch (item.key) {
                    case 'header':
                        return (
                            <View style={styles.container}>
                                <Text style={styles.header}>Employee Meetings Reports</Text>
                            </View>
                        );
                    case 'weeklyReport':
                        return (
                            <View style={styles.column}>
                                <Text style={styles.columnHeader}>Weekly Report</Text>
                                {weeklyReport.length === 0 ? (
                                    <Text style={styles.rowText}>No weekly data available.</Text>
                                ) : (
                                    <FlatList
                                        data={weeklyReport}
                                        keyExtractor={(item, index) => item.id?.toString() || index.toString()}
                                        renderItem={({ item }) => (
                                            <View style={styles.row}>
                                                <Text style={styles.rowText}>{item.day || 'N/A'}</Text>
                                                <Text style={styles.rowText}>{item.meetings || 0}</Text>
                                            </View>
                                        )}
                                    />
                                )}
                            </View>
                        );
                    case 'monthlyReport':
                        return (
                            <View style={styles.column}>
                                <Text style={styles.columnHeader}>Monthly Report</Text>
                                <Text style={styles.monthlySales}>{monthlyReport} Meetings</Text>
                            </View>
                        );
                    case 'customRange':
                        return (
                            <TouchableOpacity
                                style={styles.customRangeButton}
                                onPress={() => setShowCalendar(!showCalendar)}
                            >
                                <Text style={styles.buttonText}>Select Custom Date Range</Text>
                            </TouchableOpacity>
                        );
                    case 'calendar':
                        return (
                            showCalendar && (
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
                            )
                        );
                    default:
                        return null;
                }
            }}
            ListFooterComponent={() => (
                <>
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
                                Custom Range Meetings: {customMeetings} Meetings
                            </Text>
                        )
                    )}
                </>
            )}
        />
    );
};

export default EmployeeReportScreen;

const getDatesBetween = (startDate, endDate) => {
    if (!startDate || !endDate) return []; // Handle invalid inputs
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
