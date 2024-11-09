
const userModel = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { tokenGenerator } = require("../utils/tokenGenerator");



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

module.exports.logout = function (req, res) {
    res.cookie("token", "");
    console.log('Redirecting to logout');
    res.redirect("/");
  };