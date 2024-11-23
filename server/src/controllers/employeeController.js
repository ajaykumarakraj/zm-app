const { Op, fn, col, Sequelize, where } = require('sequelize');
const { DayPlans, FieldMeetingDetails, CheckInOutLogs } = require('../models/index');
require('dotenv').config();

const GetEmployeeReport = async (req, res) => {
    try {
        const userId = req.session.user.id;  // Assuming user ID is stored in session
        const currentDate = new Date();

        // Get all the day plans (meetings) added by the user
        const meetings = await DayPlans.findAll({
            raw: true,
            where: { added_by: userId },
            attributes: ['createdAt'],
        });

        if (!meetings || meetings.length === 0) {
            return res.status(404).json({ message: 'No meetings found for the employee' });
        }

        // Initialize weekly and monthly report data
        let weeklyReport = [
            { id: 1, day: 'Sunday', meetings: 0 },
            { id: 2, day: 'Monday', meetings: 0 },
            { id: 3, day: 'Tuesday', meetings: 0 },
            { id: 4, day: 'Wednesday', meetings: 0 },
            { id: 5, day: 'Thursday', meetings: 0 },
            { id: 6, day: 'Friday', meetings: 0 },
            { id: 7, day: 'Saturday', meetings: 0 },
        ];
        let monthlyReport = 0;

        // Loop through meetings to populate weekly and monthly reports
        meetings.forEach((meeting) => {
            const meetingDate = new Date(meeting.createdAt);  // Use createdAt for report generation
            const dayOfWeek = meetingDate.getDay();  // Get the day of the week (0=Sunday, 6=Saturday)
            const monthYear = `${meetingDate.getFullYear()}-${meetingDate.getMonth() + 1}`; // e.g., "2024-11" for November

            // Weekly report: Increment meetings count for the corresponding day of the week
            weeklyReport[dayOfWeek].meetings += 1;

            // Monthly report: Increment total meeting count for the month
            monthlyReport += 1;
        });

        return res.status(200).json({
            message: 'Employee data retrieved successfully',
            employee: {
                weeklyReport,
                monthlyReport,  // Send the total meetings for the month (a number)
            },
        });
    } catch (error) {
        console.error('Error getting Employee report:', error);
        return res.status(500).json({ message: 'Error getting Employee report' });
    }
};

const GetCustomDateEmployeeReport = async (req, res) => {
    try {
        const { start, end } = req.query; // Extracting start and end dates from the query
        const userId = req.session?.user?.id; // Assuming user ID is stored in session

        // Validate input
        if (!start || !end) {
            return res.status(400).json({ message: 'Start and end dates are required.' });
        }

        // Construct the datetime range
        const startDateTime = `${start} 00:00:00`;
        const endDateTime = `${end} 23:59:59`;

        console.log(req.query, 'this is the query params'); // Log query parameters for debugging

        // Query the database
        const employeeData = await DayPlans.count({
            raw: true,
            where: {
                added_by: userId,
                createdAt: {
                    [Op.between]: [startDateTime, endDateTime], // Filter by datetime range
                },
            },
        });

        console.log(employeeData, 'this is the fetched employee data'); // Log result for debugging

        // Handle no data case
        if (!employeeData || employeeData.length === 0) {
            return res.status(200).json({
                message: 'No data found for the specified date range.',
                data: 0,
            });
        }

        // Respond with the data
        return res.status(200).json({
            message: 'Custom date employee report retrieved successfully.',
            data: employeeData,
        });
    } catch (error) {
        console.error('Error getting custom date employee report:', error);
        return res.status(500).json({ message: 'Error getting custom date employee report.' });
    }
};

module.exports = { GetEmployeeReport, GetCustomDateEmployeeReport }