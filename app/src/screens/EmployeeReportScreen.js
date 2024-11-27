import React, { useState, useEffect } from 'react';
import { StyleSheet, Modal, Text, Linking, View, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { Calendar } from 'react-native-calendars';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const EmployeeReportScreen = () => {
    const [showCalendar, setShowCalendar] = useState(false);
    const [loading, setLoading] = useState(false);
    const [range, setRange] = useState({ startDate: '', endDate: '' });
    const [weeklyReport, setWeeklyReport] = useState([]);
    const [monthlyReport, setMonthlyReport] = useState(0);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalData, setModalData] = useState([]);
    const [isCustomModalVisible, setIsCustomModalVisible] = useState(false);
    const [customModalData, setCustomModalData] = useState([]);

    const apiurl = 'http://192.168.1.13:3000';

    useEffect(() => {
        const fetchEmployeeReport = async () => {
            try {
                const response = await axios.get(`${apiurl}/employee/getEmployeeReport`);
                const data = response.data.employee;
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
        try {
            const CustomEmployeeReport = await axios.get(`${apiurl}/employee/getCustomDateEmployeeReport?start=${start}&end=${end}`);
            const TotalMeetings = CustomEmployeeReport.data.data;

            setCustomModalData(TotalMeetings || []);
        } catch (error) {
            console.error('Error fetching custom meetings:', error);
            setCustomModalData([]);
        } finally {
            setLoading(false);
            setIsCustomModalVisible(true); // Show the modal after fetching
        }
    };

    const handleDayPress = (day) => {
        const { dateString } = day;
        if (!range.startDate || (range.startDate && range.endDate)) {
            setRange({ startDate: dateString, endDate: '' });
        } else {
            setRange((prev) => {
                const newRange = { ...prev, endDate: dateString };
                fetchCustomSales(prev.startDate, dateString);
                return newRange;
            });
            setShowCalendar(false); // Close calendar
        }
    };

    const handleCall = (phoneNumber) => {
        const url = `tel:${phoneNumber}`;
        Linking.openURL(url).catch((err) => console.error('Failed to open dialer', err));
    };

    const toggleModal = async (day) => {
        setLoading(true);
        try {
            const response = await axios.get(
                `${apiurl}/employee/getDayMeetingsDeatils/${day}`
            );
            const data = response.data.data;
            setModalData(data || []);
        } catch (error) {
            console.error('Error fetching day meetings details:', error);
            setModalData([]);
        } finally {
            setLoading(false);
            setIsModalVisible(!isModalVisible);
        }
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={[{ key: 'header' }, { key: 'weeklyReport' }, { key: 'monthlyReport' }, { key: 'customRange' }, { key: 'calendar' }]}
                keyExtractor={(item) => item.key}
                renderItem={({ item }) => {
                    switch (item.key) {
                        case 'header':
                            return (
                                <View>
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
                                                <TouchableOpacity onPress={() => toggleModal(item.day)}>
                                                    <View style={styles.row}>
                                                        <Text style={styles.rowText}>{item.day || 'N/A'}</Text>
                                                        <Text style={styles.rowText}>{item.meetings || 0}</Text>
                                                    </View>
                                                </TouchableOpacity>
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
            />



            {/* Modal */}
            <Modal
                visible={isModalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setIsModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        {/* Close Icon */}
                        <TouchableOpacity
                            style={styles.closeIcon}
                            onPress={() => setIsModalVisible(false)}
                        >
                            <MaterialIcons name="close" size={26} color="#333" />
                        </TouchableOpacity>

                        <Text style={styles.modalHeader}>Day Meetings Details</Text>
                        {loading ? (
                            <ActivityIndicator size="large" color="#2196F3" />
                        ) : modalData.length > 0 ? (
                            <FlatList
                                data={modalData}
                                keyExtractor={(item, index) => item.id.toString() || index.toString()}
                                renderItem={({ item, index }) => (
                                    <View style={[styles.row, styles.tableRow]}>
                                        <Text style={[styles.cell, styles.tableCell]}>{index + 1}</Text>
                                        <Text style={[styles.cell, styles.tableCell]}>{item.companyName}</Text>
                                        <Text style={[styles.cell, styles.tableCell]}>
                                            {item["meetingDetails.meeting_description"]}
                                        </Text>
                                        <Text style={[styles.headerCell, styles.tableCell, styles.centerbtn]}>
                                            <TouchableOpacity onPress={() => handleCall(item.contact_number)}>
                                                <MaterialIcons name="phone" size={20} color="#0997a5" />
                                            </TouchableOpacity>
                                        </Text>
                                    </View>
                                )}
                                ListHeaderComponent={() => (
                                    <View style={[styles.row, styles.headerRow]}>
                                        <Text style={[styles.headerCell, styles.tableCell]}>S. No.</Text>
                                        <Text style={[styles.headerCell, styles.tableCell]}>Company Name</Text>
                                        <Text style={[styles.headerCell, styles.tableCell]}>
                                            Meeting Description
                                        </Text>
                                        <Text style={[styles.headerCell, styles.tableCell]}>Actions</Text>
                                    </View>
                                )}
                            />
                        ) : (
                            <Text style={styles.noDataText}>No meeting details available.</Text>
                        )}
                    </View>
                </View>
            </Modal>

            {/* Custom Date Range Modal */}
            <Modal
                visible={isCustomModalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setIsCustomModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <TouchableOpacity
                            style={styles.closeIcon}
                            onPress={() => setIsCustomModalVisible(false)}
                        >
                            <MaterialIcons name="close" size={26} color="#333" />
                        </TouchableOpacity>

                        <Text style={styles.modalHeader}>Custom Range Meetings</Text>
                        {loading ? (
                            <ActivityIndicator size="large" color="#2196F3" />
                        ) : customModalData.length > 0 ? (
                            <FlatList
                                data={customModalData}
                                keyExtractor={(item, index) => item.id.toString() || index.toString()}
                                renderItem={({ item, index }) => (
                                    <View style={[styles.row, styles.tableRow]}>
                                        <Text style={[styles.cell, styles.tableCell]}>{index + 1}</Text>
                                        <Text style={[styles.cell, styles.tableCell]}>{item.companyName}</Text>
                                        <Text style={[styles.cell, styles.tableCell]}>
                                            {item["meetingDetails.meeting_description"]}
                                        </Text>
                                        <Text style={[styles.headerCell, styles.tableCell, styles.centerbtn]}>
                                            <TouchableOpacity onPress={() => handleCall(item.contact_number)}>
                                                <MaterialIcons name="phone" size={20} color="#0997a5" />
                                            </TouchableOpacity>
                                        </Text>
                                    </View>
                                )}
                                ListHeaderComponent={() => (
                                    <View style={[styles.row, styles.headerRow]}>
                                        <Text style={[styles.headerCell, styles.tableCell]}>S. No.</Text>
                                        <Text style={[styles.headerCell, styles.tableCell]}>Company Name</Text>
                                        <Text style={[styles.headerCell, styles.tableCell]}>
                                            Meeting Description
                                        </Text>
                                        <Text style={[styles.headerCell, styles.tableCell]}>Actions</Text>
                                    </View>
                                )}
                            />
                        ) : (
                            <Text style={styles.noDataText}>No meeting details available.</Text>
                        )}
                    </View>
                </View>
            </Modal>

        </View>
    );
};

export default EmployeeReportScreen;

const getDatesBetween = (startDate, endDate) => {
    if (!startDate || !endDate) return [];
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
        marginBottom: 10
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
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#fff',
        width: '90%',
        borderRadius: 10,
        padding: 20,
        position: 'relative',
        elevation: 5
    },
    closeIcon: {
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 1,
    },
    modalHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'start',
        marginBottom: 10,
    },
    tableRow: {
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    tableCell: {
        flex: 1,
        textAlign: 'center',
        paddingVertical: 10,
        borderRightWidth: 1,
        borderRightColor: '#ddd',
    },
    headerRow: {
        backgroundColor: '#f0f0f0',
        borderBottomWidth: 1,
        borderBottomColor: '#bbb',
    },
    headerCell: {
        fontWeight: 'bold',
    },
    closeButton: {
        backgroundColor: '#2196F3',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    centerbtn: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },


});
