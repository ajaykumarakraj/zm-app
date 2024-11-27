const { Op, fn, col, Sequelize, where } = require('sequelize');
const { DayPlans, FieldMeetingDetails, CheckInOutLogs } = require('../models/index');
require('dotenv').config();

const GetEmployeeReport = async (req, res) => {
    try {
        const userId = req.session.user.id;
        const currentDate = new Date();

        // Get the start of the current week (Sunday)
        const startOfWeek = new Date(currentDate);
        startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
        startOfWeek.setHours(0, 0, 0, 0);

        const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

        // Get all the day plans (meetings) added by the user during this week
        const meetings = await DayPlans.findAll({
            raw: true,
            where: {
                added_by: userId,
                createdAt: {
                    [Sequelize.Op.between]: [startOfWeek, currentDate], // Limit data to current week until today
                },
            },
            attributes: ['createdAt'],
        });


        if (!meetings || meetings.length === 0) {
            return res.status(404).json({ message: 'No meetings found for the employee this week' });
        }

        const monthlyMeetings = await DayPlans.findAll({
            raw: true,
            where: {
                added_by: userId,
                createdAt: {
                    [Sequelize.Op.between]: [startOfMonth, currentDate], // Limit data to the current month until today
                },
            },
            attributes: ['createdAt'],
        });

        // Initialize weekly report data (Sunday to Saturday)
        let weeklyReport = [
            { id: 0, day: 'Sunday', meetings: 0 },
            { id: 1, day: 'Monday', meetings: 0 },
            { id: 2, day: 'Tuesday', meetings: 0 },
            { id: 3, day: 'Wednesday', meetings: 0 },
            { id: 4, day: 'Thursday', meetings: 0 },
            { id: 5, day: 'Friday', meetings: 0 },
            { id: 6, day: 'Saturday', meetings: 0 },
        ];

        // Loop through meetings to populate weekly report
        meetings.forEach((meeting) => {
            const meetingDate = new Date(meeting.createdAt); // Use createdAt for report generation
            const dayOfWeek = meetingDate.getDay(); // Get the day of the week (0=Sunday, 6=Saturday)

            // Weekly report: Increment meetings count for the corresponding day of the week
            if (dayOfWeek <= currentDate.getDay()) {
                // Include only days up to today
                weeklyReport[dayOfWeek].meetings += 1;
            }
        });

        const monthlyReport = monthlyMeetings.length;

        return res.status(200).json({
            message: 'Employee data retrieved successfully',
            employee: {
                weeklyReport,
                monthlyReport
            },
        });
    } catch (error) {
        console.error('Error getting Employee report:', error);
        return res.status(500).json({ message: 'Error getting Employee report' });
    }
};

const GetCustomDateEmployeeReport = async (req, res) => {
    try {
        const { start, end } = req.query;
        const userId = req.session?.user?.id;

        if (!start || !end) {
            return res.status(400).json({ message: 'Start and end dates are required.' });
        }

        // Construct the datetime range
        const startDateTime = `${start} 00:00:00`;
        const endDateTime = `${end} 23:59:59`;

        // Query the database
        const employeeData = await DayPlans.findAll({
            raw: true,
            where: {
                added_by: userId,
                createdAt: {
                    [Op.between]: [startDateTime, endDateTime],
                },
            },
            include: [
                {
                    model: FieldMeetingDetails,
                    as: 'meetingDetails'
                }
            ]
        });

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

const GetDayMeetingsDeatils = async (req, res) => {
    try {
        const userId = req.session.user.id;
        const day = req.params.day;

        // Map day names to numbers (0 = Sunday, 1 = Monday, ...)
        const dayMap = {
            Sunday: 0,
            Monday: 1,
            Tuesday: 2,
            Wednesday: 3,
            Thursday: 4,
            Friday: 5,
            Saturday: 6
        };

        const targetDay = dayMap[day];
        if (targetDay === undefined) {
            return res.status(400).json({ message: 'Invalid day provided' });
        }

        // Get the current date and start of the week
        const now = new Date();
        const startOfWeek = new Date(
            now.setDate(now.getDate() - now.getDay())
        ); // Adjust for Sunday as the first day of the week
        startOfWeek.setHours(0, 0, 0, 0);

        // Calculate the target day of the week
        const targetDate = new Date(startOfWeek);
        targetDate.setDate(startOfWeek.getDate() + targetDay); // Add days to startOfWeek

        // Set start and end of the target day
        const startOfDay = new Date(targetDate);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(targetDate);
        endOfDay.setHours(23, 59, 59, 999);

        // Query for the specific day
        const SpecificDayMeetings = await DayPlans.findAll({
            raw: true,
            where: {
                createdAt: { [Sequelize.Op.between]: [startOfDay, endOfDay] },
                added_by: userId
            },
            include: [
                {
                    model: FieldMeetingDetails,
                    as: 'meetingDetails'
                }
            ]
        });

        return res.status(200).json({
            message: `Meetings on ${day} of this week retrieved successfully`,
            data: SpecificDayMeetings
        });
    } catch (error) {
        console.error('Error retrieving meetings:', error);
        return res.status(500).json({ message: 'Error retrieving meetings' });
    }
};

module.exports = { GetEmployeeReport, GetCustomDateEmployeeReport, GetDayMeetingsDeatils }