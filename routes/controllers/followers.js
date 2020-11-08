var express = require('express');
const Follower = require('../../db/models/followers.js');
const User = require('../../db/models/users.js');
// Create and Save a new follower
module.exports = {
    create : async (req, res) => {
    if(!req.body) {
        return res.status(400).send({
        message: "Please fill all required field"
      });
      }

      const user =await User.findOne({_id:req.params.userId});

      // Add a new follower
      const follower = new Follower();{
        follower.user =  user._id
      }
      // Save follower in the database
      await follower.save()
        .then(data => {
        res.send(data);
      }).catch(err => {
        res.status(500).send({
        message: err.message || "Something went wrong while creating new follower."
      });
      });
},
// Find a single follower with a id
findOne : async (req, res) => {
  Follower.findById(req.params.id)
   .then(follower => {
   if(!follower) {
    return res.status(404).send({
    message: "follower not found with id " + req.params.id
  });
 }
  res.send(follower);
 }).catch(err => {
   if(err.kind === 'ObjectId') {
     return res.status(404).send({
     message: "follower not found with id " + req.params.id
   });
 }
 return res.status(500).send({
   message: "Error getting follower with id " + req.params.id
 });
 });
 },

 findAll : async (req, res) => {
  Follower.find()
    .then(followers => {
    res.send(followers);
  }).catch(err => {
    res.status(500).send({
    message: err.message || "Something went wrong while getting list of followers."
  });
  });
  },

}