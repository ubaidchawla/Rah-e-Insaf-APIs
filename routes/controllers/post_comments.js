var express = require('express');
const Post = require('../../db/models/posts.js');
const Comment = require('../../db/models/comments.js');
const Notification = require('../../db/models/notifications.js');

// Create and Save a new post
module.exports = {
    create : async (req, res) => {
    if(!req.body) {
        return res.status(400).send({
        message: "Please fill all required field"
      });
      }

      const post =await Post.findOne({_id:req.params.postId});

      // Create a new post
      const comment = new Comment();
      const notification = new Notification();
        comment.content = req.body.content,
        comment.post = post._id,
        comment.attachment = req.file.path,
        comment.user = req.user.id
      // Save post in the database

        notification.content = req.user.id+" added a comment on your Post";

        await notification.save()
      .then(data => {
        res.send(data);
      }).catch(err => {
        res.status(500).send({
        message: err.message || "Something went wrong while adding a new comment."
      });
      });
      await comment.save()
      .then(data => {
        res.send(data);
      }).catch(err => {
        res.status(500).send({
        message: err.message || "Something went wrong while adding a new comment."
      });
      });

      post.comments.push(post._id);
      await post.save();
      
},
  delete : async (req, res) => {
    const usercomment = await Comment.findOne({_id:req.params.id});
    if (usercomment.lawyer !== req.users.id)
    {
      return res.status(401).json({
        error: {
          message: `You can only delete your own Comment.`
        },
      });
    }
    else{
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
    }
  }
}