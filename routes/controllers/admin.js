var express = require('express');
const Admin = require('../../db/models/admin.js');
const Lawyer = require('../../db/models/lawyers.js');
const { admin } = require('../routes.js');


// Create and Save a new admin
module.exports = {
    create :async (req, res) => {
          if(!req.body) {
        return res.status(400).send({
        message: "Please fill all required field"
      });
      }

      
      const admin = new Admin();

        admin.name = req.body.name,
        admin.email = req.body.email,
        admin.password = req.body.password,
        admin.image_url = req.files.image[0].location,
      // Save admin in the database
      await admin.save()
      .then(data => {
        res.send(data);
      }).catch(err => {
        res.status(500).send({
        message: err.message || "Something went wrong while creating new admin."
      });
      });
    },

findOne : async (req, res) => {
  Admin.findById(req.params.id)
  .then(admin => {
  if(!admin) {
   return res.status(404).send({
   message: "admin not found with id " + req.params.id
 });
}
 res.send(admin);
}).catch(err => {
  if(err.kind === 'ObjectId') {
    return res.status(404).send({
    message: "admin not found with id " + req.params.id
  });
}
return res.status(500).send({
  message: "Error getting admin with id " + req.params.id
});
});
},
//feed page API
  findAll : async (req, res) => {
  Admin.find()
    .then(admins => {
    res.json(admins);
  }).catch(err => {
    res.status(500).send({
    message: err.message || "Something went wrong while getting admin"
  });
  });
  },

  delete : async (req, res) => {
      Admin.findByIdAndRemove(req.params.id)
      .then(admin => {
      if(!admin) {
        return res.status(404).send({
        message: "admin not found with id " + req.params.id
      });
      }
      res.send({message: "admin deleted successfully!"});
      }).catch(err => {
      if(err.kind === 'ObjectId' || err.name === 'NotFound') {
        return res.status(404).send({
        message: "admin not found with id " + req.params.id
      });
      }
      return res.status(500).send({
        message: "Could not delete admin with id " + req.params.id
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
    // Find lawsuit and update it with the request body
    Admin.findByIdAndUpdate(req.params.id, {
      name : req.body.name,
      email : req.body.email,
      password: req.body.password
      // image_url = req.files.image[0].location
    }, {new: true})
    .then(admin => {
    if(!admin) {
    return res.status(404).send({
    message: "admin not found with id " + req.params.id
    });
    }
    res.send(admin);
    }).catch(err => {
    if(err.kind === 'ObjectId') {
    return res.status(404).send({
    message: "admin not found with id " + req.params.id
    });
    }
    return res.status(500).send({
    message: "Error updating lawsuit with id " + req.params.id
    });
    });
    },
    
    }


