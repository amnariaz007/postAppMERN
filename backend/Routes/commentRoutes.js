const express = require('express');
const router = express.Router();
const {addComment, deleteComment} = require('../Controllers/commentController');
const isLoggedin = require('../Middlewares/isLoggedIn');
const commentRoutes = router 



commentRoutes.post('/addComment',isLoggedin , addComment )
commentRoutes.post('/deleteComment',isLoggedin , deleteComment )



module.exports = commentRoutes;




