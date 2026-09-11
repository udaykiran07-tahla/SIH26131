const express = require('express');
const router = express.Router();
const { protectAdmin } = require('../middleware/auth');
const {
  getAllCrops,
  getCropById,
  createCrop,
  updateCrop,
  deleteCrop,
} = require('../controllers/cropController');

router.get('/', getAllCrops);
router.get('/:id', getCropById);
router.post('/', protectAdmin, createCrop);
router.put('/:id', protectAdmin, updateCrop);
router.delete('/:id', protectAdmin, deleteCrop);

module.exports = router;
