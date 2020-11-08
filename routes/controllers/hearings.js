var express = require('express');
const Hearing = require('../../db/models/hearings.js');
const Lawsuit = require('../../db/models/lawsuits.js');


// Create and Save a new hearing
module.exports = {
    create :async (req, res) => {
      
      console.log(req.file);
    if(!req.body) {
        return res.status(400).send({
        message: "Please fill all required field"
      });
      }
    
      const lawsuit =await Lawsuit.findOne({_id:req.params.lawsuitId});
      // Create a new hearing
      const hearing = new Hearing();

        hearing.time = req.body.time,
        hearing.hearing_location = req.body.hearing_location,
        hearing.hearing_result = req.body.hearing_result,
        hearing.attachment = req.file.path,
        hearing.lawsuit = lawsuit._id
      // Save hearing in the database
      await hearing.save()
      .then(data => {
        res.send(data);
      }).catch(err => {
        res.status(500).send({
        message: err.message || "Something went wrong while creating new hearing."
      });
      });

      lawsuit.hearings.push(hearing._id);
      await lawsuit.save();
      
},

findOne : async (req, res) => {
  Hearing.findById(req.params.id)
  .then(hearing => {
  if(!hearing) {
   return res.status(404).send({
   message: "hearing not found with id " + req.params.id
 });
}
 res.send(hearing);
}).catch(err => {
  if(err.kind === 'ObjectId') {
    return res.status(404).send({
    message: "hearing not found with id " + req.params.id
  });
}
return res.status(500).send({
  message: "Error getting hearing with id " + req.params.id
});
});
},

  findAll : async (req, res) => {
  Hearing.find().sort([['date', -1]])
    .then(hearings => {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 2;

      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
    results = hearings.slice(startIndex,endIndex)
    res.json(results);
  }).catch(err => {
    res.status(500).send({
    message: err.message || "Something went wrong while getting hearings"
  });
  });
  },

  delete : async (req, res) => {
    Hearing.findByIdAndRemove(req.params.id)
    .then(hearing => {
    if(!hearing) {
      return res.status(404).send({
      message: "hearing not found with id " + req.params.id
    });
    }
    res.send({message: "hearing deleted successfully!"});
    }).catch(err => {
    if(err.kind === 'ObjectId' || err.name === 'NotFound') {
      return res.status(404).send({
      message: "hearing not found with id " + req.params.id
    });
    }
    return res.status(500).send({
      message: "Could not delete hearing with id " + req.params.id
    });
    });
    },

    lawsuitHearings: async (req,res)=>{
      hearing.find({"lawsuit": req.params.lawsuitId}).sort([['date', -1]])
        .then(hearings => {
          const page = parseInt(req.query.page) || 1;
          const limit = parseInt(req.query.limit) || 4;

          const startIndex = (page - 1) * limit;
          const endIndex = page * limit;
        results = hearings.slice(startIndex,endIndex)
        res.json(results);
      }).catch(err => {
        res.status(500).send({
        message: err.message || "Something went wrong while getting hearings"
      });
      });

      
    },


}
