var express = require('express');
const Sub_Cat = require('../../db/models/sub_categories');
const Category = require('../../db/models/categories');
// Create and Save a new category
module.exports = {

  create : async (req, res) => {
    if(!req.body) {
        return res.status(400).send({
        message: "Please fill all required field"
      });
      }

      const category =await Category.findOne({_id:req.body.category});

      // Create a new category
      const sub_category = new Sub_Cat();

        sub_category.name = req.body.name,
        sub_category.category = req.body.category,
      // Save category in the database
      await sub_category.save()
      .then(data => {
        category.subcategories.push(data._id);
        res.send(data);
      }).catch(err => {
        res.status(500).send({
        message: err.message || "Something went wrong while adding a new sub_category."
      });
      });
      category.save();
},

  findAll : async (req, res) => {
    Sub_Cat.aggregate([
      { $lookup:
        {
          from: 'categories',
          localField: 'category',
          foreignField: '_id',
          as: 'cat'
        },
      }
    ])
    .then(sub_categories => {
    res.send(sub_categories);
  }).catch(err => {
    res.status(500).send({
    message: err.message || "Something went wrong while getting sub_categories"
  });
  });
  },

  delete : async (req, res) => {
      Sub_Cat.findByIdAndRemove(req.params.id)
      .then(post => {
      if(!post) {
        return res.status(404).send({
        message: "SubCategory not found with id " + req.params.id
      });
      }
      res.send({message: "SubCategory deleted successfully!"});
      }).catch(err => {
      if(err.kind === 'ObjectId' || err.name === 'NotFound') {
        return res.status(404).send({
        message: "SubCategory not found with id " + req.params.id
      });
      }
      return res.status(500).send({
        message: "Could not delete post with id " + req.params.id
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
  Sub_Cat.findByIdAndUpdate(req.params.id, {
    name : req.body.name,
  }, {new: true})
  .then(subcategory => {
  if(!subcategory) {
  return res.status(404).send({
  message: "subcategory not found with id " + req.params.id
  });
  }
  res.send(subcategory);
  }).catch(err => {
  if(err.kind === 'ObjectId') {
  return res.status(404).send({
  message: "subcategory not found with id " + req.params.id
  });
  }
  return res.status(500).send({
  message: "Error updating lawsuit with id " + req.params.id
  });
  });
  },
}