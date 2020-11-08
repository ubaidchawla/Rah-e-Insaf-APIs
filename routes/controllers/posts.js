var express = require('express');
const Post = require('../../db/models/posts.js');
const Lawyer = require('../../db/models/lawyers.js');
const { post } = require('../routes.js');


// Create and Save a new post
module.exports = {
    create :async (req, res) => {
          if(!req.body) {
        return res.status(400).send({
        message: "Please fill all required field"
      });
      }

      const lawyer =await Lawyer.findOne({_id:req.params.lawyerId});
      // Create a new post
      const post = new Post();

        post.description = req.body.description,
        post.image_url = req.files.image[0].location,
        post.document_url = req.files.document[0].location,
        post.lawyer = lawyer._id
      // Save post in the database
      await post.save()
      .then(data => {
        res.send(data);
      }).catch(err => {
        res.status(500).send({
        message: err.message || "Something went wrong while creating new post."
      });
      });

      lawyer.posts.push(post._id);
      await lawyer.save();
      
},

findOne : async (req, res) => {
  Post.findById(req.params.id)
  .then(post => {
  if(!post) {
   return res.status(404).send({
   message: "post not found with id " + req.params.id
 });
}
 res.send(post);
}).catch(err => {
  if(err.kind === 'ObjectId') {
    return res.status(404).send({
    message: "post not found with id " + req.params.id
  });
}
return res.status(500).send({
  message: "Error getting post with id " + req.params.id
});
});
},
//feed page API
  findAll : async (req, res) => {
  Post.find().sort([['date', -1]])
    .then(posts => {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 2;

      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
    results = posts.slice(startIndex,endIndex)
    res.json(results);
  }).catch(err => {
    res.status(500).send({
    message: err.message || "Something went wrong while getting Post"
  });
  });
  },

  delete : async (req, res) => {
    const lawyerpost = await Post.findOne({_id:req.params.id});
    const lawyer = await Lawyer.findOne({user:req.users.id});
    if (lawyerpost.lawyer !== lawyer._id)
    {
      return res.status(401).json({
        error: {
          message: `You can only delete your own Posts.`
        },
      });
    }
    else{
      Post.findByIdAndRemove(req.params.id)
      .then(post => {
      if(!post) {
        return res.status(404).send({
        message: "post not found with id " + req.params.id
      });
      }
      res.send({message: "post deleted successfully!"});
      }).catch(err => {
      if(err.kind === 'ObjectId' || err.name === 'NotFound') {
        return res.status(404).send({
        message: "post not found with id " + req.params.id
      });
      }
      return res.status(500).send({
        message: "Could not delete post with id " + req.params.id
      });
      });
    }
    
    },

    lawyerPosts : async (req,res)=>{
      Post.find({"lawyer": req.params.lawyerId}).sort([['date', -1]])
        .then(posts => {
          const page = parseInt(req.query.page) || 1;
          const limit = parseInt(req.query.limit) || 4;

          const startIndex = (page - 1) * limit;
          const endIndex = page * limit;
        results = posts.slice(startIndex,endIndex)
        res.json(results);
      }).catch(err => {
        res.status(500).send({
        message: err.message || "Something went wrong while getting Posts"
      });
      });

      
    },

    bookmark : async (req, res) => {
      if(!req.body) {
          return res.status(400).send({
          message: "Please fill all required field"
        });
        }
  
        const post =await Post.findOne({_id:req.params.postId});
  
        post.bookmarks.push("5f33d9cb3e5793722bffa835");
        await post.save().then(data => {
          res.send(data);
        }).catch(err => {
          res.status(500).send({
          message: err.message || "Something went wrong while bookmarking a post."
        });
        });
        
    },

    bookmarked : async (req,res)=>{
      Post.find({"bookmarks": "5f33d9cb3e5793722bffa835"}).sort([['date', -1]])
        .then(posts => {
          const page = parseInt(req.query.page) || 1;
          const limit = parseInt(req.query.limit) || 4;

          const startIndex = (page - 1) * limit;
          const endIndex = page * limit;
        results = posts.slice(startIndex,endIndex)
        res.json(results);
      }).catch(err => {
        res.status(500).send({
        message: err.message || "Something went wrong while getting Posts"
      });
      });
    },

    bookmarkremove : async (req, res) => {
      const post =await Post.findOne({_id:req.params.id});
      post.bookmarks.splice( post.bookmarks.indexOf('5f33d9cb3e5793722bffa835'), 1 );
        await post.save().then(data => {
          res.send(data);
        }).catch(err => {
          res.status(500).send({
          message: err.message || "Something went wrong while bookmarking a post."
        });
        });
      },
}
