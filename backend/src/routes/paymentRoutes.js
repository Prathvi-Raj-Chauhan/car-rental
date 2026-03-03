const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { protect, requireAdmin } = require('../middleware/authMiddleware');

router.post('/', protect, paymentController.create);
router.get('/my', protect, paymentController.getMyPayments);
router.get('/', protect, requireAdmin, paymentController.getAll);
router.get('/:id/receipt', protect, paymentController.getReceipt);

module.exports = router;
