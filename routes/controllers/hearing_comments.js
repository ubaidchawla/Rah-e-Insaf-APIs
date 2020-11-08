var express = require('express');
const Hearing = require('../../db/models/hearings.js');
const Comment = require('../../db/models/comments.js');
// Create and Save a new hearing
module.exports = {
    create : async (req, res) => {
    if(!req.body) {
        return res.status(400).send({
        message: "Please fill all required field"
      });
      }

      const hearing =await Hearing.findOne({_id:req.params.hearingId});

      // Create a new hearing
      const comment = new Comment();

        comment.content = req.body.content,
        comment.hearing = hearing._id,
        comment.attachment = req.file.path,
        comment.user = req.user.id
      // Save hearing in the database
      await comment.save()
      .then(data => {
        res.send(data);
      }).catch(err => {
        res.status(500).send({
        message: err.message || "Something went wrong while adding a new comment."
      });
      });

      hearing.comments.push(hearing._id);
      await hearing.save();
      
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