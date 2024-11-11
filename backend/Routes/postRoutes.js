const express = require('express');
const router = express.Router();
const {createPost, likePost, deletePost} = require('../Controllers/postController');
const isLoggedin = require('../Middlewares/isLoggedin');
const postRoutes = router 
const upload = require ('../config/multer-config')

postRoutes.post('/createPost',isLoggedin, upload.single('file') , createPost )
postRoutes.post('/likePost',isLoggedin , likePost )
postRoutes.post('/deletePost',isLoggedin , deletePost )


module.exports = postRoutes;