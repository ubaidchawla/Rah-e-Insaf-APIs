var express = require('express');
const Appraisal = require('../../db/models/appraisals')
const Lawyer = require('../../db/models/lawyers.js');

// Create and Save a new appraisal
module.exports = {
    create : async (req, res) => {
    if(!req.body) {
        return res.status(400).send({
        message: "Please fill all required field"
      });
      }

      const lawyer =await Lawyer.findOne({_id:req.params.lawyerId});
      // Create a new appraisal
      const appraisal = new Appraisal();

        appraisal.rating = req.body.rating,
        appraisal.text = lawyer.text
      // Save appraisal in the database
      await appraisal.save()
      .then(data => {
        res.send(data);
      }).catch(err => {
        res.status(500).send({
        message: err.message || "Something went wrong while creating new appraisal."
      });
      });

},

findOne : async (req, res) => {
  Appraisal.findById(req.params.lawyerId)
  .then(appraisal => {
  if(!appraisal) {
   return res.status(404).send({
   message: "appraisal not found with id " + req.params.lawyerId
 });
}
 res.send(appraisal);
}).catch(err => {
  if(err.kind === 'ObjectId') {
    return res.status(404).send({
    message: "appraisal not found with id " + req.params.lawyerId
  });
}
return res.status(500).send({
  message: "Error getting appraisal with id " + req.params.id
});
});
},
 //LIST ALL APPRAISALS 
  findAll : async (req, res) => {
  Appraisal.find().sort([['date', -1]])
    .then(appraisals => {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 2;

      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
    results = appraisals.slice(startIndex,endIndex)
    res.json(results);
  }).catch(err => {
    res.status(500).send({
    message: err.message || "Something went wrong while getting appraisals"
  });
  });
  }
}
