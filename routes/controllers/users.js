var express = require('express');
const User = require('../../db/models/users.js');
// Create and Save a new laywer
module.exports = {
    

    findOne : async (req, res) => {
        User.findById(req.params.id)
         .then(user => {
         if(!user) {
          return res.status(404).send({
          message: "User not found with id " + req.params.id
        });
       }
        res.send(user);
       }).catch(err => {
         if(err.kind === 'ObjectId') {
           return res.status(404).send({
           message: "User not found with id " + req.params.id
         });
       }
       return res.status(500).send({
         message: "Error getting user with id " + req.params.id
       });
       });
       },
    

    findAll : async (req, res) => {
        User.find()
        .then(users => {
        res.send(users);
      }).catch(err => {
        res.status(500).send({
        message: err.message || "Something went wrong while getting list of users."
      });
      });
      }

}

