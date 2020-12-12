var express = require('express');
const Lawyer = require('../../db/models/lawyers.js');
const User = require('../../db/models/users.js');
// Create and Save a new lawyer
module.exports = {
    create : async (req, res) => {
    if(!req.body) {
        return res.status(400).send({
        message: "Please fill all required field"
      });
      }
      const lawyer = new Lawyer();
      lawyer.tier = req.body.tier,
      lawyer.overall_experience = req.body.overall_experience,
      lawyer.consultation_fee = req.body.consultation_fee,
      lawyer.introduction = req.body.introduction,
      lawyer.bar_council = req.body.bar_council,
      lawyer.city = req.body.city,
      lawyer.user = req.body.user
      await lawyer.save()
        .then(data => {
        res.send(data);
      }).catch(err => {
        res.status(500).send({
        message: err.message || "Something went wrong while creating new lawyer."
      });
      });
},
// Find a single Lawyer with a id
findOne : async (req, res) => {
  Lawyer.findById(req.params.id)
   .then(lawyer => {
   if(!lawyer) {
    return res.status(404).send({
    message: "Lawyer not found with id " + req.params.id
  });
 }
  res.send(lawyer);
 }).catch(err => {
   if(err.kind === 'ObjectId') {
     return res.status(404).send({
     message: "lawyer not found with id " + req.params.id
   });
 }
 return res.status(500).send({
   message: "Error getting lawyer with id " + req.params.id
 });
 });
 },

 findAll : async (req, res) => {
  Lawyer.aggregate([
    { $lookup:
      {
        from: 'users',
        localField: 'user',
        foreignField: '_id',
        as: 'basicdetails'
      }
    }
  ]).then(lawyers => {
    res.send(lawyers);
  }).catch(err => {
    res.status(500).send({
    message: err.message || "Something went wrong while getting list of lawyers."
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
  // Find lawyer and update it with the request body
  Lawyer.findByIdAndUpdate(req.params.id, {
    tier: req.body.tier,
    overall_experience: req.body.overall_experience,
    consultation_fee: req.body.consultation_fee,
    introduction: req.body.introduction,
    bar_council: req.body.bar_council
    }, {new: true})
    .then(lawyer => {
    if(!lawyer) {
    return res.status(404).send({
    message: "lawyer not found with id " + req.params.id
    });
    }
    res.send(lawyer);
    }).catch(err => {
    if(err.kind === 'ObjectId') {
    return res.status(404).send({
    message: "lawyer not found with id " + req.params.id
    });
    }
    return res.status(500).send({
    message: "Error updating lawyer with id " + req.params.id
    });
    });
    },
    delete : async (req, res) => {
      Lawyer.findByIdAndRemove(req.params.id)
      .then(post => {
      if(!post) {
        return res.status(404).send({
        message: "Lawyer not found with id " + req.params.id
      });
      }
      res.send({message: "Lawyer deleted successfully!"});
      }).catch(err => {
      if(err.kind === 'ObjectId' || err.name === 'NotFound') {
        return res.status(404).send({
        message: "Lawyer not found with id " + req.params.id
      });
      }
      return res.status(500).send({
        message: "Could not delete post with id " + req.params.id
      });
      });
    },
  bookmark : async (req, res) => {
    if(!req.body) {
        return res.status(400).send({
        message: "Please fill all required field"
      });
      }

      const lawyer =await Lawyer.findOne({_id:req.params.lawyerId});

      lawyer.bookmarks.push(req.user._id);
      await lawyer.save().then(data => {
        res.send(data);
      }).catch(err => {
        res.status(500).send({
        message: err.message || "Something went wrong while creating new lawyer."
      });
      });
      
},
bookmarked : async (req,res)=>{
  Lawyer.find({"bookmarks": req.user._id}).sort([['date', -1]])
    .then(lawyers => {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 4;

      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
    results = lawyers.slice(startIndex,endIndex)
    res.json(results);
  }).catch(err => {
    res.status(500).send({
    message: err.message || "Something went wrong while getting lawyers"
  });
  });
},

bookmarkremove : async (req, res) => {
  const lawyer =await Lawyer.findOne({_id:req.params.id});
  lawyer.bookmarks.splice( lawyer.bookmarks.indexOf('5f33d9cb3e5793722bffa835'), 1 );
    await lawyer.save().then(data => {
      res.send(data);
    }).catch(err => {
      res.status(500).send({
      message: err.message || "Something went wrong while bookmarking a lawyer."
    });
    });
  },

  follow : async (req, res) => {
    if(!req.body) {
        return res.status(400).send({
        message: "Please fill all required field"
      });
      }

      const lawyer =await Lawyer.findOne({_id:req.params.lawyerId});

      lawyer.followers.push(req.user._id);
      await lawyer.save().then(data => {
        res.send(data);
      }).catch(err => {
        res.status(500).send({
        message: err.message || "Something went wrong while creating new lawyer."
      });
      });
      
},
unfollow : async (req, res) => {
  const lawyer =await Lawyer.findOne({_id:req.params.id});
  lawyer.followers.splice( lawyer.followers.indexOf('5f33d9cb3e5793722bffa835'), 1 );
    await lawyer.save().then(data => {
      res.send(data);
    }).catch(err => {
      res.status(500).send({
      message: err.message || "Something went wrong while bookmarking a lawyer."
    });
    });
  },
  following : async (req,res)=>{
    Lawyer.find({"followers": req.user._id}).sort([['date', -1]])
      .then(lawyers => {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 4;
  
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
      results = lawyers.slice(startIndex,endIndex)
      res.json(results);
    }).catch(err => {
      res.status(500).send({
      message: err.message || "Something went wrong while getting lawyers"
    });
    });
  },

  count : async (req, res) => {
    Lawyer.countDocuments(function (err, count) {
      if (err) {
          res.send(err);
          return;
      }
      res.json({ count: count });
  });
  }
}