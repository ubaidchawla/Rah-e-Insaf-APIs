var express = require('express');
const Category = require('../../db/models/categories');
// Create and Save a new post
module.exports = {

  create : async (req, res) => {
    if(!req.body) {
        return res.status(400).send({
        message: "Please fill all required field"
      });
      }

      // Create a new post
      const category = new Category();

        category.name = req.body.name
      // Save post in the database
      await category.save()
      .then(data => {
        res.send(data);
      }).catch(err => {
        res.status(500).send({
        message: err.message || "Something went wrong while adding a new category."
      });
      });
      
},
  findAll : async (req, res) => {
  Category.find()
    .then(categories => {
    res.send(categories);
  }).catch(err => {
    res.status(500).send({
    message: err.message || "Something went wrong while getting categories"
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
    // Find Category and update it with the request body
    Category.findByIdAndUpdate(req.params.id, {
      name : req.body.name,
    }, {new: true})
    .then(category => {
    if(!category) {
    return res.status(404).send({
    message: "Category not found with id " + req.params.id
    });
    }
    res.send(category);
    }).catch(err => {
    if(err.kind === 'ObjectId') {
    return res.status(404).send({
    message: "Category not found with id " + req.params.id
    });
    }
    return res.status(500).send({
    message: "Error updating Category with id " + req.params.id
    });
    });
    },
    delete : async (req, res) => {
      Category.findByIdAndRemove(req.params.id)
      .then(post => {
      if(!post) {
        return res.status(404).send({
        message: "Category not found with id " + req.params.id
      });
      }
      res.send({message: "Category deleted successfully!"});
      }).catch(err => {
      if(err.kind === 'ObjectId' || err.name === 'NotFound') {
        return res.status(404).send({
        message: "Category not found with id " + req.params.id
      });
      }
      return res.status(500).send({
        message: "Could not delete post with id " + req.params.id
      });
      });
  },
}