const express = require('express');
const router = express.Router();
const { protectAdmin } = require('../middleware/auth');
const {
  getAllConditions,
  getConditionById,
  createCondition,
  updateCondition,
  deleteCondition,
} = require('../controllers/conditionController');

router.get('/', getAllConditions);
router.get('/:id', getConditionById);
router.post('/', protectAdmin, createCondition);
router.put('/:id', protectAdmin, updateCondition);
router.delete('/:id', protectAdmin, deleteCondition);

module.exports = router;
