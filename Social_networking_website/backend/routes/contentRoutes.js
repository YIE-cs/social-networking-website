const express = require('express');
const multer = require('multer');
const path = require('path');

const {
  createPost,
  searchContents,
  ForYouPage,
  likePost,      
  unlikePost,    
  addComment     
} = require('../controllers/contentController');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {                   
    const unique = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, unique + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

router.post('/contents', upload.single('image'), createPost);     
router.get('/contents', searchContents);                        
router.get('/contents/feed', ForYouPage);                   
router.post('/contents/like', likePost);
router.post('/contents/unlike', unlikePost);
router.post('/contents/comment', addComment);        

module.exports = router;