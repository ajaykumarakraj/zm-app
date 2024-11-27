const express = require('express');
const router = express.Router();
const employeesController = require('../controllers/employeeController');

router.get('/getEmployeeReport', employeesController.GetEmployeeReport)
router.get('/getCustomDateEmployeeReport', employeesController.GetCustomDateEmployeeReport)
router.get('/getDayMeetingsDeatils/:day', employeesController.GetDayMeetingsDeatils)

module.exports = router;
