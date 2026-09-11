const express = require('express');
const router = express.Router();
const { login, getMe } = require('../controllers/adminController');
const { protectAdmin } = require('../middleware/auth');

router.post('/login', login);
router.get('/me', protectAdmin, getMe);

module.exports = router;
