const express = require('express');
const router = express.Router();
const {registerUser, loginUser, logout, userInfo, recoverPassword, googlelogin} = require('../Controllers/authController');
const isLoggedin = require('../Middlewares/isLoggedin')
const authRoutes = router 


authRoutes.get('/', async (req, res) => {
    res.send('user router working');
});
authRoutes.post('/register', registerUser )

authRoutes.post('/login', loginUser )

authRoutes.post('/recoverPassword', recoverPassword )

authRoutes.get("/userInfo", isLoggedin ,userInfo);

authRoutes.post('/googlelogin' , googlelogin )

authRoutes.get("/logout", logout);



module.exports = authRoutes;