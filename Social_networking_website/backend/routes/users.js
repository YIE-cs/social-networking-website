const { searchUsers, getMyFollowing } = require('../controllers/userController');
const express = require('express');
const router = express.Router();

router.get('/users', searchUsers);
router.get('/users/following', getMyFollowing);

module.exports = router;