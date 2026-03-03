const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect, requireAdmin } = require('../middleware/authMiddleware');

router.get('/', protect, requireAdmin, userController.getAll);
router.get('/:id', protect, requireAdmin, userController.getOne);
router.put('/:id', protect, requireAdmin, userController.update);
router.delete('/:id', protect, requireAdmin, userController.delete);

module.exports = router;
