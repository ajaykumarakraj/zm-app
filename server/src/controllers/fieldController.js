const { Op, fn, col, Sequelize } = require('sequelize');
const { DayPlans, FieldMeetingDetails, CheckInOutLogs } = require('../models/index');
const ImageKit = require('imagekit');
const moment = require('moment');
require('dotenv').config();

// SDK initialization
var imagekit = new ImageKit({
  publicKey: "public_5J27hETdJ/Qqdmt102EjAbUOOd4=",
  privateKey: "private_rI5739WSAbOayuMXnydJW74H40k=",
  urlEndpoint: "https://ik.imagekit.io/rw05vsmbv"
});

const GetAllMeetings = async (req, res) => {
  try {
    const userId = req.session.user.id;
    const meetings = await DayPlans.findAll({
      raw: true,
      where: { added_by: userId },
      include: [
        {
          model: CheckInOutLogs,
          as: 'checkInOutLogs'
        },
        {
          model: FieldMeetingDetails,
          as: 'meetingDetails'
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

    const {
      companyName,
      contactNumber,
      industry,
      product,
      amount,
      clientType,
      meetingDescription,
      meetingType,
      nextFollowUpDate,
    } = req.body;

    let meetingImage = null;

    // Process file buffer
    if (req.file) {
      const fileBuffer = req.file.buffer;

      // Upload to ImageKit
      const uploadResponse = await imagekit.upload({
        file: fileBuffer, // Use the file buffer
        fileName: req.file.originalname, // Original file name
      });

      meetingImage = uploadResponse.url;
    }

    const meetingDetails = {
      day_plan_id: req.body.meetingId,
      company_name: companyName,
      contact_number: contactNumber,
      industry,
      product,
      amount,
      client_type: clientType,
      meeting_description: meetingDescription,
      meeting_type: meetingType,
      image: meetingImage,
      follow_up_date: nextFollowUpDate,
    };

    await FieldMeetingDetails.create(meetingDetails);

    res.status(200).json({ message: 'Meeting updated successfully' });
  } catch (error) {
    console.error('Error updating meeting:', error);
    res.status(500).json({ message: 'Error updating meeting', error: error.message });
  }
};

const GetAllFollowUps = async (req, res) => {
  try {
    const { date } = req.query;
    const id = req.session.user.id;

    let DayPlansId = await DayPlans.findAll({
      raw: true,
      attributes: ['id'],
      where: { added_by: id }
    })

    DayPlansId = DayPlansId.map((item) => item.id)

    const formattedDate = moment(date).format('YYYY-MM-DD');

    const AllFollowUps = await FieldMeetingDetails.findAll({
      raw: true,
      where: {
        day_plan_id: DayPlansId,
        [Op.and]: [
          Sequelize.where(
            fn('DATE', col('follow_up_date')),
            formattedDate
          )
        ]
      },
      attributes: ['id', 'company_name', 'contact_number', 'product', 'industry', 'meeting_description']
    });

    res.status(200).json({ message: 'Followps retreated successfully', followUps : AllFollowUps });
  } catch (error) {
    console.error('Error getting followups:', error);
    res.status(500).json({ message: 'Error getting followups', error: error.message });
  }
};

module.exports = { AddMeeting, GetAllMeetings, CheckInMeeting, CheckOutStatus, CheckOutMeeting, UpdateMeeting, GetAllFollowUps }