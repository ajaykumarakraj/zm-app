const express = require('express');
const router = express.Router();
const salesController = require('../controllers/salesController');

router.get('/getSalesReport', salesController.GetSalesReport)
router.get('/getCustomDateSalesReport', salesController.GetCustomDateSalesReport)

module.exports = router;
