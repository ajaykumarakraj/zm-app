const { Op } = require('sequelize');
const { DayPlans, FieldMeetingDetails, CheckInOutLogs } = require('../models/index');
const { raw } = require('mysql2');
require('dotenv').config();

const GetAllMeetings = async (req, res) => {
  try {
    // console.log('see')
    const userId = req.session.user.id;
    const meetings = await DayPlans.findAll({
      raw: true,
      where: { added_by: userId },
      include: [
        {
          model: CheckInOutLogs,
          as: 'checkInOutLogs'
        }
      ]
    });

    // Send a successful response with the meetings data
    res.status(200).json({ message: 'Meetings retrieved successfully', data: meetings });
  } catch (error) {
    console.error('Error getting all meetings:', error);
    res.status(500).json({ message: 'Error getting all meetings' });
  }
};

const AddMeeting = async (req, res) => {
  try {
    const meeting = {
      added_by: req.session.user.id,
      companyName: req.body.companyName,
      clientName: req.body.clientName,
      mobileNumber: req.body.mobileNumber,
      meetingTime: req.body.meetingTime,
      address: req.body.address,
      location: req.body.location
    }
    // Create a new meeting entry in FieldMeetings table
    await DayPlans.create(meeting);

    res.status(201).json({ message: 'Meeting added successfully' });
  } catch (error) {
    console.error('Error adding meeting:', error);
    res.status(500).json({ message: 'Error adding meeting' });
  }
};

const CheckInMeeting = async (req, res) => {
  const { day_plan_id, location } = req.body;
  console.log(day_plan_id, location, "seee them")
  try {
    const userId = req.session.user.id;

    // Create a new check-in log
    const checkInLog = await CheckInOutLogs.create({
      user_id: userId,
      day_plan_id: day_plan_id,
      check_in_time: new Date(),
      check_in_location: location,
    });

    // Respond with success
    res.status(200).json({
      message: 'Check-in successful',
      success: true,
      checkInLog: checkInLog,
    });
  } catch (error) {
    console.error('Error checking in meeting:', error);
    res.status(500).json({ message: 'Error checking in meeting', success: false });
  }
};

const CheckOutStatus = async (req, res) => {
  const { dayPlanId } = req.params; // Get day plan ID from the URL parameter
  const userId = req.session.user.id;

  try {
    // Check if a check-in log exists for this user and day_plan_id
    const existingLog = await CheckInOutLogs.findOne({
      raw: true,
      where: { user_id: userId, day_plan_id: dayPlanId, check_in_time: { [Op.not]: null } },
    });
    console.log(existingLog, 'check karna')

    if (existingLog) {
      res.status(200).json({ isCheckedIn: true });
    } else {
      res.status(200).json({ isCheckedIn: false });
    }
  } catch (error) {
    console.error('Error checking check-in status:', error);
    res.status(500).json({ message: 'Error checking status', success: false });
  }
};

// Check-out endpoint
const CheckOutMeeting = async (req, res) => {
  const { day_plan_id, location } = req.body;
  const userId = req.session.user.id;

  try {

    // Create a new check-in log
    const checkOutLog = await CheckInOutLogs.update(
      {
        check_out_time: new Date(),
        check_out_location: location,
      }, {
      where: {
        user_id: userId,
        day_plan_id: day_plan_id
      }
    }
    );

    // Respond with success
    res.status(200).json({
      message: 'Check-in successful',
      success: true,
      checkInLog: checkOutLog,
    });

  } catch (error) {
    console.error('Error in check-out meeting:', error);
    res.status(500).json({ message: 'Error checking out meeting', success: false });
  }
};

const UpdateMeeting = async (req, res) => {
  try {

    console.log(req.body, 'meeting details')

    const meetingDetails = {
      day_plan_id: req.body.meetingId,
      company_name: req.body.companyName,
      contact_number: req.body.mobileNumber,
      industry: req.body.industry,
      client_type: req.body.client_type,
      meeting_description: req.body.meeting_description,
      meeting_type: req.body.meeting_type,
      image: meetingImage,
      follow_up_date: 'follow_up_date'
    }

    console.log(meetingDetails)

    // Create a new meeting entry in FieldMeetings table
    // await FieldMeetingDetails.create(meetingDetails);

    res.status(200).json({ message: 'Meeting updated successfully' });
  } catch (error) {
    console.error('Error updating meeting:', error);
    res.status(500).json({ message: 'Error updating meeting' });
  }
};


module.exports = { AddMeeting, GetAllMeetings, CheckInMeeting, CheckOutStatus, CheckOutMeeting, UpdateMeeting }