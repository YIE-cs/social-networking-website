const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/users', authController.register);
router.post('/login', authController.login);
router.get('/login', authController.checkLogin);
router.delete('/login', authController.logout);

module.exports = router;