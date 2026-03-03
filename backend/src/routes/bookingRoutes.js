const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { protect, requireAdmin } = require('../middleware/authMiddleware');

router.post('/', protect, bookingController.create);
router.get('/my', protect, bookingController.getMyBookings);
router.get('/', protect, requireAdmin, bookingController.getAll);
router.get('/:id', protect, bookingController.getOne);
router.put('/:id/cancel', protect, bookingController.cancel);
router.put('/:id/status', protect, requireAdmin, bookingController.updateStatus);

module.exports = router;
