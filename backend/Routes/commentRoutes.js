const express = require('express');
const router = express.Router();
const {addComment, deleteComment} = require('../Controllers/commentController');
const isLoggedin = require('../Middlewares/isLoggedin');
const commentRoutes = router 



commentRoutes.post('/addComment',isLoggedin , addComment )
commentRoutes.post('/deleteComment',isLoggedin , deleteComment )



module.exports = commentRoutes;




