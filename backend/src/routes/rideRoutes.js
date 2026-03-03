const express = require('express');
const router = express.Router();
const rideController = require('../controllers/rideController');
const { protect, requireAdmin, requireDriver } = require('../middleware/authMiddleware');

router.get('/estimate', rideController.estimateFare);
router.post('/', protect, rideController.create);
router.get('/my', protect, rideController.getMyRides);
router.get('/', protect, requireAdmin, rideController.getAll);
router.get('/:id', protect, rideController.getOne);
router.put('/:id/status', protect, rideController.updateStatus);
router.put('/:id/accept', protect, requireDriver, rideController.acceptRide);

module.exports = router;
