const express = require('express');
const router = express.Router();
const fieldController = require('../controllers/fieldController');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

router.get('/get-all', fieldController.GetAllMeetings)
router.post('/add', fieldController.AddMeeting)
router.post('/check-in', fieldController.CheckInMeeting)
router.get('/check-in-status/:dayPlanId', fieldController.CheckOutStatus)
router.post('/check-out', fieldController.CheckOutMeeting)
router.post('/update', upload.single('image'), fieldController.UpdateMeeting)
router.get('/get-followups', fieldController.GetAllFollowUps)

module.exports = router;
