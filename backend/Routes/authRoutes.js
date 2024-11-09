const express = require('express');
const router = express.Router();
const {registerUser, loginUser, logout} = require('../Controllers/authController')
const authRoutes = router 


authRoutes.get('/', async (req, res) => {
    res.send('user router working');
});
authRoutes.post('/register', registerUser )

authRoutes.post('/login', loginUser )

authRoutes.get("/logout", logout);



module.exports = authRoutes;