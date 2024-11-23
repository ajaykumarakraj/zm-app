const express = require('express');
const router = express.Router();
const employeesController = require('../controllers/employeeController');

router.get('/getEmployeeReport', employeesController.GetEmployeeReport)
router.get('/getCustomDateEmployeeReport', employeesController.GetCustomDateEmployeeReport)

module.exports = router;
