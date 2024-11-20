const express = require('express');
const router = express.Router();
const fieldController = require('../controllers/fieldController');

router.get('/get-all', fieldController.GetAllMeetings)
router.post('/add', fieldController.AddMeeting)
router.post('/check-in', fieldController.CheckInMeeting)
router.get('/check-in-status/:dayPlanId', fieldController.CheckOutStatus)
router.post('/check-out', fieldController.CheckOutMeeting)
router.post('/update', fieldController.UpdateMeeting)

module.exports = router;
