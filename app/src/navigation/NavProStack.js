import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import BottomProNav from './BottomProNav';
import FieldMeetingScreen from '../screens/fieldMeeting/FieldMeetingScreen';
import UpdateMeetingScreen from '../screens/fieldMeeting/UpdateMeetingScreen';
import DayPlanScreen from '../screens/dayPlan/DayPlanScreen';
import AddDayPlanScreen from '../screens/dayPlan/AddDayPlanScreen';
import PlanDetailScreen from '../screens/dayPlan/PlanDetailScreen';
import EmployeeReportScreen from '../screens/EmployeeReportScreen';
import SalesReportScreen from '../screens/SalesReportScreen';

const Stack = createStackNavigator();

const NavProStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="MainTabs" component={BottomProNav} options={{ headerShown: false }} />
    <Stack.Screen name="FieldMeetings" component={FieldMeetingScreen} options={{ headerShown: false }} />
    <Stack.Screen name="UpdateMeeting" component={UpdateMeetingScreen} options={{ headerShown: false }} />
    <Stack.Screen name="DayPlans" component={DayPlanScreen} options={{ headerShown: false }} />
    <Stack.Screen name="AddDayPlan" component={AddDayPlanScreen} options={{ headerShown: false }} />
    <Stack.Screen name="PlanDetail" component={PlanDetailScreen} options={{ headerShown: false }} />
    <Stack.Screen name="EmployeeReport" component={EmployeeReportScreen} options={{ headerShown: false }} />
    <Stack.Screen name="SalesReport" component={SalesReportScreen} options={{ headerShown: false }} />
  </Stack.Navigator>
);


export default NavProStack;



