
const userModel = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { OAuth2Client } = require('google-auth-library');
const { tokenGenerator } = require("../utils/tokenGenerator");

const client = new OAuth2Client('215959850029-qgugg2bb27t50eohcaaj6jkssi0r1qt9.apps.googleusercontent.com');

module.exports.registerUser =  async (req,res )=> {
    try {

        let { fullname, email, password } = req.body;
        let user = await userModel.findOne({ email: email })
        if (user)    {

            //req.flash("error", "You already have an account, please login.");
            console.log('"error", "You already have an account, please login');
           return res.redirect("/");
        }

        bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(password, salt, async function (err, hash) {
              if (err) return res.send(err.message);
              else {
                let user = await userModel.create({
                  email,
                  password: hash,
                  fullname,
                });
      
                let token = tokenGenerator(user);
                res.cookie("token", token);
                console.log('Redirecting to task page');

                res.send("Successfully Signed In");
              }
            });
          });
    }catch (err) {
        res.send(err.message);
    }
}

module.exports.loginUser = async ( req,res) => {
    try{
        let { email, password } = req.body;
        let user = await userModel.findOne({ email: email })
        if (!user) {
           // req.flash("error", "Email or Password incorrect");
            console.log('error", "Email or Password incorrect');

            return res.send("Incorrect email or password");
          }
        
        console.log("userpassword", user.password);
        bcrypt.compare(password, user.password, function (err, result) {
            console.log("result", result)
            if (result) {
                let token = tokenGenerator(user);
                res.cookie("token", token);
                console.log('Redirecting to login');
                res.status(200).json({id: user._id, token: token});
                //res.send("logged in");
            }
            else {
                //req.flash("error", "Email or Password incorrect");
                return res.send("error", "Email or Password incorrect");
            } 
        })
    }
    catch(err){
        res.send(err.message);
    }
}

module.exports.userInfo = async (req, res) => {
  try {
    const user = req.user;
    console.log(user, "user")

    return res.status(200).json({

      id: user._id,
      email: user.email,
      fullname: user.fullname,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send(err.message);
  }
};

module.exports.recoverPassword = async (req, res) => {
  const { email, newPassword, confirmPassword } = req.body;

  try {
   
    if (!email) {
      return res.status(400).json({ message: 'Email is required.' });
    }
    if (!newPassword || !confirmPassword) {
      return res.status(400).json({ message: 'Both password fields are required.' });
    }
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match.' });
    }

  
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update the user's password
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: 'Password reset successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred. Please try again later.' });
  }
};

module.exports.googlelogin = async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ message: 'Token is missing' });
  }

  console.log('Received token:', token); 

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: '215959850029-qgugg2bb27t50eohcaaj6jkssi0r1qt9.apps.googleusercontent.com'
      ,  
    });

    const payload = ticket.getPayload();
    const { email, name } = payload;

    let user = await userModel.findOne({ email });
    if (!user) {
      
      user = new userModel({ email, fullname: name });
      await user.save();
    }

    const jwtToken = tokenGenerator(user); 

    res.status(200).json({ token: jwtToken, user });  
  } catch (err) {
    console.error('Error verifying Google token:', err.message);
    res.status(401).json({ message: 'Invalid Google token' });
  }
};





module.exports.logout = function (req, res) {
    res.cookie("token", "");
    console.log('Redirecting to logout');
    res.send("/");
  };