const express = require('express');
const {
  getDashboardStats,
  getDashboardActivity,
} = require('../controllers/dashboardController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.get('/stats', getDashboardStats);
router.get('/activity', getDashboardActivity);

module.exports = router;
