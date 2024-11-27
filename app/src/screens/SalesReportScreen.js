import React, { useState, useEffect } from 'react';
import { 
    StyleSheet, 
    Text, 
    View, 
    TouchableOpacity, 
    FlatList, 
    ActivityIndicator, 
    ScrollView 
} from 'react-native';
import axios from 'axios';
import { Calendar } from 'react-native-calendars';
import LinearGradient from 'react-native-linear-gradient';

const SalesReportScreen = () => {
    const [showCalendar, setShowCalendar] = useState(false);
    const [loading, setLoading] = useState(false);
    const [range, setRange] = useState({ startDate: '', endDate: '' });
    const [customSales, setCustomSales] = useState(0);
    const [weeklyReport, setWeeklyReport] = useState([]);
    const [monthlyReport, setMonthlyReport] = useState(0);

    const apiurl = 'http://192.168.1.13:3000';

    useEffect(() => {
        const fetchSalesReport = async () => {
            try {
                const response = await axios.get(`${apiurl}/sales/getSalesReport`);
                const data = response.data.sales;

                if (data) {
                    setWeeklyReport(data?.weeklyReport || []);
                    setMonthlyReport(data?.monthlyReport || 0);
                }
            } catch (error) {
                console.error('Error fetching sales report:', error);
            }
        };

        fetchSalesReport();
    }, []);

    const fetchCustomSalesReport = async (start, end) => {
        setLoading(true);
        setCustomSales(0);
        try {
            const customSalesReport = await axios.get(`${apiurl}/sales/getCustomDateSalesReport?start=${start}&end=${end}`);
            const totalSales = customSalesReport.data.data;

            setCustomSales(totalSales || 0);
        } catch (error) {
            console.error('Error fetching custom sales report:', error);
            setCustomSales(0);
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
                fetchCustomSalesReport(prev.startDate, dateString);
                return newRange;
            });
            setShowCalendar(false);
        }
    };

    return (
        <LinearGradient colors={['#F0F8FF', '#E6E6FA']} style={styles.container}>
            <ScrollView>
                {/* Header */}
                <Text style={styles.header}>📊 Sales Reports</Text>

                {/* Weekly Report */}
                <View style={styles.card}>
                    <Text style={styles.cardHeader}>Weekly Sales Report</Text>
                    {weeklyReport.length === 0 ? (
                        <Text style={styles.placeholderText}>No weekly data available.</Text>
                    ) : (
                        <FlatList
                            data={weeklyReport}
                            keyExtractor={(item, index) => item.id?.toString() || index.toString()}
                            renderItem={({ item }) => (
                                <View style={styles.row}>
                                    <Text style={styles.rowText}>{item.day || 'N/A'}</Text>
                                    <Text style={styles.rowValue}>{item.sales || 0}</Text>
                                </View>
                            )}
                        />
                    )}
                </View>

                {/* Monthly Report */}
                <View style={styles.card}>
                    <Text style={styles.cardHeader}>Monthly Sales Report</Text>
                    <Text style={styles.monthlySales}>{monthlyReport} Sales</Text>
                </View>

                {/* Custom Range Selector */}
                <TouchableOpacity
                    style={styles.customRangeButton}
                    onPress={() => setShowCalendar(!showCalendar)}
                >
                    <LinearGradient colors={['#2193b0', '#6dd5ed']} style={styles.buttonGradient}>
                        <Text style={styles.buttonText}>Select Custom Date Range</Text>
                    </LinearGradient>
                </TouchableOpacity>

                {/* Calendar */}
                {showCalendar && (
                    <View style={styles.card}>
                        <Calendar
                            onDayPress={handleDayPress}
                            markingType={'period'}
                            markedDates={{
                                [range.startDate]: { startingDay: true, color: '#2193b0', textColor: 'white' },
                                [range.endDate]: { endingDay: true, color: '#2193b0', textColor: 'white' },
                            }}
                        />
                    </View>
                )}

                {/* Custom Sales Report */}
                {range.startDate && range.endDate && (
                    <View style={styles.card}>
                        <Text style={styles.rangeText}>
                            Selected Range: {range.startDate} - {range.endDate}
                        </Text>
                        {loading ? (
                            <ActivityIndicator size="large" color="#2193b0" />
                        ) : (
                            <Text style={styles.customSalesText}>
                                Custom Range Sales: {customSales} Sales
                            </Text>
                        )}
                    </View>
                )}
            </ScrollView>
        </LinearGradient>
    );
};

export default SalesReportScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        fontSize: 26,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 20,
        color: '#4B0082',
    },
    card: {
        backgroundColor: '#fff',
        marginHorizontal: 15,
        marginVertical: 10,
        borderRadius: 12,
        padding: 15,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    cardHeader: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#4B0082',
        marginBottom: 10,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 8,
    },
    rowText: {
        fontSize: 16,
        color: '#555',
    },
    rowValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#4B0082',
    },
    placeholderText: {
        fontSize: 16,
        textAlign: 'center',
        color: '#AAA',
    },
    monthlySales: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2193b0',
        textAlign: 'center',
    },
    customRangeButton: {
        marginHorizontal: 15,
        borderRadius: 10,
        overflow: 'hidden',
    },
    buttonGradient: {
        paddingVertical: 15,
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 16,
        color: 'white',
        fontWeight: 'bold',
    },
    rangeText: {
        fontSize: 16,
        textAlign: 'center',
        color: '#333',
    },
    customSalesText: {
        fontSize: 18,
        textAlign: 'center',
        fontWeight: 'bold',
        color: '#4CAF50',
    },
});
