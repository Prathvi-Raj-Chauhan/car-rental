const express = require('express');
const router = express.Router();
const driverController = require('../controllers/driverController');
const { protect, requireAdmin, requireDriver } = require('../middleware/authMiddleware');

router.post('/register', driverController.register);
router.get('/profile', protect, requireDriver, driverController.getProfile);
router.get('/rides', protect, requireDriver, driverController.getMyRides);
router.get('/available', protect, requireDriver, driverController.getAvailableRides);

router.get('/', protect, requireAdmin, driverController.getAll);
router.put('/:id/verify', protect, requireAdmin, driverController.verify);
router.put('/:id/reject', protect, requireAdmin, driverController.reject);

module.exports = router;
