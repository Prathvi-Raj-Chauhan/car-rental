const express = require('express');
const router = express.Router();
const carController = require('../controllers/carController');
const { protect, requireAdmin } = require('../middleware/authMiddleware');
const { uploadCarImage } = require('../middleware/uploadMiddleware');

router.get('/', carController.getAll);
router.get('/:id', carController.getOne);

router.post('/', protect, requireAdmin, uploadCarImage, carController.create);
router.put('/:id', protect, requireAdmin, uploadCarImage, carController.update);
router.delete('/:id', protect, requireAdmin, carController.delete);

module.exports = router;
