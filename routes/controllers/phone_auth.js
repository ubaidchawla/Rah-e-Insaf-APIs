var express = require('express');
var router = express.Router();
var User = require('../../db/models/users');
const serviceID = process.env['SERVICE_ID'];
const accountSID = process.env['ACCOUNT_SID'];
const authToken = process.env['AUTH_TOKEN'];


const client = require('twilio')(accountSID, authToken);
var passport = require('passport');
// required for persistent login sessions
passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

module.exports = {
    // Login Endpoint
    login :async (req, res) => {
        User.findOne({phone:req.body.phonenumber}, function(err, result) {
            if (err) {
                return done(err);
            } 
            if (result) {
              if (req.body.phonenumber) {
                client.verify.services(serviceID).verifications
                .create({
                    to: `+${req.body.phonenumber}`,
                    channel: req.body.channel==='call' ? 'call' : 'sms' 
                })
                .then(data => {
                    res.status(200).send({
                        message: "Verification is sent!!",
                        phonenumber: req.body.phonenumber,
                        data
                    })
                })
             } else {
                res.status(400).send({
                    message: "Wrong phone number :(",
                    phonenumber: req.body.phonenumber,
                    data
                })
             }
            }
            else
            {
                res.send("Phone Number not Found. Please Register");
            }
          });
            
    },
    
    // Register Endpoint
    register :async (req, res) => {
        User.findOne({phone:req.body.phonenumber}, function(err, result) {
            if (err) {
                return done(err);
            } 
            if (!result) {
              if (req.body.phonenumber) {
                client.verify.services(serviceID).verifications
                .create({
                    to: `+${req.body.phonenumber}`,
                    channel: req.body.channel==='call' ? 'call' : 'sms' 
                })
                .then(data => {
                    res.status(200).send({
                        message: "Verification is sent!!",
                        phonenumber: req.body.phonenumber,
                        data
                    })
                })
             } else {
                res.status(400).send({
                    message: "Wrong phone number :(",
                    phonenumber: req.body.phonenumber,
                    data
                })
             }
            }
            else
            {
                res.send("Phone Number already Registered. Login with phone Number");
            }
          });
    },
    // Verify Endpoint
    verify :async (req, res) => {
        User.findOne({phone:req.body.phonenumber}, function(err, result) {
            if (err) {
                return done(err);
            } 
            if (!result) {
                if (req.body.phonenumber && ((req.body.code).toString()).length === 6) {
                    client
                        .verify
                        .services(serviceID)
                        .verificationChecks
                        .create({
                            to: `+${req.body.phonenumber}`,
                            code: req.body.code
                        })
                        .then(data => {
                            if (data.status === "approved") {
    
                                res.status(200).send({
                                    message: "User is Verified!!",
                                    data
                                })
                                
                                var newUser = new User();
                                // set the user's local credentials
                                newUser.name = req.body.name,
                                newUser.city = req.body.city,
                                newUser.phone = req.body.phonenumber
                                
                                newUser.save()
                                .then(data => {
                                    res.send(data);
                                }).catch(err => {
                                    res.status(500).send({
                                    message: err.message || "Something went wrong while Registering new User."
                                });
                                });
                                
                            }
                        })
                } else {
                    res.status(400).send({
                        message: "Wrong phone number or code :(",
                        phonenumber: req.body.phonenumber
                    })
                }
            }
            else
            {
                if (req.body.phonenumber && ((req.body.code).toString()).length === 6) {
                    client
                        .verify
                        .services(serviceID)
                        .verificationChecks
                        .create({
                            to: `+${req.body.phonenumber}`,
                            code: req.body.code
                        })
                        .then(data => {
                            if (data.status === "approved") {
                                res.status(200).send({
                                    message: "User is Verified!!",
                                    data
                                })
                                req.login(id, function(err){
                                    res.redirect('/profile')
                                })
                            }
                        })
                } else {
                    res.status(400).send({
                        message: "Wrong phone number or code :(",
                        phonenumber: req.body.phonenumber
                    })
                }
            }
          });
    },
}
