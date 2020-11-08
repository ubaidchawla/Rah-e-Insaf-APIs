var express = require('express');
const Client = require('../../db/models/clients.js');
const User = require('../../db/models/users.js');
// Create and Save a new client
module.exports = {
    create : async (req, res) => {
    if(!req.body) {
        return res.status(400).send({
        message: "Please fill all required field"
      });
      }
      const user =await User.findOne({_id:req.params.userId});
      // Create a new client
      const client = new Client();
      client.phone = req.body.phone,
      client.city = req.body.city,
      client.user = user._id
      // client.user = req.user._id
      // Save client in the database
      await client.save()
        .then(data => {
        res.send(data);
      }).catch(err => {
        res.status(500).send({
        message: err.message || "Something went wrong while creating new client."
      });
      });
},
// Find a single client with a id
    findOne : async (req, res) => {
    Client.findById(req.params.id)
    .then(client => {
    if(!client) {
        return res.status(404).send({
        message: "client not found with id " + req.params.id
    });
    }
    res.send(client);
    }).catch(err => {
    if(err.kind === 'ObjectId') {
        return res.status(404).send({
        message: "client not found with id " + req.params.id
    });
    }
    return res.status(500).send({
    message: "Error getting client with id " + req.params.id
    });
    });
    },

    findAll : async (req, res) => {
    Client.aggregate([
        { $lookup:
        {
            from: 'users',
            localField: 'user',
            foreignField: '_id',
            as: 'basicdetails'
        }
        }
    ]).then(clients => {
        res.send(clients);
    }).catch(err => {
        res.status(500).send({
        message: err.message || "Something went wrong while getting list of clients."
    });
    });
    },

  update : async (req, res) => {
    // Validate Request
  if(!req.body) {
  return res.status(400).send({
  message: "Please fill all required field"
  });
  }
  // Find client and update it with the request body
  Client.findByIdAndUpdate(req.params.id, {
    city: req.body.city,
    phone: req.body.phone,
    }, {new: true})
    .then(client => {
    if(!client) {
    return res.status(404).send({
    message: "client not found with id " + req.params.id
    });
    }
    res.send(client);
    }).catch(err => {
    if(err.kind === 'ObjectId') {
    return res.status(404).send({
    message: "client not found with id " + req.params.id
    });
    }
    return res.status(500).send({
    message: "Error updating client with id " + req.params.id
    });
    });
  },

  count : async (req, res) => {
    Client.countDocuments(function (err, count) {
      if (err) {
          res.send(err);
          return;
      }
      res.json({ count: count });
  });
  }
}