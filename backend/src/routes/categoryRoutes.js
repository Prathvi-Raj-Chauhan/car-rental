const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { protect, requireAdmin } = require('../middleware/authMiddleware');

router.get('/', categoryController.getAll);
router.get('/:id', categoryController.getOne);

router.post('/', protect, requireAdmin, categoryController.create);
router.put('/:id', protect, requireAdmin, categoryController.update);
router.delete('/:id', protect, requireAdmin, categoryController.delete);

module.exports = router;
