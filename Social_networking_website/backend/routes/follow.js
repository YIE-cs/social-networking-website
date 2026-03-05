const express = require('express');
const router = express.Router();

const { followUser, unfollowUser } = require('../controllers/followController');
router.post('/follow', followUser);        
router.delete('/follow', unfollowUser);    

module.exports = router;
