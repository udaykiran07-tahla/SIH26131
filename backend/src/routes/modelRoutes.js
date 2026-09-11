const express = require('express');
const router = express.Router();
const { protectAdmin } = require('../middleware/auth');
const {
  getModelVersions,
  createModelVersion,
  updateModelVersion,
  deleteModelVersion,
} = require('../controllers/modelController');

router.get('/', getModelVersions);
router.post('/', protectAdmin, createModelVersion);
router.put('/:id', protectAdmin, updateModelVersion);
router.delete('/:id', protectAdmin, deleteModelVersion);

module.exports = router;
