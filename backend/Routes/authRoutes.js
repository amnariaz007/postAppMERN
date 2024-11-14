const express = require('express');
const router = express.Router();
const {registerUser, loginUser, logout, userInfo} = require('../Controllers/authController');
const isLoggedin = require('../Middlewares/isLoggedin')
const authRoutes = router 


authRoutes.get('/', async (req, res) => {
    res.send('user router working');
});
authRoutes.post('/register', registerUser )

authRoutes.post('/login', loginUser )

authRoutes.get("/userInfo", isLoggedin ,userInfo);

authRoutes.get("/logout", logout);



module.exports = authRoutes;