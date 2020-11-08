var express = require('express');
const Sub_Cat = require('../../db/models/sub_categories');
const Law = require('../../db/models/laws.js');
// Create and Save a new law
module.exports = {

  create : async (req, res) => {
    if(!req.body) {
        return res.status(400).send({
        message: "Please fill all required field"
      });
      }

      // const sub_category =await Sub_Cat.findOne({_id:req.params.id});

      // Create a new sub_category
      const law = new Law();

        law.name = req.body.name,
        law.offence_type = req.body.offence_type,
        law.penal_code = req.body.penal_code,
        law.punishment_period = req.body.punishment_period
        law.category = req.body.category,
        law.sub_category = req.body.sub_category,
      // Save sub_category in the database
      await law.save()
      .then(data => {
        res.send(data);
      }).catch(err => {
        res.status(500).send({
        message: err.message || "Something went wrong while adding a new law."
      });
      });
      
},
findOne : async (req, res) => {
  Law.findById(req.params.id)
  .then(law => {
  if(!law) {
   return res.status(404).send({
   message: "law not found with id " + req.params.id
 });
}
 res.send(law);
}).catch(err => {
  if(err.kind === 'ObjectId') {
    return res.status(404).send({
    message: "law not found with id " + req.params.id
  });
}
return res.status(500).send({
  message: "Error getting law with id " + req.params.id
});
});
},

  findAll : async (req, res) => {
    const filter = req.query.filter || ''
    const filterQuery = {
      name: new RegExp(filter,'i')
    }
      Law.find(filterQuery)
        .then(laws => {
        res.send(laws);
      }).catch(err => {
        res.status(500).send({
        message: err.message || "Something went wrong while getting laws"
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
      // Find Lawyer and update it with the request body
      Law.findByIdAndUpdate(req.params.id, {
        name : req.body.name,
        offence_type: req.body.offence_type,
        penal_code: req.body.penal_code,
        punishment_period: req.body.punishment_period
      }, {new: true})
      .then(category => {
      if(!category) {
      return res.status(404).send({
      message: "Law not found with id " + req.params.id
      });
      }
      res.send(category);
      }).catch(err => {
      if(err.kind === 'ObjectId') {
      return res.status(404).send({
      message: "Law not found with id " + req.params.id
      });
      }
      return res.status(500).send({
      message: "Error updating Law with id " + req.params.id
      });
      });
      },
      delete : async (req, res) => {
        Law.findByIdAndRemove(req.params.id)
        .then(post => {
        if(!post) {
          return res.status(404).send({
          message: "Law not found with id " + req.params.id
        });
        }
        res.send({message: "Law deleted successfully!"});
        }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
          return res.status(404).send({
          message: "Law not found with id " + req.params.id
        });
        }
        return res.status(500).send({
          message: "Could not delete Law with id " + req.params.id
        });
        });
    },
      lawdetails : async (req, res) => {
        Law.aggregate([
          { $lookup:
            {
              from: 'subcategories',
              localField: 'sub_category',
              foreignField: '_id',
              as: 'sub'
            },
          },
          {
            $lookup:
            {
              from: 'categories',
              localField: 'category',
              foreignField: '_id',
              as: 'cat'
            },
          }
        ]).then(lawyers => {
          res.send(lawyers);
        }).catch(err => {
          res.status(500).send({
          message: err.message || "Something went wrong while getting list of lawyers."
        });
        });
        },
      bookmark : async (req, res) => {
        if(!req.body) {
            return res.status(400).send({
            message: "Please fill all required field"
          });
          }
    
          const law =await Law.findOne({_id:req.params.lawId});
    
          law.bookmarks.push("5f33d9cb3e5793722bffa835");
          await law.save().then(data => {
            res.send(data);
          }).catch(err => {
            res.status(500).send({
            message: err.message || "Something went wrong while bookmarking a law."
          });
          });
          
      },
  
      bookmarked : async (req,res)=>{
        Law.find({"bookmarks": "5f33d9cb3e5793722bffa835"}).sort([['date', -1]])
          .then(laws => {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 4;
  
            const startIndex = (page - 1) * limit;
            const endIndex = page * limit;
          results = laws.slice(startIndex,endIndex)
          res.json(results);
        }).catch(err => {
          res.status(500).send({
          message: err.message || "Something went wrong while getting laws"
        });
        });
      },

      bookmarkremove : async (req, res) => {
        const law =await Law.findOne({_id:req.params.id});
        law.bookmarks.splice( law.bookmarks.indexOf('5f33d9cb3e5793722bffa835'), 1 );
          await law.save().then(data => {
            res.send(data);
          }).catch(err => {
            res.status(500).send({
            message: err.message || "Something went wrong while bookmarking a law."
          });
          });
        },

        getlaws : async (req,res) => {
          Law.find(filterQuery)
            .then(laws => {
            res.send(laws);
          }).catch(err => {
            res.status(500).send({
            message: err.message || "Something went wrong while getting laws"
          });
          });
        }
}