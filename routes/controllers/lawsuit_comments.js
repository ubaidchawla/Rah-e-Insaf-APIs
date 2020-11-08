var express = require('express');
const Lawsuit = require('../../db/models/lawsuits.js');
const Comment = require('../../db/models/comments.js');
// Create and Save a new lawsuit
module.exports = {
    create : async (req, res) => {
    if(!req.body) {
        return res.status(400).send({
        message: "Please fill all required field"
      });
      }

      const lawsuit =await Lawsuit.findOne({_id:req.params.lawsuitId});

      // Create a new lawsuit
      const comment = new Comment();

        comment.content = req.body.content,
        comment.lawsuit = lawsuit._id,
        comment.attachment = req.file.path,
        comment.user = req.user.id
      // Save lawsuit in the database
      await comment.save()
      .then(data => {
        res.send(data);
      }).catch(err => {
        res.status(500).send({
        message: err.message || "Something went wrong while adding a new comment."
      });
      });

      lawsuit.comments.push(lawsuit._id);
      await lawsuit.save();
      
},
  delete : async (req, res) => {
    Comment.findByIdAndRemove(req.params.id)
    .then(comment => {
    if(!comment) {
      return res.status(404).send({
      message: "comment not found with id " + req.params.id
    });
    }
    res.send({message: "comment deleted successfully!"});
    }).catch(err => {
    if(err.kind === 'ObjectId' || err.name === 'NotFound') {
      return res.status(404).send({
      message: "comment not found with id " + req.params.id
    });
    }
    return res.status(500).send({
      message: "Could not delete comment with id " + req.params.id
    });
    });
    },

    findAll : async (req, res) => {
        Comment.find().sort([['date', -1]])
          .then(comments => {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 2;
      
            const startIndex = (page - 1) * limit;
            const endIndex = page * limit;
          results = comments.slice(startIndex,endIndex)
          res.json(results);
        }).catch(err => {
          res.status(500).send({
          message: err.message || "Something went wrong while getting comments"
        });
        });
        }
}