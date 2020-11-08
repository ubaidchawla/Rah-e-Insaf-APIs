var express = require('express');
const Consultation = require('../../db/models/consultations')
const User = require('../../db/models/users.js');

// Create and Save a new consultation
module.exports = {
    create : async (req, res) => {
    if(!req.body) {
        return res.status(400).send({
        message: "Please fill all required field"
      });
      }

      const user =await User.findOne({_id:req.params.userId});
      // Create a new consultation
      const consultation = new Consultation();

        consultation.time = new Date.now();
        consultation.lawyer = req.body.lawyerId;
        consultation.client = client._id;
        
      // Save consultation in the database
      await consultation.save()
      .then(data => {
        res.send(data);
      }).catch(err => {
        res.status(500).send({
        message: err.message || "Something went wrong while creating new consultation."
      });
      });

},

findOne : async (req, res) => {
  Consultation.findById(req.params.lawyerId)
  .then(consultation => {
  if(!consultation) {
   return res.status(404).send({
   message: "consultation not found with id " + req.params.lawyerId
 });
}
 res.send(consultation);
}).catch(err => {
  if(err.kind === 'ObjectId') {
    return res.status(404).send({
    message: "consultation not found with id " + req.params.lawyerId
  });
}
return res.status(500).send({
  message: "Error getting consultation with id " + req.params.lawyerId
});
});
},
  findAll : async (req, res) => {
  Consultation.find().sort([['date', -1]])
    .then(consultations => {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 2;

      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
    results = consultations.slice(startIndex,endIndex)
    res.json(results);
  }).catch(err => {
    res.status(500).send({
    message: err.message || "Something went wrong while getting consultations"
  });
  });
  },

  approve : async (req,res) => {
    // Validate Request
    if(!req.body) {
      return res.status(400).send({
      message: "Please fill all required field"
      });
      }
      // Find Consultation and update it with the request body
      Consultation.findByIdAndUpdate(req.params.id, {
        status : true
      }, {new: true})
      .then(consultation => {
      if(!consultation) {
      return res.status(404).send({
      message: "consultation not found with id " + req.params.id
      });
      }
      res.send(consultation);
      }).catch(err => {
      if(err.kind === 'ObjectId') {
      return res.status(404).send({
      message: "consultation request not found with id " + req.params.id
      });
      }
      return res.status(500).send({
      message: "Error approving consultation with id " + req.params.id
      });
      });
  },
  reject : async (req, res) => {
    Consultation.findByIdAndRemove(req.params.id)
    .then(consultation => {
    if(!consultation) {
      return res.status(404).send({
      message: "consultation not found with id " + req.params.id
    });
    }
    res.send({message: "consultation deleted successfully!"});
    }).catch(err => {
    if(err.kind === 'ObjectId' || err.name === 'NotFound') {
      return res.status(404).send({
      message: "consultation not found with id " + req.params.id
    });
    }
    return res.status(500).send({
      message: "Could not delete consultation with id " + req.params.id
    });
    });
    },
  delete : async (req, res) => {
    Consultation.findByIdAndRemove(req.params.id)
    .then(consultation => {
    if(!consultation) {
      return res.status(404).send({
      message: "consultation not found with id " + req.params.id
    });
    }
    res.send({message: "consultation deleted successfully!"});
    }).catch(err => {
    if(err.kind === 'ObjectId' || err.name === 'NotFound') {
      return res.status(404).send({
      message: "consultation not found with id " + req.params.id
    });
    }
    return res.status(500).send({
      message: "Could not delete consultation with id " + req.params.id
    });
    });
    },

    countfinished : async (req, res) => {
    Consultation.countDocuments({status:"finished"},function (err, count) {
      if (err) {
          res.send(err);
          return;
      }
      res.json({ count: count });
  });
  },

  countrequests : async (req, res) => {
    Consultation.countDocuments({status:"pending"},function (err, count) {
      if (err) {
          res.send(err);
          return;
      }
      res.json({ count: count });
  });
  },

  countrejected : async (req, res) => {
    Consultation.countDocuments({status:"rejected"},function (err, count) {
      if (err) {
          res.send(err);
          return;
      }
      res.json({ count: count });
  });
  },
  count : async (req, res) => {
    Consultation.countDocuments(function (err, count) {
      if (err) {
          res.send(err);
          return;
      }
      res.json({ count: count });
  });
  },

  revenue : async (req,res)=>{
    Consultation.aggregate([
      { $lookup: {
        from: "lawyers",
        localField: "lawyer",
        foreignField: "_id",
        as: "lawyer_detail"
      }},
      {$match: { "status": "finished" } },
      { 
        $project: {
        total: { $sum: '$lawyer_detail.consultation_fee' }
      }}
    ]).then(consultations => {
      result = consultations.reduce(function(_this, val) {
        return _this + val.total
    }, 0);

      result = result/1000;
      res.json({result: result+"k"})
    }).catch(err => {
      res.status(500).send({
      message: err.message || "Something went wrong while getting list of consultations."
    });
    });
    }
  }
